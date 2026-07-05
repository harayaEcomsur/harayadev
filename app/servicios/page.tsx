import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ServiceCard } from "@/components/sections/ServiceCard";
import { services } from "@/content/services";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(
  {
    title: "Servicios",
    description: "Desarrollo web a medida, integraciones con IA, paneles de administración y sitios con IA para pymes.",
  },
  "/servicios"
);

export default function ServiciosPage() {
  return (
    <main className="py-16 sm:py-24">
      <Container>
        <h1 className="font-heading text-4xl font-bold text-foreground">Servicios</h1>
        <p className="mt-4 max-w-2xl text-lg text-foreground/70">
          Desde un sitio a medida hasta un producto propio para lanzar webs con IA a pymes en
          horas. Esto es lo que puedo construir para tu negocio.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {services.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-primary/5 p-8 text-center">
          <p className="text-lg text-foreground/80">
            ¿Quieres ver el trabajo terminado antes de conversar?
          </p>
          <Link
            href="/proyectos"
            className="mt-4 inline-flex rounded-full bg-primary px-6 py-3 font-medium text-white transition-transform hover:scale-105"
          >
            Ver proyectos
          </Link>
        </div>
      </Container>
    </main>
  );
}
