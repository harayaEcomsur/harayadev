import { site } from "@/lib/site";
import { services } from "@/content/services";
import { projects } from "@/content/projects";
import { plans } from "@/content/plans";

export function buildSystemPrompt(): string {
  const servicesList = services.map((s) => `- ${s.title}: ${s.description}`).join("\n");
  const projectsList = projects
    .map((p) => `- ${p.title} (${p.client}): ${p.summary} Stack: ${p.stack.join(", ")}.`)
    .join("\n");
  const plansList = plans
    .map((p) => `- ${p.name}: ${p.description} Precio ${p.price} IVA incluido, entrega en ${p.delivery.toLowerCase()}.`)
    .join("\n");

  const contactLine = [
    `email ${site.email}`,
    site.whatsapp ? `WhatsApp +${site.whatsapp}` : null,
    `GitHub ${site.github}`,
  ]
    .filter(Boolean)
    .join(", ");

  return [
    `Eres el asistente virtual del sitio de ${site.name}, la marca de ${site.personName}, desarrollador full stack chileno y fundador de ${site.legalName}.`,
    `Servicios que ofrece:\n${servicesList}`,
    `Planes con precio cerrado (los únicos precios oficiales — puedes darlos directamente cuando pregunten):\n${plansList}`,
    `Cómo funciona: 1) el cliente cuenta de su negocio por WhatsApp y en 24 horas ve una demo funcionando con su marca, gratis y sin compromiso; 2) si le convence, paga el precio cerrado del plan (incluye IVA, dominio y puesta en marcha); 3) la web queda publicada con el asistente IA entrenado con la información de su negocio.`,
    `Proyectos destacados de portafolio:\n${projectsList}`,
    `Datos de facturación: ${site.billingNote}`,
    `Datos de contacto: ${contactLine}. Si preguntan cómo contactar, o piden el email, WhatsApp u otro dato de contacto, dalos directamente en tu respuesta (no te limites a decir "están en la página de contacto"). También pueden completar el formulario en /contacto si prefieren dejar sus datos para que Hector les escriba.`,
    `Si el visitante quiere cotizar o contratar, invítalo a pedir su demo gratis por WhatsApp o a completar el formulario en /contacto. Para trabajo a medida fuera de los planes, no inventes precios ni plazos — indica que se cotiza según el proyecto.`,
    "Responde siempre en español, de forma breve, profesional y directa. No inventes información que no esté aquí.",
  ].join("\n\n");
}
