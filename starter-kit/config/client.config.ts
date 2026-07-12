import { defineClientConfig } from "@/config/schema";

// Demo para Vasca Propiedades (prospecto — motion de demos). Datos de contacto,
// dirección y fotos tomados de su presencia pública (sitio UENI + directorios);
// verificar todo con el cliente antes de publicar. Comisiones = valores típicos
// del rubro, NO confirmados con Vasca.
export const clientConfig = defineClientConfig({
  meta: {
    slug: "vasca-propiedades",
    businessName: "Vasca Propiedades",
    rubro: "Compra-venta, arriendo y administración de propiedades",
    locale: "es-CL",
  },

  branding: {
    // Logo real (rojo Vasca); paleta extraída con npm run palette y curada a mano
    // (acento negro — la marca es rojo/blanco/negro).
    logoUrl: "/clients/vasca-propiedades/logo.jpg",
    faviconUrl: "/clients/vasca-propiedades/logo.jpg",
    palette: {
      primary: "#DD2222",
      accent: "#1E1E1E",
      background: "#FBF9F9",
      foreground: "#231A1A",
    },
    fontPairing: "elegante",
    logoIncludesName: true,
    layout: "inmobiliaria",
  },

  hero: {
    title: "Más de 20 años arrendando y vendiendo en la costa",
    subtitle:
      "Compra-venta, arriendo residencial y turístico, y administración de propiedades en Viña del Mar, Reñaca y Concón. Trato directo y conocimiento real del barrio.",
    ctaLabel: "Conversemos por WhatsApp",
    ctaHref: "#contacto",
    backgroundImageUrl: "/clients/vasca-propiedades/hero.jpg",
  },

  services: [
    {
      icon: "Home",
      title: "Venta de propiedades",
      description: "Tasación, publicación, visitas y negociación hasta la firma — con el respaldo de dos décadas en la zona.",
    },
    {
      icon: "KeyRound",
      title: "Arriendo residencial",
      description: "Búsqueda y evaluación de arrendatarios con informe comercial y contrato al día.",
    },
    {
      icon: "CalendarDays",
      title: "Arriendo turístico",
      description: "Departamentos de temporada en Viña, Reñaca y Concón: publicación, reservas, entrega y recepción.",
    },
    {
      icon: "Building2",
      title: "Administración de propiedades",
      description: "Nos encargamos de todo: cobros, mantenciones, coordinación con arrendatarios y rendición mensual.",
    },
    {
      icon: "TrendingUp",
      title: "Tasación y estudio de mercado",
      description: "Valorización realista según el mercado actual de la comuna y ventas comparables.",
    },
    {
      icon: "Users",
      title: "Asesoría a compradores",
      description: "Te acompañamos a las visitas, revisamos la documentación y negociamos el mejor precio por ti.",
    },
  ],

  about: {
    title: "Dos décadas en la costa",
    body: "Vasca Propiedades es una corredora con más de 20 años de trayectoria en Viña del Mar, Reñaca y Concón. Gestionamos arriendos residenciales y turísticos, compra-venta y administración de propiedades, con un sello simple: trato cercano, conocimiento real del barrio y todo por escrito.",
    imageUrl: "/clients/vasca-propiedades/nosotros.jpg",
  },

  gallery: [
    { url: "/clients/vasca-propiedades/galeria-1.jpg", alt: "Departamento en Viña del Mar" },
    { url: "/clients/vasca-propiedades/galeria-2.jpg", alt: "Vista al mar desde Reñaca" },
    { url: "/clients/vasca-propiedades/galeria-3.jpg", alt: "Living comedor de casa moderna" },
  ],

  contact: {
    phone: "+56 9 3174 6767",
    whatsapp: "56931746767",
    whatsappPrefilledMessage: "Hola! Vi el sitio de Vasca Propiedades y quiero consultar por una propiedad",
    email: "info@vascapropiedades.cl",
    address: "Miramar 50, Viña del Mar",
    mapQuery: "Miramar 50, Viña del Mar, Chile",
    hours: [
      { day: "Lunes a viernes", open: "09:30", close: "18:30" },
      { day: "Sábado", open: "10:00", close: "13:30" },
      { day: "Domingo", closed: true },
    ],
  },

  modules: {
    contactForm: true,
    whatsappButton: true,
    testimonials: false,
    faq: true,
    pricing: false,
    chat: true,
  },

  faq: [
    { q: "¿En qué zonas trabajan?", a: "Nuestra especialidad es el borde costero: Viña del Mar, Reñaca y Concón, donde llevamos más de 20 años corretajeando y administrando propiedades." },
    { q: "¿Hacen arriendos por temporada?", a: "Sí — es una de nuestras especialidades. Administramos departamentos de temporada en Viña, Reñaca y Concón: publicación, reservas, entrega y recepción." },
    { q: "¿Qué incluye la administración de propiedades?", a: "Cobro de arriendos, coordinación de mantenciones y reparaciones, relación con los arrendatarios y rendición mensual. Tú recibes tu arriendo sin preocuparte de nada." },
    { q: "¿Cómo publico mi propiedad con ustedes?", a: "Escríbenos por WhatsApp o el formulario. Coordinamos una visita, tasamos y publicamos con fotos profesionales — solo cobramos si el negocio se concreta." },
    { q: "¿Atienden fuera de horario de oficina?", a: "Las visitas a propiedades se coordinan según tu disponibilidad, incluidos fines de semana con cita previa." },
  ],

  chat: {
    businessDescription:
      "Vasca Propiedades es una corredora de propiedades con más de 20 años de trayectoria en Viña del Mar, Reñaca y Concón (V Región, Chile). Servicios: compra-venta de propiedades, arriendo residencial, arriendo turístico/de temporada, administración de propiedades, tasación y asesoría a compradores. Oficina en Miramar 50, Viña del Mar. Su sello es el trato cercano y el conocimiento profundo del borde costero.",
    qaPairs: [
      { q: "¿En qué zonas trabajan?", a: "Viña del Mar, Reñaca y Concón principalmente — más de 20 años en el borde costero de la V Región." },
      { q: "¿Hacen arriendos por temporada?", a: "Sí, es una especialidad de la casa: administración completa de departamentos de temporada (publicación, reservas, entrega y recepción)." },
      { q: "¿Qué incluye la administración de propiedades?", a: "Cobro de arriendos, mantenciones, relación con arrendatarios y rendición mensual al propietario." },
      { q: "¿Cómo puedo publicar mi propiedad?", a: "Por WhatsApp al +56 9 3174 6767 o el formulario de contacto: se coordina visita, tasación y publicación. Solo se cobra si el negocio se concreta." },
      { q: "¿Dónde están ubicados?", a: "Miramar 50, Viña del Mar. Atienden lunes a viernes de 9:30 a 18:30 y sábados de 10:00 a 13:30." },
      { q: "¿Cuánto cobran de comisión?", a: "Las condiciones se conversan directamente según el servicio (venta, arriendo o administración) — escríbeles por WhatsApp y te responden al tiro." },
    ],
    fallbackToWhatsapp: true,
  },

  seo: {
    title: "Vasca Propiedades — Corredora en Viña del Mar, Reñaca y Concón",
    description:
      "Más de 20 años en el borde costero: compra-venta, arriendo residencial y turístico, y administración de propiedades en Viña del Mar, Reñaca y Concón.",
    businessType: "RealEstateAgent",
    priceRange: "$$",
    keywords: ["corredora de propiedades viña del mar", "arriendo reñaca", "arriendos temporada concón", "administración de propiedades viña del mar"],
  },
});
