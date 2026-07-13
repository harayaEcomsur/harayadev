import { streamText } from "ai";
import { google } from "@/lib/gemini";
import { clientConfig } from "@/config/client.config";
import { buildSystemPrompt } from "@/lib/assistant-prompt";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "edge";

export async function POST(req: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return new Response(
      JSON.stringify({ error: "El chat no está configurado todavía (falta GEMINI_API_KEY)." }),
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
      model: google(clientConfig.chat.model),
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
