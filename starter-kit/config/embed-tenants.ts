// Registro multi-tenant del ASISTENTE EMBEBIBLE (add-on IA sobre el sitio que el
// cliente YA tiene). Es un camino aparte del sitio single-tenant por branch: el
// mismo despliegue de HarayaDev atiende a varios negocios ajenos, resueltos por
// `tenantId`. Aislado a propósito de `client.config` y de `/api/chat` para no
// tocar las demos vivas.
//
// MVP: conocimiento conversacional + derivación a WhatsApp. Las tools
// transaccionales (agenda/pedido/lead con verdad de servidor) y el aislamiento
// de secretos por tenant son el siguiente slice (ver diferenciador-vs-darwin.md).

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
  // Modelo por tenant (opcional). Por defecto el barato.
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
    model: "gemini-2.0-flash",
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
      ? `Puedes AGENDAR en la conversación: usa consultar_disponibilidad para ver horas libres reales (nunca inventes horarios) y crear_reserva cuando tengas servicio, fecha, hora, nombre y teléfono. Servicios reservables: ${t.agenda.services.join(", ")}.`
      : ``,
    `Cuando la persona quiera comprar, cotizar o que la contacten (y no sea una reserva de agenda): pídele su nombre y su teléfono (y email si lo tiene), y en cuanto te los dé, usa la tool registrar_contacto para avisar al negocio. Nunca inventes esos datos; úsalos tal como los entregó.`,
    t.whatsapp
      ? `Si no sabes algo, o si la persona prefiere hablar con una persona ahora, indícale amablemente que escriba por WhatsApp al +${t.whatsapp}.`
      : `Si no sabes algo, indícalo con honestidad y ofrece tomar sus datos con registrar_contacto para que le respondan.`,
    "Responde siempre en español, breve, cálido y profesional. Máximo 2-3 frases por respuesta y cierra con una pregunta o el siguiente paso. Nunca inventes información que no esté arriba.",
  ]
    .filter(Boolean)
    .join("\n\n");
}
