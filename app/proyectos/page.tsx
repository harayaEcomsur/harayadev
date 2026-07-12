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
          Una muestra de lo construido por {"HarayaDev"}: un cliente real ya en producción y una
          demo funcional con IA para reuniones comerciales.
        </p>

        <div className="mt-12 space-y-6">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>

        <aside className="mt-12 rounded-2xl border border-dashed border-line bg-card p-6 sm:p-8">
          <p className="font-mono text-xs tracking-[0.14em] text-primary">TECNOLOGÍA PROPIA</p>
          <h2 className="mt-2 font-heading text-xl font-semibold text-foreground">
            El motor detrás de los planes
          </h2>
          <p className="mt-3 max-w-2xl text-foreground/70">
            Los sitios web con IA que vendemos no parten de cero: los genera una plataforma propia
            config-driven (Next.js + Zod + chat IA con streaming) que permite mostrar una demo
            personalizada en menos de 30 minutos y entregar en horas — con layouts por rubro y
            paleta extraída del logo del cliente para que ningún sitio se vea genérico.{" "}
            <a href="/servicios" className="text-primary hover:underline">
              Ver planes y precios →
            </a>
          </p>
        </aside>
      </Container>
    </main>
  );
}
