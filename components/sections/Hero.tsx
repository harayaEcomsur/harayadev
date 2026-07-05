import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <section className="bg-primary/5 py-20 sm:py-28">
      <Container className="text-center">
        <p className="font-medium text-primary">{site.personName} · {site.name}</p>
        <h1 className="mx-auto mt-3 max-w-3xl font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {site.tagline}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/70">
          Desde sitios y paneles administrativos a medida hasta un producto propio para
          lanzar sitios con chat IA a pymes chilenas en horas, no semanas.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/proyectos"
            className="rounded-full bg-primary px-6 py-3 font-medium text-white shadow-md transition-transform hover:scale-105"
          >
            Ver proyectos
          </Link>
          <Link
            href="/contacto"
            className="rounded-full border border-primary/30 px-6 py-3 font-medium text-primary transition-colors hover:bg-primary/5"
          >
            Conversemos
          </Link>
        </div>
      </Container>
    </section>
  );
}
