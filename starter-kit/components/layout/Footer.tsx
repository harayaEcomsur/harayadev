import { Container } from "@/components/ui/Container";
import type { ClientConfig } from "@/config/schema";

export function Footer({ config }: { config: ClientConfig }) {
  const { meta, contact } = config;

  return (
    <footer className="border-t border-black/5 py-10 text-sm text-foreground/60">
      <Container className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {meta.businessName}. Todos los derechos reservados.
        </p>
        <div className="flex flex-wrap gap-4">
          {contact.address && <span>{contact.address}</span>}
          {contact.phone && (
            <a href={`tel:${contact.phone}`} className="hover:text-primary">
              {contact.phone}
            </a>
          )}
        </div>
      </Container>
    </footer>
  );
}
