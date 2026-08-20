import { defineClientConfig } from "@/config/schema";

export const clientConfig = defineClientConfig({
  meta: {
    slug: "sb-barberia-studio",
    businessName: "SB Barbería Studio",
    rubro: "Barbería y estética masculina",
    locale: "es-CL",
  },

  branding: {
    logoUrl: "/clients/sb-barberia-studio/logo.png",
    faviconUrl: "/clients/sb-barberia-studio/logo.png",
    palette: {
      primary: "#1A1A1A",
      accent: "#C9A227",
      background: "#F7F5F2",
      foreground: "#171412",
    },
    fontPairing: "elegante",
    layout: "clasico",
  },

  hero: {
    title: "Preocupados por tu imagen",
    subtitle: "Cortes, asesoría de estilo y afeitado en Achupalla, Viña del Mar. Reserva tu hora en minutos.",
    ctaLabel: "Reservar hora",
    ctaHref: "#contacto",
    backgroundImageUrl: "/clients/barberia-don-manuel/hero.jpg",
  },

  services: [
    { icon: "Scissors", title: "Corte SB Studio", description: "Corte a tijera y máquina. Incluye lavado, asesoría de estilo y un bebestible de cortesía.", price: "Consulta valor" },
    { icon: "Sparkles", title: "Corte + limpieza de cejas", description: "Todo lo del Corte SB Studio, más limpieza de cejas.", price: "Consulta valor" },
  ],

  about: {
    title: "Calidad, asesoría y estilo",
    body: "SB Barbería Studio, en Achupalla (Viña del Mar), le pone foco a tu imagen: cada corte incluye lavado, asesoría de estilo y un bebestible de cortesía, con la opción de sumar limpieza de cejas. Todos los martes, 10% de descuento en el servicio.",
    imageUrl: "/clients/barberia-don-manuel/nosotros.jpg",
  },

  gallery: [
    { url: "/clients/barberia-don-manuel/galeria-1.jpg", alt: "Corte terminado" },
    { url: "/clients/barberia-don-manuel/galeria-2.jpg", alt: "Interior de la barbería" },
    { url: "/clients/barberia-don-manuel/galeria-3.jpg", alt: "Atención en el sillón" },
  ],

  contact: {
    phone: "+56 9 8765 4321",
    whatsapp: "56987654321",
    whatsappPrefilledMessage: "Hola! Quiero reservar hora en SB Barbería Studio",
    email: "reservas@sbbarberiastudio.cl",
    address: "Elicura 145, Achupalla, Viña del Mar",
    mapQuery: "Elicura 145, Achupalla, Viña del Mar, Chile",
    hours: [
      { day: "Martes a viernes", open: "10:00", close: "20:00" },
      { day: "Sábado", open: "09:00", close: "18:00" },
      { day: "Lunes y domingo", closed: true },
    ],
    socials: [
      { platform: "instagram", url: "https://instagram.com/sb_salooon" },
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
      "Para confirmar tu hora pedimos un abono, que se descuenta del servicio. Puedes pagarlo al tiro con tarjeta.",
    depositAmount: 5000,
  },

  testimonials: [
    { name: "Cliente frecuente", quote: "Me gusta que el corte venga con asesoría, no solo llegan y cortan.", rating: 5 },
    { name: "Cliente nuevo", quote: "Buena onda, ambiente cómodo y quedé conforme con el resultado.", rating: 5 },
  ],

  faq: [
    { q: "¿Necesito reservar hora?", a: "Se recomienda reservar por WhatsApp, aunque también atendemos por orden de llegada según disponibilidad." },
    { q: "¿Qué incluye el corte?", a: "Todo corte incluye lavado, asesoría de estilo y un bebestible de cortesía. La limpieza de cejas es opcional." },
    { q: "¿Tienen promociones?", a: "Sí: con la membresía, cada 5 cortes obtienes 1 gratis (o cada 10, según el plan). Además, todos los martes hay 10% de descuento en tu servicio." },
    { q: "¿Aceptan tarjeta?", a: "Sí, débito y crédito." },
  ],

  pricing: [
    {
      name: "Corte SB Studio",
      price: "Consulta valor",
      features: ["Corte a tijera y máquina", "Lavado incluido", "Asesoría de estilo", "Bebestible de cortesía"],
    },
    {
      name: "Corte + limpieza de cejas",
      price: "Consulta valor",
      features: ["Todo lo del corte SB Studio", "Limpieza de cejas"],
      highlighted: true,
    },
    {
      name: "Membresía SB Studio",
      price: "Acumulable",
      features: ["5 cortes → 1 corte gratis", "10 cortes → 1 corte gratis", "Martes: 10% dto. en tu servicio"],
    },
  ],

  chat: {
    businessDescription: "SB Barbería Studio es una barbería en Achupalla, Viña del Mar, enfocada en la imagen del cliente: cada corte incluye lavado, asesoría de estilo y un bebestible de cortesía, con limpieza de cejas opcional. Tienen membresía por cortes acumulados y descuento los martes.",
    qaPairs: [
      { q: "¿Cuál es el horario?", a: "Martes a viernes de 10:00 a 20:00, sábado de 9:00 a 18:00. Cerrado lunes y domingo." },
      { q: "¿Qué incluye un corte?", a: "Lavado, asesoría de estilo y un bebestible de cortesía. La limpieza de cejas es opcional." },
      { q: "¿Tienen descuentos?", a: "Todos los martes hay 10% de descuento en tu servicio, y con la membresía cada 5 o 10 cortes obtienes 1 gratis." },
      { q: "¿Cómo reservo hora?", a: "Puedes reservar directamente por WhatsApp o desde la agenda del sitio, indicando el día y horario de tu preferencia." },
      { q: "¿Dónde están ubicados?", a: "En Elicura 145, Achupalla, Viña del Mar." },
    ],
    fallbackToWhatsapp: true,
  },

  themeVariants: [
    { id: "a", name: "Fiel al logo", palette: { primary: "#1A1A1A", accent: "#C9A227", background: "#F7F5F2", foreground: "#171412" } },
    { id: "b", name: "Acento protagonista", palette: { primary: "#C9A227", accent: "#1A1A1A", background: "#FFFDF8", foreground: "#171412" } },
    { id: "c", name: "Modo oscuro", palette: { primary: "#C9A227", accent: "#8A7126", background: "#14110D", foreground: "#F4EFE6" } },
  ],

  seo: {
    title: "SB Barbería Studio — Barbería en Viña del Mar",
    description: "Barbería en Achupalla, Viña del Mar. Cortes con lavado, asesoría de estilo y bebestible de cortesía. Reserva tu hora por WhatsApp o agenda online.",
    businessType: "HairSalon",
    priceRange: "$$",
    keywords: ["barberia viña del mar", "barberia achupalla", "corte de pelo hombre viña del mar"],
  },
});
