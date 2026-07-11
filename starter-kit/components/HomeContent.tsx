import { clientConfig } from "@/config/client.config";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { About } from "@/components/sections/About";
import { Gallery } from "@/components/sections/Gallery";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { Pricing } from "@/components/sections/Pricing";
import { ContactForm } from "@/components/sections/ContactForm";
import { MapEmbed } from "@/components/sections/MapEmbed";
import { Container } from "@/components/ui/Container";

export function HomeContent() {
  const { modules, contact } = clientConfig;
  const hasWhatsapp = modules.whatsappButton && Boolean(contact.whatsapp);

  return (
    <>
      <Header config={clientConfig} />
      <main>
        <Hero hero={clientConfig.hero} />
        <Services services={clientConfig.services} />
        <About about={clientConfig.about} />
        {clientConfig.gallery?.length ? <Gallery images={clientConfig.gallery} /> : null}
        {modules.testimonials && clientConfig.testimonials?.length ? (
          <Testimonials testimonials={clientConfig.testimonials} />
        ) : null}
        {modules.pricing && clientConfig.pricing?.length ? <Pricing plans={clientConfig.pricing} /> : null}
        {modules.faq && clientConfig.faq?.length ? <FAQ items={clientConfig.faq} /> : null}
        <section id="contacto" className="py-16 sm:py-24">
          <Container className="grid gap-10 lg:grid-cols-2">
            <div className="space-y-6">
              <h2 className="font-heading text-3xl font-bold text-foreground">Contacto</h2>
              {contact.address && <MapEmbed query={contact.mapQuery ?? contact.address} />}
            </div>
            {modules.contactForm ? <ContactForm /> : null}
          </Container>
        </section>
      </main>
      <Footer config={clientConfig} />
      {hasWhatsapp && contact.whatsapp ? (
        <WhatsAppButton phone={contact.whatsapp} message={contact.whatsappPrefilledMessage} />
      ) : null}
      {modules.chat ? (
        <ChatWidget businessName={clientConfig.meta.businessName} stacked={hasWhatsapp} />
      ) : null}
    </>
  );
}
