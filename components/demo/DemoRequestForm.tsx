"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { allContractablePlans } from "@/content/plans";
import { site } from "@/lib/site";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";
import type { PreContract } from "@/lib/contract";

const inputClass =
  "w-full rounded-[10px] border border-line bg-background px-4 py-3.5 text-[15px] text-foreground outline-none focus:border-primary";
const labelClass = "font-mono text-xs tracking-[0.1em] text-soft";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

export function DemoRequestForm() {
  const searchParams = useSearchParams();
  const initialPlan = allContractablePlans.some((p) => p.id === searchParams.get("plan"))
    ? (searchParams.get("plan") as string)
    : "bot";

  const [planId, setPlanId] = useState(initialPlan);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [result, setResult] = useState<PreContract | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const data = new FormData(e.currentTarget);
    const payload = {
      planId,
      applicant: {
        name: String(data.get("name") ?? ""),
        businessName: String(data.get("businessName") ?? ""),
        rubro: String(data.get("rubro") ?? ""),
        phone: String(data.get("phone") ?? ""),
        email: String(data.get("email") ?? ""),
        brief: String(data.get("brief") ?? ""),
      },
      currentSiteUrl: String(data.get("currentSiteUrl") ?? "") || undefined,
    };

    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const responseData = await res.json();
      if (!res.ok) {
        setStatus("error");
        return;
      }
      trackEvent("demo_solicitada", { plan: planId });
      setResult(responseData.preContract);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  if (result) {
    const waHref = site.whatsapp
      ? buildWhatsAppLink(
          site.whatsapp,
          `Hola Hector! Acabo de pedir mi demo (solicitud ${result.number}) para ${result.applicant.businessName}`
        )
      : "/contacto";

    return (
      <div className="flex flex-col gap-6">
        <div className="anim-success-in flex flex-wrap items-center justify-between gap-4 rounded-xl border border-primary/40 bg-primary/5 px-5 py-4 print:hidden">
          <p className="m-0 text-sm text-foreground">
            ✅ Solicitud <strong>{result.number}</strong> recibida — tu demo estará lista en 24–48 horas hábiles.
          </p>
          <div className="flex gap-2.5">
            <button
              onClick={() => window.print()}
              className="rounded-[10px] border-[1.5px] border-line px-4 py-2.5 text-sm font-bold text-foreground hover:border-soft"
            >
              Imprimir / PDF
            </button>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[10px] bg-primary px-4 py-2.5 text-sm font-extrabold text-white hover:bg-primary-hover"
            >
              Acelerar por WhatsApp
            </a>
          </div>
        </div>

        <article className="rounded-2xl bg-white p-6 text-[#0C1626] shadow-xl sm:p-10 print:rounded-none print:p-0 print:shadow-none">
          <header className="border-b border-[#0C1626]/15 pb-5">
            <p className="m-0 font-mono text-xs tracking-[0.12em] text-[#0C1626]/60">
              SOLICITUD DE DEMO · {result.number} · {result.date}
            </p>
            <h2 className="m-0 mt-2 text-2xl font-black">Pre-contrato de demo gratuita</h2>
          </header>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="rounded-lg border border-[#0C1626]/15 p-4">
              <p className="m-0 font-mono text-[10px] tracking-[0.12em] text-[#0C1626]/50">PRESTADOR</p>
              <p className="m-0 mt-1 text-sm font-bold">{result.provider.legalName}</p>
              <p className="m-0 text-sm">RUT {result.provider.rut} · {result.provider.representative}</p>
              <p className="m-0 text-sm">{result.provider.email} · {result.provider.phone}</p>
            </div>
            <div className="rounded-lg border border-[#0C1626]/15 p-4">
              <p className="m-0 font-mono text-[10px] tracking-[0.12em] text-[#0C1626]/50">SOLICITANTE</p>
              <p className="m-0 mt-1 text-sm font-bold">{result.applicant.businessName} ({result.applicant.rubro})</p>
              <p className="m-0 text-sm">{result.applicant.name}</p>
              <p className="m-0 text-sm">{result.applicant.phone} · {result.applicant.email}</p>
            </div>
          </div>

          <p className="mt-5 text-sm">
            <strong>Plan de referencia:</strong> {result.plan.name} · {result.plan.priceLabel} · entrega {result.plan.delivery.toLowerCase()}
          </p>

          <ol className="mt-4 flex list-decimal flex-col gap-2.5 pl-5 text-sm leading-relaxed">
            {result.terms.map((t) => (
              <li key={t.slice(0, 40)}>{t}</li>
            ))}
          </ol>

          <p className="mt-6 border-t border-[#0C1626]/15 pt-4 text-xs text-[#0C1626]/60">
            Este pre-contrato no genera ninguna obligación de pago. El contrato final — con las
            modificaciones acordadas, sus valores y el valor total — se genera en {site.name} una
            vez que pruebes tu demo.
          </p>
        </article>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-7">
      <div className="flex flex-col gap-2">
        <span className={labelClass}>QUÉ PLAN TE INTERESA (REFERENCIAL — LA DEMO ES GRATIS IGUAL)</span>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {allContractablePlans
            .filter((p) => p.id !== "mantencion" && p.id !== "mejora")
            .map((p) => {
              const selected = p.id === planId;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlanId(p.id)}
                  className={`rounded-lg border px-3 py-3 text-[13px] font-bold transition-colors ${
                    selected
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-line bg-background text-soft hover:text-foreground"
                  }`}
                >
                  {p.name}
                  <span className="mt-0.5 block font-mono text-[10px] font-normal tracking-[0.06em]">
                    {p.price ? `${p.price.toUpperCase()} IVA INCL.` : "SEGÚN COTIZACIÓN"}
                  </span>
                </button>
              );
            })}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="TU NOMBRE">
          <input name="name" required minLength={2} maxLength={120} className={inputClass} placeholder="Nombre y apellido" />
        </Field>
        <Field label="NOMBRE DEL NEGOCIO">
          <input name="businessName" required minLength={2} maxLength={120} className={inputClass} placeholder="Como aparece en tu logo o letrero" />
        </Field>
        <Field label="RUBRO">
          <input name="rubro" required minLength={2} maxLength={120} className={inputClass} placeholder="Ej: corretaje, restaurante, contabilidad…" />
        </Field>
        <Field label="WHATSAPP">
          <input name="phone" required minLength={6} maxLength={20} className={inputClass} placeholder="+56 9 …" />
        </Field>
        <Field label="EMAIL">
          <input name="email" type="email" required className={inputClass} placeholder="tu@correo.cl" />
        </Field>
        <Field label="SITIO O INSTAGRAM ACTUAL (OPCIONAL)">
          <input name="currentSiteUrl" maxLength={300} className={inputClass} placeholder="www.minegocio.cl o @minegocio" />
        </Field>
      </div>

      <Field label="CUÉNTANOS DE TU NEGOCIO">
        <textarea
          name="brief"
          required
          minLength={10}
          maxLength={1500}
          rows={4}
          className={inputClass}
          placeholder="Qué vendes o qué servicio das, en qué zona, qué te gustaría que tu web hiciera por ti…"
        />
      </Field>

      {status === "error" && (
        <p className="m-0 rounded-lg border border-primary/40 bg-primary/5 px-4 py-3 text-sm text-foreground">
          No pudimos registrar la solicitud. Intenta de nuevo o escríbenos directo por WhatsApp.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-[10px] bg-primary px-7 py-4 text-[16px] font-extrabold text-white transition-colors hover:bg-primary-hover disabled:opacity-60"
      >
        {status === "sending" ? "Enviando…" : "Pedir mi demo gratis →"}
      </button>
      <p className="m-0 text-center font-mono text-[11px] tracking-[0.06em] text-soft/70">
        SIN COSTO · SIN COMPROMISO · TU DEMO EN 24–48 HORAS HÁBILES
      </p>
    </form>
  );
}
