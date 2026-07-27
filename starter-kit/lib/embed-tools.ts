import { tool, type CoreTool } from "ai";
import { z } from "zod";
import { notifyByEmail, notifyByWhatsApp } from "@/lib/booking-actions";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { slotsForDate, createBooking, type EmbedBooking } from "@/lib/embed-agenda";
import { createOrder } from "@/lib/embed-store";
import { embedWebpayEnv } from "@/lib/embed-webpay";
import { createTransaction } from "@/lib/webpay";
import type { EmbedTenant } from "@/config/embed-tenants";

// Tools TRANSACCIONALES del asistente EMBEBIBLE, resueltas por tenant.
//
// Primer slice: captura de contacto/lead universal (sirve a cualquier rubro —
// salón, abogado, tienda), que avisa al dueño DEL TENANT por email y, si hay
// token de la app de Meta de HarayaDev, también por WhatsApp (enviado desde el
// número de HarayaDev al número del dueño, no del tenant). Es aditivo: no toca
// el store single-tenant ni la agenda/tienda compartidas, y no necesita secretos
// por tenant. La agenda y la tienda por tenant (con verdad de servidor y
// aislamiento de secretos de Webpay/WhatsApp propios) son el siguiente slice.

interface ContactoData {
  nombre: string;
  telefono: string;
  interes: string;
  email?: string;
}

// Resumen legible para el aviso al dueño — mismo estilo que leadSummary/bookingSummary.
function contactoSummary(t: EmbedTenant, data: ContactoData): string {
  const lines = [
    `Nuevo CONTACTO desde el asistente de ${t.businessName}:`,
    ``,
    `Nombre: ${data.nombre}`,
    `Teléfono: ${data.telefono}`,
  ];
  if (data.email) lines.push(`Email: ${data.email}`);
  lines.push(``, `Consulta: ${data.interes}`);
  return lines.join("\n");
}

