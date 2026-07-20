import { clientConfig } from "@/config/client.config";
import { db, ensureSchema, hasDb, jsonb, withDb } from "@/lib/db";

// Almacén de reservas del módulo agenda.
//
// Con DATABASE_URL (Neon) las reservas viven en Postgres y son las mismas para
// todos los isolates de Vercel; la base garantiza además que dos personas no
// tomen la misma hora. Sin DATABASE_URL funciona en memoria (globalThis) con
// datos sembrados: así una demo arranca sin configurar nada y el panel del
// dueño nunca se ve vacío. Ver lib/db.ts.

export interface Booking {
  id: string;
  service: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  name: string;
  phone: string;
  status: "pendiente" | "confirmada" | "cancelada";
  // Presente cuando el abono se pagó online con Webpay.
  payment?: { amount: number; authorizationCode?: string; cardLast4?: string };
  createdAt: string;
}

interface Store {
  bookings: Booking[];
  // "YYYY-MM-DD" bloquea el día completo; "YYYY-MM-DD HH:mm" bloquea una hora.
  blocked: string[];
  // Destinos de aviso configurables desde el panel (para la demo en vivo y para
  // que el negocio los cambie sin tocar variables de entorno).
  notify: { email?: string; whatsapp?: string };
  notifyQuota?: { date: string; sent: number };
  seeded: boolean;
}

const g = globalThis as unknown as { __bookingStore?: Store };

function store(): Store {
  if (!g.__bookingStore) {
    g.__bookingStore = { bookings: [], blocked: [], notify: {}, seeded: false };
    // Los datos de ejemplo son para las demos. Un cliente real con base de
    // datos jamás debe ver reservas inventadas en su panel.
    if (!hasDb()) seed(g.__bookingStore);
  }
  return g.__bookingStore;
}

// createBooking necesita distinguir el choque de horario de otros errores, así
// que no usa withDb (que degrada a memoria en silencio) sino este envoltorio.
async function ensureSchemaThen(operation: () => Promise<void>): Promise<void> {
  await ensureSchema();
  await operation();
}

// Fila de Postgres → Booking.
function rowToBooking(r: Record<string, unknown>): Booking {
  return {
    id: String(r.id),
    service: String(r.service),
    date: String(r.date),
    time: String(r.time),
    name: String(r.name),
    phone: String(r.phone),
    status: r.status as Booking["status"],
    payment: (r.payment as Booking["payment"]) ?? undefined,
    createdAt: new Date(r.created_at as string).toISOString(),
  };
}

// Datos de ejemplo para que el panel del dueño nunca se vea vacío en la demo.
function seed(s: Store) {
  if (s.seeded) return;
  const d = (offset: number) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return date.toISOString().slice(0, 10);
  };
  const services = clientConfig.services.map((x) => x.title);
  const svc = (i: number) => services[i % Math.max(services.length, 1)] ?? "Servicio";
  s.bookings.push(
    { id: "demo-1", service: svc(0), date: d(1), time: "11:00", name: "Camila R.", phone: "+56 9 5555 1111", status: "pendiente", createdAt: new Date().toISOString() },
    { id: "demo-2", service: svc(1), date: d(1), time: "15:00", name: "Fernanda M.", phone: "+56 9 5555 2222", status: "confirmada", createdAt: new Date().toISOString() },
    { id: "demo-3", service: svc(4), date: d(2), time: "10:00", name: "Valentina S.", phone: "+56 9 5555 3333", status: "confirmada", createdAt: new Date().toISOString() }
  );
  s.blocked.push(d(3)); // un día bloqueado de ejemplo
  if (clientConfig.booking?.ownerNotifyWhatsapp) {
    s.notify.whatsapp = clientConfig.booking.ownerNotifyWhatsapp;
  }
  if (clientConfig.booking?.ownerNotifyEmail) {
    s.notify.email = clientConfig.booking.ownerNotifyEmail;
  }
  s.seeded = true;
}

const DAY_NAMES = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

