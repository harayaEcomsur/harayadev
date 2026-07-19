// Memoria corta de conversación por número de WhatsApp, para que el asistente
// pueda completar flujos de varios mensajes (ej. agendar: servicio → hora →
// nombre). En memoria (globalThis), igual que el resto de los stores del
// template: suficiente para la ventana de una conversación real; en producción
// con Postgres se respalda igual que las reservas.

export interface WaTurn {
  role: "user" | "assistant";
  content: string;
}

interface WaThread {
  turns: WaTurn[];
  updatedAt: number;
}

const MAX_TURNS = 12; // ~6 idas y vueltas
const TTL_MS = 6 * 60 * 60 * 1000; // 6 horas: cubre la ventana de servicio típica

const g = globalThis as unknown as { __waHistory?: Map<string, WaThread> };

function threads(): Map<string, WaThread> {
  if (!g.__waHistory) g.__waHistory = new Map();
  return g.__waHistory;
}

export function getHistory(phone: string): WaTurn[] {
  const t = threads().get(phone);
  if (!t) return [];
  if (Date.now() - t.updatedAt > TTL_MS) {
    threads().delete(phone);
    return [];
  }
  return t.turns;
}

export function appendHistory(phone: string, ...turns: WaTurn[]): void {
  const map = threads();
  const t = map.get(phone) ?? { turns: [], updatedAt: 0 };
  t.turns.push(...turns);
  if (t.turns.length > MAX_TURNS) t.turns.splice(0, t.turns.length - MAX_TURNS);
  t.updatedAt = Date.now();
  map.set(phone, t);
  // Limpieza básica para que el map no crezca sin límite.
  if (map.size > 500) {
    const oldest = [...map.entries()].sort((a, b) => a[1].updatedAt - b[1].updatedAt)[0];
    if (oldest) map.delete(oldest[0]);
  }
}
