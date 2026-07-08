"use client";

import { Printer } from "lucide-react";
import type { Contract } from "@/lib/contract";
import { site } from "@/lib/site";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function ContractView({
  contract,
  emailSent,
  emailNote,
}: {
  contract: Contract;
  emailSent: boolean;
  emailNote?: string;
}) {
  const waHref = site.whatsapp
    ? buildWhatsAppLink(
        site.whatsapp,
        `Hola! Generé el contrato ${contract.number} (${contract.service.name}) y quiero coordinar el pago`
      )
    : null;

  return (
    <div className="flex flex-col gap-6">
      {/* Barra de estado y acciones — no se imprime */}
      <div className="flex flex-col gap-4 print:hidden">
        <div className="rounded-xl border border-line bg-card p-5">
          <p className="m-0 text-base font-bold text-foreground">Contrato {contract.number} generado ✓</p>
          <p className="m-0 mt-1 text-sm leading-[1.6] text-soft">
            {emailSent
              ? "Le envié una copia a Hector — te contactará para confirmar. "
              : `${emailNote ?? ""} `}
            Revísalo con calma: es un borrador y no te obliga a nada. Si necesitas otra alternativa de
            pago u otro ajuste, se conversa y se corrige antes de firmar.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => window.print()}
            className="inline-flex cursor-pointer items-center gap-2 rounded-[10px] bg-primary px-6 py-3.5 text-[15px] font-extrabold text-white transition-colors hover:bg-primary-hover"
          >
            <Printer size={18} /> Imprimir / guardar PDF
          </button>
          {waHref && (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[10px] border-[1.5px] border-line px-6 py-3.5 text-[15px] font-bold text-foreground transition-colors hover:border-soft"
            >
              Coordinar pago por WhatsApp
            </a>
          )}
        </div>
      </div>

      {/* Documento */}
      <article className="rounded-2xl bg-white p-6 text-[#0C1626] shadow-[0_40px_90px_rgba(0,0,0,0.5)] sm:p-10 print:rounded-none print:p-0 print:shadow-none">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-[#E4E8EE] pb-6">
          <div>
            <p className="m-0 text-2xl font-black">
              Haraya<span className="text-primary">Dev</span>
            </p>
            <p className="m-0 mt-1 text-sm text-[#5A6675]">{contract.provider.legalName}</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="m-0 font-mono text-sm font-bold">CONTRATO {contract.number}</p>
            <p className="m-0 mt-1 text-sm text-[#5A6675]">Santiago de Chile, {contract.date}</p>
          </div>
        </header>

        <section className="mt-6">
          <h2 className="m-0 text-lg font-black">Contrato de prestación de servicios — {contract.service.name}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[#E4E8EE] p-4">
              <p className="m-0 font-mono text-[11px] tracking-[0.1em] text-[#5A6675]">EL PRESTADOR</p>
              <p className="m-0 mt-2 text-sm font-bold">{contract.provider.legalName}</p>
              <p className="m-0 text-sm text-[#5A6675]">RUT {contract.provider.rut}</p>
              <p className="m-0 text-sm text-[#5A6675]">Representada por {contract.provider.representative}</p>
              <p className="m-0 text-sm text-[#5A6675]">
                {contract.provider.email} · {contract.provider.phone}
              </p>
            </div>
            <div className="rounded-xl border border-[#E4E8EE] p-4">
              <p className="m-0 font-mono text-[11px] tracking-[0.1em] text-[#5A6675]">EL CLIENTE</p>
              <p className="m-0 mt-2 text-sm font-bold">{contract.client.company || contract.client.name}</p>
              <p className="m-0 text-sm text-[#5A6675]">RUT {contract.client.rut}</p>
              {contract.client.company && <p className="m-0 text-sm text-[#5A6675]">Contacto: {contract.client.name}</p>}
              <p className="m-0 text-sm text-[#5A6675]">
                {contract.client.email} · {contract.client.phone}
              </p>
              <p className="m-0 text-sm text-[#5A6675]">{contract.client.address}</p>
              <p className="m-0 text-sm text-[#5A6675]">Negocio: {contract.client.businessName}</p>
            </div>
          </div>
        </section>

        <section className="mt-6">
          <p className="m-0 font-mono text-[11px] tracking-[0.1em] text-[#5A6675]">DESCRIPCIÓN DEL ENCARGO</p>
          <p className="m-0 mt-2 text-sm leading-[1.65]">{contract.client.brief}</p>
        </section>

        <section className="mt-6 flex flex-col gap-5">
          {contract.clauses.map((clause, i) => (
            <div key={clause.title}>
              <h3 className="m-0 text-sm font-black">
                {i + 1}. {clause.title}
              </h3>
              <p className="m-0 mt-1.5 text-sm leading-[1.65]">{clause.body}</p>
            </div>
          ))}
        </section>

        {contract.bank ? (
          <section className="mt-6 rounded-xl border border-[#E4E8EE] bg-[#F5F6F8] p-4">
            <p className="m-0 font-mono text-[11px] tracking-[0.1em] text-[#5A6675]">DATOS PARA TRANSFERENCIA</p>
            <div className="mt-2 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
              <p className="m-0">Banco: {contract.bank.bankName}</p>
              <p className="m-0">Tipo de cuenta: {contract.bank.accountType}</p>
              <p className="m-0">N° de cuenta: {contract.bank.accountNumber}</p>
              <p className="m-0">Titular: {contract.bank.holder}</p>
              <p className="m-0">RUT: {contract.bank.rut}</p>
              <p className="m-0">Aviso a: {contract.bank.email}</p>
            </div>
          </section>
        ) : (
          <section className="mt-6 rounded-xl border border-[#E4E8EE] bg-[#F5F6F8] p-4">
            <p className="m-0 text-sm text-[#5A6675]">
              Los datos para la transferencia se envían por WhatsApp o email al confirmar el contrato —
              nunca transfieras sin haber conversado antes con {contract.provider.representative}.
            </p>
          </section>
        )}

        <footer className="mt-10 grid gap-10 sm:grid-cols-2">
          <div className="border-t border-[#0C1626] pt-2 text-center text-sm">
            <p className="m-0 font-bold">{contract.provider.representative}</p>
            <p className="m-0 text-[#5A6675]">p.p. {contract.provider.legalName}</p>
          </div>
          <div className="border-t border-[#0C1626] pt-2 text-center text-sm">
            <p className="m-0 font-bold">{contract.client.name}</p>
            <p className="m-0 text-[#5A6675]">{contract.client.company || "El Cliente"}</p>
          </div>
        </footer>
      </article>
    </div>
  );
}
