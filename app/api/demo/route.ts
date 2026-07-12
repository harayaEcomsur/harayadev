import { site } from "@/lib/site";
import { demoRequestSchema, buildPreContract, type PreContract } from "@/lib/contract";

export const runtime = "nodejs";

function preContractToText(pre: PreContract): string {
  return [
    `SOLICITUD DE DEMO ${pre.number} — ${pre.date}`,
    ``,
    `Negocio: ${pre.applicant.businessName} (${pre.applicant.rubro})`,
    `Solicitante: ${pre.applicant.name} · ${pre.applicant.phone} · ${pre.applicant.email}`,
    pre.applicant.currentSiteUrl ? `Sitio actual: ${pre.applicant.currentSiteUrl}` : `Sin sitio actual`,
    `Plan de referencia: ${pre.plan.name} (${pre.plan.priceLabel})`,
    ``,
    `Sobre el negocio:`,
    pre.applicant.brief,
    ``,
    `→ Construir la demo con el wizard y enviarla por WhatsApp (D0 inbound).`,
  ].join("\n");
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = demoRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Datos inválidos", fields: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const preContract = buildPreContract(parsed.data);

  // Aviso a Hector: cada solicitud de demo es un lead inbound. Best-effort —
  // el pre-contrato se muestra igual al solicitante aunque el email falle.
  let emailSent = false;
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "Sitio web <onboarding@resend.dev>",
          to: process.env.CONTACT_TO_EMAIL || site.email,
          reply_to: preContract.applicant.email,
          subject: `🔥 LEAD: solicitud de demo ${preContract.number} — ${preContract.applicant.businessName} (${preContract.applicant.rubro})`,
          text: preContractToText(preContract),
        }),
      });
      emailSent = res.ok;
    } catch {
      emailSent = false;
    }
  }

  return Response.json({ ok: true, preContract, emailSent });
}
