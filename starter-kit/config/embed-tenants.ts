// Registro multi-tenant del ASISTENTE EMBEBIBLE (add-on IA sobre el sitio que el
// cliente YA tiene). Es un camino aparte del sitio single-tenant por branch: el
// mismo despliegue de HarayaDev atiende a varios negocios ajenos, resueltos por
// `tenantId`. Aislado a propósito de `client.config` y de `/api/chat` para no
// tocar las demos vivas.
//
// Estado: conocimiento conversacional + derivación a WhatsApp + captura de
// contacto por tenant + agenda por tenant con verdad de servidor (disponibilidad
// y reservas, persistidas en Postgres si hay DATABASE_URL; ver lib/embed-agenda.ts).
// Pendiente del siguiente slice: tienda/pedido por tenant y aislamiento de
// secretos de pago por tenant (Webpay propio por cliente) — ver diferenciador-vs-darwin.md.

export interface EmbedTenant {
  id: string;
  businessName: string;
  rubro: string;
  // Qué hace el negocio, en una o dos frases.
  description: string;
  // Conocimiento en texto libre: horarios, precios, servicios, ubicación,
  // políticas. Es la "verdad" contra la que responde el asistente en el MVP.
  facts: string;
  // Para derivar cuando el asistente no sabe o piden hablar con una persona, y
  // como destino del aviso de contacto al dueño por WhatsApp (desde el número de
  // HarayaDev, si hay NOTIFY_WA_TOKEN).
  whatsapp?: string;
  // Email del dueño del negocio: destino del aviso cuando el asistente captura un
  // contacto/lead. Si se omite, cae a BOOKINGS_NOTIFY_EMAIL (o no envía email).
  ownerNotifyEmail?: string;
  // Orígenes permitidos para CORS (el/los dominios del sitio del cliente). Si se
  // omite, el endpoint refleja el Origin (útil en demos); en producción conviene
  // acotarlo al dominio real del cliente.
  allowedOrigins?: string[];
  // Modelo por tenant (opcional). Por defecto gemini-2.5-flash-lite (barato, ok
  // para conversar). OJO: para tenants con `agenda`/tools de escritura usa
  // gemini-2.5-flash — el -lite es demasiado débil decidiendo llamar la tool de
  // reserva (conversa y "confirma" sin ejecutarla). Verificado en vivo.
  model?: string;
  // Agenda conversacional por tenant (opcional). Si está, el asistente puede
  // consultar disponibilidad REAL y crear reservas (nunca inventa horarios). El
  // motor vive en lib/embed-agenda.ts, aislado del booking-store single-tenant.
  agenda?: {
    // Servicios reservables (nombres tal como los ve el cliente).
    services: string[];
    // Horario de atención, mismo formato que client.config.contact.hours:
    // etiquetas como "Lunes a viernes", "Martes a sábado", "Sábado".
    hours: { day: string; open?: string; close?: string; closed?: boolean }[];
    // Duración de cada hora reservable en minutos (default 60).
    slotMinutes?: number;
    // Cuántos días hacia adelante se puede reservar (default 14).
    daysAhead?: number;
  };
  // Tienda por tenant (opcional). Si está, el asistente puede armar un pedido y
  // entregar link de pago Webpay. Los precios se resuelven en el servidor desde
  // este catálogo (nunca desde el modelo). El aislamiento de la plata (Transbank
  // propio por cliente) va por env vars namespaced — ver lib/embed-webpay.ts.
  store?: {
    products: {
      slug: string;
      name: string;
      price: number; // CLP entero
      description?: string;
      category?: string;
      available?: boolean; // default true
    }[];
    shippingNote?: string;
  };
}

