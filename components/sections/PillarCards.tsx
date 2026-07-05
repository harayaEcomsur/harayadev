import Link from "next/link";
import { Briefcase, FolderGit2, UserRound } from "lucide-react";
import { Container } from "@/components/ui/Container";

const PILLARS = [
  {
    href: "/servicios",
    icon: Briefcase,
    title: "Servicios",
    description: "Qué puedo hacer por tu negocio: desarrollo web, integraciones IA y el starter-kit para pymes.",
  },
  {
    href: "/proyectos",
    icon: FolderGit2,
    title: "Proyectos",
    description: "Casos reales: sitios, paneles de administración y demos con IA construidos de punta a punta.",
  },
  {
    href: "/sobre-mi",
    icon: UserRound,
    title: "Sobre mí",
    description: "Quién está detrás de Haraya Ecomsur y qué stack y experiencia respaldan el trabajo.",
  },
];

export function PillarCards() {
  return (
    <section className="py-16 sm:py-24">
      <Container className="grid gap-6 sm:grid-cols-3">
        {PILLARS.map((pillar) => (
          <Link
            key={pillar.href}
            href={pillar.href}
            className="rounded-2xl border border-black/5 p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <pillar.icon className="h-8 w-8 text-primary" />
            <h2 className="mt-4 font-heading text-lg font-semibold text-foreground">{pillar.title}</h2>
            <p className="mt-2 text-sm text-foreground/70">{pillar.description}</p>
          </Link>
        ))}
      </Container>
    </section>
  );
}
