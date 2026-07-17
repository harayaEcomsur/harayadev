import type { Metadata } from "next";
import Link from "next/link";
import { plans, recurringServices, verticalPlans, addons } from "@/content/plans";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { faqs } from "@/content/faq";
import { site } from "@/lib/site";
import { buildFaqJsonLd, buildMetadata, buildServicesJsonLd } from "@/lib/seo";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export const metadata: Metadata = buildMetadata(
  {
    title: "Página web con IA para tu pyme: planes y precios",
    description:
      "Tu web con IA en 72 horas: 4 planes con precio cerrado e IVA incluido, más desarrollo a medida, mantención y mejora de sitios existentes. Chile y Latinoamérica.",
  },
  "/servicios"
);

const CUSTOM_CARDS = [
  {
    title: "Desarrollo web full stack",
    description:
      "Sitios y sistemas construidos de punta a punta: diseño, desarrollo, base de datos y despliegue. Next.js, Node, PostgreSQL.",
  },
  {
    title: "Paneles administrativos",
    description:
      "Gestión de clientes, pedidos, inventario y reportes en un panel hecho para tu operación, con autenticación y permisos.",
  },
  {
    title: "Integraciones con IA",
    description:
      "Asistentes entrenados con tu negocio, integrados a tu web, WhatsApp o sistemas internos: responden, agendan y toman pedidos.",
  },
];

