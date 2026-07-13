import { clientConfig } from "@/config/client.config";

// Almacén de reservas del módulo agenda.
//
// DEMO/MVP: en memoria (globalThis) con datos sembrados — suficiente para mostrar
// el flujo completo (reservar → pendiente de abono → confirmar → bloquear horarios).
// Las reservas viven mientras viva el isolate del servidor; en producción este
// módulo se respalda en Postgres (Neon) sin cambiar nada del resto del código:
// solo se reemplazan estas funciones.

export interface Booking {
  id: string;
  service: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  name: string;
  phone: string;
  status: "pendiente" | "confirmada" | "cancelada";
  createdAt: string;
}

interface Store {
  bookings: Booking[];
  // "YYYY-MM-DD" bloquea el día completo; "YYYY-MM-DD HH:mm" bloquea una hora.
  blocked: string[];
  // Destinos de aviso configurables desde el panel (para la demo en vivo y para
  // que el negocio los cambie sin tocar variables de entorno).
  notify: { email?: string; whatsapp?: string };
  seeded: boolean;
}

const g = globalThis as unknown as { __bookingStore?: Store };

function store(): Store {
  if (!g.__bookingStore) {
    g.__bookingStore = { bookings: [], blocked: [], notify: {}, seeded: false };
    seed(g.__bookingStore);
  }
  return g.__bookingStore;
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
  s.seeded = true;
}

const DAY_NAMES = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

function hoursForDate(date: string): { open: string; close: string } | null {
  const dayIdx = new Date(date + "T12:00:00").getDay();
  const dayName = DAY_NAMES[dayIdx];
  for (const h of clientConfig.contact.hours ?? []) {
    const label = h.day.toLowerCase();
    const matches =
      label.includes(dayName) ||
      (label.includes("lunes a viernes") && dayIdx >= 1 && dayIdx <= 5) ||
      (label.includes("lunes a sábado") && dayIdx >= 1 && dayIdx <= 6);
    if (matches) {
      if (h.closed || !h.open || !h.close) return null;
      return { open: h.open, close: h.close };
    }
  }
  return null;
}

export function slotsForDate(date: string): { time: string; available: boolean }[] {
  const s = store();
  if (s.blocked.includes(date)) return [];
  const hours = hoursForDate(date);
  if (!hours) return [];

  const slotMinutes = clientConfig.booking?.slotMinutes ?? 60;
  const [oh, om] = hours.open.split(":").map(Number);
  const [ch, cm] = hours.close.split(":").map(Number);
  const slots: { time: string; available: boolean }[] = [];
  for (let t = oh * 60 + om; t + slotMinutes <= ch * 60 + cm; t += slotMinutes) {
    const time = `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
    const taken = s.bookings.some((b) => b.date === date && b.time === time && b.status !== "cancelada");
    const blocked = s.blocked.includes(`${date} ${time}`);
    slots.push({ time, available: !taken && !blocked });
  }
  return slots;
}

export function createBooking(data: Omit<Booking, "id" | "status" | "createdAt">): Booking | { error: string } {
  const slot = slotsForDate(data.date).find((x) => x.time === data.time);
  if (!slot) return { error: "Ese día no hay atención." };
  if (!slot.available) return { error: "Esa hora ya está tomada — elige otra." };
  const booking: Booking = {
    ...data,
    id: Math.random().toString(36).slice(2, 8).toUpperCase(),
    status: "pendiente",
    createdAt: new Date().toISOString(),
  };
  store().bookings.push(booking);
  return booking;
}

export function listBookings(): Booking[] {
  return [...store().bookings].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
}

export function setBookingStatus(id: string, status: Booking["status"]): boolean {
  const b = store().bookings.find((x) => x.id === id);
  if (!b) return false;
  b.status = status;
  return true;
}

export function listBlocked(): string[] {
  return [...store().blocked].sort();
}

export function getNotify(): { email?: string; whatsapp?: string } {
  return { ...store().notify };
}

export function setNotify(data: { email?: string; whatsapp?: string }): void {
  const n = store().notify;
  if (data.email !== undefined) n.email = data.email || undefined;
  if (data.whatsapp !== undefined) n.whatsapp = data.whatsapp || undefined;
}

export function toggleBlocked(key: string): { blocked: boolean } {
  const s = store();
  const i = s.blocked.indexOf(key);
  if (i >= 0) s.blocked.splice(i, 1);
  else s.blocked.push(key);
  return { blocked: i < 0 };
}
