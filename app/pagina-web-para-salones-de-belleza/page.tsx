import type { Metadata } from "next";
import Link from "next/link";
import { plans, addons } from "@/content/plans";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { site } from "@/lib/site";
import { buildFaqJsonLd, buildMetadata, buildServicesJsonLd } from "@/lib/seo";
import { buildWhatsAppLink } from "@/lib/whatsapp";

// Página de captura por rubro (SEO): "página web para salón de belleza /
// barbería / uñas" — el gancho es la agenda online con abono (anti no-show).
export const metadata: Metadata = buildMetadata(
  {
    title: "Página web para salones de belleza con agenda online",
    description:
      "Tus clientas reservan solas, con abono anti no-show: agenda online 24/7, avisos al instante y asistente IA. Salones, barberías y uñas. Demo gratis en 24 horas.",
  },
  "/pagina-web-para-salones-de-belleza"
);

const FEATURES = [
  {
    tag: "AGENDA 24/7",
    title: "Reservan solas, a cualquier hora",
    description:
      "Tu clienta elige servicio, día y hora desde el celular — a las 11 de la noche si quiere. Solo ve los horarios que realmente tienes libres, según tu horario de atención.",
  },
  {
    tag: "ANTI NO-SHOW",
    title: "Abono para que nadie te deje plantada",
    description:
      "Cada reserva queda “pendiente de abono” hasta que la clienta transfiere. La hora que te reservan es una hora que te pagan — se acabó el sillón vacío a las 4 de la tarde.",
  },
  {
    tag: "AVISOS",
    title: "Te enteras al instante",
    description:
      "Cada reserva nueva te llega al correo al tiro, con un enlace que abre tu WhatsApp con el mensaje listo para coordinar el abono. Confirmas con un click desde tu panel.",
  },
  {
    tag: "TU HORARIO",
    title: "Bloqueas los días que no atiendes",
    description:
      "¿Vacaciones, hora médica, un sábado libre? Lo bloqueas desde el panel y desaparece de la agenda pública al instante. Tu agenda manda, no al revés.",
  },
  {
    tag: "ASISTENTE IA",
    title: "Responde precios y horarios por ti",
    description:
      "“¿Cuánto sale el esmaltado permanente?” “¿Atienden los sábados?” El asistente responde las 24 horas con TU información y guía a la clienta a agendar — tú no tocas el teléfono.",
  },
  {
    tag: "VITRINA",
    title: "Tu trabajo, en tu propio sitio",
    description:
      "Galería con tus trabajos, servicios con precios y tu marca — no solo un feed de Instagram. Tu bio de IG apunta a un sitio que agenda y vende por ti.",
  },
];

const RUBRO_FAQS = [
  {
    question: "¿Cómo evita la agenda online los no-shows?",
    answer:
      "Con abono obligatorio: cuando una clienta reserva, la hora queda “pendiente de abono” y tú recibes el aviso. Ella te transfiere el abono (que se descuenta del valor del servicio), tú confirmas con un click y recién ahí la hora queda tomada. Quien no abona, no bloquea tu agenda.",
  },
  {
    question: "¿Cuánto cuesta una página web para un salón de belleza?",
    answer:
      "La web con asistente IA parte en $149.990 y la agenda online con abono se agrega desde $99.990 — ambos precios con IVA incluido y sin costos ocultos. Antes de pagar, ves una demo funcionando con tu marca, gratis.",
  },
  {
    question: "¿Me avisan cuando alguien reserva?",
    answer:
      "Sí, al instante: te llega un correo con el detalle de la reserva y un enlace que abre tu WhatsApp con el mensaje listo para coordinar el abono con la clienta. Desde tu panel confirmas, cancelas o revisas todas tus reservas.",
  },
  {
    question: "¿Las reservas llegan a mi Google Calendar?",
    answer:
      "Sí. Te suscribes una sola vez desde tu panel y tus reservas aparecen y se actualizan solas en Google Calendar, Outlook o el calendario del iPhone. Además, cada correo de aviso trae un botón “Agregar a Google Calendar” para anotar esa hora al instante.",
  },
  {
    question: "¿Puedo bloquear días u horas en que no atiendo?",
    answer:
      "Sí. Desde tu panel bloqueas un día completo o una hora puntual (vacaciones, trámites, hora médica) y ese horario desaparece de inmediato de la agenda que ven tus clientas.",
  },
  {
    question: "¿Cómo recibo el abono?",
    answer:
      "Directo a tu cuenta, por transferencia: coordinas con la clienta por WhatsApp (el mensaje con tus datos sale listo desde el panel) y confirmas la reserva cuando llega el abono. El dinero nunca pasa por nosotros.",
  },
  {
    question: "¿Sirve para barberías, uñas, pestañas o estética?",
    answer:
      "Sí — la agenda funciona igual para salones de belleza, barberías, manicure y uñas esculpidas, extensiones de pestañas, estética y spa: defines tus servicios con sus precios y duraciones, y la agenda se arma sola con tu horario.",
  },
  {
    question: "¿Y si mis clientas ya me agendan por Instagram?",
    answer:
      "Van a seguir llegando por Instagram — la diferencia es que el link de tu bio ahora apunta a una agenda que se atiende sola, en vez de un ida y vuelta de mensajes a toda hora. Tú revisas reservas confirmadas en lugar de responder “¿tienes hora el viernes?” veinte veces al día.",
  },
];

const agendaAddon = addons.find((a) => a.name.toLowerCase().includes("agenda"));
const botPlan = plans.find((p) => p.id === "bot");

