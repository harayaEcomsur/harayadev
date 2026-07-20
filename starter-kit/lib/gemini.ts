import { createGoogleGenerativeAI } from "@ai-sdk/google";
import {
  experimental_wrapLanguageModel as wrapLanguageModel,
  type LanguageModelV1,
  type LanguageModelV1StreamPart,
} from "ai";

const provider = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Gemini a veces cierra el turno posterior a una tool call con content SIN
// "parts" (turno vacío legítimo: "ya terminé"), y el schema de @ai-sdk/google
// 0.0.x lo rechaza ("candidates.0.content.parts Required"), cortando el stream
// con error justo después de crear una reserva. Este middleware convierte ese
// error específico en un cierre limpio y, si el turno venía después de un
// crear_reserva exitoso, emite la confirmación construida desde el RESULTADO
// REAL de la tool (nunca texto inventado por el modelo).
const EMPTY_PARTS_ERROR = /candidates[\s\S]*content[\s\S]*parts|Type validation failed/;

type ToolResultLike = { toolName?: string; result?: unknown };

// Último resultado de tool del turno, para redactar una salida determinista si
// el modelo enmudece (turno vacío) después de ejecutarla.
function lastToolResult(params: { prompt?: unknown }): ToolResultLike | null {
  const prompt = params.prompt;
  if (!Array.isArray(prompt)) return null;
  for (let i = prompt.length - 1; i >= 0; i--) {
    const msg = prompt[i] as { role?: string; content?: unknown };
    if (msg?.role !== "tool" || !Array.isArray(msg.content)) continue;
    const parts = msg.content as ToolResultLike[];
    for (let j = parts.length - 1; j >= 0; j--) {
      if (parts[j]?.toolName) return parts[j];
    }
  }
  return null;
}

// Texto de respaldo construido SOLO desde el resultado real de la tool — nunca
// inventado. Los mensajes de error de nuestras tools ya están redactados para
// el cliente final, así que se entregan tal cual.
function fallbackText(params: { prompt?: unknown }): string | null {
  const part = lastToolResult(params);
  if (!part) return null;
  const r = part.result as Record<string, unknown> | undefined;
  if (!r) return null;

  if (typeof r.error === "string" && r.error) return r.error;

  if (part.toolName === "crear_reserva" && r.ok) {
    const reserva = r.reserva as { id?: string; dia?: string; hora?: string } | undefined;
    const abono = r.abono as { nota?: string } | null | undefined;
    if (!reserva?.id) return null;
    const cuando = reserva.dia && reserva.hora ? ` para el ${reserva.dia} a las ${reserva.hora}` : "";
    return `¡Listo! Tu reserva${cuando} quedó tomada con el número ${reserva.id}.${abono?.nota ? ` ${abono.nota}` : ""}`;
  }

  if (part.toolName === "crear_pedido" && r.ok) {
    const total = typeof r.totalFormateado === "string" ? r.totalFormateado : "";
    const link = typeof r.linkPago === "string" ? r.linkPago : "";
    if (!link) return null;
    return `¡Pedido ${r.pedidoId ?? ""} creado!${total ? ` Total: ${total}.` : ""} Paga con tarjeta aquí: ${link}`;
  }

  if (part.toolName === "registrar_lead" && r.ok) {
    return "¡Listo! Dejé tus datos registrados — del equipo te contactarán pronto con opciones a tu medida. ¿Te ayudo con algo más?";
  }

  return null;
}

function tolerantModel(model: LanguageModelV1): LanguageModelV1 {
  return wrapLanguageModel({
    model,
    middleware: {
      // Camino generateText (webhook WhatsApp): mismo error, misma salida limpia.
      wrapGenerate: async ({ doGenerate, params }) => {
        try {
          return await doGenerate();
        } catch (error) {
          if (!EMPTY_PARTS_ERROR.test(String(error))) throw error;
          return {
            text: fallbackText(params as { prompt?: unknown }) ?? "¡Listo! Quedó registrado 👍",
            finishReason: "stop" as const,
            usage: { promptTokens: 0, completionTokens: 0 },
            rawCall: { rawPrompt: null, rawSettings: {} },
            warnings: [],
          };
        }
      },
      wrapStream: async ({ doStream, params }) => {
        const { stream, ...rest } = await doStream();
        let finished = false;

        const transformed = stream.pipeThrough(
          new TransformStream<LanguageModelV1StreamPart, LanguageModelV1StreamPart>({
            transform(part, controller) {
              if (part.type === "finish") finished = true;
              if (part.type === "error" && !finished && EMPTY_PARTS_ERROR.test(String(part.error))) {
                const text = fallbackText(params as { prompt?: unknown });
                if (text) controller.enqueue({ type: "text-delta", textDelta: text });
                controller.enqueue({
                  type: "finish",
                  finishReason: "stop",
                  usage: { promptTokens: 0, completionTokens: 0 },
                });
                finished = true;
                return;
              }
              controller.enqueue(part);
            },
          })
        );

        return { stream: transformed, ...rest };
      },
    },
  });
}

export function google(modelId: string) {
  return tolerantModel(provider(modelId));
}
