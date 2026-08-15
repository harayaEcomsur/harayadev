import { site } from "@/lib/site";
import { getPayment, verifyWebhookSignature } from "@/lib/mercadopago";

export const runtime = "nodejs";

// El aviso de "contrato generado" con todos los datos ya se envía en
// /api/contract al crear el borrador — este email es solo la confirmación de
// que el pago se concretó, referenciando el mismo número de contrato.
async function sendPaymentConfirmedEmail(meta: Record<string, string>, amount: number, paymentId: number) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contract/pagar/webhook] RESEND_API_KEY no configurado — no se pudo avisar el pago", meta.contract_number);
    return;
  }
  const text = [
    `PAGO CONFIRMADO vía Mercado Pago — $${amount.toLocaleString("es-CL")} (payment_id ${paymentId})`,
    ``,
    `Contrato: ${meta.contract_number ?? "?"}`,
    `Plan: ${meta.plan_id ?? "?"}`,
    `Cliente: ${meta.client_name ?? "?"} (RUT ${meta.client_rut ?? "?"}) — ${meta.client_business ?? "?"}`,
    `Email: ${meta.client_email ?? "?"}`,
    ``,
    `El detalle completo del contrato se envió al generarlo, en el email "Nueva solicitud de contrato ${meta.contract_number ?? ""}".`,
  ].join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || "Sitio web <onboarding@resend.dev>",
      to: process.env.CONTACT_TO_EMAIL || site.email,
      reply_to: meta.client_email || undefined,
      subject: `Pago recibido — contrato ${meta.contract_number ?? ""} (${meta.client_business ?? ""})`,
      text,
    }),
  });
  if (!res.ok) console.error("[contract/pagar/webhook] No se pudo enviar el email de pago confirmado", meta.contract_number);
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  const body = await req.json().catch(() => null);

  const type = body?.type ?? url.searchParams.get("type") ?? url.searchParams.get("topic");
  const dataId = body?.data?.id ?? url.searchParams.get("data.id") ?? url.searchParams.get("id");

  // Mercado Pago reintenta agresivamente si no recibe 2xx — se responde 200
  // siempre, incluso cuando la notificación no nos interesa o falla el email,
  // para no generar una tormenta de reintentos por algo no crítico.
  if (type !== "payment" || !dataId) {
    return new Response(null, { status: 200 });
  }

  const valid = verifyWebhookSignature({
    xSignature: req.headers.get("x-signature"),
    xRequestId: req.headers.get("x-request-id"),
    dataId: String(dataId),
  });
  if (!valid) {
    console.error("[contract/pagar/webhook] Firma x-signature inválida, se ignora", dataId);
    return new Response(null, { status: 200 });
  }

  try {
    const payment = await getPayment(String(dataId));
    if (payment.status === "approved") {
      await sendPaymentConfirmedEmail(payment.metadata ?? {}, payment.transaction_amount, payment.id);
    }
  } catch (e) {
    console.error("[contract/pagar/webhook]", e);
  }

  return new Response(null, { status: 200 });
}
