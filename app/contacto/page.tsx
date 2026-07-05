import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/sections/ContactForm";
import { site } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export const metadata: Metadata = buildMetadata(
  {
    title: "Contacto",
    description: `Escríbeme para conversar sobre tu proyecto — ${site.name}.`,
  },
  "/contacto"
);

export default function ContactoPage() {
  return (
    <main className="py-16 sm:py-24">
      <Container className="grid gap-10 lg:grid-cols-2">
        <div>
          <h1 className="font-heading text-4xl font-bold text-foreground">Conversemos</h1>
          <p className="mt-4 text-lg text-foreground/70">
            Cuéntame sobre tu negocio o proyecto y te respondo a la brevedad.
          </p>
          <div className="mt-6 space-y-2 text-foreground/70">
            <p>
              Email:{" "}
              <a href={`mailto:${site.email}`} className="text-primary hover:underline">
                {site.email}
              </a>
            </p>
            {site.whatsapp && (
              <p>
                WhatsApp:{" "}
                <a
                  href={buildWhatsAppLink(site.whatsapp, "Hola! Vi tu sitio y quiero conversar sobre un proyecto")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  +{site.whatsapp}
                </a>
              </p>
            )}
            <p>
              GitHub:{" "}
              <a href={site.github} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {site.github}
              </a>
            </p>
          </div>
          <p className="mt-6 text-sm text-foreground/50">{site.billingNote}</p>
        </div>
        <ContactForm />
      </Container>
    </main>
  );
}
