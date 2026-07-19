import { generateText } from "ai";
import { google } from "@/lib/gemini";
import { buildSystemPrompt } from "@/lib/chat-prompt";

// Webhook de WhatsApp Business Cloud API: el mismo asistente del sitio
// respondiendo el WhatsApp de HarayaDev. Primera respuesta y filtro — el
// cierre de venta siempre lo toma una persona en el mismo chat.
//
// Setup (ver ~/harayadev-crm/whatsapp-cloud-api-plan.md):
//   WHATSAPP_VERIFY_TOKEN    — string secreto que eliges tú; se repite en el panel de Meta
//   WHATSAPP_TOKEN           — token permanente de la app de Meta (System User)
//   WHATSAPP_PHONE_NUMBER_ID — ID del número (no el número) en WhatsApp Manager
export const runtime = "nodejs";

const GRAPH_URL = "https://graph.facebook.com/v21.0";

// Verificación del webhook (Meta hace un GET al registrar la URL).
export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new Response(challenge ?? "", { status: 200 });
  }
  return new Response("Forbidden", { status: 403 });
}

async function sendWhatsAppText(to: string, body: string): Promise<boolean> {
  const res = await fetch(`${GRAPH_URL}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      // 4096 es el máximo de WhatsApp; el asistente responde corto igual.
      text: { body: body.slice(0, 4000) },
    }),
  });
  return res.ok;
}

export async function POST(req: Request) {
  // Siempre responder 200 rápido: si Meta recibe errores, reintenta y puede
  // desactivar el webhook. Los problemas se registran en logs, no en el status.
  const configured =
    process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID && process.env.GEMINI_API_KEY;

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return Response.json({ ok: true });
  }

  if (!configured) return Response.json({ ok: true, note: "whatsapp no configurado" });

  try {
    // Estructura estándar del webhook: entry[].changes[].value.messages[]
    const value = (payload as any)?.entry?.[0]?.changes?.[0]?.value;
    const message = value?.messages?.[0];

    // Ignorar estados de entrega/lectura y tipos no soportados en v1.
    if (!message || message.type !== "text" || !message.text?.body) {
      return Response.json({ ok: true });
    }

    const from: string = message.from;
    const userText: string = message.text.body;

    const { text } = await generateText({
      model: google("gemini-2.5-flash-lite"),
      system:
        buildSystemPrompt() +
        "\n\nEstás respondiendo por WhatsApp: sé especialmente breve (2-4 frases), sin markdown ni asteriscos, y las rutas del sitio escríbelas como URL completa (https://haraya.dev/demo). Tu rol es dar la primera respuesta y filtrar: responde precios, planes y cómo funciona la demo. Si el cliente quiere contratar, cotizar algo a medida o hablar con una persona, dile que alguien del equipo le responde por este mismo chat dentro del horario hábil — no cierres tratos ni prometas plazos tú.",
      prompt: userText,
      maxTokens: 500,
    });

    if (text?.trim()) {
      await sendWhatsAppText(from, text.trim());
    }
  } catch (error) {
    console.error("[whatsapp webhook]", error);
  }

  return Response.json({ ok: true });
}
