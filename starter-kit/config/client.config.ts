import { defineClientConfig } from "@/config/schema";

export const clientConfig = defineClientConfig({
  meta: {
    slug: "sb-barberia-studio",
    businessName: "SB Barbería Studio",
    rubro: "barbería",
    locale: "es-CL",
  },

  branding: {
    logoUrl: "/clients/sb-barberia-studio/logo.png",
    faviconUrl: "/clients/sb-barberia-studio/logo.png",
    palette: {
      primary: "#547E7E",
      accent: "#EEDDDD",
      background: "#F9FBFB",
      foreground: "#172626",
    },
    fontPairing: "elegante",
    layout: "clasico",
  },

  hero: {
    title: "Estilo clásico, técnica moderna",
    subtitle: "Cortes, barba y afeitado tradicional en Ñuñoa. Reserva tu hora en minutos.",
    ctaLabel: "Reservar hora",
    ctaHref: "#contacto",
    backgroundImageUrl: "/clients/barberia-don-manuel/hero.jpg",
  },

  services: [
    { icon: "Scissors", title: "Corte clásico", description: "Corte a tijera y máquina, incluye lavado.", price: "$9.000" },
    { icon: "Sparkles", title: "Afeitado tradicional", description: "Afeitado a navaja con toalla caliente.", price: "$7.000" },
    { icon: "Wrench", title: "Arreglo de barba", description: "Perfilado y diseño de barba a tu estilo.", price: "$6.000" },
    { icon: "Star", title: "Combo corte + barba", description: "Nuestro servicio más pedido.", price: "$14.000" },
    { icon: "Award", title: "Membresía mensual", description: "4 cortes al mes con precio preferencial.", price: "$29.990/mes" },
  ],

  about: {
    title: "Tradición barbera desde 2015",
    body: "Don Manuel aprendió el oficio de su padre y hoy lidera un equipo de 4 barberos en el corazón de Ñuñoa. Ambiente relajado, buena música y atención de primera.",
    imageUrl: "/clients/barberia-don-manuel/nosotros.jpg",
  },

  gallery: [
    { url: "/clients/barberia-don-manuel/galeria-1.jpg", alt: "Corte clásico terminado" },
    { url: "/clients/barberia-don-manuel/galeria-2.jpg", alt: "Interior de la barbería" },
    { url: "/clients/barberia-don-manuel/galeria-3.jpg", alt: "Afeitado a navaja" },
  ],

  contact: {
    phone: "+56 9 8765 4321",
    whatsapp: "56987654321",
    whatsappPrefilledMessage: "Hola! Quiero reservar hora en SB Barbería Studio",
    email: "reservas@barberiadonmanuel.cl",
    address: "Elicura 145, Achupalla, Viña del Mar",
    mapQuery: "Elicura 145, Achupalla, Viña del Mar, Chile",
    hours: [
      { day: "Martes a viernes", open: "10:00", close: "20:00" },
      { day: "Sábado", open: "09:00", close: "18:00" },
      { day: "Lunes y domingo", closed: true },
    ],
    socials: [
      { platform: "instagram", url: "https://instagram.com/barberiadonmanuel" },
    ],
  },

  modules: {
    contactForm: true,
    whatsappButton: true,
    testimonials: true,
    faq: true,
    pricing: true,
    chat: true,
    agenda: true,
  },

  booking: {
    slotMinutes: 45,
    daysAhead: 14,
    depositNote:
      "Para confirmar tu hora pedimos un abono de $5.000, que se descuenta del servicio. Puedes pagarlo al tiro con tarjeta.",
    depositAmount: 5000,
  },

  testimonials: [
    { name: "Francisco T.", quote: "Llevo 3 años yendo, nunca me han dejado mal.", rating: 5 },
    { name: "Ignacio P.", quote: "El mejor afeitado tradicional que he probado en Santiago.", rating: 5 },
  ],

  faq: [
    { q: "¿Necesito reservar hora?", a: "Se recomienda reservar por WhatsApp, aunque también atendemos por orden de llegada según disponibilidad." },
    { q: "¿Atienden niños?", a: "Sí, tenemos precio especial para menores de 12 años." },
    { q: "¿Aceptan tarjeta?", a: "Sí, débito y crédito." },
  ],

  pricing: [
    {
      name: "Corte simple",
      price: "$9.000",
      features: ["Corte a tijera y máquina", "Lavado incluido"],
    },
    {
      name: "Combo completo",
      price: "$14.000",
      features: ["Corte", "Arreglo de barba", "Toalla caliente"],
      highlighted: true,
    },
    {
      name: "Membresía mensual",
      price: "$29.990/mes",
      features: ["4 cortes al mes", "Prioridad de agenda", "10% dto. en productos"],
    },
  ],

  chat: {
    businessDescription: "SB Barbería Studio es una barbería tradicional en Ñuñoa, Santiago, con más de 8 años de trayectoria y 4 barberos.",
    qaPairs: [
      { q: "¿Cuál es el horario?", a: "Martes a viernes de 10:00 a 20:00, sábado de 9:00 a 18:00. Cerrado lunes y domingo." },
      { q: "¿Cuánto cuesta un corte?", a: "El corte clásico cuesta $9.000, y el combo corte + barba $14.000." },
      { q: "¿Cómo reservo hora?", a: "Puedes reservar directamente por WhatsApp indicando el día y horario de tu preferencia." },
      { q: "¿Dónde están ubicados?", a: "En Irarrázaval 3456, Ñuñoa, Santiago." },
    ],
    fallbackToWhatsapp: true,
  },

  themeVariants: [
    { id: "a", name: "Fiel al logo", palette: { primary: "#547E7E", accent: "#EEDDDD", background: "#F9FBFB", foreground: "#172626" } },
    { id: "b", name: "Acento protagonista", palette: { primary: "#AF6060", accent: "#547E7E", background: "#FBF9F9", foreground: "#172626" } },
    { id: "c", name: "Modo oscuro", palette: { primary: "#2C8383", accent: "#EEDDDD", background: "#122121", foreground: "#F4F2EF" } },
  ],

  seo: {
    title: "SB Barbería Studio — Barbería",
    description: "Barbería tradicional en Ñuñoa. Cortes clásicos, afeitado a navaja y arreglo de barba. Reserva tu hora por WhatsApp.",
    businessType: "HairSalon",
    priceRange: "$$",
    keywords: ["barberia ñuñoa", "corte de pelo hombre", "afeitado tradicional santiago"],
  },
});

