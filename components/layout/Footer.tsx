import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer className="border-t border-black/5 py-10 text-sm text-foreground/60">
      <Container className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {site.legalName}.
        </p>
        <div className="flex flex-wrap gap-4">
          <a href={site.github} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
            GitHub
          </a>
          <a href={`mailto:${site.email}`} className="hover:text-primary">
            {site.email}
          </a>
          <a
            href={buildWhatsAppLink(site.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary"
          >
            WhatsApp
          </a>
          <Link href="/contacto" className="hover:text-primary">
            Contacto
          </Link>
        </div>
      </Container>
    </footer>
  );
}
