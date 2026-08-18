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
  payerRut?: string;
  origin: string;
  // Solo identificadores cortos (no el contrato completo): Mercado Pago tiene
  // límite de tamaño en metadata y además normaliza las keys a minúsculas, así
  // que se usan nombres ya en snake_case para no depender de esa conversión.
  metadata: Record<string, string>;
}

// Chile: Mercado Pago espera RUT con guión y sin puntos (12345678-9).
function normalizeRut(rut: string): string | null {
  const cleaned = rut.replace(/[^0-9kK]/g, "").toUpperCase();
  if (cleaned.length < 8 || cleaned.length > 9) return null;
  return `${cleaned.slice(0, -1)}-${cleaned.slice(-1)}`;
}

function splitName(fullName: string): { name: string; surname: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { name: parts[0], surname: parts[0] };
  return { name: parts[0], surname: parts.slice(1).join(" ") };
}

export interface Preference {
  id: string;
  init_point: string;
}

export async function createPreference(input: CreatePreferenceInput): Promise<Preference> {
  const token = mpAccessToken();
  if (!token) throw new Error("MP_ACCESS_TOKEN no configurado");

  // Mercado Pago rechaza la preferencia si back_urls / auto_return / notification_url
  // van con localhost — solo se mandan con un dominio público.
  const isPublicOrigin = !/^https?:\/\/(localhost|127\.0\.0\.1)/i.test(input.origin);
  const { name, surname } = splitName(input.payerName);
  const rut = input.payerRut ? normalizeRut(input.payerRut) : null;

  const res = await fetch(`${API}/checkout/preferences`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      items: [
        {
          id: input.contractNumber,
          title: input.title,
          description: input.title,
          category_id: "services",
          quantity: 1,
          unit_price: input.amount,
          currency_id: "CLP",
        },
      ],
      payer: {
        email: input.payerEmail,
        name,
        surname,
        ...(rut ? { identification: { type: "RUT", number: rut } } : {}),
      },
      // Un solo pago, sin cuotas: si el checkout pide elegir cuotas y no hay
      // valor por defecto, el botón "Pagar" se queda deshabilitado.
      payment_methods: { installments: 1, default_installments: 1 },
      binary_mode: true,
      external_reference: input.contractNumber,
      metadata: input.metadata,
      ...(isPublicOrigin
        ? {
            back_urls: {
              success: `${input.origin}/contratar/pago/retorno`,
              pending: `${input.origin}/contratar/pago/retorno`,
              failure: `${input.origin}/contratar/pago/retorno`,
            },
            auto_return: "approved",
            notification_url: `${input.origin}/api/contract/pagar/webhook`,
          }
        : {}),
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Mercado Pago rechazó la preferencia (${res.status}): ${body}`);
  }
  const data = await res.json();
  // En credenciales de prueba Mercado Pago a veces omite init_point y solo
  // entrega sandbox_init_point; en producción es al revés. Usar el que exista.
  const checkoutUrl: string | undefined = data.init_point || data.sandbox_init_point;
  if (!data.id || !checkoutUrl) {
    throw new Error("Mercado Pago creó la preferencia pero no devolvió URL de checkout");
  }
  return { id: data.id, init_point: checkoutUrl };
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
