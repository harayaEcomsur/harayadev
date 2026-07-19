import type { Metadata } from "next";
import Link from "next/link";
import { plans, verticalPlans } from "@/content/plans";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { site } from "@/lib/site";
import { buildFaqJsonLd, buildMetadata, buildServicesJsonLd } from "@/lib/seo";
import { buildWhatsAppLink } from "@/lib/whatsapp";

// Página de captura por intención de compra (SEO): "cuánto cuesta una página
// web en Chile". Responde la pregunta de frente (rangos reales del mercado),
// educa contra la trampa de la suscripción y aterriza en nuestros precios
// públicos. Mismo contenido que la guía PDF del lead magnet.
export const metadata: Metadata = buildMetadata(
  {
    title: "¿Cuánto cuesta una página web en Chile? Precios 2026",
    description:
      "Precios reales 2026: freelancers desde $80.000, agencias desde $650.000, suscripciones y sus trampas. Tabla comparativa, checklist de 8 puntos y precios públicos con IVA incluido.",
  },
  "/cuanto-cuesta-una-pagina-web-en-chile"
);

const MERCADO = [
  {
    opcion: "Freelancer informal",
    precio: "$80.000 – $300.000",
    modalidad: "pago único",
    detalle:
      "Muchas veces sin boleta ni contrato. El riesgo real: cuando necesites un cambio en 6 meses, puede que ya no responda el WhatsApp.",
  },
  {
    opcion: "Agencia tradicional",
    precio: "$650.000 o más",
    modalidad: "pago único",
    detalle:
      "Buen trabajo, con reuniones y proceso. Entrega en 3 a 6 semanas. Tiene sentido para marcas grandes; para una pyme suele ser más proceso del que necesitas.",
  },
  {
    opcion: "Plantilla por suscripción",
    precio: "$50.000 – $95.000",
    modalidad: "al año",
    detalle:
      "Barato el primer año. El sitio es una plantilla compartida y no es tuyo: si dejas de pagar, desaparece — y el dominio a veces también.",
  },
  {
    opcion: "Hazlo tú mismo (Wix y similares)",
    precio: "$10.000 – $30.000",
    modalidad: "al mes",
    detalle:
      "El costo real es tu tiempo: días armándolo, resultado genérico, y sigues pagando mensual para siempre.",
  },
  {
    opcion: "Tienda por suscripción (Shopify, etc.)",
    precio: "$15.000 – $40.000",
    modalidad: "al mes + comisiones",
    detalle:
      "Bien para catálogos grandes. Para partir vendiendo online, pagas mensualidad más comisiones por venta desde el día uno.",
  },
];

const CHECKLIST = [
  {
    title: "Dominio propio (.cl) a tu nombre",
    desc: "Tú eres el dueño en NIC Chile, no el proveedor. Si la dirección de tu negocio en internet no es tuya, tu negocio es rehén.",
  },
  {
    title: "Boleta o factura",
    desc: "Trabajo formal, con respaldo — y el gasto es deducible para tu empresa.",
  },
  {
    title: "Precio cerrado antes de partir",
    desc: "Sabes cuánto pagarás en total, por escrito. Los “depende” al final siempre juegan en tu contra.",
  },
  {
    title: "Perfecta en el celular",
    desc: "En Chile, la gran mayoría de las visitas llegan desde el teléfono. Pide ver la demo en un celular, no en un notebook.",
  },
  {
    title: "Preparada para aparecer en Google",
    desc: "Títulos, descripciones y velocidad optimizados desde el día uno. Una web que no aparece en Google es una tarjeta guardada en un cajón.",
  },
  {
    title: "El sitio es tuyo, con código incluido",
    desc: "Si terminas la relación con el proveedor, te llevas el sitio completo. Con suscripciones esto casi nunca es posible.",
  },
  {
    title: "Asistente con IA que atiende 24/7",
    desc: "Un asistente que responde precios, agenda horas y toma pedidos mientras duermes. Pregunta si viene incluido o cuánto cuesta agregarlo.",
  },
  {
    title: "Pago online con Webpay (si vendes)",
    desc: "Que tus clientes paguen con tarjeta ahí mismo, sin “hablemos por DM para transferir”.",
  },
];

