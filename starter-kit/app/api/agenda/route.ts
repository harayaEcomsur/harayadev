import { z } from "zod";
import { clientConfig } from "@/config/client.config";
import {
  slotsForDate,
  listBookings,
  setBookingStatus,
  listBlocked,
  toggleBlocked,
  getNotify,
  setNotify,
  consumeNotifyQuota,
} from "@/lib/booking-store";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import {
  createBookingAndNotify,
  notifyByEmail,
  notifyByWhatsApp,
  notifyTargets,
  emailWithWaLinks,
  defaultOwnerWhatsapp,
} from "@/lib/booking-actions";

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

export async function POST(req: Request) {
  if (!clientConfig.modules.agenda) return Response.json({ error: "Agenda no habilitada" }, { status: 404 });
  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "Datos inválidos" }, { status: 400 });

  const result = await createBookingAndNotify(parsed.data);
  if (!result.ok) return Response.json({ error: result.error }, { status: 409 });

  return Response.json({
    ok: true,
    booking: result.booking,
    emailSent: result.emailSent,
    whatsappSent: result.whatsappSent,
    waNotifyUrl: result.waNotifyUrl,
    depositNote: result.depositNote,
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
                service: clientConfig.services[0]?.title ?? "Servicio",
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