export default function ServiciosPage() {
  const waHref = site.whatsapp ? buildWhatsAppLink(site.whatsapp, "Hola! Quiero que me recomiendes un plan") : "/contacto";

  return (
    <main>
      {/* HEADER */}
      <header className="relative overflow-hidden px-4 pb-12 pt-14 sm:px-6 sm:pb-[70px] sm:pt-[90px] lg:px-8">
        <div
          className="pointer-events-none absolute -right-[200px] -top-[300px] h-[800px] w-[800px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(255,61,61,0.12), transparent 62%)" }}
        />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-[18px]">
          <span className="font-mono text-sm tracking-[0.14em] text-primary">SERVICIOS</span>
          <h1 className="m-0 text-4xl font-black leading-none tracking-tight sm:text-[62px]">
            Qué puedo hacer por tu negocio
          </h1>
          <p className="m-0 max-w-[640px] text-lg leading-[1.6] text-soft sm:text-[19px]">
            Desarrollo web a medida, integraciones con IA y un producto propio para pymes: tu web con
            IA en 72 horas, con precio cerrado y demo gratis antes de pagar.
          </p>
        </div>
      </header>

      {/* A MEDIDA */}
      <section className="px-4 pb-16 sm:px-6 sm:pb-[70px] lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-[18px] sm:grid-cols-3">
          {CUSTOM_CARDS.map((card) => (
            <div key={card.title} className="flex flex-col gap-3 rounded-[14px] border border-line bg-card p-7">
              <span className="font-mono text-[13px] tracking-[0.12em] text-primary">A MEDIDA</span>
              <span className="text-[22px] font-extrabold">{card.title}</span>
              <span className="flex-1 text-[15px] leading-[1.55] text-soft">{card.description}</span>
              <span className="font-mono text-xs tracking-[0.08em] text-soft/60">
                PRECIO SEGÚN PROYECTO · CONVERSEMOS
              </span>
            </div>
          ))}
          <div className="flex flex-wrap items-center justify-between gap-5 rounded-[14px] border border-dashed border-line bg-background px-7 py-[22px] sm:col-span-3">
            <span className="text-base text-soft">
              ¿Tu proyecto no calza con ningún plan? Lo cotizamos a la medida, con precio cerrado igual.
            </span>
            <Link
              href="/contacto"
              className="whitespace-nowrap rounded-[10px] border-[1.5px] border-primary px-6 py-3 text-[15px] font-bold text-primary transition-colors hover:bg-primary/10"
            >
              Pedir algo personalizado →
            </Link>
          </div>
        </div>
      </section>

      {/* PLANES */}
      <section id="planes" className="scroll-mt-20 border-t border-line px-4 py-16 sm:px-6 sm:pb-[90px] sm:pt-[60px] lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3.5 pb-8">
          <span className="font-mono text-sm tracking-[0.14em] text-primary">EL PRODUCTO PARA PYMES</span>
          <h2 className="m-0 text-3xl font-black tracking-tight sm:text-[44px]">Tu web con IA en 72 horas</h2>
          <p className="m-0 max-w-[640px] text-lg leading-[1.6] text-soft">
            Cuatro planes con precio cerrado e IVA incluido. Ves tu demo gratis en 24 horas y solo
            pagas si te convence.
          </p>
        </div>
        <div className="mx-auto flex max-w-6xl flex-col gap-[22px]">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`flex flex-col gap-8 rounded-2xl border bg-card p-7 sm:p-10 lg:flex-row lg:items-center lg:gap-12 ${
                plan.highlighted ? "border-primary" : "border-line"
              }`}
            >
              <div className="flex flex-1 flex-col gap-3.5">
                <span
                  className={`font-mono text-[13px] tracking-[0.12em] ${plan.highlighted ? "text-primary" : "text-soft"}`}
                >
                  {plan.tag}
                </span>
                <h3 className="m-0 text-2xl font-black tracking-tight sm:text-[34px]">{plan.name}</h3>
                <p className="m-0 max-w-[560px] text-base leading-[1.6] text-soft sm:text-[17px]">
                  {plan.longDescription}
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {plan.includes.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-line bg-background px-3.5 py-2 text-sm text-soft"
                    >
                      ✓ {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-start gap-2.5 lg:items-end lg:text-right">
                <span
                  className={`text-[44px] font-black tracking-tight sm:text-[52px] ${
                    plan.highlighted ? "text-primary" : "text-foreground"
                  }`}
                >
                  {plan.price}
                </span>
                <span className="font-mono text-xs tracking-[0.1em] text-soft/60">
                  IVA INCLUIDO · ENTREGA {plan.delivery}
                </span>
                <div className="mt-1 flex flex-wrap gap-2.5">
                  <Link
                    href={`/demo?plan=${plan.id}`}
                    className="whitespace-nowrap rounded-[10px] border-[1.5px] border-line px-5 py-3 text-[15px] font-bold text-foreground transition-colors hover:border-soft"
                  >
                    Pide tu demo gratis
                  </Link>
                  <Link
                    href={`/contratar?plan=${plan.id}`}
                    className="whitespace-nowrap rounded-[10px] bg-primary px-5 py-3 text-[15px] font-extrabold text-white transition-colors hover:bg-primary-hover"
                  >
                    Comprar ahora
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VERTICALES + MÓDULOS */}
      <section className="border-t border-line px-4 py-16 sm:px-6 sm:py-[70px] lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3.5 pb-8">
          <span className="font-mono text-sm tracking-[0.14em] text-primary">MÁS QUE UNA WEB INFORMATIVA</span>
          <h2 className="m-0 text-3xl font-black tracking-tight sm:text-[44px]">Verticales y módulos</h2>
          <p className="m-0 max-w-[640px] text-lg leading-[1.6] text-soft">
            Para negocios donde el contenido vive y cambia — propiedades, cartas, catálogos,
            vehículos — armamos tu web como un sistema: inventario dinámico, portales y redes
            sincronizados. Precios &quot;desde&quot;: el valor final se cierra en la cotización, antes de partir.
          </p>
        </div>

        {verticalPlans.map((plan) => (
          <div
            key={plan.id}
            className="mx-auto mb-[18px] flex max-w-6xl flex-col gap-8 rounded-2xl border border-primary bg-card p-7 sm:p-10 lg:flex-row lg:items-center lg:gap-12"
          >
            <div className="flex flex-1 flex-col gap-3.5">
              <span className="font-mono text-[13px] tracking-[0.12em] text-primary">{plan.tag}</span>
              <h3 className="m-0 text-2xl font-black tracking-tight sm:text-[34px]">{plan.name}</h3>
              <p className="m-0 max-w-[560px] text-base leading-[1.6] text-soft sm:text-[17px]">{plan.longDescription}</p>
              {plan.id === "inmobiliaria" && (
                <Link href="/pagina-web-para-inmobiliarias" className="text-[15px] font-bold text-primary hover:underline">
                  Todo sobre la página web para inmobiliarias →
                </Link>
              )}
              <div className="flex flex-wrap gap-2.5">
                {plan.includes.map((item) => (
                  <span key={item} className="rounded-full border border-line bg-background px-3.5 py-2 text-sm text-soft">
                    ✓ {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-start gap-2.5 lg:items-end lg:text-right">
              <span className="text-[38px] font-black tracking-tight text-primary sm:text-[44px]">{plan.price}</span>
              <span className="font-mono text-xs tracking-[0.1em] text-soft/60">IVA INCLUIDO · ENTREGA {plan.delivery}</span>
              <div className="mt-1 flex flex-wrap gap-2.5">
                <Link
                  href={`/demo?plan=${plan.id}`}
                  className="whitespace-nowrap rounded-[10px] border-[1.5px] border-line px-5 py-3 text-[15px] font-bold text-foreground transition-colors hover:border-soft"
                >
                  Pide tu demo gratis
                </Link>
                <Link
                  href={`/contratar?plan=${plan.id}`}
                  className="whitespace-nowrap rounded-[10px] bg-primary px-5 py-3 text-[15px] font-extrabold text-white transition-colors hover:bg-primary-hover"
                >
                  Cotizar y contratar
                </Link>
              </div>
            </div>
          </div>
        ))}

        <div className="mx-auto grid max-w-6xl gap-[18px] sm:grid-cols-2">
          {addons.map((addon) => (
            <div key={addon.name} className="flex flex-col gap-3 rounded-[14px] border border-line bg-card p-7">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[20px] font-extrabold">{addon.name}</span>
                <span className="shrink-0 font-mono text-sm font-bold tracking-[0.04em] text-primary">{addon.priceFrom}</span>
              </div>
              <span className="text-[15px] leading-[1.55] text-soft">{addon.description}</span>
            </div>
          ))}
          <div className="flex flex-wrap items-center justify-between gap-5 rounded-[14px] border border-dashed border-line bg-background px-7 py-[22px] sm:col-span-2">
            <span className="text-base text-soft">
              ¿Tu rubro necesita su propio vertical (gastronomía, automotora, clínica)? Lo armamos igual que el inmobiliario.
            </span>
            <Link
              href="/contacto"
              className="whitespace-nowrap rounded-[10px] border-[1.5px] border-primary px-6 py-3 text-[15px] font-bold text-primary transition-colors hover:bg-primary/10"
            >
              Conversemos tu vertical →
            </Link>
          </div>
        </div>
      </section>

      {/* MANTENCIÓN / MEJORA */}
      <section className="border-t border-line px-4 py-16 sm:px-6 sm:py-[70px] lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3.5 pb-8">
          <span className="font-mono text-sm tracking-[0.14em] text-primary">¿YA TIENES SITIO?</span>
          <h2 className="m-0 text-3xl font-black tracking-tight sm:text-[44px]">Mantención y mejoras</h2>
          <p className="m-0 max-w-[640px] text-lg leading-[1.6] text-soft">
            También trabajamos sobre sitios existentes: mantención mensual con precio fijo, o una
            mejora puntual con cotización previa y precio cerrado igual que los planes.
          </p>
        </div>
        <div className="mx-auto grid max-w-6xl gap-[18px] sm:grid-cols-2">
          {recurringServices.map((service) => (
            <div key={service.id} className="flex flex-col gap-3.5 rounded-2xl border border-line bg-card p-7 sm:p-8">
              <span className="font-mono text-[13px] tracking-[0.12em] text-primary">{service.tag}</span>
              <h3 className="m-0 text-2xl font-black tracking-tight">{service.name}</h3>
              <p className="m-0 flex-1 text-base leading-[1.6] text-soft">{service.longDescription}</p>
              <div className="flex flex-wrap gap-2.5">
                {service.includes.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-line bg-background px-3.5 py-2 text-sm text-soft"
                  >
                    ✓ {item}
                  </span>
                ))}
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                <span className="font-mono text-xs tracking-[0.1em] text-soft/60">
                  {service.price ? (
                    <>
                      <span className="text-lg font-black tracking-normal text-foreground">{service.price}</span>{" "}
                      IVA INCL. · {service.delivery}
                    </>
                  ) : (
                    <>PRECIO SEGÚN COTIZACIÓN · {service.delivery}</>
                  )}
                </span>
                <Link
                  href={`/contratar?plan=${service.id}`}
                  className="whitespace-nowrap rounded-[10px] bg-primary px-5 py-3 text-[15px] font-extrabold text-white transition-colors hover:bg-primary-hover"
                >
                  Contratar
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* COMPARATIVA */}
      <section className="border-t border-line bg-card px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto flex max-w-[900px] flex-col items-center gap-6 text-center">
          <h2 className="m-0 text-3xl font-black tracking-tight sm:text-[40px]">
            La misma tecnología, sin precio de agencia
          </h2>
          <div className="flex flex-wrap justify-center gap-6 font-mono text-lg sm:gap-12 sm:text-[22px]">
            <span className="text-soft/60 line-through">AGENCIAS: $650.000+</span>
            <span>
              NOSOTROS: <span className="font-bold text-primary">$449.990</span>
            </span>
          </div>
          <p className="m-0 max-w-[560px] text-base leading-[1.6] text-soft sm:text-[17px]">
            Trabajas directo con el desarrollador, sin intermediarios ni horas de reunión facturadas.
            Por eso el precio es la mitad.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-line px-4 py-16 sm:px-6 sm:py-[90px] lg:px-8">
        <div className="mx-auto flex max-w-[820px] flex-col gap-9">
          <h2 className="m-0 text-3xl font-black tracking-tight sm:text-[44px]">Preguntas frecuentes</h2>
          <FaqAccordion />
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqJsonLd(faqs)) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildServicesJsonLd(plans)) }}
        />
      </section>

      {/* CTA FINAL */}
      <section className="relative overflow-hidden border-t border-line px-4 py-16 sm:px-6 sm:py-[100px] lg:px-8">
        <div
          className="pointer-events-none absolute -top-[300px] left-1/2 h-[800px] w-[1000px] -translate-x-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(255,61,61,0.13), transparent 62%)" }}
        />
        <div className="relative mx-auto flex max-w-[760px] flex-col items-center gap-6 text-center">
          <h2 className="m-0 text-3xl font-black leading-[1.02] tracking-tight sm:text-[50px]">
            ¿No sabes qué plan te calza?
          </h2>
          <p className="m-0 text-lg leading-[1.6] text-soft">
            Cuéntame de tu negocio por WhatsApp y te recomiendo el plan justo — sin venderte de más.
          </p>
          <a
            href={waHref}
            {...(site.whatsapp ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="rounded-[10px] bg-primary px-[30px] py-4 text-[17px] font-extrabold text-white transition-colors hover:bg-primary-hover"
          >
            Escríbeme por WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}
