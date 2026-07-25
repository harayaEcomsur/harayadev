import { tool, type CoreTool } from "ai";
import { z } from "zod";
import { notifyByEmail, notifyByWhatsApp } from "@/lib/booking-actions";
import { buildWhatsAppLink } from "@/lib/whatsapp";
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

export function buildEmbedTools(t: EmbedTenant): Record<string, CoreTool> {
  return {
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
