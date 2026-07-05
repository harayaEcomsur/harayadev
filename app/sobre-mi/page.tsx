import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(
  {
    title: "Sobre mí",
    description: `${site.personName}, fundador de ${site.name}. Stack, trayectoria y forma de trabajar.`,
  },
  "/sobre-mi"
);

const STACK = [
  "TypeScript",
  "React / Next.js",
  "Node.js",
  "Tailwind CSS",
  "VTEX IO",
  "Kotlin & Java",
  "AWS / Docker",
  "GraphQL",
  "Salesforce",
  "PostgreSQL / Neon",
  "Anthropic Claude & Google Gemini (integraciones IA)",
  "GTM / GA4",
  "Vercel",
];

const EXPERIENCE: { company: string; role: string; period: string; description: string }[] = [
  {
    company: "Wbuild",
    role: "Full Stack Developer",
    period: "Sep 2024 – Abr 2026",
    description: "Landing pages SEO-optimizadas con Next.js y microservicios en Kotlin dentro de un stack AWS/Docker/GraphQL.",
  },
  {
    company: "Nexitty",
    role: "VTEX Consultant",
    period: "Oct 2024 – Feb 2025",
    description: "Arquitecté e implementé un portal B2B en VTEX IO para Maxservice con GTM/GA4 integrado.",
  },
  {
    company: "Muruna",
    role: "Developer",
    period: "Sep 2024 – Dic 2024",
    description: "Soporte técnico en ecosistema Salesforce, desarrollo Java y análisis de rendimiento con Instana.",
  },
  {
    company: "Cencosud",
    role: "Software Engineer II",
    period: "Ene 2021 – Mar 2024",
    description: "Migración de EASY.cl a VTEX IO y desarrollo del micro-frontend \"Mi Cuenta\" en Next.js con SSR.",
  },
  {
    company: "Ecomsur",
    role: "Frontend Developer",
    period: "Mar 2018 – Ene 2021",
    description: "Migración de VTEX Legacy a VTEX IO y liderazgo de célula de optimización que aumentó conversión un 10%.",
  },
];

export default function SobreMiPage() {
  return (
    <main className="py-16 sm:py-24">
      <Container className="max-w-3xl">
        <h1 className="font-heading text-4xl font-bold text-foreground">Sobre mí</h1>
        <p className="mt-4 text-lg text-foreground/70">
          Soy {site.personName}, desarrollador full stack y fundador de{" "}
          <strong className="text-foreground">{site.name}</strong>. Más de 6 años
          construyendo desde e-commerce a gran escala (VTEX IO, Cencosud) hasta paneles de
          administración e integraciones con IA de punta a punta — desde la arquitectura hasta
          el deploy.
        </p>
        <p className="mt-4 text-foreground/70">
          Hoy el foco principal es un producto propio: un starter kit para lanzar sitios web con
          chat IA a pymes chilenas en horas, no semanas (ver{" "}
          <a href="/proyectos" className="text-primary hover:underline">
            proyectos
          </a>
          ).
        </p>
        <p className="mt-4 text-sm text-foreground/50">
          Razón social: {site.legalName}. {site.billingNote}
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
        <ul className="mt-4 space-y-4">
          {EXPERIENCE.map((item) => (
            <li key={item.company} className="rounded-xl border border-line bg-card p-4 shadow-sm">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <span className="font-heading font-semibold text-foreground">
                  {item.company} <span className="font-normal text-foreground/60">· {item.role}</span>
                </span>
                <span className="text-sm text-foreground/50">{item.period}</span>
              </div>
              <p className="mt-2 text-sm text-foreground/70">{item.description}</p>
            </li>
          ))}
        </ul>
      </Container>
    </main>
  );
}
