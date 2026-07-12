import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { DemoRequestForm } from "@/components/demo/DemoRequestForm";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(
  {
    title: "Pide tu demo gratis",
    description:
      "Cuéntanos de tu negocio y en 24–48 horas ves tu web con IA funcionando, con tu marca. Gratis y sin compromiso: solo pagas si te convence.",
  },
  "/demo"
);

export default function DemoPage() {
  return (
    <main className="py-14 sm:py-20">
      <Container className="max-w-3xl">
        <span className="font-mono text-sm tracking-[0.14em] text-primary">DEMO GRATIS</span>
        <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-[52px]">
          Mira tu web funcionando antes de pagar un peso
        </h1>
        <p className="mt-4 max-w-[620px] text-lg leading-[1.6] text-soft">
          Completa el formulario y en 24–48 horas te enviamos por WhatsApp el link de tu demo:
          tu marca, tu rubro y un asistente IA respondiendo por ti. La pruebas, nos dices qué
          cambiarías, y recién ahí se genera el contrato con cada modificación y su valor.
        </p>
        <div className="mt-10">
          <Suspense>
            <DemoRequestForm />
          </Suspense>
        </div>
      </Container>
    </main>
  );
}
