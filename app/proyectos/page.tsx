import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { projects } from "@/content/projects";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(
  {
    title: "Proyectos",
    description: "Casos reales: sitios, paneles de administración y demos con IA construidos de punta a punta.",
  },
  "/proyectos"
);

export default function ProyectosPage() {
  return (
    <main className="py-16 sm:py-24">
      <Container>
        <h1 className="font-heading text-4xl font-bold text-foreground">Proyectos</h1>
        <p className="mt-4 max-w-2xl text-lg text-foreground/70">
          Una muestra de lo construido hasta ahora: un cliente real, una herramienta de venta
          propia y el producto en el que estoy trabajando ahora mismo.
        </p>

        <div className="mt-12 space-y-6">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </Container>
    </main>
  );
}
