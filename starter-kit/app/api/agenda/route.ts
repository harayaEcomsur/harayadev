import { z } from "zod";
import { clientConfig } from "@/config/client.config";
import {
  slotsForDate,
  createBooking,
  listBookings,
  setBookingStatus,
  listBlocked,
  toggleBlocked,
} from "@/lib/booking-store";

// API del módulo agenda. GET público entrega disponibilidad; con clave de admin
// entrega además las reservas. POST crea una reserva (queda "pendiente" hasta el
// abono) y avisa por email. PATCH (solo admin) confirma/cancela o bloquea horarios.
export const runtime = "nodejs";

function isAdmin(req: Request): boolean {
  const key = process.env.AGENDA_ADMIN_KEY;
  if (!key) return false;
  return req.headers.get("x-agenda-key") === key || new URL(req.url).searchParams.get("clave") === key;
}

export async function GET(req: Request) {
  if (!clientConfig.modules.agenda) return Response.json({ error: "Agenda no habilitada" }, { status: 404 });
  const url = new URL(req.url);
  const date = url.searchParams.get("date");

  if (isAdmin(req)) {
    return Response.json({ bookings: listBookings(), blocked: listBlocked() });
  }
  if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return Response.json({ date, slots: slotsForDate(date) });
  }
  return Response.json({ error: "Falta ?date=YYYY-MM-DD" }, { status: 400 });
}

const createSchema = z.object({
  service: z.string().min(2).max(120),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  name: z.string().min(2).max(120),
  phone: z.string().min(6).max(20),
});

async function notifyByEmail(subject: string, text: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.BOOKINGS_NOTIFY_EMAIL;
  if (!apiKey || !to) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "Agenda <onboarding@resend.dev>",
        to,
        subject,
        text,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  if (!clientConfig.modules.agenda) return Response.json({ error: "Agenda no habilitada" }, { status: 404 });
  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "Datos inválidos" }, { status: 400 });

  const result = createBooking(parsed.data);
  if ("error" in result) return Response.json({ error: result.error }, { status: 409 });

  // Aviso al dueño — email real si está configurado; WhatsApp se suma cuando el
  // negocio activa el módulo "Asistente IA en tu WhatsApp" (misma Cloud API).
  const emailSent = await notifyByEmail(
    `📅 Nueva reserva ${result.id} — ${result.service} (${clientConfig.meta.businessName})`,
    [
      `Reserva PENDIENTE DE ABONO en ${clientConfig.meta.businessName}:`,
      ``,
      `Servicio: ${result.service}`,
      `Fecha: ${result.date} a las ${result.time}`,
      `Cliente: ${result.name} · ${result.phone}`,
      ``,
      `Confírmala en el panel: /agenda/admin`,
    ].join("\n")
  );

  return Response.json({
    ok: true,
    booking: result,
    emailSent,
    depositNote: clientConfig.booking?.depositNote,
  });
}

const patchSchema = z.union([
  z.object({ action: z.literal("status"), id: z.string(), status: z.enum(["confirmada", "cancelada", "pendiente"]) }),
  z.object({ action: z.literal("toggleBlock"), key: z.string().min(10).max(16) }),
]);

export async function PATCH(req: Request) {
  if (!clientConfig.modules.agenda) return Response.json({ error: "Agenda no habilitada" }, { status: 404 });
  if (!isAdmin(req)) return Response.json({ error: "No autorizado" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "Datos inválidos" }, { status: 400 });

  if (parsed.data.action === "status") {
    const ok = setBookingStatus(parsed.data.id, parsed.data.status);
    return Response.json({ ok });
  }
  return Response.json({ ok: true, ...toggleBlocked(parsed.data.key) });
}
