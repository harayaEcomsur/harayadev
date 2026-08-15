import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildMetadata({ title: "Pago", description: "Resultado de tu pago con Mercado Pago." }, "/contratar/pago/retorno"),
  robots: { index: false, follow: false },
};

const COPY: Record<string, { title: string; body: string }> = {
  approved: {
    title: "¡Pago recibido!",
    body: "Gracias — Mercado Pago confirmó tu pago. Te enviamos la confirmación por email y te contactamos para coordinar los próximos pasos.",
  },
  pending: {
    title: "Pago en revisión",
    body: "Tu pago quedó pendiente de confirmación (algunos medios de pago demoran unos días en acreditarse). Te avisamos por email en cuanto se confirme.",
  },
  in_process: {
    title: "Pago en revisión",
    body: "Tu pago quedó pendiente de confirmación. Te avisamos por email en cuanto se confirme.",
  },
  failure: {
    title: "El pago no se pudo completar",
    body: "Mercado Pago no pudo procesar el pago — no se realizó ningún cobro. Puedes intentarlo de nuevo o coordinar el pago por transferencia.",
  },
  rejected: {
    title: "El pago no se pudo completar",
    body: "Mercado Pago no pudo procesar el pago — no se realizó ningún cobro. Puedes intentarlo de nuevo o coordinar el pago por transferencia.",
  },
};

export default function PagoRetornoPage({
  searchParams,
}: {
  searchParams: { status?: string; external_reference?: string };
}) {
  const copy = COPY[searchParams.status ?? ""] ?? COPY.pending;

  return (
    <main className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 text-center">
        <h1 className="m-0 text-3xl font-black tracking-tight">{copy.title}</h1>
        <p className="m-0 text-base leading-[1.6] text-soft">{copy.body}</p>
        {searchParams.external_reference && (
          <p className="m-0 font-mono text-xs text-soft/60">Contrato {searchParams.external_reference}</p>
        )}
        <Link
          href="/contratar"
          className="mt-4 rounded-[10px] bg-primary px-6 py-3.5 text-[15px] font-extrabold text-white transition-colors hover:bg-primary-hover"
        >
          Volver
        </Link>
      </div>
    </main>
  );
}
