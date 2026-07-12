"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { trackEvent } from "@/lib/analytics";
import { allContractablePlans } from "@/content/plans";
import type { Contract } from "@/lib/contract";
import { ContractView } from "./ContractView";

const inputClass =
  "w-full rounded-[10px] border border-line bg-background px-4 py-3.5 text-[15px] text-foreground outline-none focus:border-primary";
const labelClass = "font-mono text-xs tracking-[0.1em] text-soft";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

export function ContractForm() {
  const searchParams = useSearchParams();
  const initialPlan = allContractablePlans.some((p) => p.id === searchParams.get("plan"))
    ? (searchParams.get("plan") as string)
    : "landing";

  const [planId, setPlanId] = useState(initialPlan);
  const [paymentPlan, setPaymentPlan] = useState<"full" | "split" | "monthly">("full");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState<{ contract: Contract; emailSent: boolean; emailNote?: string } | null>(null);

  const plan = allContractablePlans.find((p) => p.id === planId)!;
  const paymentOptions =
    plan.id === "mantencion"
      ? ([{ value: "monthly", label: "Cargo mensual", detail: "Por transferencia, primeros 5 días de cada mes" }] as const)
      : ([
          {
            value: "full",
            label: "100% al aprobar la demo",
            detail: plan.quoted ? "Pago único al aceptar el contrato" : "Un solo pago, después de ver tu demo funcionando",
          },
          { value: "split", label: "50% inicio / 50% entrega", detail: "La mitad para partir, la mitad contra entrega" },
        ] as const);

  const effectivePayment = paymentOptions.some((o) => o.value === paymentPlan)
    ? paymentPlan
    : paymentOptions[0].value;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const data = new FormData(e.currentTarget);

    const payload = {
      planId,
      paymentPlan: effectivePayment,
      client: {
        name: String(data.get("name") ?? ""),
        rut: String(data.get("rut") ?? ""),
        company: String(data.get("company") ?? "") || undefined,
        email: String(data.get("email") ?? ""),
        phone: String(data.get("phone") ?? ""),
        address: String(data.get("address") ?? ""),
        businessName: String(data.get("businessName") ?? ""),
        brief: String(data.get("brief") ?? ""),
      },
      existingSiteUrl: String(data.get("existingSiteUrl") ?? "") || undefined,
      agreedAmount: String(data.get("agreedAmount") ?? "") || undefined,
    };

    try {
      const res = await fetch("/api/contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const responseData = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(responseData.error ?? "Ocurrió un error generando el contrato.");
        return;
      }
      trackEvent("contrato_generado", { plan: planId, pago: effectivePayment });
      setResult(responseData);
      window.scrollTo({ top: 0 });
    } catch {
      setStatus("error");
      setErrorMsg("No se pudo generar el contrato. Revisa tu conexión.");
    }
  }

  if (result) {
    return <ContractView contract={result.contract} emailSent={result.emailSent} emailNote={result.emailNote} />;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-7">
      {/* Plan */}
      <div className="flex flex-col gap-2">
        <span className={labelClass}>QUÉ QUIERES CONTRATAR</span>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {allContractablePlans.map((p) => {
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
                  {p.price ? `${p.price} IVA INCL.` : "SEGÚN COTIZACIÓN"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Forma de pago */}
      <div className="flex flex-col gap-2">
        <span className={labelClass}>FORMA DE PAGO · TRANSFERENCIA BANCARIA</span>
        <div className="grid gap-2 sm:grid-cols-2">
          {paymentOptions.map((option) => {
            const selected = option.value === effectivePayment;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setPaymentPlan(option.value)}
                className={`rounded-lg border px-4 py-3.5 text-left transition-colors ${
                  selected ? "border-primary bg-primary/10" : "border-line bg-background hover:border-soft"
                }`}
              >
                <span className={`block text-sm font-bold ${selected ? "text-primary" : "text-foreground"}`}>
                  {option.label}
                </span>
                <span className="mt-0.5 block text-[13px] text-soft">{option.detail}</span>
              </button>
            );
          })}
        </div>
        <p className="m-0 mt-1 font-mono text-[11px] leading-relaxed tracking-[0.04em] text-soft/60">
          ¿NECESITAS OTRA ALTERNATIVA? EL CONTRATO ES UN BORRADOR: GENÉRALO Y LO AJUSTAMOS ANTES DE FIRMAR.
        </p>
      </div>

      {/* Datos del cliente */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="TU NOMBRE">
          <input name="name" required maxLength={120} placeholder="Ej: Carolina Rojas" className={inputClass} />
        </Field>
        <Field label="RUT (PERSONA O EMPRESA)">
          <input name="rut" required maxLength={15} placeholder="Ej: 12.345.678-9" className={inputClass} />
        </Field>
        <Field label="RAZÓN SOCIAL (OPCIONAL)">
          <input name="company" maxLength={160} placeholder="Si contratas como empresa" className={inputClass} />
        </Field>
        <Field label="EMAIL">
          <input name="email" type="email" required placeholder="tu@correo.cl" className={inputClass} />
        </Field>
        <Field label="TELÉFONO">
          <input name="phone" required maxLength={20} placeholder="+56 9 1234 5678" className={inputClass} />
        </Field>
        <Field label="DIRECCIÓN">
          <input name="address" required maxLength={200} placeholder="Calle, comuna, ciudad" className={inputClass} />
        </Field>
        <Field label="NOMBRE DE TU NEGOCIO">
          <input name="businessName" required maxLength={120} placeholder="Ej: Pastelería Rosita" className={inputClass} />
        </Field>
        {plan.quoted && (
          <Field label="URL DE TU SITIO ACTUAL">
            <input name="existingSiteUrl" required maxLength={300} placeholder="https://…" className={inputClass} />
          </Field>
        )}
        {plan.quoted && (
          <Field label="MONTO YA ACORDADO (OPCIONAL, CLP)">
            <input name="agreedAmount" maxLength={20} placeholder="Déjalo vacío si aún no cotizamos" className={inputClass} />
          </Field>
        )}
      </div>

      <Field label="CUÉNTAME QUÉ NECESITAS">
        <textarea
          name="brief"
          required
          rows={4}
          maxLength={1500}
          placeholder={
            plan.quoted
              ? "Ej: Mi web está lenta y quiero agregarle un asistente que responda pedidos"
              : "Ej: Quiero que mi WhatsApp responda solo los pedidos de la pastelería"
          }
          className={`${inputClass} resize-y`}
        />
      </Field>

      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-[10px] bg-primary px-8 py-4 text-base font-extrabold text-white transition-colors hover:bg-primary-hover disabled:opacity-60"
      >
        {status === "sending" ? "Generando contrato…" : "Generar contrato para revisar"}
      </button>
      {status === "error" && <p className="m-0 text-sm text-primary">{errorMsg}</p>}
      <p className="m-0 text-center font-mono text-[11px] tracking-[0.06em] text-soft/60">
        NO PAGAS NADA EN ESTE PASO · EL CONTRATO ES UN BORRADOR PARA REVISAR
      </p>
    </form>
  );
}
