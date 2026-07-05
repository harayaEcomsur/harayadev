import { streamText } from "ai";
import { anthropic } from "@/lib/anthropic";
import { checkRateLimit } from "@/lib/rate-limit";
import { buildSystemPrompt } from "@/lib/chat-prompt";

export const runtime = "edge";

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
      model: anthropic("claude-haiku-4-5-20251001"),
      system: buildSystemPrompt(),
      messages,
      maxTokens: 300,
    });

    return result.toDataStreamResponse();
  } catch (err) {
    console.error("Chat error:", err);
    return new Response(
      JSON.stringify({ error: "El chat no está disponible en este momento. Escríbeme por Contacto." }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
}
