import { Container } from "@/components/ui/Container";
import type { ClientConfig } from "@/config/schema";

export function Header({ config }: { config: ClientConfig }) {
  const { branding, meta, modules } = config;

  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-background/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element -- logo is a local SVG; next/image requires dangerouslyAllowSVG for those */}
          <img
            src={branding.logoUrl}
            alt={meta.businessName}
            width={36}
            height={36}
            className="rounded-md object-contain"
          />
          <span className="font-heading text-lg font-semibold text-foreground">{meta.businessName}</span>
        </div>
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
