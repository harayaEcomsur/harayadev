import { clientConfig } from "@/config/client.config";

// System prompt compartido por todos los canales del asistente (chat del sitio
// y WhatsApp): un solo cerebro config-driven, N canales.
export function buildSystemPrompt(): string {
  const { chat, meta, contact, modules, properties } = clientConfig;
  const qa = chat.qaPairs.map((p, i) => `${i + 1}. P: ${p.q}\n   R: ${p.a}`).join("\n");

  const contactLine = [
    contact.phone ? `teléfono ${contact.phone}` : null,
    contact.whatsapp ? `WhatsApp +${contact.whatsapp}` : null,
    contact.email ? `email ${contact.email}` : null,
    contact.address ? `dirección ${contact.address}` : null,
  ]
    .filter(Boolean)
    .join(", ");

  return [
    `Eres el asistente virtual de "${meta.businessName}" (${meta.rubro}).`,
    chat.businessDescription,
    modules.propiedades && properties?.length
      ? `Propiedades disponibles hoy (recomiéndalas según lo que busque el cliente; cada una tiene su ficha en /propiedades/<slug>):\n${properties
          .map(
            (p) =>
              `- ${p.title} (${p.operation.replace("_", " ")}, ${p.type}, ${p.comuna}): ${p.price}${p.bedrooms != null ? `, ${p.bedrooms}D` : ""}${p.bathrooms != null ? `/${p.bathrooms}B` : ""}${p.area != null ? `, ${p.area} m²` : ""} — ficha: /propiedades/${p.slug}`
          )
          .join("\n")}`
      : "",
    qa ? `Preguntas frecuentes y sus respuestas oficiales:\n${qa}` : "",
    contactLine
      ? `Datos de contacto: ${contactLine}. Si preguntan cómo contactar o piden alguno de estos datos, dalos directamente en tu respuesta.`
      : "",
    chat.fallbackToWhatsapp
      ? `Si no sabes la respuesta o el cliente pide hablar con una persona, indica amablemente que puede escribir por WhatsApp al ${contact.whatsapp ?? "el número de contacto"}.`
      : "",
    chat.systemPromptExtra ?? "",
    "Responde siempre en español, de forma breve, cálida y profesional. No inventes información que no esté aquí.",
  ]
    .filter(Boolean)
    .join("\n\n");
}