export default function SalonesPage() {
  const waHref = site.whatsapp
    ? buildWhatsAppLink(site.whatsapp, "Hola! Tengo un salón y quiero mi demo gratis con agenda online")
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
          <span className="font-mono text-sm tracking-[0.14em] text-primary">
            SALONES · BARBERÍAS · UÑAS Y PESTAÑAS · ESTÉTICA
          </span>
          <h1 className="m-0 max-w-[900px] text-4xl font-black leading-[1.05] tracking-tight sm:text-[54px]">
            Página web con agenda online para salones de belleza
          </h1>
          <p className="m-0 max-w-[680px] text-lg leading-[1.6] text-soft sm:text-[19px]">
            Tus clientas reservan hora solas — con <strong className="text-foreground">abono</strong>{" "}
            para que nadie te deje plantada. Tú recibes el aviso al instante, confirmas con un click y
            un asistente IA responde precios y horarios por ti, las 24 horas.
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
            <span>✓ DEMO CON TU MARCA EN 24H</span>
            <span>✓ PRECIO CERRADO, IVA INCLUIDO</span>
            <span>✓ RESERVAS CON ABONO</span>
          </div>
        </div>
      </header>

      {/* EL PROBLEMA */}
      <section className="border-t border-line px-4 py-16 sm:px-6 sm:py-[90px] lg:px-8">
        <div className="mx-auto flex max-w-[820px] flex-col gap-5">
          <h2 className="m-0 text-3xl font-black tracking-tight sm:text-[44px]">
            Tu agenda no debería vivir en los DM
          </h2>
          <p className="m-0 text-lg leading-[1.7] text-soft">
            “¿Tienes hora el viernes?” a las 11 de la noche. El ida y vuelta de mensajes para
            cuadrar una hora. Y lo peor: la clienta que reservó, no llegó y te dejó el sillón vacío
            en tu mejor horario. Una agenda online con abono resuelve las tres cosas: las horas se
            reservan solas, cada reserva llega con compromiso de pago, y tú dedicas las manos a lo
            que te genera plata — no al teléfono.
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-t border-line px-4 py-16 sm:px-6 sm:py-[90px] lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3.5 pb-8">
          <span className="font-mono text-sm tracking-[0.14em] text-primary">QUÉ INCLUYE</span>
          <h2 className="m-0 text-3xl font-black tracking-tight sm:text-[44px]">
            Un sitio que atiende mientras tú atiendes
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
      <section className="border-t border-line px-4 py-16 sm:px-6 sm:py-[90px] lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-[18px]">
          <div className="flex flex-col gap-3.5 pb-4">
            <span className="font-mono text-sm tracking-[0.14em] text-primary">PRECIO CERRADO</span>
            <h2 className="m-0 text-3xl font-black tracking-tight sm:text-[44px]">Cuánto cuesta</h2>
          </div>
          <div className="grid gap-[18px] sm:grid-cols-2">
            {botPlan && (
              <div className="flex flex-col gap-3 rounded-[14px] border border-line bg-card p-7">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[20px] font-extrabold">{botPlan.name}</span>
                  <span className="shrink-0 font-mono text-lg font-bold text-primary">{botPlan.price}</span>
                </div>
                <span className="text-[15px] leading-[1.55] text-soft">
                  Tu sitio con galería, servicios y precios, más el asistente IA respondiendo por tu
                  negocio en la web. IVA incluido, entrega en 72 horas.
                </span>
              </div>
            )}
            {agendaAddon && (
              <div className="flex flex-col gap-3 rounded-[14px] border border-primary bg-card p-7">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[20px] font-extrabold">{agendaAddon.name}</span>
                  <span className="shrink-0 font-mono text-lg font-bold text-primary">{agendaAddon.priceFrom}</span>
                </div>
                <span className="text-[15px] leading-[1.55] text-soft">{agendaAddon.description}</span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-5 rounded-[14px] border border-dashed border-line bg-background px-7 py-[22px]">
            <span className="text-base text-soft">
              ¿Solo quieres partir con lo básico? Mira todos los planes desde $99.990.
            </span>
            <Link href="/servicios" className="whitespace-nowrap text-[15px] font-bold text-primary hover:underline">
              Ver planes y precios →
            </Link>
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="border-t border-line px-4 py-16 sm:px-6 sm:py-[90px] lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3.5 pb-8">
          <h2 className="m-0 text-3xl font-black tracking-tight sm:text-[44px]">Cómo funciona</h2>
        </div>
        <div className="mx-auto grid max-w-6xl gap-[18px] sm:grid-cols-3">
          {[
            {
              n: "01",
              t: "Nos cuentas de tu salón",
              d: "Tus servicios con precios, tu horario de atención y tu Instagram. Con eso armamos todo.",
            },
            {
              n: "02",
              t: "Ves tu demo en 24 horas",
              d: "Tu sitio con tu marca, la agenda funcionando y el asistente respondiendo tus precios. Gratis, sin compromiso.",
            },
            {
              n: "03",
              t: "Publicada en 72 horas",
              d: "Ajustamos lo que quieras, conectamos tu dominio y pones el link en tu bio. Solo pagas si la demo te convenció.",
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
            __html: JSON.stringify(
              buildServicesJsonLd(
                [
                  botPlan ? { name: botPlan.name, price: botPlan.price, description: botPlan.description } : null,
                  agendaAddon
                    ? { name: agendaAddon.name, price: agendaAddon.priceFrom, description: agendaAddon.description }
                    : null,
                ].filter((x): x is { name: string; price: string; description: string } => x !== null)
              )
            ),
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
            Deja que tu agenda se llene sola
          </h2>
          <p className="m-0 max-w-[560px] text-lg leading-[1.6] text-soft">
            Cuéntanos de tu salón hoy y mañana ves tu sitio con la agenda funcionando — con tus
            servicios, tus precios y tu marca. Si no te gusta, lo borramos y quedamos como amigas.
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
