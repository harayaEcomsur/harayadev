import type { EmbedTenant } from "@/config/embed-tenants";

// Motor de agenda del asistente EMBEBIBLE, SCOPED POR TENANT.
//
// Aislado a propósito del booking-store single-tenant (lib/booking-store.ts, que
// sirve las demos vivas contra Postgres con índice único global (date,time)):
// acá NO tocamos ese esquema. El almacén es en memoria por tenant (globalThis,
// por isolate de Vercel). Persistencia por tenant en Postgres —columna tenant_id
// + índice único (tenant_id,date,time)— es el siguiente paso antes de un cliente
// real que pague; para las demos del add-on, memoria por tenant es suficiente y
// prueba lo esencial: el asistente nunca inventa horarios (verdad de servidor).

export interface EmbedBooking {
  id: string;
  service: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  name: string;
  phone: string;
  status: "pendiente";
  createdAt: string;
}

const g = globalThis as unknown as { __embedBookings?: Map<string, EmbedBooking[]> };

function bucket(tenantId: string): EmbedBooking[] {
  if (!g.__embedBookings) g.__embedBookings = new Map();
  let arr = g.__embedBookings.get(tenantId);
  if (!arr) {
    arr = [];
    g.__embedBookings.set(tenantId, arr);
  }
  return arr;
}

const DAY_NAMES_NORM = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];

function normalizeDay(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

// ¿El día `dayIdx` (0=domingo) calza con "Lunes a viernes", "Martes a sábado",
// "Viernes a lunes" (cruce de semana) o "Jueves"? Misma semántica que el
// booking-store single-tenant, en versión compacta.
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

function hoursForDate(t: EmbedTenant, date: string): { open: string; close: string } | null {
  const dayIdx = new Date(date + "T12:00:00").getDay();
  for (const h of t.agenda?.hours ?? []) {
    if (dayMatchesLabel(dayIdx, h.day)) {
      if (h.closed || !h.open || !h.close) return null;
      return { open: h.open, close: h.close };
    }
  }
  return null;
}

// Grilla de horarios del día con la marca de disponibilidad. Única fuente de
// verdad: la usan tanto la consulta como la creación de la reserva.
export function slotsForDate(t: EmbedTenant, date: string): { time: string; available: boolean }[] {
  const hours = hoursForDate(t, date);
  if (!hours) return [];
  const slotMinutes = t.agenda?.slotMinutes ?? 60;
  const [oh, om] = hours.open.split(":").map(Number);
  const [ch, cm] = hours.close.split(":").map(Number);
  const taken = new Set(
    bucket(t.id)
      .filter((b) => b.date === date)
      .map((b) => b.time)
  );
  const slots: { time: string; available: boolean }[] = [];
  for (let m = oh * 60 + om; m + slotMinutes <= ch * 60 + cm; m += slotMinutes) {
    const time = `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
    slots.push({ time, available: !taken.has(time) });
  }
  return slots;
}

export function createBooking(
  t: EmbedTenant,
  data: { service: string; date: string; time: string; name: string; phone: string }
): EmbedBooking | { error: string } {
  const slot = slotsForDate(t, data.date).find((s) => s.time === data.time);
  if (!slot) return { error: "Ese día no hay atención." };
  if (!slot.available) return { error: "Esa hora ya está tomada — elige otra." };

  const booking: EmbedBooking = {
    ...data,
    id: Math.random().toString(36).slice(2, 8).toUpperCase(),
    status: "pendiente",
    createdAt: new Date().toISOString(),
  };
  bucket(t.id).push(booking);
  return booking;
}
