import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(
  {
    title: "Sobre mí",
    description: `${site.personName}, fundador de ${site.legalName}. Stack, trayectoria y forma de trabajar.`,
  },
  "/sobre-mi"
);

const STACK = [
  "TypeScript",
  "React / Next.js",
  "Node.js",
  "Tailwind CSS",
  "PostgreSQL / Neon",
  "Anthropic Claude & Google Gemini (integraciones IA)",
  "Vercel",
];

// TODO: reemplazar por la experiencia profesional real (empresa, cargo, período).
// Se dejó como placeholder a propósito: no se debe publicar historial laboral sin confirmar
// con el usuario los datos exactos.
const EXPERIENCE: { company: string; role: string; period: string }[] = [
  { company: "TODO: nombre de la empresa", role: "TODO: cargo", period: "TODO: período" },
  { company: "TODO: nombre de la empresa", role: "TODO: cargo", period: "TODO: período" },
];

export default function SobreMiPage() {
  return (
    <main className="py-16 sm:py-24">
      <Container className="max-w-3xl">
        <h1 className="font-heading text-4xl font-bold text-foreground">Sobre mí</h1>
        <p className="mt-4 text-lg text-foreground/70">
          Soy {site.personName}, desarrollador full stack y fundador de{" "}
          <strong className="text-foreground">{site.legalName}</strong>. Diseño y construyo
          sitios, paneles de administración e integraciones con IA de punta a punta — desde la
          arquitectura hasta el deploy.
        </p>
        <p className="mt-4 text-foreground/70">
          Hoy el foco principal es un producto propio: un starter kit para lanzar sitios web con
          chat IA a pymes chilenas en horas, no semanas (ver{" "}
          <a href="/proyectos" className="text-primary hover:underline">
            proyectos
          </a>
          ).
        </p>

        <h2 className="mt-12 font-heading text-2xl font-semibold text-foreground">Stack</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {STACK.map((tech) => (
            <span key={tech} className="rounded-full bg-muted px-3 py-1 text-sm font-medium text-foreground/70">
              {tech}
            </span>
          ))}
        </div>

        <h2 className="mt-12 font-heading text-2xl font-semibold text-foreground">Experiencia</h2>
        <p className="mt-2 text-sm text-foreground/50">
          (Sección en construcción — pendiente completar con el detalle real de cada etapa.)
        </p>
        <ul className="mt-4 space-y-3">
          {EXPERIENCE.map((item, i) => (
            <li key={i} className="rounded-xl border border-dashed border-black/10 p-4 text-sm text-foreground/60">
              <span className="font-medium text-foreground/80">{item.company}</span> — {item.role} ·{" "}
              {item.period}
            </li>
          ))}
        </ul>
      </Container>
    </main>
  );
}
