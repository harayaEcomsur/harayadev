import { streamText } from "ai";
import { anthropic } from "@/lib/anthropic";
import { clientConfig } from "@/config/client.config";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "edge";

function buildSystemPrompt(): string {
  const { chat, meta, contact } = clientConfig;
  const qa = chat.qaPairs.map((p, i) => `${i + 1}. P: ${p.q}\n   R: ${p.a}`).join("\n");

  return [
    `Eres el asistente virtual de "${meta.businessName}" (${meta.rubro}).`,
    chat.businessDescription,
    qa ? `Preguntas frecuentes y sus respuestas oficiales:\n${qa}` : "",
    chat.fallbackToWhatsapp
      ? `Si no sabes la respuesta o el cliente pide hablar con una persona, indica amablemente que puede escribir por WhatsApp al ${contact.whatsapp ?? "el número de contacto"}.`
      : "",
    chat.systemPromptExtra ?? "",
    "Responde siempre en español, de forma breve, cálida y profesional. No inventes información que no esté aquí.",
  ]
    .filter(Boolean)
    .join("\n\n");
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: "El chat no está configurado todavía (falta ANTHROPIC_API_KEY)." }),
      { status: 501, headers: { "Content-Type": "application/json" } }
    );
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
  const { allowed, retryAfterSeconds } = checkRateLimit(ip);

  if (!allowed) {
    return new Response(
      JSON.stringify({ error: "Demasiadas solicitudes. Intenta de nuevo en unos minutos." }),
      {
        status: 429,
        headers: { "Content-Type": "application/json", "Retry-After": String(retryAfterSeconds) },
      }
    );
  }

  const { messages } = await req.json();

  try {
    const result = await streamText({
      model: anthropic(clientConfig.chat.model),
      system: buildSystemPrompt(),
      messages,
      maxTokens: clientConfig.chat.maxTokensPerReply,
    });

    return result.toDataStreamResponse();
  } catch (err) {
    console.error("Chat error:", err);
    return new Response(
      JSON.stringify({
        error: `El chat no está disponible en este momento. Escríbenos por WhatsApp${
          clientConfig.contact.whatsapp ? ` al ${clientConfig.contact.whatsapp}` : ""
        }.`,
      }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
}
