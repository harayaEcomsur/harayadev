import type { Metadata } from "next";
import Link from "next/link";
import { plans, addons } from "@/content/plans";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { site } from "@/lib/site";
import { buildFaqJsonLd, buildMetadata, buildServicesJsonLd } from "@/lib/seo";
import { buildWhatsAppLink } from "@/lib/whatsapp";

// Página de captura por rubro (SEO): "página web para abogados / estudio
// jurídico". Gancho: presencia seria + agenda de reuniones (presencial o
// videollamada) sincronizada con el calendario del abogado.
export const metadata: Metadata = buildMetadata(
  {
    title: "Página web para abogados con agenda de reuniones",
    description:
      "Sitio serio para tu estudio: agenda de reuniones (presencial o videollamada) sincronizada con Google Calendar y asistente IA que agenda por ti. Demo gratis en 24h.",
  },
  "/pagina-web-para-abogados"
);

const FEATURES = [
  {
    tag: "PRESENCIA",
    title: "Un sitio a la altura del estudio",
    description:
      "Diseño sobrio y profesional: áreas de práctica, trayectoria y equipo. La primera búsqueda en Google que hace un cliente antes de confiarte su caso — resuelta.",
  },
  {
    tag: "AGENDA",
    title: "Reuniones que se agendan solas",
    description:
      "Tu cliente elige el tipo de reunión — primera consulta, presencial o videollamada — y el horario disponible. Sin llamadas ni ida y vuelta de correos para cuadrar una hora.",
  },
  {
    tag: "TU CALENDARIO",
    title: "Sincronizada con Google Calendar",
    description:
      "Cada reunión aparece y se actualiza sola en tu Google Calendar u Outlook, y cada aviso trae un botón para anotarla al instante. Tu agenda de siempre, sin doble registro.",
  },
  {
    tag: "ASISTENTE IA",
    title: "Filtra y orienta, no improvisa",
    description:
      "El asistente responde por tus áreas de práctica, honorarios de consulta y disponibilidad, y guía a agendar. No da consejo legal — ese es tu trabajo; el suyo es que la consulta llegue ordenada.",
  },
  {
    tag: "CONTROL",
    title: "Tu disponibilidad manda",
    description:
      "¿Audiencia, alegato, vacaciones? Bloqueas el día o la hora desde tu panel y desaparece de la agenda pública al instante. La consulta puede requerir abono — tú decides.",
  },
  {
    tag: "CONFIANZA",
    title: "Todo lo que da seriedad",
    description:
      "Dominio propio .cl, correo profesional, formulario de contacto y presencia en Google. Con mantención mensual para que siempre esté al día.",
  },
];

const RUBRO_FAQS = [
  {
    question: "¿Cómo agendan reuniones mis clientes?",
    answer:
      "Desde tu sitio: eligen el tipo de reunión que definas (por ejemplo primera consulta, reunión presencial o videollamada), ven solo tus horarios disponibles y reservan. Tú recibes el aviso al instante y confirmas desde tu panel.",
  },
  {
    question: "¿Las reuniones llegan a mi Google Calendar u Outlook?",
    answer:
      "Sí. Te suscribes una sola vez y tus reuniones aparecen y se actualizan solas en Google Calendar, Outlook o el calendario del iPhone. Cada correo de aviso además trae un botón “Agregar a Google Calendar”.",
  },
  {
    question: "¿El asistente IA da consejos legales?",
    answer:
      "No — y está instruido para no hacerlo. Orienta sobre tus áreas de práctica, el valor de la consulta y la disponibilidad, y guía al cliente a agendar una reunión contigo. El consejo legal lo das tú, en la reunión.",
  },
  {
    question: "¿Puedo cobrar la primera consulta?",
    answer:
      "Tú decides: la agenda soporta reservas con abono (la hora queda pendiente hasta la transferencia) o reservas libres que tú confirmas. Muchos estudios usan el abono para filtrar consultas serias.",
  },
  {
    question: "¿Cuánto cuesta una página web para un abogado o estudio jurídico?",
    answer:
      "El sitio completo (Web Pyme) cuesta $249.990 y la agenda de reuniones se agrega desde $99.990 — IVA incluido, con dominio y hosting el primer año. Antes de pagar, ves una demo con la identidad de tu estudio, gratis.",
  },
  {
    question: "¿Sirve para un estudio con varios abogados?",
    answer:
      "Sí. El sitio presenta al equipo completo y la agenda parte centralizada (una agenda del estudio); la agenda individual por abogado está disponible como ampliación.",
  },
  {
    question: "¿Cuánto demora?",
    answer:
      "La demo la ves en 24 horas y el sitio queda publicado en 72 horas desde tu aprobación. Solo pagas si la demo te convence.",
  },
];