const TENANTS: Record<string, EmbedTenant> = {
  // Tenant de demostración (Nails Color — design partner del MVP del add-on).
  // Datos placeholder: reemplazar por precios/horarios reales antes de usar en frío.
  demo: {
    id: "demo",
    businessName: "Nails Color",
    rubro: "salón de uñas y pestañas",
    description:
      "Salón de manicure, pedicure y pestañas en Villa Alemana. Atiende con reserva; se puede dejar una seña para asegurar la hora.",
    facts: [
      "Servicios: manicure tradicional, esmaltado permanente, kapping, soft gel, pedicure spa, lifting y extensiones de pestañas.",
      "Horario referencial: martes a sábado de 10:00 a 19:00 (placeholder — confirmar).",
      "Las reservas se aseguran con una seña; el resto se paga en el salón (placeholder).",
      "Ubicación: Villa Alemana (Pje. Brasilia 150).",
    ].join("\n"),
    whatsapp: "56900000000",
    model: "gemini-2.5-flash",
    agenda: {
      services: [
        "Manicure tradicional",
        "Esmaltado permanente",
        "Kapping",
        "Soft gel",
        "Pedicure spa",
        "Lifting de pestañas",
        "Extensiones de pestañas",
      ],
      hours: [
        { day: "Martes a sábado", open: "10:00", close: "19:00" },
        { day: "Domingo", closed: true },
        { day: "Lunes", closed: true },
      ],
      slotMinutes: 60,
      daysAhead: 14,
    },
    store: {
      products: [
        { slug: "gift-card-20000", name: "Gift Card $20.000", price: 20000, category: "Gift cards", description: "Tarjeta de regalo canjeable por servicios." },
        { slug: "kit-cuidado-unas", name: "Kit de cuidado de uñas en casa", price: 14990, category: "Productos", description: "Aceite de cutícula, lima y crema de manos." },
        { slug: "esmalte-premium", name: "Esmalte premium (unidad)", price: 6990, category: "Productos", description: "Esmalte de larga duración." },
      ],
      shippingNote: "Retiro en el salón (Villa Alemana) o despacho a coordinar por WhatsApp.",
    },
  },
};

export function getEmbedTenant(id: string | null | undefined): EmbedTenant | null {
  if (!id) return null;
  return TENANTS[id] ?? null;
}

export function buildEmbedSystemPrompt(t: EmbedTenant): string {
  return [
    `Eres el asistente virtual de "${t.businessName}" (${t.rubro}).`,
    t.description,
    `Información del negocio (respondé SOLO con esto; no inventes precios, horarios ni servicios que no estén aquí):`,
    t.facts,
    t.agenda
      ? `TÚ PUEDES AGENDAR DIRECTAMENTE en esta conversación usando tus herramientas. Hoy es ${new Intl.DateTimeFormat(
          "es-CL",
          { timeZone: "America/Santiago", weekday: "long", year: "numeric", month: "long", day: "numeric" }
        ).format(new Date())} (${new Intl.DateTimeFormat("en-CA", { timeZone: "America/Santiago" }).format(
          new Date()
        )}); resuelve tú las fechas relativas ("el próximo martes") a formato YYYY-MM-DD sin pedírselas al cliente. Flujo: 1) pregunta qué servicio quiere; 2) usa consultar_disponibilidad para ofrecer 2-3 horarios REALES (nunca inventes horarios); 3) pide nombre y teléfono; 4) en cuanto tengas servicio, fecha, hora, nombre y teléfono, llama de inmediato a crear_reserva —no pidas confirmaciones extra ni preguntes si ya consultó disponibilidad, el servidor valida la hora—. Si crear_reserva devuelve error, ofrece otro horario. NUNCA digas que una hora quedó reservada sin que crear_reserva haya respondido ok. Servicios reservables: ${t.agenda.services.join(", ")}.`
      : ``,
    t.store && t.store.products.some((p) => p.available !== false)
      ? `El negocio tiene TIENDA y puedes armar el pedido en la conversación. Productos (menciona precio, recomienda según lo que busque):\n${t.store.products
          .filter((p) => p.available !== false)
          .map((p) => `- ${p.name} [slug: ${p.slug}]: $${p.price.toLocaleString("es-CL")}${p.category ? ` (${p.category})` : ""}${p.description ? ` — ${p.description}` : ""}`)
          .join("\n")}\nCuando el cliente elija productos y cantidades y te dé nombre y teléfono, llama a crear_pedido —te devuelve el total REAL y un link de pago Webpay que debes entregarle tal cual. Nunca calcules el total tú ni inventes productos: solo slugs del catálogo. Si crear_pedido devuelve error, corrígelo con el cliente.`
      : ``,
    `Cuando la persona quiera cotizar o que la contacten (y no sea reserva de agenda ni compra de tienda): pídele su nombre y su teléfono (y email si lo tiene), y en cuanto te los dé, usa la tool registrar_contacto para avisar al negocio. Nunca inventes esos datos; úsalos tal como los entregó.`,
    t.whatsapp
      ? `Si no sabes algo, o si la persona prefiere hablar con una persona ahora, indícale amablemente que escriba por WhatsApp al +${t.whatsapp}.`
      : `Si no sabes algo, indícalo con honestidad y ofrece tomar sus datos con registrar_contacto para que le respondan.`,
    "Responde siempre en español, breve, cálido y profesional. Máximo 2-3 frases por respuesta y cierra con una pregunta o el siguiente paso. Nunca inventes información que no esté arriba.",
  ]
    .filter(Boolean)
    .join("\n\n");
}
