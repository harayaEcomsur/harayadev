import { site } from "@/lib/site";
import { contractRequestSchema, buildContract, type Contract } from "@/lib/contract";

export const runtime = "nodejs";

function contractToText(contract: Contract): string {
  return [
    `CONTRATO ${contract.number} — ${contract.date}`,
    ``,
    `PRESTADOR: ${contract.provider.legalName} (RUT ${contract.provider.rut}), representada por ${contract.provider.representative}.`,
    `CLIENTE: ${contract.client.company || contract.client.name} (RUT ${contract.client.rut}) — ${contract.client.name}, ${contract.client.email}, ${contract.client.phone}, ${contract.client.address}.`,
    `NEGOCIO: ${contract.client.businessName}`,
    `ENCARGO: ${contract.client.brief}`,
    ``,
    ...contract.clauses.map((c, i) => `${i + 1}. ${c.title.toUpperCase()}\n${c.body}`),
  ].join("\n\n");
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = contractRequestSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: "Datos inválidos", issues: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const contract = buildContract(parsed.data);

  // El contrato es el artefacto principal y se devuelve siempre; el envío por email es
  // secundario y se reporta honestamente en la respuesta si no se pudo hacer.
  let emailSent = false;
  let emailNote: string | undefined;
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    emailNote = "Aviso automático no configurado — envía el contrato por WhatsApp o email al confirmar.";
  } else {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "Sitio web <onboarding@resend.dev>",
          to: process.env.CONTACT_TO_EMAIL || site.email,
          reply_to: contract.client.email,
          subject: `Nueva solicitud de contrato ${contract.number} — ${contract.service.name} (${contract.client.businessName})`,
          text: contractToText(contract),
        }),
      });
      emailSent = res.ok;
      if (!res.ok) emailNote = "No se pudo enviar el aviso por email.";
    } catch {
      emailNote = "No se pudo enviar el aviso por email.";
    }
  }

  return Response.json({ ok: true, contract, emailSent, emailNote });
}
