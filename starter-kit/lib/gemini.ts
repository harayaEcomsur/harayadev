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

// Busca en los params del turno el último resultado de crear_reserva exitoso,
// para poder redactar la confirmación determinista si el modelo enmudece.
function lastBookingResult(params: { prompt?: unknown }): {
  id: string;
  dia?: string;
  hora?: string;
  abonoNota?: string;
} | null {
  const prompt = params.prompt;
  if (!Array.isArray(prompt)) return null;
  for (let i = prompt.length - 1; i >= 0; i--) {
    const msg = prompt[i] as { role?: string; content?: unknown };
    if (msg?.role !== "tool" || !Array.isArray(msg.content)) continue;
    for (const part of msg.content as ToolResultLike[]) {
      if (part?.toolName !== "crear_reserva") continue;
      const r = part.result as {
        ok?: boolean;
        reserva?: { id?: string; dia?: string; hora?: string };
        abono?: { nota?: string } | null;
      };
      if (r?.ok && r.reserva?.id) {
        return { id: r.reserva.id, dia: r.reserva.dia, hora: r.reserva.hora, abonoNota: r.abono?.nota };
      }
    }
  }
  return null;
}

function fallbackText(params: { prompt?: unknown }): string | null {
  const booking = lastBookingResult(params);
  if (!booking) return null;
  const cuando = booking.dia && booking.hora ? ` para el ${booking.dia} a las ${booking.hora}` : "";
  const abono = booking.abonoNota ? ` ${booking.abonoNota}` : "";
  return `¡Listo! Tu reserva${cuando} quedó tomada con el número ${booking.id}.${abono}`;
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
