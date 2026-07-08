import type { Metadata } from "next";
import { Suspense } from "react";
import { ContractForm } from "@/components/contract/ContractForm";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildMetadata(
    {
      title: "Contratar",
      description: "Elige tu plan, la forma de pago por transferencia y genera tu contrato para revisar.",
    },
    "/contratar"
  ),
  // Página transaccional — sin valor para búsqueda.
  robots: { index: false, follow: true },
};

export default function ContratarPage() {
  return (
    <main className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <header className="flex flex-col gap-3 print:hidden">
          <span className="font-mono text-sm tracking-[0.14em] text-primary">CONTRATAR</span>
          <h1 className="m-0 text-3xl font-black tracking-tight sm:text-[44px]">
            Genera tu contrato para revisar
          </h1>
          <p className="m-0 text-base leading-[1.6] text-soft sm:text-lg">
            Elige el plan y la forma de pago por transferencia. Se genera un contrato simple con todo
            por escrito — precio, plazo e hitos de pago — para que lo revises antes de transferir un
            peso. Si necesitas otra alternativa (por ejemplo otro reparto de pagos), se ajusta antes
            de firmar.
          </p>
        </header>
        <Suspense fallback={null}>
          <ContractForm />
        </Suspense>
      </div>
    </main>
  );
}
