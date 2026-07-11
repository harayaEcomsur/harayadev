import { Container } from "@/components/ui/Container";
import type { ClientConfig } from "@/config/schema";

export function Header({ config }: { config: ClientConfig }) {
  const { branding, meta, modules } = config;

  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-background/90 backdrop-blur">
      <Container className="flex h-20 items-center justify-between sm:h-24">
        {/* El logo es la marca del cliente: va grande (2-3x el título), y el
            nombre en texto pasa a acompañarlo en chico. */}
        <a href="#" className="flex min-w-0 items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- logo is a local SVG; next/image requires dangerouslyAllowSVG for those */}
          <img
            src={branding.logoUrl}
            alt={meta.businessName}
            className="h-12 w-auto max-w-[170px] rounded-md object-contain sm:h-[4.5rem] sm:max-w-[280px]"
          />
          {/* En móvil el nombre siempre acompaña al logo (el logo se achica y
              puede no leerse); en desktop se omite solo si el logo ya lo trae. */}
          <span
            className={`truncate font-heading text-sm font-medium text-foreground/80 ${
              branding.logoIncludesName ? "md:hidden" : ""
            }`}
          >
            {meta.businessName}
          </span>
        </a>
        <nav className="hidden gap-6 text-sm font-medium text-foreground/70 sm:flex">
          <a href="#servicios" className="hover:text-primary">
            Servicios
          </a>
          <a href="#nosotros" className="hover:text-primary">
            Nosotros
          </a>
          {modules.pricing && (
            <a href="#precios" className="hover:text-primary">
              Precios
            </a>
          )}
          <a href="#contacto" className="hover:text-primary">
            Contacto
          </a>
        </nav>
      </Container>
    </header>
  );
}