// Sin tildes ni mayúsculas, para comparar "miércoles"/"Miercoles"/"sábado" parejo.
function normalizeDay(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const DAY_NAMES_NORM = DAY_NAMES.map(normalizeDay);

// ¿El día `dayIdx` (0=domingo) calza con una etiqueta como "Lunes a viernes",
// "Martes a sábado", "Lunes y domingo" o "Jueves"? Los rangos "X a Y" se expanden
// de verdad (incluye los días intermedios) y soportan cruce de semana
// ("Viernes a lunes"); cualquier otra etiqueta calza si menciona el día.
function dayMatchesLabel(dayIdx: number, label: string): boolean {
  const l = normalizeDay(label);
  const range = l.match(/([a-z]+)\s+a\s+([a-z]+)/);
  if (range) {
    const from = DAY_NAMES_NORM.indexOf(range[1]);
    const to = DAY_NAMES_NORM.indexOf(range[2]);
    if (from >= 0 && to >= 0) {
      return from <= to ? dayIdx >= from && dayIdx <= to : dayIdx >= from || dayIdx <= to;
    }
  }
  return l.includes(DAY_NAMES_NORM[dayIdx]);
}

function hoursForDate(date: string): { open: string; close: string } | null {
  const dayIdx = new Date(date + "T12:00:00").getDay();
  for (const h of clientConfig.contact.hours ?? []) {
    if (dayMatchesLabel(dayIdx, h.day)) {
      if (h.closed || !h.open || !h.close) return null;
      return { open: h.open, close: h.close };
    }
  }
  return null;
}

// Genera la grilla de horarios del día y marca cuáles siguen libres. Es la
// única fuente de verdad de disponibilidad: la usan el formulario, la API y las
// herramientas del asistente.
function buildSlots(
  date: string,
  isTaken: (time: string) => boolean,
  isBlocked: (key: string) => boolean
): { time: string; available: boolean }[] {
  if (isBlocked(date)) return [];
  const hours = hoursForDate(date);
  if (!hours) return [];

  const slotMinutes = clientConfig.booking?.slotMinutes ?? 60;
  const [oh, om] = hours.open.split(":").map(Number);
  const [ch, cm] = hours.close.split(":").map(Number);
  const slots: { time: string; available: boolean }[] = [];
  for (let t = oh * 60 + om; t + slotMinutes <= ch * 60 + cm; t += slotMinutes) {
    const time = `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
    slots.push({ time, available: !isTaken(time) && !isBlocked(`${date} ${time}`) });
  }
  return slots;
}

export async function slotsForDate(date: string): Promise<{ time: string; available: boolean }[]> {
  return withDb(
    async () => {
      const sql = db();
      const [taken, blocked] = await Promise.all([
        sql`SELECT time FROM bookings WHERE date = ${date} AND status <> 'cancelada'`,
        sql`SELECT key FROM blocked_slots WHERE key = ${date} OR key LIKE ${date + " %"}`,
      ]);
      const takenSet = new Set(taken.map((r) => String(r.time)));
      const blockedSet = new Set(blocked.map((r) => String(r.key)));
      return buildSlots(date, (t) => takenSet.has(t), (k) => blockedSet.has(k));
    },
    () => {
      const s = store();
      return buildSlots(
        date,
        (time) => s.bookings.some((b) => b.date === date && b.time === time && b.status !== "cancelada"),
        (key) => s.blocked.includes(key)
      );
    }
  );
}

export async function createBooking(
  data: Omit<Booking, "id" | "status" | "createdAt">
): Promise<Booking | { error: string }> {
  const slot = (await slotsForDate(data.date)).find((x) => x.time === data.time);
  if (!slot) return { error: "Ese día no hay atención." };
  if (!slot.available) return { error: "Esa hora ya está tomada — elige otra." };

  const booking: Booking = {
    ...data,
    id: Math.random().toString(36).slice(2, 8).toUpperCase(),
    status: "pendiente",
    createdAt: new Date().toISOString(),
  };

  if (!hasDb()) {
    store().bookings.push(booking);
    return booking;
  }

  try {
    await ensureSchemaThen(async () => {
      const sql = db();
      await sql`
        INSERT INTO bookings (id, service, date, time, name, phone, status, created_at)
        VALUES (${booking.id}, ${booking.service}, ${booking.date}, ${booking.time},
                ${booking.name}, ${booking.phone}, ${booking.status}, ${booking.createdAt})
      `;
    });
    return booking;
  } catch (error) {
    // El índice único (date, time) es la última defensa contra dos personas
    // reservando la misma hora al mismo tiempo.
    if (String(error).includes("bookings_slot_unico")) {
      return { error: "Esa hora acaba de tomarla otra persona — elige otra." };
    }
    console.error("[booking-store] createBooking:", error);
    return { error: "No pudimos registrar la reserva. Intenta de nuevo en unos minutos." };
  }
}

export async function listBookings(): Promise<Booking[]> {
  return withDb(
    async () => {
      const sql = db();
      const rows = await sql`SELECT * FROM bookings ORDER BY date, time`;
      return rows.map((r) => rowToBooking(r as Record<string, unknown>));
    },
    () => [...store().bookings].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
  );
}

export async function setBookingStatus(id: string, status: Booking["status"]): Promise<boolean> {
  return withDb(
    async () => {
      const sql = db();
      const rows = await sql`UPDATE bookings SET status = ${status} WHERE id = ${id} RETURNING id`;
      return rows.length > 0;
    },
    () => {
      const b = store().bookings.find((x) => x.id === id);
      if (!b) return false;
      b.status = status;
      return true;
    }
  );
}

export async function getBooking(id: string): Promise<Booking | undefined> {
  return withDb(
    async () => {
      const sql = db();
      const rows = await sql`SELECT * FROM bookings WHERE id = ${id} LIMIT 1`;
      return rows[0] ? rowToBooking(rows[0] as Record<string, unknown>) : undefined;
    },
    () => store().bookings.find((x) => x.id === id)
  );
}

// Abono aprobado por Webpay: registra el pago y confirma la reserva de una vez.
export async function setBookingPaid(
  id: string,
  payment: { amount: number; authorizationCode?: string; cardLast4?: string }
): Promise<boolean> {
  return withDb(
    async () => {
      const sql = db();
      const rows = await sql`
        UPDATE bookings SET payment = ${jsonb(payment)}, status = 'confirmada'
        WHERE id = ${id} RETURNING id
      `;
      return rows.length > 0;
    },
    () => {
      const b = store().bookings.find((x) => x.id === id);
      if (!b) return false;
      b.payment = payment;
      b.status = "confirmada";
      return true;
    }
  );
}

export async function listBlocked(): Promise<string[]> {
  return withDb(
    async () => {
      const sql = db();
      const rows = await sql`SELECT key FROM blocked_slots ORDER BY key`;
      return rows.map((r) => String(r.key));
    },
    () => [...store().blocked].sort()
  );
}

export async function getNotify(): Promise<{ email?: string; whatsapp?: string }> {
  return withDb(
    async () => {
      const sql = db();
      const rows = await sql`SELECT value FROM settings WHERE key = 'notify' LIMIT 1`;
      return (rows[0]?.value as { email?: string; whatsapp?: string }) ?? {};
    },
    () => ({ ...store().notify })
  );
}

export async function setNotify(data: { email?: string; whatsapp?: string }): Promise<void> {
  await withDb(
    async () => {
      const current = await getNotify();
      const next = { ...current };
      if (data.email !== undefined) next.email = data.email || undefined;
      if (data.whatsapp !== undefined) next.whatsapp = data.whatsapp || undefined;
      const sql = db();
      await sql`
        INSERT INTO settings (key, value) VALUES ('notify', ${jsonb(next)})
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
      `;
    },
    () => {
      const n = store().notify;
      if (data.email !== undefined) n.email = data.email || undefined;
      if (data.whatsapp !== undefined) n.whatsapp = data.whatsapp || undefined;
    }
  );
}

// Tope diario de avisos automáticos. Mantiene el envío dentro de la capa
// gratuita de Resend (100/día) aunque un prospecto pruebe la demo sin parar:
// pasado el tope la reserva se crea igual, solo se omite el aviso.
export async function consumeNotifyQuota(maxPerDay = 20): Promise<boolean> {
  const today = new Date().toISOString().slice(0, 10);
  return withDb(
    async () => {
      const sql = db();
      // Un solo upsert atómico: el WHERE hace que la base NO actualice cuando
      // el cupo del día ya se agotó, y entonces RETURNING no devuelve filas.
      const rows = await sql`
        INSERT INTO settings (key, value) VALUES ('notify_quota', ${jsonb({ date: today, sent: 1 })})
        ON CONFLICT (key) DO UPDATE SET value =
          CASE
            WHEN settings.value->>'date' <> ${today} THEN ${jsonb({ date: today, sent: 1 })}
            ELSE jsonb_build_object('date', ${today}::text, 'sent', (settings.value->>'sent')::int + 1)
          END
        WHERE settings.value->>'date' <> ${today} OR (settings.value->>'sent')::int < ${maxPerDay}
        RETURNING value
      `;
      return rows.length > 0;
    },
    () => {
      const s = store();
      if (!s.notifyQuota || s.notifyQuota.date !== today) s.notifyQuota = { date: today, sent: 0 };
      if (s.notifyQuota.sent >= maxPerDay) return false;
      s.notifyQuota.sent++;
      return true;
    }
  );
}

export async function toggleBlocked(key: string): Promise<{ blocked: boolean }> {
  return withDb(
    async () => {
      const sql = db();
      const deleted = await sql`DELETE FROM blocked_slots WHERE key = ${key} RETURNING key`;
      if (deleted.length > 0) return { blocked: false };
      await sql`INSERT INTO blocked_slots (key) VALUES (${key}) ON CONFLICT DO NOTHING`;
      return { blocked: true };
    },
    () => {
      const s = store();
      const i = s.blocked.indexOf(key);
      if (i >= 0) s.blocked.splice(i, 1);
      else s.blocked.push(key);
      return { blocked: i < 0 };
    }
  );
}