const PRECIO_FAQS = [
  {
    question: "¿Cuánto cuesta hacer una página web en Chile en 2026?",
    answer:
      "Depende de a quién le compres: un freelancer informal cobra entre $80.000 y $300.000, una agencia tradicional desde $650.000, y las plataformas de suscripción entre $10.000 y $40.000 mensuales para siempre. En HarayaDev los precios son públicos y cerrados: desde $99.990 (landing con asistente IA) hasta $449.990 (tienda con Webpay), IVA incluido y con pago único.",
  },
  {
    question: "¿Es mejor pagar mensual (Wix, plantillas) o un pago único?",
    answer:
      "Haz la matemática a 3 años: una suscripción de $25.000 al mes son $900.000 — y el sitio nunca es tuyo: si dejas de pagar, desaparece. Un sitio propio con pago único queda pagado el primer mes, es tuyo con dominio y código, y la mantención es opcional. Si en 12 meses de cuotas pagas más que un sitio propio, no estás ahorrando: estás arrendando.",
  },
  {
    question: "¿Cuánto cuesta mantener una página web?",
    answer:
      "Con nosotros la mantención es opcional y cuesta $29.990 mensuales (actualizaciones de contenido, respaldo y soporte). El sitio sigue siendo tuyo con o sin mantención — no es un arriendo encubierto. El dominio .cl cuesta aparte alrededor de $10.000 al año en NIC Chile, y queda a tu nombre.",
  },
  {
    question: "¿Cuánto cuesta una tienda online con Webpay en Chile?",
    answer:
      "Nuestra Tienda Online cuesta desde $449.990, pago único con IVA incluido: catálogo, carrito y pago con tarjeta vía Webpay, sin mensualidad de plataforma ni comisiones nuestras por venta. En plataformas de suscripción como Shopify o Jumpseller pagas $15.000–$40.000 mensuales más comisiones, para siempre.",
  },
  {
    question: "¿El precio incluye dominio, hosting y diseño para celular?",
    answer:
      "Sí. Todos nuestros planes incluyen dominio y hosting el primer año, diseño mobile-first, asistente con IA y optimización para Google. Sin costos escondidos: el precio publicado con IVA incluido es lo que pagas.",
  },
  {
    question: "¿Cuánto demora hacer una página web?",
    answer:
      "Con nosotros ves una demo funcionando con tu marca en 24 horas, gratis y sin compromiso. Aprobada la demo, el sitio queda publicado en 72 horas. Una agencia tradicional demora entre 3 y 6 semanas.",
  },
  {
    question: "¿Por qué hay tanta diferencia de precios entre proveedores?",
    answer:
      "Porque venden cosas distintas: soporte que desaparece vs. empresa formal, plantilla arrendada vs. sitio propio, precio “desde” vs. precio cerrado. Antes de comparar precios, compara qué incluye: dominio a tu nombre, boleta, sitio de tu propiedad, diseño para celular y qué pasa si dejas de pagar.",
  },
];

const landing = plans.find((p) => p.id === "landing");
const bot = plans.find((p) => p.id === "bot");
const pyme = plans.find((p) => p.id === "pyme");
const tienda = plans.find((p) => p.id === "tienda");
const inmobiliaria = verticalPlans.find((p) => p.id === "inmobiliaria");
const nuestros = [landing, bot, pyme, inmobiliaria, tienda].filter(
  (p): p is NonNullable<typeof p> => p != null
);

