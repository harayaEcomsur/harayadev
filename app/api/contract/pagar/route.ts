import { site } from "@/lib/site";
import { contractRequestSchema, buildContract, amountDueNow } from "@/lib/contract";
import { createPreference, mpAccessToken } from "@/lib/mercadopago";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!mpAccessToken()) {
    return Response.json(
      { error: "El pago online todavía no está configurado — coordina el pago por transferencia o WhatsApp." },
      { status: 501 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = contractRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Datos inválidos" }, { status: 400 });
  }
  const request = parsed.data;

  const amount = amountDueNow(request);
  if (amount == null) {
    return Response.json(
      {
        error:
          request.paymentPlan !== "full"
            ? "El pago online por ahora solo está disponible para pago único (100%). Usa transferencia para 50/50 o mensual."
            : "Falta el monto acordado para poder cobrar online.",
      },
      { status: 400 }
    );
  }

  const contract = buildContract(request);
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin;

  try {
    const preference = await createPreference({
      contractNumber: contract.number,
      title: `${contract.service.name} — ${site.name}`,
      amount,
      payerEmail: request.client.email,
      payerName: request.client.name,
      origin,
      metadata: {
        contract_number: contract.number,
        plan_id: request.planId,
        client_name: request.client.name,
        client_rut: request.client.rut,
        client_business: request.client.businessName,
        client_email: request.client.email,
      },
    });
    return Response.json({ url: preference.init_point });
  } catch (e) {
    console.error("[contract/pagar] MP create preference:", e);
    return Response.json({ error: "No pudimos conectar con Mercado Pago. Intenta de nuevo en unos minutos." }, { status: 502 });
  }
}
