import { site } from "@/lib/site";
import { contractRequestSchema, buildContract, contractToText } from "@/lib/contract";

export const runtime = "nodejs";

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
