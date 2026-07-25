import { streamText } from "ai";
import { google } from "@/lib/gemini";
import { getEmbedTenant, buildEmbedSystemPrompt } from "@/config/embed-tenants";
import { buildEmbedTools } from "@/lib/embed-tools";
import { checkRateLimit } from "@/lib/rate-limit";

// Endpoint del ASISTENTE EMBEBIBLE (add-on IA en el sitio ajeno del cliente).
// Multi-tenant vía ?t=<tenantId>. Aislado de /api/chat (single-tenant) para no
// tocar las demos vivas. Devuelve un stream de texto plano simple, fácil de
// consumir desde el widget vanilla (public/widget.js) sin el protocolo del AI SDK.
export const runtime = "nodejs";

// CORS: el widget corre en el dominio del cliente y llama a nuestro dominio.
// Refleja el Origin (en producción se puede acotar por tenant.allowedOrigins).
function corsHeaders(origin: string | null, tenant?: { allowedOrigins?: string[] }): Record<string, string> {
  const allow =
    tenant?.allowedOrigins && origin && !tenant.allowedOrigins.includes(origin)
      ? tenant.allowedOrigins[0] ?? "*"
      : origin ?? "*";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

export async function OPTIONS(req: Request) {
  const origin = req.headers.get("origin");
  const tenant = getEmbedTenant(new URL(req.url).searchParams.get("t")) ?? undefined;
  return new Response(null, { status: 204, headers: corsHeaders(origin, tenant ?? undefined) });
}

export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  const url = new URL(req.url);
  const tenantId = url.searchParams.get("t");
  const tenant = getEmbedTenant(tenantId);

  const cors = corsHeaders(origin, tenant ?? undefined);
  const json = (status: number, body: unknown) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json", ...cors },
    });

  if (!tenant) return json(404, { error: "Asistente no encontrado para este sitio." });
  if (!process.env.GEMINI_API_KEY) return json(501, { error: "El asistente no está configurado todavía." });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
  const { allowed, retryAfterSeconds } = checkRateLimit(`embed:${tenant.id}:${ip}`);
  if (!allowed) {
    return new Response(JSON.stringify({ error: "Demasiadas solicitudes. Intenta en unos minutos." }), {
      status: 429,
      headers: { "Content-Type": "application/json", "Retry-After": String(retryAfterSeconds), ...cors },
    });
  }

  let messages: unknown;
  try {
    ({ messages } = await req.json());
  } catch {
    return json(400, { error: "Cuerpo inválido." });
  }
  if (!Array.isArray(messages)) return json(400, { error: "Faltan mensajes." });

  try {
    const result = await streamText({
      model: google(tenant.model ?? "gemini-2.5-flash-lite"),
      system: buildEmbedSystemPrompt(tenant),
      messages: messages as Parameters<typeof streamText>[0]["messages"],
      maxTokens: 500,
      // Primera tool transaccional del embed: captura de contacto/lead por tenant
      // (avisa al dueño por email/WhatsApp). Aditiva; agenda/tienda por tenant van
      // en el siguiente slice. El SDK ejecuta la tool server-side y streamea el
      // texto final, que el widget lee igual como texto plano.
      tools: buildEmbedTools(tenant),
      maxToolRoundtrips: 3,
    });
    return result.toTextStreamResponse({ headers: cors });
  } catch (err) {
    console.error("Embed chat error:", err);
    return json(500, { error: "No pudimos responder ahora. Intenta de nuevo." });
  }
}
