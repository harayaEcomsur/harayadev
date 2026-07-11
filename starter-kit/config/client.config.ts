import { defineClientConfig } from "@/config/schema";

// Demo para B&M Abogados. Los datos de contacto, honorarios y áreas de práctica
// son placeholders razonables del rubro — reemplazar con los datos reales del
// estudio antes de pasar a producción.
export const clientConfig = defineClientConfig({
  meta: {
    slug: "bm-abogados",
    businessName: "B&M Abogados",
    rubro: "Estudio jurídico",
    locale: "es-CL",
  },

  branding: {
    logoUrl: "/clients/bm-abogados/logo.svg",
    faviconUrl: "/clients/bm-abogados/logo.svg",
    palette: {
      primary: "#1C2B4A",
      accent: "#8C1D2F",
      background: "#F8F8F6",
      foreground: "#171A21",
    },
    fontPairing: "elegante",
    layout: "corporativo",
  },

  hero: {
    title: "Asesoría legal clara, sin letra chica",
    subtitle:
      "Estudio jurídico en Santiago especializado en derecho civil, laboral y de familia. Respuestas rápidas, honorarios transparentes y estrategia en cada caso.",
    ctaLabel: "Agenda tu primera consulta",
    ctaHref: "#contacto",
    backgroundImageUrl: "/clients/bm-abogados/hero.jpg",
  },

  services: [
    {
      icon: "Scale",
      title: "Derecho civil",
      description: "Contratos, cobranzas, arriendos, responsabilidad civil e indemnización de perjuicios.",
    },
    {
      icon: "Users",
      title: "Derecho de familia",
      description: "Divorcios, pensión de alimentos, cuidado personal y régimen de visitas.",
    },
    {
      icon: "Briefcase",
      title: "Derecho laboral",
      description: "Despidos injustificados, tutela de derechos, autodespido y negociación de finiquitos.",
    },
    {
      icon: "Building2",
      title: "Derecho inmobiliario",
      description: "Estudios de títulos, promesas de compraventa, escrituración y regularización de propiedades.",
    },
    {
      icon: "FileText",
      title: "Contratos y sociedades",
      description: "Redacción y revisión de contratos comerciales, constitución y modificación de sociedades.",
    },
    {
      icon: "Gavel",
      title: "Litigios",
      description: "Representación judicial en juicios civiles, laborales y de familia, en todas las instancias.",
    },
  ],

  about: {
    title: "Un estudio cercano y directo",
    body: "B&M Abogados nace con una convicción simple: el cliente merece saber siempre en qué está su causa, cuánto va a costar y cuáles son sus opciones reales. Trabajas directo con el abogado a cargo de tu caso — sin intermediarios — con informes de avance periódicos y honorarios acordados por escrito antes de empezar.",
    imageUrl: "/clients/bm-abogados/nosotros.jpg",
  },

  contact: {
    phone: "+56 2 2987 6543",
    whatsapp: "56998765432",
    whatsappPrefilledMessage: "Hola! Vengo del sitio web de B&M Abogados y quiero hacer una consulta",
    email: "contacto@bymabogados.cl",
    address: "Santiago Centro, Región Metropolitana",
    mapQuery: "Santiago Centro, Chile",
    hours: [
      { day: "Lunes a viernes", open: "09:00", close: "18:00" },
      { day: "Sábado y domingo", closed: true },
    ],
    socials: [
      { platform: "linkedin", url: "https://linkedin.com/company/bm-abogados" },
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
    { name: "Marcela V.", quote: "Llevaron mi divorcio con mucha claridad. Siempre supe qué venía en cada etapa y cuánto costaba.", rating: 5 },
    { name: "Rodrigo P.", quote: "Ganamos la demanda por despido injustificado. Comunicación impecable durante todo el juicio.", rating: 5 },
    { name: "Inmobiliaria del Sur", quote: "Nos hacen los estudios de títulos de todas nuestras operaciones. Rápidos y rigurosos.", rating: 5 },
  ],

  faq: [
    { q: "¿La primera consulta tiene costo?", a: "La primera reunión de orientación de 30 minutos es sin costo, presencial o por videollamada. Ahí evaluamos tu caso y te damos opciones concretas con honorarios claros." },
    { q: "¿Cómo se pagan los honorarios?", a: "Siempre por escrito y antes de empezar. Según el caso puede ser un monto fijo, por etapas del juicio, o una parte fija más un porcentaje del resultado." },
    { q: "¿Atienden fuera de Santiago?", a: "Sí. La mayoría de las gestiones y audiencias hoy son electrónicas, así que atendemos causas en todo Chile, con reuniones por videollamada." },
    { q: "¿Cuánto demora un juicio?", a: "Depende del tipo de causa: un divorcio de común acuerdo puede tomar 2 a 3 meses; un juicio laboral, 4 a 8 meses; un juicio civil, más de un año. Te damos una estimación realista en la primera consulta." },
    { q: "¿Puedo saber cómo va mi causa?", a: "Sí, enviamos informes de avance periódicos y puedes escribirnos por WhatsApp — respondemos dentro del día hábil." },
  ],

  pricing: [
    {
      name: "Consulta de orientación",
      price: "Gratis",
      features: ["30 minutos, presencial o videollamada", "Evaluación del caso", "Opciones y honorarios por escrito"],
    },
    {
      name: "Consulta extendida",
      price: "$40.000",
      features: ["1 hora con abogado", "Revisión de documentos", "Informe escrito con recomendaciones"],
      highlighted: true,
    },
    {
      name: "Representación judicial",
      price: "Según el caso",
      features: ["Honorarios por escrito antes de empezar", "Pago por etapas", "Informes de avance periódicos"],
    },
  ],

  chat: {
    businessDescription:
      "B&M Abogados es un estudio jurídico en Santiago de Chile especializado en derecho civil, de familia, laboral e inmobiliario, además de contratos, sociedades y litigios. Atiende causas en todo Chile (tramitación electrónica y videollamadas). Su sello: honorarios transparentes acordados por escrito e informes de avance periódicos.",
    qaPairs: [
      { q: "¿La primera consulta tiene costo?", a: "No, la primera reunión de orientación de 30 minutos es gratuita, presencial o por videollamada." },
      { q: "¿Qué áreas cubren?", a: "Derecho civil, familia (divorcios, alimentos), laboral (despidos, tutela), inmobiliario (estudios de títulos, escrituración), contratos, sociedades y litigios." },
      { q: "¿Cuánto cuesta una consulta extendida?", a: "$40.000 por una hora con abogado, con revisión de documentos e informe escrito con recomendaciones." },
      { q: "¿Cómo se pagan los honorarios de un juicio?", a: "Se acuerdan por escrito antes de empezar: monto fijo, pago por etapas, o una parte fija más porcentaje del resultado, según el caso." },
      { q: "¿Atienden fuera de Santiago?", a: "Sí, atienden causas en todo Chile: la tramitación judicial es electrónica y las reuniones pueden ser por videollamada." },
      { q: "¿Cuál es el horario de atención?", a: "Lunes a viernes de 9:00 a 18:00. Por WhatsApp responden dentro del día hábil." },
      { q: "¿Cuánto demora un divorcio?", a: "De común acuerdo, entre 2 y 3 meses aproximadamente. Contencioso, bastante más — en la primera consulta dan una estimación realista para cada caso." },
    ],
    fallbackToWhatsapp: true,
  },

  seo: {
    title: "B&M Abogados — Estudio jurídico en Santiago",
    description:
      "Abogados en derecho civil, familia, laboral e inmobiliario. Primera consulta gratis, honorarios por escrito y atención en todo Chile.",
    businessType: "LegalService",
    priceRange: "$$",
    keywords: ["abogados santiago", "abogado de familia", "abogado laboral", "estudio de títulos", "divorcio chile"],
  },
});
