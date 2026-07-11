import { clientConfig } from "@/config/client.config";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { About } from "@/components/sections/About";
import { Gallery } from "@/components/sections/Gallery";
import { HeroInmobiliaria } from "@/components/layouts/inmobiliaria/HeroInmobiliaria";
import { ServicesInmobiliaria } from "@/components/layouts/inmobiliaria/ServicesInmobiliaria";
import { GalleryInmobiliaria } from "@/components/layouts/inmobiliaria/GalleryInmobiliaria";
import { HeroCorporativo } from "@/components/layouts/corporativo/HeroCorporativo";
import { ServicesCorporativo } from "@/components/layouts/corporativo/ServicesCorporativo";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { Pricing } from "@/components/sections/Pricing";
import { ContactForm } from "@/components/sections/ContactForm";
import { MapEmbed } from "@/components/sections/MapEmbed";
import { Container } from "@/components/ui/Container";

export function HomeContent() {
  const { modules, contact, branding, meta } = clientConfig;
  const hasWhatsapp = modules.whatsappButton && Boolean(contact.whatsapp);
  const layout = branding.layout;
  const gallery = clientConfig.gallery ?? [];

  // Cada layout intercambia hero, servicios y galería para que dos clientes de
  // rubros distintos no se vean como el mismo sitio con otra paleta. El resto
  // de las secciones (nosotros, testimonios, precios, FAQ, contacto) es común.
  const hero =
    layout === "inmobiliaria" ? (
      <HeroInmobiliaria hero={clientConfig.hero} rubro={meta.rubro} hasGallery={gallery.length > 0} />
    ) : layout === "corporativo" ? (
      <HeroCorporativo hero={clientConfig.hero} rubro={meta.rubro} />
    ) : (
      <Hero hero={clientConfig.hero} />
    );

  const services =
    layout === "inmobiliaria" ? (
      <ServicesInmobiliaria services={clientConfig.services} />
    ) : layout === "corporativo" ? (
      <ServicesCorporativo services={clientConfig.services} />
    ) : (
      <Services services={clientConfig.services} />
    );

  const gallerySection = !gallery.length ? null : layout === "inmobiliaria" ? (
    <GalleryInmobiliaria images={gallery} />
  ) : (
    <Gallery images={gallery} />
  );

  return (
    <>
      <Header config={clientConfig} />
      <main>
        {hero}
        {services}
        <About about={clientConfig.about} />
        {gallerySection}
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
