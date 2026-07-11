import { defineClientConfig } from "@/config/schema";

// Demo para Propiedades Rossana Angulo. Los datos de contacto, comisiones y
// trayectoria son placeholders razonables del rubro — reemplazar con los datos
// reales de la clienta antes de pasar a producción.
export const clientConfig = defineClientConfig({
  meta: {
    slug: "propiedades-rossana-angulo",
    businessName: "Propiedades Rossana Angulo",
    rubro: "Corretaje de propiedades",
    locale: "es-CL",
  },

  branding: {
    logoUrl: "/clients/propiedades-rossana-angulo/logo.svg",
    faviconUrl: "/clients/propiedades-rossana-angulo/logo.svg",
    palette: {
      primary: "#1E3A5F",
      accent: "#C9A24B",
      background: "#FAF9F7",
      foreground: "#16202C",
    },
    fontPairing: "elegante",
  },

  hero: {
    title: "Tu próxima propiedad, con asesoría de verdad",
    subtitle:
      "Compra, venta y arriendo de propiedades en Santiago con acompañamiento personal en todo el proceso: desde la tasación hasta la entrega de llaves.",
    ctaLabel: "Agenda una visita",
    ctaHref: "#contacto",
    backgroundImageUrl: "/clients/propiedades-rossana-angulo/hero.jpg",
  },

  services: [
    {
      icon: "Home",
      title: "Venta de propiedades",
      description: "Publicación en los principales portales, difusión activa y gestión de visitas hasta el cierre del negocio.",
    },
    {
      icon: "KeyRound",
      title: "Arriendo",
      description: "Búsqueda y evaluación de arrendatarios con informe comercial, contrato de arriendo y acta de entrega.",
    },
    {
      icon: "TrendingUp",
      title: "Tasación y estudio de mercado",
      description: "Valorización realista de tu propiedad según ventas comparables y el mercado actual de la comuna.",
    },
    {
      icon: "FileCheck",
      title: "Estudio de títulos y escrituración",
      description: "Coordinación con abogados, banco y notaría para que el cierre sea sin sorpresas.",
    },
    {
      icon: "Camera",
      title: "Marketing inmobiliario",
      description: "Fotografía profesional, ficha destacada y difusión en portales y redes para vender más rápido.",
    },
    {
      icon: "Users",
      title: "Asesoría a compradores",
      description: "Te acompaño a las visitas, reviso la documentación y negocio el mejor precio por ti.",
    },
  ],

  about: {
    title: "Quién te asesora",
    body: "Rossana Angulo es corredora de propiedades con años de experiencia en la Región Metropolitana. Su sello es el acompañamiento personal en cada etapa del proceso — tasación, publicación, visitas, negociación y firma — con comunicación clara, sin letra chica y siempre con contrato por escrito.",
    imageUrl: "/clients/propiedades-rossana-angulo/nosotros.jpg",
  },

  gallery: [
    { url: "/clients/propiedades-rossana-angulo/galeria-1.jpg", alt: "Casa en venta con antejardín" },
    { url: "/clients/propiedades-rossana-angulo/galeria-2.jpg", alt: "Living comedor de casa moderna" },
    { url: "/clients/propiedades-rossana-angulo/galeria-3.jpg", alt: "Departamento amoblado en arriendo" },
    { url: "/clients/propiedades-rossana-angulo/galeria-4.jpg", alt: "Fachada de casas mediterráneas" },
  ],

  contact: {
    phone: "+56 9 8765 4321",
    whatsapp: "56987654321",
    whatsappPrefilledMessage: "Hola Rossana! Vi tu sitio web y quiero consultar por una propiedad",
    email: "contacto@propiedadesrossanaangulo.cl",
    address: "Providencia, Santiago",
    mapQuery: "Providencia, Santiago, Chile",
    hours: [
      { day: "Lunes a viernes", open: "09:30", close: "19:00" },
      { day: "Sábado", open: "10:00", close: "14:00" },
      { day: "Domingo", closed: true },
    ],
    socials: [
      { platform: "instagram", url: "https://instagram.com/propiedadesrossanaangulo" },
    ],
  },

  modules: {
    contactForm: true,
    whatsappButton: true,
    testimonials: true,
    faq: true,
    pricing: true,
    chat: true,
  },

  testimonials: [
    { name: "Familia Contreras", quote: "Rossana vendió nuestro departamento en cinco semanas y nos acompañó hasta la firma en notaría.", rating: 5 },
    { name: "Jorge M.", quote: "Me consiguió arrendatario en una semana, con informe comercial y contrato claro. Cero problemas desde entonces.", rating: 5 },
    { name: "Carolina R.", quote: "Como compradora primeriza, me explicó cada paso del crédito y la escritura. Se agradece la paciencia.", rating: 5 },
  ],

  faq: [
    { q: "¿Cuánto cobra por vender mi propiedad?", a: "La comisión de venta es el 2% + IVA del valor de la propiedad, y se paga solo si el negocio se concreta. Incluye tasación, publicación, visitas y acompañamiento hasta la firma." },
    { q: "¿Y por arrendar?", a: "El equivalente al 50% + IVA del primer mes de arriendo, que incluye evaluación del arrendatario con informe comercial y contrato de arriendo." },
    { q: "¿Cuánto demora venderse una propiedad?", a: "Depende del sector y del precio, pero una propiedad bien tasada y con buenas fotos se vende en general entre 2 y 4 meses." },
    { q: "¿Qué documentos necesito para vender?", a: "Escritura, certificado de dominio vigente, certificado de hipotecas y gravámenes, y contribuciones al día. Te ayudo a reunirlos todos." },
    { q: "¿Trabajas con compradores con crédito hipotecario?", a: "Sí, la mayoría de las ventas son con crédito. Coordino directamente con el banco y la notaría los plazos de la operación." },
    { q: "¿En qué comunas trabajas?", a: "Principalmente en Providencia, Ñuñoa, Las Condes, La Reina y Santiago Centro, pero evalúo propiedades en toda la Región Metropolitana." },
  ],

  pricing: [
    {
      name: "Venta",
      price: "2% + IVA",
      features: ["Tasación y estudio de mercado", "Fotografía y publicación en portales", "Gestión de visitas y negociación", "Acompañamiento hasta la firma"],
      highlighted: true,
    },
    {
      name: "Arriendo",
      price: "50% + IVA del primer mes",
      features: ["Evaluación con informe comercial", "Contrato de arriendo", "Acta de entrega de la propiedad"],
    },
    {
      name: "Solo tasación",
      price: "$60.000",
      features: ["Informe de valorización escrito", "Comparables del sector", "Se descuenta si luego vendes conmigo"],
    },
  ],

  chat: {
    businessDescription:
      "Propiedades Rossana Angulo es una corredora de propiedades independiente en Santiago de Chile. Ofrece venta, arriendo, tasación, estudio de títulos, marketing inmobiliario y asesoría a compradores, principalmente en Providencia, Ñuñoa, Las Condes, La Reina y Santiago Centro. Atiende con acompañamiento personal en todo el proceso.",
    qaPairs: [
      { q: "¿Cuánto cobra por vender una propiedad?", a: "2% + IVA del valor de venta, solo si el negocio se concreta. Incluye tasación, publicación, visitas y acompañamiento hasta la firma." },
      { q: "¿Cuánto cobra por arrendar?", a: "El 50% + IVA del primer mes de arriendo, con informe comercial del arrendatario y contrato incluido." },
      { q: "¿Hace tasaciones?", a: "Sí, la tasación con informe escrito cuesta $60.000 y se descuenta de la comisión si luego vendes con ella." },
      { q: "¿En qué comunas trabaja?", a: "Providencia, Ñuñoa, Las Condes, La Reina y Santiago Centro principalmente, y evalúa propiedades en toda la Región Metropolitana." },
      { q: "¿Cuál es el horario de atención?", a: "Lunes a viernes de 9:30 a 19:00 y sábados de 10:00 a 14:00. Las visitas se coordinan según disponibilidad." },
      { q: "¿Cómo agendo una visita?", a: "Por WhatsApp o el formulario de contacto de esta página, indicando la propiedad o el tipo de propiedad que buscas." },
      { q: "¿Trabaja con crédito hipotecario?", a: "Sí, coordina directamente con el banco y la notaría los plazos de la operación." },
    ],
    fallbackToWhatsapp: true,
  },

  seo: {
    title: "Propiedades Rossana Angulo — Corretaje de propiedades en Santiago",
    description:
      "Venta, arriendo y tasación de propiedades en Providencia, Ñuñoa, Las Condes y Santiago. Asesoría personal de principio a fin, con contrato claro.",
    businessType: "RealEstateAgent",
    priceRange: "$$",
    keywords: ["corredora de propiedades santiago", "venta de propiedades providencia", "arriendo ñuñoa", "tasación de propiedades"],
  },
});
