import { z } from "zod";

export const hourSchema = z.object({
  day: z.string(),
  open: z.string().optional(),
  close: z.string().optional(),
  closed: z.boolean().optional(),
});

export const socialSchema = z.object({
  platform: z.enum(["instagram", "facebook", "tiktok", "linkedin", "x", "youtube", "other"]),
  url: z.string().url(),
  label: z.string().optional(),
});

export const clientConfigSchema = z.object({
  meta: z.object({
    slug: z.string(),
    businessName: z.string(),
    // Texto libre: cada cliente es de un rubro distinto (restaurante, veterinaria,
    // estudio jurídico, ferretería, etc.) — no lo limitamos a una lista fija.
    rubro: z.string(),
    locale: z.string().default("es-CL"),
  }),

  branding: z.object({
    logoUrl: z.string(),
    faviconUrl: z.string().optional(),
    palette: z.object({
      primary: z.string(),
      accent: z.string(),
      background: z.string(),
      foreground: z.string().default("#111111"),
    }),
    fontPairing: z.enum(["modern", "elegante", "amigable"]),
    // true cuando el archivo del logo ya trae el nombre del negocio escrito —
    // el header muestra solo el logo, sin repetir el nombre en texto al lado.
    logoIncludesName: z.boolean().default(false),
    // Layout de la home según el rubro, para que no todos los sitios se vean
    // iguales: "clasico" (cards centradas, el original), "inmobiliaria" (hero
    // full-screen con la propiedad como protagonista, estilo corretaje premium)
    // y "corporativo" (banda sobria, áreas numeradas, estilo estudio de
    // abogados/consultora).
    layout: z.enum(["clasico", "inmobiliaria", "corporativo"]).default("clasico"),
  }),

  hero: z.object({
    title: z.string(),
    subtitle: z.string(),
    ctaLabel: z.string(),
    ctaHref: z.string(),
    backgroundImageUrl: z.string().optional(),
  }),

  services: z
    .array(
      z.object({
        // Nombre de cualquier ícono de lucide-react (ej. "UtensilsCrossed", "Scissors",
        // "Scale"). Se resuelve dinámicamente, así que no hay una lista cerrada de íconos.
        icon: z.string(),
        title: z.string(),
        description: z.string(),
        price: z.string().optional(),
      })
    )
    .max(12)
    .default([]),

  about: z.object({
    title: z.string(),
    body: z.string(),
    imageUrl: z.string().optional(),
  }),

  gallery: z.array(z.object({ url: z.string(), alt: z.string() })).max(20).optional(),

  contact: z
    .object({
      phone: z.string().optional(),
      whatsapp: z.string().optional(),
      whatsappPrefilledMessage: z.string().optional(),
      email: z.string().email().optional(),
      address: z.string().optional(),
      mapQuery: z.string().optional(),
      hours: z.array(hourSchema).optional(),
      socials: z.array(socialSchema).optional(),
      extraLinks: z.array(z.object({ label: z.string(), url: z.string() })).optional(),
    })
    .refine((c) => Boolean(c.whatsapp || c.phone || c.email), {
      message: "Debe existir al menos un medio de contacto (whatsapp, phone o email)",
    }),

  modules: z.object({
    contactForm: z.boolean().default(true),
    whatsappButton: z.boolean().default(true),
    testimonials: z.boolean().default(false),
    faq: z.boolean().default(false),
    pricing: z.boolean().default(false),
    chat: z.boolean().default(true),
    // Módulo CMS de propiedades (vertical inmobiliario): páginas /propiedades con
    // búsqueda y filtros, ficha por propiedad con galería y video, y el chat IA
    // respondiendo sobre el inventario. Se activa/desactiva por cliente.
    propiedades: z.boolean().default(false),
  }),

  // Inventario de propiedades (requiere modules.propiedades). En la demo/MVP vive
  // en el config; en producción se administra desde el panel (fase CMS con DB) o
  // vía mantención mensual — el resto del sitio no cambia.
  properties: z
    .array(
      z.object({
        slug: z.string(),
        title: z.string(),
        operation: z.enum(["venta", "arriendo", "arriendo_temporada"]),
        type: z.enum(["casa", "departamento", "oficina", "local", "terreno", "parcela"]),
        comuna: z.string(),
        // Texto libre para soportar UF y CLP: "UF 4.500", "$650.000/mes".
        price: z.string(),
        bedrooms: z.number().optional(),
        bathrooms: z.number().optional(),
        area: z.number().optional(),
        parking: z.number().optional(),
        description: z.string(),
        images: z.array(z.string()).min(1),
        // URL de YouTube (watch o youtu.be); se embebe en la ficha.
        video: z.string().optional(),
        featured: z.boolean().default(false),
      })
    )
    .max(200)
    .optional(),

  // Servicios de sindicación activables por cliente. En la demo se muestran como
  // sello en cada ficha ("se publica también en…"); la integración real (API de
  // MercadoLibre para Portalinmobiliario, Graph API para Instagram, Content
  // Posting API para TikTok) se habilita por cliente en la implementación.
  syndication: z
    .object({
      portalinmobiliario: z.boolean().default(false),
      instagram: z.boolean().default(false),
      tiktok: z.boolean().default(false),
    })
    .optional(),

  testimonials: z
    .array(
      z.object({
        name: z.string(),
        quote: z.string(),
        rating: z.number().min(1).max(5).optional(),
      })
    )
    .optional(),

  faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),

  pricing: z
    .array(
      z.object({
        name: z.string(),
        price: z.string(),
        features: z.array(z.string()),
        highlighted: z.boolean().optional(),
      })
    )
    .optional(),

  chat: z.object({
    businessDescription: z.string(),
    qaPairs: z.array(z.object({ q: z.string(), a: z.string() })).max(40).default([]),
    // gemini-2.5-flash gasta la mayoría del budget de tokens en "thinking" interno antes
    // de responder, truncando respuestas cortas. flash-lite no tiene ese overhead y usa
    // la misma cuota gratuita.
    model: z.string().default("gemini-2.5-flash-lite"),
    maxTokensPerReply: z.number().default(500),
    fallbackToWhatsapp: z.boolean().default(true),
    systemPromptExtra: z.string().optional(),
  }),

  // Variantes de paleta para mostrar al cliente en /variantes ("¿cuál te gusta
  // más: A, B o C?"). Opcional: si no se define, /variantes explica cómo usarlas.
  // `npm run palette -- logo.png` sugiere estas variantes automáticamente.
  themeVariants: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        palette: z.object({
          primary: z.string(),
          accent: z.string(),
          background: z.string(),
          foreground: z.string(),
        }),
      })
    )
    .max(6)
    .optional(),

  seo: z.object({
    title: z.string(),
    description: z.string(),
    ogImageUrl: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    // Subtipo de schema.org (Restaurant, HairSalon, LegalService, Store, etc.)
    businessType: z.string().default("LocalBusiness"),
    priceRange: z.string().optional(),
  }),
});

export type ClientConfig = z.infer<typeof clientConfigSchema>;

export function defineClientConfig(config: z.input<typeof clientConfigSchema>): ClientConfig {
  return clientConfigSchema.parse(config);
}
