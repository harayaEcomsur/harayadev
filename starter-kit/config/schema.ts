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
  }),

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
    model: z.string().default("gemini-2.5-flash"),
    maxTokensPerReply: z.number().default(300),
    fallbackToWhatsapp: z.boolean().default(true),
    systemPromptExtra: z.string().optional(),
  }),

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
