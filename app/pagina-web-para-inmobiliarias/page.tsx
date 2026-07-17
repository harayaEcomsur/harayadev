import type { Metadata } from "next";
import Link from "next/link";
import { verticalPlans } from "@/content/plans";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { site } from "@/lib/site";
import { buildFaqJsonLd, buildMetadata, buildServicesJsonLd } from "@/lib/seo";
import { buildWhatsAppLink } from "@/lib/whatsapp";

// Primera página de captura por rubro (SEO): "página web para inmobiliaria /
// corredora de propiedades". La demo con las propiedades del prospecto es la
// prueba — no se enlazan demos de otros clientes.
export const metadata: Metadata = buildMetadata(
  {
    title: "Página web para inmobiliarias con buscador y asistente IA",
    description:
      "Sitio propio para tu corredora: cartera con buscador y filtros, fichas con galería y video, y un asistente IA que responde por tus propiedades 24/7. Desde $349.990 IVA incluido. Demo gratis con TUS propiedades en 24 horas.",
  },
  "/pagina-web-para-inmobiliarias"
);

const FEATURES = [
  {
    tag: "BUSCADOR",
    title: "Cartera con buscador y filtros",
    description:
      "Tus clientes filtran por operación (venta o arriendo), comuna, tipo de propiedad, dormitorios y precio — como en los portales, pero en TU sitio y con TU marca.",
  },
  {
    tag: "FICHAS",
    title: "Ficha completa por propiedad",
    description:
      "Galería de fotos, video embebido, superficie, estacionamientos y descripción. Cada propiedad con su propia URL para compartir por WhatsApp o redes.",
  },
  {
    tag: "ASISTENTE IA",
    title: "Un vendedor que no duerme",
    description:
      "El asistente conoce tu cartera completa: responde “¿qué tienen en Reñaca bajo UF 5.000?” a las 3 de la tarde o de la madrugada, y deriva al WhatsApp del corredor a los interesados de verdad.",
  },
  {
    tag: "CONTACTO",
    title: "WhatsApp por propiedad",
    description:
      "Cada ficha tiene su botón de WhatsApp con el mensaje listo (“Hola, me interesa la casa en Concón…”). El lead te llega con contexto, no con “hola, ¿info?”.",
  },
  {
    tag: "SINDICACIÓN",
    title: "Publica una vez, aparece en todas partes",
    description:
      "Ampliación opcional: tu cartera se sincroniza con Portalinmobiliario y se publica en tus redes. Cargas la propiedad una vez y se replica sola.",
  },
  {
    tag: "MANTENCIÓN",
    title: "Nosotros la mantenemos por ti",
    description:
      "Cambios de propiedades, fotos y textos incluidos en la mantención mensual de $29.990. Tú vendes propiedades; nosotros mantenemos el sitio.",
  },
];

const RUBRO_FAQS = [
  {
    question: "¿Por qué tener sitio propio si ya publico en Portalinmobiliario?",
    answer:
      "Los portales son vitrina compartida: tus propiedades aparecen al lado de las de tu competencia y pagas por estar. Tu sitio propio es tu marca, tu dominio y tus leads directos — y con la sindicación opcional sigues publicando en los portales igual, sin doble trabajo.",
  },
  {
    question: "¿El asistente IA responde de verdad por mi cartera?",
    answer:
      "Sí. Se entrena con tus propiedades reales y responde preguntas concretas: qué hay disponible en una comuna, en un rango de precio, con cierta cantidad de dormitorios. Cuando detecta un interesado, lo deriva a tu WhatsApp con el contexto de la conversación.",
  },
  {
    question: "¿Cuánto cuesta una página web para inmobiliaria?",
    answer:
      "El Plan Inmobiliaria parte en $349.990 IVA incluido: sitio completo, CMS de propiedades con buscador, fichas con galería y video, y el asistente IA. La mantención mensual es de $29.990 e incluye la actualización de tu cartera. La sindicación a portales se cotiza como ampliación.",
  },
  {
    question: "¿Cuánto demora?",
    answer:
      "La demo con tus propiedades la ves en 24 horas, gratis y sin compromiso. Si te gusta, el sitio completo queda publicado en unos 7 días.",
  },
  {
    question: "¿Sirve para un corredor independiente o solo para inmobiliarias?",
    answer:
      "Sirve igual. El plan es el mismo para corredores de propiedades independientes, corredoras boutique e inmobiliarias con equipo — cambia el tamaño de la cartera, no el precio de partida.",
  },
  {
    question: "¿Quién carga y actualiza las propiedades?",
    answer:
      "Nosotros: la carga inicial va incluida y los cambios posteriores entran en la mantención mensual. Si prefieres administrar tu cartera tú mismo, el panel autoadministrable está disponible como ampliación.",
  },
  {
    question: "¿Qué pasa con mi dominio actual?",
    answer:
      "Si ya tienes dominio (.cl u otro), lo usamos — sigue siendo tuyo. Si no tienes, registramos uno a tu nombre; queda incluido en el plan.",
  },
];

