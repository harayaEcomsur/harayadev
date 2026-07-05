import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";

const NAV_LINKS = [
  { href: "/servicios", label: "Servicios" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/sobre-mi", label: "Sobre mí" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-background/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="font-heading text-lg font-semibold text-foreground">
          {site.name}
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-foreground/70 sm:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-primary">
              {link.label}
            </Link>
          ))}
          <Link
            href="/contacto"
            className="rounded-full bg-primary px-4 py-2 text-white transition-transform hover:scale-105"
          >
            Contacto
          </Link>
        </nav>
        <Link
          href="/contacto"
          className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white sm:hidden"
        >
          Contacto
        </Link>
      </Container>
    </header>
  );
}
