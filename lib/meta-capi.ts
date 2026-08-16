// Meta Conversions API — envía el evento "Purchase" del lado servidor cuando
// se confirma un pago (webhook de Mercado Pago), en vez de depender solo del
// Pixel del navegador: sobrevive a bloqueadores de ads y a que el cliente
// nunca haya vuelto a /contratar/pago/retorno. Requiere NEXT_PUBLIC_META_PIXEL_ID
// (el mismo del Pixel de cliente) + META_CAPI_ACCESS_TOKEN. Sin cualquiera de
// los dos, no hace nada — no es un requisito para que el pago funcione.
import { createHash } from "crypto";

function sha256(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

export async function sendMetaPurchaseEvent(params: {
  value: number;
  currency: string;
  email?: string;
  phone?: string;
  eventId: string;
}): Promise<void> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const token = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !token) return;

  const userData: Record<string, string[]> = {};
  if (params.email) userData.em = [sha256(params.email)];
  if (params.phone) userData.ph = [sha256(params.phone.replace(/[^\d]/g, ""))];

  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/${pixelId}/events`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        data: [
          {
            event_name: "Purchase",
            event_time: Math.floor(Date.now() / 1000),
            event_id: params.eventId,
            action_source: "website",
            user_data: userData,
            custom_data: { value: params.value, currency: params.currency },
          },
        ],
      }),
    });
    if (!res.ok) console.error("[meta-capi] Evento Purchase rechazado:", await res.text());
  } catch (e) {
    console.error("[meta-capi] Error enviando evento Purchase:", e);
  }
}
