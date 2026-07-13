import { defineClientConfig } from "@/config/schema";

// Demo para Nails Color (prospecto — motion de demos). Datos desde su Instagram
// público (@nailscolor.va): bio, dirección y rubro reales. Teléfono, horarios y
// PRECIOS son placeholders típicos del rubro — VERIFICAR antes de publicar.
export const clientConfig = defineClientConfig({
  meta: {
    slug: "nails-color",
    businessName: "Nails Color",
    rubro: "Salón de uñas y pestañas",
    locale: "es-CL",
  },

  branding: {
    // Logo real (foto de perfil de su Instagram); paleta curada desde el logo:
    // rosa del script como primario, menta del esmalte como acento.
    logoUrl: "/clients/nails-color/logo.jpg",
    faviconUrl: "/clients/nails-color/logo.jpg",
    logoIncludesName: true,
    palette: {
      primary: "#C13A6B",
      accent: "#0FA98E",
      background: "#FDF7F9",
      foreground: "#2B1B22",
    },
    fontPairing: "amigable",
  },

  hero: {
    title: "Tus uñas y pestañas, como te las imaginaste",
    subtitle:
      "Esmaltado permanente, uñas esculpidas y extensiones de pestañas en Villa Alemana. Agenda tu hora y llega a relajarte: del diseño nos encargamos nosotras.",
    ctaLabel: "Agendar mi hora",
    ctaHref: "#contacto",
    backgroundImageUrl: "/clients/nails-color/hero.jpg",
  },

  services: [
    {
      icon: "Sparkles",
      title: "Esmaltado permanente",
      description: "Color impecable por semanas, con terminación de salón y el diseño que quieras.",
      price: "desde $14.000",
    },
    {
      icon: "Gem",
      title: "Uñas esculpidas (acrílicas / polygel)",
      description: "Largo y forma a tu medida, naturales o con nail art — duración y estructura profesional.",
      price: "desde $25.000",
    },
    {
      icon: "Hand",
      title: "Manicure tradicional",
      description: "Limado, cutículas y esmaltado clásico: manos cuidadas para el día a día.",
      price: "desde $10.000",
    },
    {
      icon: "Footprints",
      title: "Pedicure completa",
      description: "Pedicure spa con esmaltado: pies renovados, suaves y con color perfecto.",
      price: "desde $18.000",
    },
    {
      icon: "Eye",
      title: "Extensiones de pestañas",
      description: "Clásicas pelo a pelo o con volumen: mirada lista al despertar, sin rímel.",
      price: "desde $22.000",
    },
    {
      icon: "Wand2",
      title: "Lifting de pestañas",
      description: "Curvatura y elevación de tus pestañas naturales, con efecto de hasta 8 semanas.",
      price: "desde $15.000",
    },
  ],

  about: {
    title: "Un espacio pensado para ti",
    body: "Nails Color es un salón de uñas y pestañas en Villa Alemana. Trabajamos con productos de calidad, esterilización de herramientas en cada atención y dedicación real por el detalle — porque unas uñas bonitas se notan, pero unas uñas bien hechas se notan más. Agenda tu hora y date el gusto.",
    imageUrl: "/clients/nails-color/nosotros.jpg",
  },

  gallery: [
    { url: "/clients/nails-color/hero.jpg", alt: "Diseño de uñas rojas con nail art" },
    { url: "/clients/nails-color/galeria-1.jpg", alt: "Manicure profesional en el salón" },
    { url: "/clients/nails-color/galeria-2.jpg", alt: "Pedicure spa" },
    { url: "/clients/nails-color/galeria-3.jpg", alt: "Tratamiento de pestañas y rostro" },
  ],

  contact: {
    phone: "+56 9 •••• ••••",
    address: "Pasaje Brasilia 150, Villa Alemana",
    mapQuery: "Pasaje Brasilia 150, Villa Alemana, Chile",
    hours: [
      { day: "Lunes a viernes", open: "10:00", close: "19:00" },
      { day: "Sábado", open: "10:00", close: "14:00" },
      { day: "Domingo", closed: true },
    ],
    socials: [{ platform: "instagram", url: "https://www.instagram.com/nailscolor.va/" }],
    extraLinks: [{ label: "Agenda tu hora por Instagram", url: "https://www.instagram.com/nailscolor.va/" }],
  },

  modules: {
    contactForm: false,
    whatsappButton: false,
    testimonials: false,
    faq: true,
    pricing: false,
    chat: true,
  },

  faq: [
    { q: "¿Cómo agendo una hora?", a: "Por Instagram (@nailscolor.va) — escríbenos por DM con el servicio que quieres y coordinamos día y hora." },
    { q: "¿Dónde están ubicadas?", a: "En Pasaje Brasilia 150, Villa Alemana. Te enviamos la referencia exacta al confirmar tu hora." },
    { q: "¿Cuánto dura el esmaltado permanente?", a: "Entre 3 y 4 semanas con el cuidado adecuado. Te damos los tips al terminar tu atención." },
    { q: "¿Las extensiones de pestañas dañan las pestañas naturales?", a: "No, aplicadas correctamente no las dañan: usamos técnica pelo a pelo respetando tu pestaña natural, con mantenciones cada 3 semanas." },
    { q: "¿Atienden sin hora previa?", a: "Trabajamos solo con agenda para dedicarle a cada clienta el tiempo que merece — escríbenos y buscamos el horario que te acomode." },
  ],

  chat: {
    businessDescription:
      "Nails Color es un salón de uñas y pestañas en Villa Alemana (Pasaje Brasilia 150, V Región, Chile). Servicios: esmaltado permanente, uñas esculpidas acrílicas y polygel, manicure tradicional, pedicure completa, extensiones de pestañas clásicas y con volumen, y lifting de pestañas. Se atiende solo con hora agendada. Las horas se agendan por Instagram @nailscolor.va.",
    qaPairs: [
      { q: "¿Cómo agendo?", a: "Por Instagram: escribe un DM a @nailscolor.va con el servicio que quieres y te confirman día y hora." },
      { q: "¿Cuánto cuesta el esmaltado permanente?", a: "Desde $14.000 — el valor exacto depende del diseño. Confirma el detalle al agendar por Instagram." },
      { q: "¿Cuánto cuestan las uñas acrílicas?", a: "Las uñas esculpidas (acrílicas o polygel) van desde $25.000 según largo y diseño." },
      { q: "¿Dónde están?", a: "Pasaje Brasilia 150, Villa Alemana. Al confirmar tu hora te envían la referencia exacta." },
      { q: "¿Qué horario tienen?", a: "Lunes a viernes de 10:00 a 19:00 y sábados de 10:00 a 14:00, siempre con hora agendada." },
      { q: "¿Hacen pestañas?", a: "Sí: extensiones clásicas pelo a pelo o con volumen (desde $22.000) y lifting de pestañas naturales (desde $15.000)." },
    ],
    fallbackToWhatsapp: false,
    systemPromptExtra:
      "Si no sabes la respuesta o la clienta quiere agendar, deriva siempre a Instagram: que escriba un DM a @nailscolor.va. Los precios son referenciales ('desde') — el valor final se confirma al agendar.",
  },

  seo: {
    title: "Nails Color — Uñas y pestañas en Villa Alemana",
    description:
      "Salón de uñas y pestañas en Villa Alemana: esmaltado permanente, uñas esculpidas, manicure, pedicure y extensiones de pestañas. Agenda tu hora.",
    businessType: "NailSalon",
    priceRange: "$",
    keywords: ["uñas villa alemana", "esmaltado permanente villa alemana", "pestañas villa alemana", "manicure villa alemana"],
  },
});
