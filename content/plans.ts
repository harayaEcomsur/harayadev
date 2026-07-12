export interface Plan {
  id: string;
  tag: string;
  highlighted?: boolean;
  name: string;
  description: string;
  longDescription: string;
  includes: string[];
  // Precio fijo en CLP con IVA incluido; los servicios "a cotizar" no lo definen.
  price?: string;
  delivery: string;
  demoHref?: string;
  // Servicios sobre sitios existentes (mantención/mejora): el contrato referencia la
  // cotización aceptada en vez de un precio publicado.
  quoted?: boolean;
}

const STARTER_DEMO_URL = "https://starter-kit-beta-nine.vercel.app";

export const plans: Plan[] = [
  {
    id: "landing",
    tag: "PARA PARTIR",
    name: "Landing Express",
    description: "Una página con tu oferta, botón de WhatsApp y asistente IA.",
    longDescription:
      "Una página potente con tu oferta, fotos, botón de WhatsApp y asistente IA que responde por ti. Ideal para validar tu negocio o dejar de perder los contactos de Marketplace.",
    includes: ["1 página", "Asistente IA", "Botón WhatsApp", "Dominio .cl 1 año", "Optimizada para celular"],
    price: "$99.990",
    delivery: "72 HORAS",
    demoHref: STARTER_DEMO_URL,
  },
  {
    id: "bot",
    tag: "MÁS VENDIDO",
    highlighted: true,
    name: "Bot IA WhatsApp",
    description: "Tu negocio responde solo, 24/7, con la información de tu pyme.",
    longDescription:
      "Tu WhatsApp responde solo, 24/7: stock, horarios, reservas, despachos. Nunca más un cliente sin respuesta a las 3 AM — el bot atiende mientras duermes.",
    includes: [
      "Respuestas 24/7",
      "Entrenado con tu negocio",
      "Deriva a humano",
      "Toma pedidos y reservas",
      "Reportes de conversaciones",
    ],
    price: "$149.990",
    delivery: "72 HORAS",
    demoHref: "/#demo",
  },
  {
    id: "pyme",
    tag: "SITIO COMPLETO",
    name: "Web Pyme",
    description: "Sitio de 5 secciones con asistente IA incluido.",
    longDescription:
      "Sitio de 5 secciones — inicio, servicios, galería, nosotros y contacto — con asistente IA incluido. La presencia completa que tu pyme necesita para competir en serio.",
    includes: ["5 secciones", "Asistente IA", "Formulario + WhatsApp", "Galería de fotos", "Dominio .cl 1 año"],
    price: "$249.990",
    delivery: "5 DÍAS",
    demoHref: STARTER_DEMO_URL,
  },
  {
    id: "tienda",
    tag: "PARA VENDER",
    name: "Tienda Online",
    description: "Catálogo, carrito y pago con Webpay integrado.",
    longDescription:
      "Catálogo, carrito y pago con Webpay integrado (débito, crédito y prepago). Lo que una agencia cobra $650.000+, con precio cerrado y sin letra chica.",
    includes: ["Catálogo de productos", "Carrito de compras", "Pago con Webpay", "Asistente IA", "Gestión de pedidos"],
    price: "$449.990",
    delivery: "10 DÍAS",
  },
];

export const recurringServices: Plan[] = [
  {
    id: "mantencion",
    tag: "PARA TU SITIO",
    name: "Mantención mensual",
    description: "Tu sitio siempre al día: cambios de textos, precios, fotos y soporte.",
    longDescription:
      "Hosting, dominio y sitio siempre al día: cambios de textos, precios, fotos y contenido, actualización del asistente IA cuando tu información cambie, reporte mensual y soporte prioritario. Sin permanencia: se cancela avisando con 30 días.",
    includes: ["Hosting y dominio incluidos", "Cambios de contenido", "Asistente IA actualizado", "Reporte mensual", "Sin permanencia"],
    price: "$29.990/mes",
    delivery: "SERVICIO MENSUAL",
  },
  {
    id: "mejora",
    tag: "SITIO EXISTENTE",
    name: "Mejora de sitio existente",
    description: "Moderniza tu web actual o agrégale asistente IA, sin partir de cero.",
    longDescription:
      "¿Ya tienes web pero se ve antigua, es lenta o no vende? La modernizo, la optimizo o le integro un asistente IA — sin que pierdas tu dominio ni tu contenido. Cotización según el estado del sitio, con precio cerrado igual.",
    includes: ["Diagnóstico gratis", "Rediseño o optimización", "Asistente IA opcional", "Precio cerrado tras cotizar"],
    delivery: "PLAZO SEGÚN COTIZACIÓN",
    quoted: true,
  },
];

export const allContractablePlans: Plan[] = [...plans, ...recurringServices];
