// Registro de interacciones del asistente IA (chat web y WhatsApp), para poder
// armar el resumen diario al dueño. En memoria (globalThis), igual que el resto
// de los stores del template: suficiente para la ventana de 24h del resumen; en
// producción con Postgres se respalda igual que las reservas.

export interface ChatLogEntry {
  ts: number;
  canal: "web" | "whatsapp";
  userText: string;
  assistantText: string;
}

const MAX_ENTRIES = 600; // tope duro: descarta las más viejas

const g = globalThis as unknown as { __chatLog?: ChatLogEntry[] };

function log(): ChatLogEntry[] {
  if (!g.__chatLog) g.__chatLog = [];
  return g.__chatLog;
}

export function logChat(entry: Omit<ChatLogEntry, "ts">): void {
  const l = log();
  l.push({ ...entry, ts: Date.now() });
  if (l.length > MAX_ENTRIES) l.splice(0, l.length - MAX_ENTRIES);
}

// Interacciones de las últimas `hours` horas, de la más antigua a la más nueva.
export function recentChats(hours = 24): ChatLogEntry[] {
  const since = Date.now() - hours * 60 * 60 * 1000;
  return log().filter((e) => e.ts >= since);
}