const inmobiliariaPlan = verticalPlans.find((p) => p.id === "inmobiliaria");

export default function InmobiliariasPage() {
  const waHref = site.whatsapp
    ? buildWhatsAppLink(site.whatsapp, "Hola! Tengo una corredora de propiedades y quiero mi demo gratis")
    : "/contacto";

  return (
    <main>
      {/* HERO */}
      <header className="relative overflow-hidden px-4 pb-12 pt-14 sm:px-6 sm:pb-[70px] sm:pt-[90px] lg:px-8">
        <div
          className="pointer-events-none absolute -right-[200px] -top-[300px] h-[800px] w-[800px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(255,61,61,0.12), transparent 62%)" }}
        />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-[18px]">
          <span className="font-mono text-sm tracking-[0.14em] text-primary">CORREDORAS E INMOBILIARIAS</span>
          <h1 className="m-0 max-w-[900px] text-4xl font-black leading-[1.05] tracking-tight sm:text-[54px]">
            Página web para inmobiliarias y corredoras de propiedades
          </h1>
          <p className="m-0 max-w-[680px] text-lg leading-[1.6] text-soft sm:text-[19px]">
            Tu cartera en tu propio sitio: buscador con filtros, fichas con galería y video, y un
            asistente IA que responde por tus propiedades las 24 horas. Desde{" "}
            <strong className="text-foreground">$349.990 IVA incluido</strong> — y antes de pagar un
            peso, ves la demo funcionando con TUS propiedades.
          </p>
          <div className="mt-2 flex flex-wrap gap-3.5">
            <Link
              href="/demo"
              className="rounded-[10px] bg-primary px-[30px] py-4 text-[17px] font-extrabold text-white transition-[background-color,transform] duration-150 hover:bg-primary-hover active:scale-[0.98]"
            >
              Pide tu demo gratis →
            </Link>
            <a
              href={waHref}
              {...(site.whatsapp ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="rounded-[10px] border-[1.5px] border-line px-[30px] py-4 text-[17px] font-bold text-foreground transition-[border-color,transform] duration-150 hover:border-soft active:scale-[0.98]"
            >
              Conversemos por WhatsApp
            </a>
          </div>
          <div className="flex flex-wrap gap-7 font-mono text-[13px] tracking-[0.06em] text-soft">
            <span>✓ DEMO CON TUS PROPIEDADES EN 24H</span>
            <span>✓ PRECIO CERRADO, IVA INCLUIDO</span>
            <span>✓ PUBLICADA EN 7 DÍAS</span>
          </div>
        </div>
      </header>

      {/* EL PROBLEMA */}
      <section className="border-t border-line px-4 py-16 sm:px-6 sm:py-[90px] lg:px-8">
        <div className="mx-auto flex max-w-[820px] flex-col gap-5">
          <h2 className="m-0 text-3xl font-black tracking-tight sm:text-[44px]">
            Publicar solo en portales es arrendar la vitrina
          </h2>
          <p className="m-0 text-lg leading-[1.7] text-soft">
            Cada mes pagas por aparecer en portales donde tus propiedades compiten pantalla a pantalla
            con las de todos los demás corredores. El cliente llega, compara y se va — y el contacto
            queda en la plataforma, no contigo. Un sitio propio invierte esa ecuación: tu marca, tu
            dominio, tus leads. Y no reemplaza a los portales — con la sindicación, publicas una vez
            en tu sitio y aparece en todas partes.
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-t border-line px-4 py-16 sm:px-6 sm:py-[90px] lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3.5 pb-8">
          <span className="font-mono text-sm tracking-[0.14em] text-primary">QUÉ INCLUYE</span>
          <h2 className="m-0 text-3xl font-black tracking-tight sm:text-[44px]">
            Todo lo que tu corredora necesita online
          </h2>
        </div>
        <div className="mx-auto grid max-w-6xl gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex flex-col gap-3 rounded-[14px] border border-line bg-card p-7">
              <span className="font-mono text-[13px] tracking-[0.12em] text-primary">{f.tag}</span>
              <span className="text-[22px] font-extrabold">{f.title}</span>
              <span className="flex-1 text-[15px] leading-[1.55] text-soft">{f.description}</span>
            </div>
          ))}
        </div>
      </section>

      {/* PRECIO */}
      {inmobiliariaPlan && (
        <section className="border-t border-line px-4 py-16 sm:px-6 sm:py-[90px] lg:px-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-8 rounded-2xl border border-primary bg-card p-7 sm:p-10 lg:flex-row lg:items-center lg:gap-12">
            <div className="flex flex-1 flex-col gap-3.5">
              <span className="font-mono text-[13px] tracking-[0.12em] text-primary">{inmobiliariaPlan.tag}</span>
              <h2 className="m-0 text-2xl font-black tracking-tight sm:text-[34px]">{inmobiliariaPlan.name}</h2>
              <p className="m-0 max-w-[560px] text-base leading-[1.6] text-soft sm:text-[17px]">
                {inmobiliariaPlan.longDescription}
              </p>
              <div className="flex flex-wrap gap-2.5">
                {inmobiliariaPlan.includes.map((item) => (
                  <span key={item} className="rounded-full border border-line bg-background px-3.5 py-2 text-sm text-soft">
                    ✓ {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-start gap-4 lg:items-end">
              <div className="flex flex-col lg:items-end">
                <span className="text-4xl font-black tracking-tight sm:text-[44px]">{inmobiliariaPlan.price}</span>
                <span className="font-mono text-[13px] text-soft">IVA INCLUIDO · ENTREGA {inmobiliariaPlan.delivery}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/demo"
                  className="rounded-[10px] bg-primary px-6 py-3.5 text-[15px] font-extrabold text-white transition-[background-color,transform] duration-150 hover:bg-primary-hover active:scale-[0.98]"
                >
                  Ver mi demo gratis
                </Link>
                <Link
                  href="/contratar?plan=inmobiliaria"
                  className="rounded-[10px] border-[1.5px] border-line px-6 py-3.5 text-[15px] font-bold text-foreground transition-[border-color,transform] duration-150 hover:border-soft active:scale-[0.98]"
                >
                  Contratar
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CÓMO FUNCIONA */}
      <section className="border-t border-line px-4 py-16 sm:px-6 sm:py-[90px] lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3.5 pb-8">
          <h2 className="m-0 text-3xl font-black tracking-tight sm:text-[44px]">Cómo funciona</h2>
        </div>
        <div className="mx-auto grid max-w-6xl gap-[18px] sm:grid-cols-3">
          {[
            {
              n: "01",
              t: "Nos mandas tu cartera",
              d: "Links a tus publicaciones actuales o un listado simple. Con eso basta para partir.",
            },
            {
              n: "02",
              t: "Ves tu demo en 24 horas",
              d: "Tu sitio funcionando con tus propiedades reales, tu logo y el asistente IA respondiendo. Gratis, sin compromiso.",
            },
            {
              n: "03",
              t: "Publicada en 7 días",
              d: "Ajustamos lo que quieras, conectamos tu dominio y queda online. Solo pagas si la demo te convenció.",
            },
          ].map((s) => (
            <div key={s.n} className="flex flex-col gap-3 rounded-[14px] border border-line bg-card p-7">
              <span className="font-mono text-sm tracking-[0.14em] text-primary">{s.n}</span>
              <span className="text-[20px] font-extrabold">{s.t}</span>
              <span className="text-[15px] leading-[1.55] text-soft">{s.d}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-line px-4 py-16 sm:px-6 sm:py-[90px] lg:px-8">
        <div className="mx-auto flex max-w-[820px] flex-col gap-9">
          <h2 className="m-0 text-3xl font-black tracking-tight sm:text-[44px]">Preguntas frecuentes</h2>
          <FaqAccordion items={RUBRO_FAQS} />
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqJsonLd(RUBRO_FAQS)) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildServicesJsonLd(inmobiliariaPlan ? [inmobiliariaPlan] : [])),
          }}
        />
      </section>

      {/* CTA FINAL */}
      <section className="relative overflow-hidden border-t border-line px-4 py-16 sm:px-6 sm:py-[100px] lg:px-8">
        <div
          className="pointer-events-none absolute -bottom-[300px] left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(255,61,61,0.14), transparent 62%)" }}
        />
        <div className="relative mx-auto flex max-w-[760px] flex-col items-center gap-6 text-center">
          <h2 className="m-0 text-4xl font-black leading-[1.02] tracking-tight sm:text-[56px]">
            Mira tu corredora online antes de pagar
          </h2>
          <p className="m-0 max-w-[560px] text-lg leading-[1.6] text-soft">
            Mándanos tus propiedades hoy y mañana ves tu sitio funcionando — con tu marca, tu cartera
            y el asistente respondiendo. Si no te gusta, lo borramos y quedamos como amigos.
          </p>
          <Link
            href="/demo"
            className="rounded-[10px] bg-primary px-[34px] py-4 text-[17px] font-extrabold text-white transition-[background-color,transform] duration-150 hover:bg-primary-hover active:scale-[0.98]"
          >
            Pide tu demo gratis →
          </Link>
        </div>
      </section>
    </main>
  );
}