const pymePlan = plans.find((p) => p.id === "pyme");
const agendaAddon = addons.find((a) => a.name.toLowerCase().includes("agenda"));

export default function AbogadosPage() {
  const waHref = site.whatsapp
    ? buildWhatsAppLink(site.whatsapp, "Hola! Tengo un estudio jurídico y quiero mi demo gratis")
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
            ABOGADOS · ESTUDIOS JURÍDICOS · NOTARÍAS Y CONSULTORAS
          </span>
          <h1 className="m-0 max-w-[900px] text-4xl font-black leading-[1.05] tracking-tight sm:text-[54px]">
            Página web para abogados y estudios jurídicos
          </h1>
          <p className="m-0 max-w-[680px] text-lg leading-[1.6] text-soft sm:text-[19px]">
            Presencia seria, áreas de práctica claras y una{" "}
            <strong className="text-foreground">agenda de reuniones online</strong> — presencial o
            videollamada — sincronizada con tu Google Calendar. Tus clientes agendan solos; tú llegas
            a la reunión con la consulta ordenada.
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
            <span>✓ DEMO CON TU ESTUDIO EN 24H</span>
            <span>✓ PRECIO CERRADO, IVA INCLUIDO</span>
            <span>✓ AGENDA SINCRONIZADA</span>
          </div>
        </div>
      </header>

      {/* EL PROBLEMA */}
      <section className="border-t border-line px-4 py-16 sm:px-6 sm:py-[90px] lg:px-8">
        <div className="mx-auto flex max-w-[820px] flex-col gap-5">
          <h2 className="m-0 text-3xl font-black tracking-tight sm:text-[44px]">
            Tu cliente te googlea antes de llamarte
          </h2>
          <p className="m-0 text-lg leading-[1.7] text-soft">
            Antes de confiarle su caso a alguien, la gente busca: quién es, qué hace, dónde atiende.
            Un estudio sin sitio web — o con uno abandonado — pierde esa primera impresión frente al
            que sí la tiene. Y después viene la segunda fricción: cuadrar la reunión por teléfono,
            entre audiencias. Un sitio serio con agenda online resuelve las dos cosas: la
            credibilidad se ve, y la reunión se agenda sola en el horario que tú definiste.
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-t border-line px-4 py-16 sm:px-6 sm:py-[90px] lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3.5 pb-8">
          <span className="font-mono text-sm tracking-[0.14em] text-primary">QUÉ INCLUYE</span>
          <h2 className="m-0 text-3xl font-black tracking-tight sm:text-[44px]">
            Credibilidad online, agenda bajo control
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
            {pymePlan && (
              <div className="flex flex-col gap-3 rounded-[14px] border border-line bg-card p-7">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[20px] font-extrabold">{pymePlan.name}</span>
                  <span className="shrink-0 font-mono text-lg font-bold text-primary">{pymePlan.price}</span>
                </div>
                <span className="text-[15px] leading-[1.55] text-soft">
                  El sitio completo del estudio: áreas de práctica, equipo, formulario de contacto y
                  asistente IA. IVA incluido, dominio y hosting el primer año.
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
              ¿Prefieres partir más simple? Mira todos los planes desde $99.990.
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
              t: "Nos cuentas del estudio",
              d: "Áreas de práctica, equipo y cómo prefieres las reuniones (presencial, videollamada o ambas).",
            },
            {
              n: "02",
              t: "Ves tu demo en 24 horas",
              d: "El sitio con la identidad de tu estudio y la agenda funcionando. Gratis, sin compromiso.",
            },
            {
              n: "03",
              t: "Publicada en 72 horas",
              d: "Ajustamos lo que pidas, conectamos tu dominio y sincronizamos tu calendario. Solo pagas si te convence.",
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
                  pymePlan ? { name: pymePlan.name, price: pymePlan.price, description: pymePlan.description } : null,
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
            Que tu estudio se vea como trabaja
          </h2>
          <p className="m-0 max-w-[560px] text-lg leading-[1.6] text-soft">
            Cuéntanos de tu estudio hoy y mañana ves el sitio con tu identidad y la agenda
            funcionando. Si no te convence, lo borramos — sin costo y sin letra chica.
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
