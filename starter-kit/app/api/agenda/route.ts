import { z } from "zod";
import { clientConfig } from "@/config/client.config";
import {
  slotsForDate,
  createBooking,
  listBookings,
  setBookingStatus,
  listBlocked,
  toggleBlocked,
  getNotify,
  setNotify,
  consumeNotifyQuota,
} from "@/lib/booking-store";
import { buildBookingClientWaLink, buildWhatsAppLink } from "@/lib/whatsapp";

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
    const n = getNotify();
    return Response.json({
      bookings: listBookings(),
      blocked: listBlocked(),
      notify: {
        email: n.email ?? clientConfig.booking?.ownerNotifyEmail ?? process.env.BOOKINGS_NOTIFY_EMAIL ?? null,
        whatsapp: n.whatsapp ?? defaultOwnerWhatsapp() ?? null,
        whatsappReady: Boolean(process.env.NOTIFY_WA_TOKEN && process.env.NOTIFY_WA_PHONE_ID),
        whatsappMode: process.env.NOTIFY_WA_TOKEN && process.env.NOTIFY_WA_PHONE_ID ? "api" : "wame",
      },
    });
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

async function notifyByEmail(subject: string, text: string, toOverride?: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = toOverride ?? process.env.BOOKINGS_NOTIFY_EMAIL;
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

// Aviso por WhatsApp AL DUEÑO, enviado desde el número de HarayaDev (Cloud API).
// Requiere NOTIFY_WA_TOKEN + NOTIFY_WA_PHONE_ID (la app de Meta de HarayaDev) y,
// fuera de la ventana de 24h, una plantilla utility aprobada (NOTIFY_WA_TEMPLATE).
async function notifyByWhatsApp(to: string, text: string): Promise<boolean> {
  const token = process.env.NOTIFY_WA_TOKEN;
  const phoneId = process.env.NOTIFY_WA_PHONE_ID;
  if (!token || !phoneId || !to) return false;
  try {
    const template = process.env.NOTIFY_WA_TEMPLATE;
    const body = template
      ? {
          messaging_product: "whatsapp",
          to: to.replace(/[^\d]/g, ""),
          type: "template",
          template: {
            name: template,
            language: { code: "es" },
            components: [{ type: "body", parameters: [{ type: "text", text }] }],
          },
        }
      : {
          messaging_product: "whatsapp",
          to: to.replace(/[^\d]/g, ""),
          type: "text",
          text: { body: text },
        };
    const res = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.ok;
  } catch {
    return false;
  }
}

function defaultOwnerWhatsapp(): string | undefined {
  const digits = (n?: string) => (n ? n.replace(/\D/g, "") : "");
  const fromConfig = clientConfig.booking?.ownerNotifyWhatsapp ?? clientConfig.contact.whatsapp;
  return digits(fromConfig).length >= 8 ? fromConfig : undefined;
}

function notifyTargets(): { email?: string; whatsapp?: string } {
  const n = getNotify();
  const whatsapp = n.whatsapp ?? defaultOwnerWhatsapp();
  return {
    email: n.email ?? clientConfig.booking?.ownerNotifyEmail ?? process.env.BOOKINGS_NOTIFY_EMAIL,
    whatsapp,
  };
}

function bookingSummary(booking: { id: string; service: string; date: string; time: string; name: string; phone: string }) {
  return [
    `Reserva PENDIENTE DE ABONO en ${clientConfig.meta.businessName}:`,
    ``,
    `Servicio: ${booking.service}`,
    `Fecha: ${booking.date} a las ${booking.time}`,
    `Cliente: ${booking.name} · ${booking.phone}`,
    ``,
    `Confírmala en el panel: /agenda/admin`,
  ].join("\n");
}

function emailWithWaLinks(
  summary: string,
  booking: { id: string; service: string; date: string; time: string; name: string; phone: string; status: string },
  targets: { email?: string; whatsapp?: string }
): string {
  const lines = [summary, ""];
  if (targets.whatsapp && targets.whatsapp.replace(/\D/g, "").length >= 8) {
    lines.push(
      `📱 Abrir aviso en tu WhatsApp (gratis, wa.me):`,
      buildWhatsAppLink(targets.whatsapp, summary),
      ""
    );
  }
  if (booking.phone.replace(/\D/g, "").length >= 8) {
    lines.push(
      `💬 Escribir a la clienta por WhatsApp:`,
      buildBookingClientWaLink(booking, clientConfig.meta.businessName)
    );
  }
  return lines.join("\n");
}

export async function POST(req: Request) {
  if (!clientConfig.modules.agenda) return Response.json({ error: "Agenda no habilitada" }, { status: 404 });
  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "Datos inválidos" }, { status: 400 });

  const result = createBooking(parsed.data);
  if ("error" in result) return Response.json({ error: result.error }, { status: 409 });

  // Aviso al dueño: correo (gratis) con enlaces wa.me, y push por API solo si está activo.
  const targets = notifyTargets();
  const summary = bookingSummary(result);
  const emailBody = emailWithWaLinks(summary, result, targets);
  const quotaOk = consumeNotifyQuota();
  const [emailSent, whatsappSent] = await Promise.all([
    quotaOk
      ? notifyByEmail(`📅 Nueva reserva ${result.id} — ${result.service} (${clientConfig.meta.businessName})`, emailBody, targets.email)
      : Promise.resolve(false),
    quotaOk && targets.whatsapp && process.env.NOTIFY_WA_TOKEN
      ? notifyByWhatsApp(targets.whatsapp, summary)
      : Promise.resolve(false),
  ]);

  return Response.json({
    ok: true,
    booking: result,
    emailSent,
    whatsappSent,
    waNotifyUrl:
      targets.whatsapp && targets.whatsapp.replace(/\D/g, "").length >= 8
        ? buildWhatsAppLink(targets.whatsapp, summary)
        : null,
    depositNote: clientConfig.booking?.depositNote,
  });
}

