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

// Planes verticales: paquetes por rubro sobre el plan base, con precio "desde"
// (el precio final se cierra en la cotización según módulos y tamaño del catálogo).
export const verticalPlans: Plan[] = [
  {
    id: "inmobiliaria",
    tag: "VERTICAL · CORREDORAS E INMOBILIARIAS",
    name: "Plan Inmobiliaria",
    description: "Tu cartera de propiedades con buscador, fichas y un asistente IA que la vende por ti.",
    longDescription:
      "Sitio completo más un CMS de propiedades: buscador con filtros (operación, comuna, tipo, dormitorios), ficha por propiedad con galería y video, y el asistente IA respondiendo por tu cartera 24/7. Ampliable con sindicación automática a Portalinmobiliario y publicación en redes.",
    includes: [
      "CMS de propiedades con buscador",
      "Fichas con galería y video",
      "Chat IA que conoce tu cartera",
      "WhatsApp por propiedad",
      "Sindicación a portales (opcional)",
    ],
    price: "desde $349.990",
    delivery: "7 DÍAS",
    quoted: true,
  },
];

// Módulos activables sobre cualquier plan — la misma tecnología sirve para
// distintos rubros: propiedades, carta de restaurante, catálogo de productos,
// vehículos, servicios de clínica, etc.
export interface Addon {
  icon: string;
  name: string;
  priceFrom: string;
  description: string;
}

export const addons: Addon[] = [
  {
    icon: "LayoutGrid",
    name: "Catálogo dinámico",
    priceFrom: "desde $149.990",
    description:
      "Tu contenido como inventario vivo: propiedades, carta de restaurante, productos, vehículos o servicios — con buscador, filtros y ficha por ítem. Autoadministrable o administrado por nosotros.",
  },
  {
    icon: "Share2",
    name: "Publicación automática en redes",
    priceFrom: "desde $79.990",
    description:
      "Cada ítem nuevo de tu catálogo (plato, producto, propiedad, promoción) se publica solo en tu Instagram — feed y stories — sin que nadie del negocio toque el teléfono.",
  },
  {
    icon: "Globe",
    name: "Sindicación a portales y marketplaces",
    priceFrom: "desde $99.990",
    description:
      "Publica una vez en tu sitio y se sincroniza automático donde ya te buscan: Portalinmobiliario (propiedades), MercadoLibre (productos), Chileautos (vehículos). Se acabó la doble digitación.",
  },
  {
    icon: "DatabaseZap",
    name: "Mantención con inventario",
    priceFrom: "desde $49.990/mes",
    description:
      "La mantención estándar más la administración de tu catálogo: subimos, actualizamos y damos de baja ítems por ti, con la sindicación y las redes siempre al día.",
  },
];

export const allContractablePlans: Plan[] = [...plans, ...recurringServices, ...verticalPlans];