// Cuerpo del email: resumen + link wa.me para escribirle de vuelta al interesado.
function contactoEmailBody(t: EmbedTenant, data: ContactoData, summary: string): string {
  const lines = [summary];
  if (data.telefono.replace(/\D/g, "").length >= 8) {
    lines.push(
      ``,
      `💬 Escribirle por WhatsApp:`,
      buildWhatsAppLink(data.telefono, `Hola ${data.nombre}! Te escribo de ${t.businessName} 😊`)
    );
  }
  return lines.join("\n");
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function todayISO(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Santiago" }).format(new Date());
}
function addDays(date: string, days: number): string {
  const d = new Date(date + "T12:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
function dayLabel(date: string): string {
  return new Intl.DateTimeFormat("es-CL", {
    timeZone: "America/Santiago",
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(date + "T12:00:00"));
}
// Calza lo que escribió la persona con un servicio del tenant (sin tildes/mayúsculas).
function matchService(t: EmbedTenant, input: string): string | null {
  const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const wanted = norm(input);
  const titles = t.agenda?.services ?? [];
  return (
    titles.find((x) => norm(x) === wanted) ??
    titles.find((x) => norm(x).includes(wanted) || wanted.includes(norm(x))) ??
    null
  );
}

async function notifyOwnerBooking(t: EmbedTenant, b: EmbedBooking): Promise<void> {
  const summary = [
    `Nueva RESERVA desde el asistente de ${t.businessName}:`,
    ``,
    `Servicio: ${b.service}`,
    `Fecha: ${b.date} (${dayLabel(b.date)}) a las ${b.time}`,
    `Cliente: ${b.name} · ${b.phone} (reserva ${b.id})`,
  ].join("\n");
  const emailBody =
    b.phone.replace(/\D/g, "").length >= 8
      ? `${summary}\n\n💬 Escribirle por WhatsApp:\n${buildWhatsAppLink(
          b.phone,
          `Hola ${b.name}! Te escribo de ${t.businessName} por tu reserva 😊`
        )}`
      : summary;
  await Promise.all([
    notifyByEmail(`📅 Nueva reserva ${b.id} — ${t.businessName}`, emailBody, t.ownerNotifyEmail),
    t.whatsapp && process.env.NOTIFY_WA_TOKEN
      ? notifyByWhatsApp(t.whatsapp, summary)
      : Promise.resolve(false),
  ]);
}

// Tools de agenda por tenant: solo se exponen si el tenant declaró `agenda`.
// La disponibilidad sale del motor (embed-agenda), nunca de lo que "cree" el
// modelo — mismo principio que la agenda del sitio.
function buildEmbedAgendaTools(t: EmbedTenant): Record<string, CoreTool> {
  if (!t.agenda) return {};
  const daysAhead = t.agenda.daysAhead ?? 14;

  return {
    consultar_disponibilidad: tool({
      description:
        "Consulta los horarios REALMENTE disponibles. Sin fecha: resume los próximos días con horas libres. Con fecha (YYYY-MM-DD): lista las horas libres de ese día. Úsala SIEMPRE antes de ofrecer un horario; nunca inventes horas.",
      parameters: z.object({
        fecha: z
          .string()
          .regex(DATE_RE)
          .optional()
          .describe("Fecha exacta YYYY-MM-DD. Omitir para el resumen de próximos días."),
      }),
      execute: async ({ fecha }) => {
        const today = todayISO();
        if (fecha) {
          if (fecha < today) return { error: "Esa fecha ya pasó." };
          if (fecha > addDays(today, daysAhead))
            return { error: `Solo se puede reservar hasta ${daysAhead} días hacia adelante.` };
          const libres = (await slotsForDate(t, fecha)).filter((s) => s.available).map((s) => s.time);
          return { fecha, dia: dayLabel(fecha), horasDisponibles: libres, sinAtencion: libres.length === 0 };
        }
        const resumen: { fecha: string; dia: string; horasDisponibles: string[] }[] = [];
        for (let i = 1; i <= daysAhead && resumen.length < 5; i++) {
          const d = addDays(today, i);
          const libres = (await slotsForDate(t, d)).filter((s) => s.available).map((s) => s.time);
          if (libres.length > 0) resumen.push({ fecha: d, dia: dayLabel(d), horasDisponibles: libres.slice(0, 6) });
        }
        return { proximosDias: resumen, hoy: today, servicios: t.agenda?.services ?? [] };
      },
    }),

    crear_reserva: tool({
      description:
        "Crea una reserva REAL en la agenda. Llámala de inmediato en cuanto tengas los 5 datos: servicio, fecha (YYYY-MM-DD), hora (HH:mm), nombre y teléfono del cliente. NO necesitas haber llamado antes a consultar_disponibilidad ni pedir confirmaciones extra: el sistema valida la disponibilidad en el servidor y te avisa si la hora no está libre. Nunca inventes datos; úsalos tal como los dio el cliente.",
      parameters: z.object({
        servicio: z.string().min(2).max(120).describe("Servicio pedido, idealmente uno de los del negocio."),
        fecha: z.string().regex(DATE_RE).describe("Fecha YYYY-MM-DD."),
        hora: z.string().regex(/^\d{2}:\d{2}$/).describe("Hora HH:mm, una de las disponibles."),
        nombre: z.string().min(2).max(120).describe("Nombre del cliente."),
        telefono: z.string().min(6).max(25).describe("Teléfono del cliente."),
      }),
      execute: async ({ servicio, fecha, hora, nombre, telefono }) => {
        const service = matchService(t, servicio) ?? servicio;
        const result = await createBooking(t, { service, date: fecha, time: hora, name: nombre, phone: telefono });
        if ("error" in result) return { error: result.error };
        await notifyOwnerBooking(t, result);
        return {
          ok: true,
          reserva: {
            id: result.id,
            servicio: result.service,
            fecha: result.date,
            dia: dayLabel(result.date),
            hora: result.time,
            estado: result.status,
          },
        };
      },
    }),
  };
}

// Tools de tienda por tenant: solo si el tenant declaró `store` con productos
// disponibles. Precios y total SIEMPRE del servidor; Webpay con las credenciales
// del tenant (aislamiento de la plata) y retorno namespaced por tenant.
function buildEmbedStoreTools(t: EmbedTenant): Record<string, CoreTool> {
  const available = t.store?.products.filter((p) => p.available !== false) ?? [];
  if (!t.store || available.length === 0) return {};

  const catalog = new Map(available.map((p) => [p.slug, p]));
  const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const similar = (wanted: string): string[] => {
    const w = norm(wanted);
    const words = w.split(/[^a-z0-9]+/).filter((p) => p.length >= 3);
    return [...catalog.keys()].filter((slug) => {
      const s = norm(slug);
      return s.includes(w) || w.includes(s) || words.some((p) => s.includes(p));
    });
  };
  const clp = (n: number) => "$" + n.toLocaleString("es-CL");

  return {
    crear_pedido: tool({
      description:
        "Crea un pedido REAL de la tienda y entrega el link de pago Webpay. Solo llamar cuando el cliente ya eligió productos y cantidades y entregó nombre y teléfono. Nunca inventes productos ni precios: usa únicamente slugs del catálogo.",
      parameters: z.object({
        items: z
          .array(
            z.object({
              slug: z.string().describe("Slug exacto del producto en el catálogo."),
              cantidad: z.number().int().positive().max(99).describe("Cantidad de unidades."),
            })
          )
          .min(1),
        nombre: z.string().min(2).max(120).describe("Nombre del cliente."),
        telefono: z.string().min(6).max(30).describe("Teléfono del cliente."),
        email: z.string().email().optional().describe("Email del cliente, si lo entregó."),
      }),
      execute: async ({ items, nombre, telefono, email }) => {
        const resolved: { slug: string; name: string; price: number; qty: number }[] = [];
        for (const { slug, cantidad } of items) {
          const product = catalog.get(slug);
          if (!product) {
            const parecidos = similar(slug);
            return {
              error:
                `El producto "${slug}" no existe o no está disponible.` +
                (parecidos.length > 0 ? ` ¿Quisiste decir: ${parecidos.join(", ")}?` : ""),
              slugsValidos: [...catalog.keys()],
            };
          }
          resolved.push({ slug, name: product.name, price: product.price, qty: cantidad });
        }

        const order = await createOrder(t, {
          items: resolved,
          buyer: { name: nombre, phone: telefono, email: email || undefined },
        });

        const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
        try {
          const tx = await createTransaction(
            {
              buyOrder: order.id,
              sessionId: order.id,
              amount: order.total,
              returnUrl: `${origin}/api/embed/checkout/retorno?t=${encodeURIComponent(t.id)}`,
            },
            embedWebpayEnv(t)
          );
          return {
            ok: true,
            pedidoId: order.id,
            total: order.total,
            totalFormateado: clp(order.total),
            linkPago: `${tx.url}?token_ws=${encodeURIComponent(tx.token)}`,
            resumen: resolved.map((i) => ({ producto: i.name, cantidad: i.qty, subtotal: clp(i.price * i.qty) })),
            nota: t.store?.shippingNote,
          };
        } catch (e) {
          console.error("[embed-tools] Webpay create:", e);
          return {
            error:
              "No pudimos conectar con Webpay para generar el link de pago. Pide al cliente intentar de nuevo en unos minutos.",
          };
        }
      },
    }),
  };
}

export function buildEmbedTools(t: EmbedTenant): Record<string, CoreTool> {
  return {
    ...buildEmbedAgendaTools(t),
    ...buildEmbedStoreTools(t),
    registrar_contacto: tool({
      description:
        "Registra los datos de contacto de una persona interesada y avisa al negocio. Llamar SOLO cuando la persona quiere reservar, comprar, cotizar o que la contacten, Y ya entregó su nombre y un teléfono real. Nunca inventes nombre ni teléfono: úsalos tal como los dio la persona.",
      parameters: z.object({
        nombre: z.string().min(2).max(120).describe("Nombre de la persona, tal como lo dio."),
        telefono: z
          .string()
          .min(6)
          .max(25)
          .describe("Teléfono real de la persona (ej. +56 9 1234 5678). Nunca inventarlo."),
        interes: z
          .string()
          .min(2)
          .max(400)
          .describe("Qué necesita, consultó o quiere concretar, en pocas palabras."),
        email: z.string().email().optional().describe("Email de la persona, solo si lo entregó."),
      }),
      execute: async (data) => {
        try {
          const summary = contactoSummary(t, data);
          const ownerWa = t.whatsapp;
          await Promise.all([
            notifyByEmail(
              `📩 Nuevo contacto — ${t.businessName}`,
              contactoEmailBody(t, data, summary),
              t.ownerNotifyEmail
            ),
            ownerWa && process.env.NOTIFY_WA_TOKEN
              ? notifyByWhatsApp(ownerWa, summary)
              : Promise.resolve(false),
          ]);
          return { ok: true, note: "Contacto registrado; el negocio te contactará pronto." };
        } catch {
          return {
            error: "No se pudo registrar el contacto ahora. Ofrece derivar al WhatsApp del negocio.",
          };
        }
      },
    }),
  };
}