const patchSchema = z.union([
  z.object({ action: z.literal("status"), id: z.string(), status: z.enum(["confirmada", "cancelada", "pendiente"]) }),
  z.object({ action: z.literal("toggleBlock"), key: z.string().min(10).max(16) }),
  z.object({
    action: z.literal("setNotify"),
    email: z.string().email().or(z.literal("")).optional(),
    whatsapp: z.string().max(20).optional(),
  }),
  z.object({ action: z.literal("testNotify") }),
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
  if (parsed.data.action === "setNotify") {
    setNotify({ email: parsed.data.email, whatsapp: parsed.data.whatsapp });
    return Response.json({ ok: true });
  }
  if (parsed.data.action === "testNotify") {
    const targets = notifyTargets();
    const text = `Aviso de prueba de la agenda de ${clientConfig.meta.businessName} — así te llegará cada reserva nueva ✅`;
    const quotaOk = consumeNotifyQuota();
    const waMeUrl =
      targets.whatsapp && targets.whatsapp.replace(/\D/g, "").length >= 8
        ? buildWhatsAppLink(targets.whatsapp, text)
        : null;
    const [emailSent, whatsappSent] = await Promise.all([
      quotaOk
        ? notifyByEmail(
            `🔔 Prueba de avisos — ${clientConfig.meta.businessName}`,
            emailWithWaLinks(
              text,
              {
                id: "DEMO",
                service: "Esmaltado permanente",
                date: new Date().toISOString().slice(0, 10),
                time: "11:00",
                name: "Camila R.",
                phone: "+56 9 5555 1111",
                status: "pendiente",
              },
              targets
            ),
            targets.email
          )
        : Promise.resolve(false),
      quotaOk && targets.whatsapp && process.env.NOTIFY_WA_TOKEN
        ? notifyByWhatsApp(targets.whatsapp, text)
        : Promise.resolve(false),
    ]);
    return Response.json({ ok: true, emailSent, whatsappSent, waMeUrl });
  }
  return Response.json({ ok: true, ...toggleBlocked(parsed.data.key) });
}
