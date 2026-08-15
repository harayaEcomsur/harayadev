// Mercado Pago Checkout Pro — preferencia de pago único con redirección, para
// que el cliente pague online el contrato generado en /contratar (alternativa
// a coordinar la transferencia bancaria). Requiere MP_ACCESS_TOKEN de la cuenta
// vendedora. Docs: https://www.mercadopago.cl/developers/es/docs/checkout-pro/landing
import { createHmac, timingSafeEqual } from "crypto";

const API = "https://api.mercadopago.com";

export function mpAccessToken(): string | null {
  return process.env.MP_ACCESS_TOKEN || null;
}

export interface CreatePreferenceInput {
  contractNumber: string;
  title: string;
  amount: number;
  payerEmail: string;
  payerName: string;
  origin: string;
  // Solo identificadores cortos (no el contrato completo): Mercado Pago tiene
  // límite de tamaño en metadata y además normaliza las keys a minúsculas, así
  // que se usan nombres ya en snake_case para no depender de esa conversión.
  metadata: Record<string, string>;
}

export interface Preference {
  id: string;
  init_point: string;
}

export async function createPreference(input: CreatePreferenceInput): Promise<Preference> {
  const token = mpAccessToken();
  if (!token) throw new Error("MP_ACCESS_TOKEN no configurado");

  // Mercado Pago rechaza la preferencia si auto_return va con un origin que no
  // controla (localhost/127.0.0.1) — solo lo manda cuando hay un dominio real,
  // así se puede seguir probando en local sin necesitar un túnel público.
  const isPublicOrigin = !/^https?:\/\/(localhost|127\.0\.0\.1)/i.test(input.origin);

  const res = await fetch(`${API}/checkout/preferences`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      items: [{ title: input.title, quantity: 1, unit_price: input.amount, currency_id: "CLP" }],
      payer: { email: input.payerEmail, name: input.payerName },
      external_reference: input.contractNumber,
      metadata: input.metadata,
      back_urls: {
        success: `${input.origin}/contratar/pago/retorno`,
        pending: `${input.origin}/contratar/pago/retorno`,
        failure: `${input.origin}/contratar/pago/retorno`,
      },
      ...(isPublicOrigin ? { auto_return: "approved" } : {}),
      notification_url: `${input.origin}/api/contract/pagar/webhook`,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Mercado Pago rechazó la preferencia (${res.status}): ${body}`);
  }
  const data = await res.json();
  return { id: data.id, init_point: data.init_point };
}

export interface MpPayment {
  id: number;
  status: string;
  transaction_amount: number;
  metadata: Record<string, string>;
}

export async function getPayment(paymentId: string): Promise<MpPayment> {
  const token = mpAccessToken();
  if (!token) throw new Error("MP_ACCESS_TOKEN no configurado");
  const res = await fetch(`${API}/v1/payments/${paymentId}`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`No se pudo obtener el pago ${paymentId} (${res.status})`);
  return res.json();
}

// Valida la cabecera x-signature de las notificaciones webhook (manifest
// HMAC-SHA256), según el esquema documentado por Mercado Pago. Verificar contra
// la doc vigente y probar con un webhook simulado antes de confiar en producción.
// Sin MP_WEBHOOK_SECRET configurado, no se valida (solo aceptable en desarrollo).
export function verifyWebhookSignature(params: { xSignature: string | null; xRequestId: string | null; dataId: string }): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) return true;
  if (!params.xSignature || !params.xRequestId) return false;

  const parts: Record<string, string> = {};
  for (const p of params.xSignature.split(",")) {
    const [k, v] = p.split("=");
    if (k && v) parts[k.trim()] = v.trim();
  }
  if (!parts.ts || !parts.v1) return false;

  const manifest = `id:${params.dataId};request-id:${params.xRequestId};ts:${parts.ts};`;
  const expected = createHmac("sha256", secret).update(manifest).digest("hex");
  const expectedBuf = Buffer.from(expected, "hex");
  const gotBuf = Buffer.from(parts.v1, "hex");
  return expectedBuf.length === gotBuf.length && timingSafeEqual(expectedBuf, gotBuf);
}