export default function CuantoCuestaPage() {
  const waHref = site.whatsapp
    ? buildWhatsAppLink(
        site.whatsapp,
        "Hola! Quiero la guía de precios de páginas web en Chile 2026"
      )
    : "/contacto";

  return (
    <main>
      {/* HERO + RESPUESTA DIRECTA */}
      <header className="relative overflow-hidden px-4 pb-12 pt-14 sm:px-6 sm:pb-[70px] sm:pt-[90px] lg:px-8">
        <div
          className="pointer-events-none absolute -right-[200px] -top-[300px] h-[800px] w-[800px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(255,61,61,0.12), transparent 62%)" }}
        />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-[18px]">
          <span className="font-mono text-sm tracking-[0.14em] text-primary">
            GUÍA DE PRECIOS · MERCADO CHILENO · ACTUALIZADA 2026
          </span>
          <h1 className="m-0 max-w-[900px] text-4xl font-black leading-[1.05] tracking-tight sm:text-[54px]">
            ¿Cuánto cuesta una página web en Chile?
          </h1>
          <p className="m-0 max-w-[720px] text-lg leading-[1.6] text-soft sm:text-[19px]">
            En 2026, una página web en Chile cuesta{" "}
            <strong className="text-foreground">
              entre $80.000 y más de $1.000.000
            </strong>{" "}
            según a quién le compres: freelancer informal ($80.000–$300.000), agencia tradicional
            ($650.000 o más) o plataformas de suscripción ($10.000–$40.000 mensuales para siempre).
            La diferencia no es solo el número — es qué estás comprando de verdad. Aquí está el mapa
            honesto, con la trampa que nadie te cuenta y un checklist para no pagar de más.
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
              Recibe la guía en PDF por WhatsApp
            </a>
          </div>
          <div className="flex flex-wrap gap-7 font-mono text-[13px] tracking-[0.06em] text-soft">
            <span>✓ PRECIOS REALES DEL MERCADO</span>
            <span>✓ SIN LETRA CHICA</span>
            <span>✓ CHECKLIST DE 8 PUNTOS</span>
          </div>
        </div>
      </header>

      {/* TABLA DE MERCADO */}
      <section className="border-t border-line px-4 py-16 sm:px-6 sm:py-[90px] lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3.5 pb-8">
          <span className="font-mono text-sm tracking-[0.14em] text-primary">EL MAPA DE PRECIOS</span>
          <h2 className="m-0 text-3xl font-black tracking-tight sm:text-[44px]">
            Precios de páginas web en Chile: la tabla honesta
          </h2>
          <p className="m-0 max-w-[720px] text-lg leading-[1.6] text-soft">
            No es que alguien mienta — es que te están vendiendo cosas distintas. Compara qué
            incluye cada opción antes de comparar el número.
          </p>
        </div>
        <div className="mx-auto max-w-6xl overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr>
                <th className="border-b-2 border-primary px-4 py-3 font-mono text-[12px] tracking-[0.12em] text-soft">
                  OPCIÓN
                </th>
                <th className="border-b-2 border-primary px-4 py-3 font-mono text-[12px] tracking-[0.12em] text-soft">
                  PRECIO TÍPICO
                </th>
                <th className="border-b-2 border-primary px-4 py-3 font-mono text-[12px] tracking-[0.12em] text-soft">
                  LO QUE HAY QUE SABER
                </th>
              </tr>
            </thead>
            <tbody>
              {MERCADO.map((m) => (
                <tr key={m.opcion}>
                  <td className="border-b border-line px-4 py-4 align-top text-[15px] font-extrabold">
                    {m.opcion}
                  </td>
                  <td className="whitespace-nowrap border-b border-line px-4 py-4 align-top font-mono text-[14px] font-bold text-primary">
                    {m.precio}
                    <span className="block font-normal text-soft">{m.modalidad}</span>
                  </td>
                  <td className="border-b border-line px-4 py-4 align-top text-[14px] leading-[1.55] text-soft">
                    {m.detalle}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mx-auto mt-8 max-w-6xl rounded-[14px] border border-primary/40 bg-card p-7">
          <p className="m-0 text-[15px] leading-[1.6] text-soft">
            <strong className="text-foreground">La pregunta que ordena todo:</strong> ¿estás pagando
            por un sitio que será tuyo, o arrendando uno que desaparece cuando dejas de pagar? Esa
            diferencia vale más que el precio del primer año.
          </p>
        </div>
      </section>

      {/* LA TRAMPA */}
      <section className="border-t border-line px-4 py-16 sm:px-6 sm:py-[90px] lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3.5 pb-8">
          <span className="font-mono text-sm tracking-[0.14em] text-primary">
            LA TRAMPA DE LA SUSCRIPCIÓN
          </span>
          <h2 className="m-0 text-3xl font-black tracking-tight sm:text-[44px]">
            Haz la matemática a 3 años
          </h2>
          <p className="m-0 max-w-[720px] text-lg leading-[1.6] text-soft">
            Las opciones “baratas” por mes se comparan solas contra un pago único… si miras un solo
            mes. Ningún negocio tiene una web por un mes.
          </p>
        </div>
        <div className="mx-auto grid max-w-6xl gap-[18px] sm:grid-cols-2">
          <div className="flex flex-col gap-3 rounded-[14px] border border-line bg-card p-7">
            <span className="font-mono text-[13px] tracking-[0.12em] text-soft">
              SUSCRIPCIÓN “ECONÓMICA”
            </span>
            <span className="font-mono text-[26px] font-bold">$25.000 × 36 meses</span>
            <span className="text-[17px] font-extrabold text-primary">= $900.000 en 3 años</span>
            <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[15px] leading-[1.55] text-soft">
              <li>✗ El sitio no es tuyo — dejas de pagar y se apaga</li>
              <li>✗ Plantilla igual a miles de sitios</li>
              <li>✗ Cada función extra sube el plan</li>
              <li>✗ El dominio a veces queda a nombre de ellos</li>
            </ul>
          </div>
          <div className="flex flex-col gap-3 rounded-[14px] border border-primary bg-card p-7">
            <span className="font-mono text-[13px] tracking-[0.12em] text-primary">
              PAGO ÚNICO + MANTENCIÓN OPCIONAL
            </span>
            <span className="font-mono text-[26px] font-bold">$249.990 una vez</span>
            <span className="text-[17px] font-extrabold text-primary">= pagado el mes uno</span>
            <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[15px] leading-[1.55] text-soft">
              <li>✓ El sitio y el dominio son tuyos</li>
              <li>✓ Diseño hecho para tu rubro y tu marca</li>
              <li>✓ Sin arriendo obligatorio: la mantención es opcional</li>
              <li>✓ Si cambias de proveedor, te llevas todo</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CHECKLIST */}
      <section className="border-t border-line px-4 py-16 sm:px-6 sm:py-[90px] lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3.5 pb-8">
          <span className="font-mono text-sm tracking-[0.14em] text-primary">ANTES DE PAGAR</span>
          <h2 className="m-0 text-3xl font-black tracking-tight sm:text-[44px]">
            Checklist: las 8 cosas que tu web debe incluir
          </h2>
          <p className="m-0 max-w-[720px] text-lg leading-[1.6] text-soft">
            Ten esta lista a mano cuando pidas cotización. Si alguna respuesta es “no” o “depende”,
            pregunta el porqué antes de transferir.
          </p>
        </div>
        <div className="mx-auto grid max-w-6xl gap-[18px] sm:grid-cols-2">
          {CHECKLIST.map((c, i) => (
            <div key={c.title} className="flex gap-4 rounded-[14px] border border-line bg-card p-6">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-primary font-mono text-[13px] font-bold text-white">
                {i + 1}
              </span>
              <div className="flex flex-col gap-1.5">
                <span className="text-[17px] font-extrabold">{c.title}</span>
                <span className="text-[14px] leading-[1.55] text-soft">{c.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NUESTROS PRECIOS */}
      <section className="border-t border-line px-4 py-16 sm:px-6 sm:py-[90px] lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3.5 pb-8">
          <span className="font-mono text-sm tracking-[0.14em] text-primary">PRECIO CERRADO</span>
          <h2 className="m-0 text-3xl font-black tracking-tight sm:text-[44px]">
            Nuestros precios, públicos
          </h2>
          <p className="m-0 max-w-[720px] text-lg leading-[1.6] text-soft">
            Publicamos los precios porque cumplen el checklist completo: precio cerrado con IVA
            incluido, boleta o factura, sitio 100% tuyo y asistente con IA en todos los planes.
          </p>
        </div>
        <div className="mx-auto grid max-w-6xl gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
          {nuestros.map((p) => (
            <div key={p.id} className="flex flex-col gap-3 rounded-[14px] border border-line bg-card p-7">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[20px] font-extrabold">{p.name}</span>
                <span className="shrink-0 font-mono text-lg font-bold text-primary">{p.price}</span>
              </div>
              <span className="flex-1 text-[15px] leading-[1.55] text-soft">{p.description}</span>
            </div>
          ))}
          <div className="flex flex-col justify-center gap-3 rounded-[14px] border border-dashed border-line bg-background p-7">
            <span className="text-base text-soft">
              Todos con IVA incluido, dominio y hosting el primer año. Mantención mensual opcional
              desde $29.990. Pago por transferencia: 100% al aprobar la demo, o 50/50.
            </span>
            <Link href="/servicios" className="text-[15px] font-bold text-primary hover:underline">
              Ver el detalle de cada plan →
            </Link>
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-6xl text-sm leading-[1.6] text-soft">
          ¿Buscas algo específico para tu rubro? Tenemos páginas dedicadas:{" "}
          <Link href="/pagina-web-para-inmobiliarias" className="font-bold text-primary hover:underline">
            página web para inmobiliarias
          </Link>
          ,{" "}
          <Link href="/pagina-web-para-abogados" className="font-bold text-primary hover:underline">
            página web para abogados
          </Link>{" "}
          y{" "}
          <Link href="/pagina-web-para-salones-de-belleza" className="font-bold text-primary hover:underline">
            página web para salones de belleza
          </Link>
          .
        </p>
      </section>

      {/* FAQ */}
      <section className="border-t border-line px-4 py-16 sm:px-6 sm:py-[90px] lg:px-8">
        <div className="mx-auto flex max-w-[820px] flex-col gap-9">
          <h2 className="m-0 text-3xl font-black tracking-tight sm:text-[44px]">
            Preguntas frecuentes sobre precios
          </h2>
          <FaqAccordion items={PRECIO_FAQS} />
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqJsonLd(PRECIO_FAQS)) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              buildServicesJsonLd(
                nuestros.map((p) => ({ name: p.name, price: p.price, description: p.description }))
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
            Mira tu web funcionando antes de pagar un peso
          </h2>
          <p className="m-0 max-w-[560px] text-lg leading-[1.6] text-soft">
            No te pedimos que nos creas: te lo mostramos. Cuéntanos de tu negocio hoy y en 24 horas
            recibes tu sitio funcionando con tu marca — gratis y sin compromiso.
          </p>
          <div className="flex flex-wrap justify-center gap-3.5">
            <Link
              href="/demo"
              className="rounded-[10px] bg-primary px-[34px] py-4 text-[17px] font-extrabold text-white transition-[background-color,transform] duration-150 hover:bg-primary-hover active:scale-[0.98]"
            >
              Pide tu demo gratis →
            </Link>
            <a
              href={waHref}
              {...(site.whatsapp ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="rounded-[10px] border-[1.5px] border-line px-[34px] py-4 text-[17px] font-bold text-foreground transition-[border-color,transform] duration-150 hover:border-soft active:scale-[0.98]"
            >
              Pedir la guía en PDF
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
