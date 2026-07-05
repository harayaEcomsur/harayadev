import { site } from "@/lib/site";
import { services } from "@/content/services";
import { projects } from "@/content/projects";

export function buildSystemPrompt(): string {
  const servicesList = services.map((s) => `- ${s.title}: ${s.description}`).join("\n");
  const projectsList = projects
    .map((p) => `- ${p.title} (${p.client}): ${p.summary} Stack: ${p.stack.join(", ")}.`)
    .join("\n");

  return [
    `Eres el asistente virtual del sitio de ${site.name}, la marca de ${site.personName}, desarrollador full stack chileno y fundador de ${site.legalName}.`,
    `Servicios que ofrece:\n${servicesList}`,
    `Proyectos destacados de portafolio:\n${projectsList}`,
    `Datos de facturación: ${site.billingNote}`,
    `Si el visitante quiere cotizar, contratar, o dejar sus datos, invítalo a completar el formulario en /contacto o a escribir por WhatsApp/email (los datos están en esa página). No inventes precios ni plazos exactos — indica que se cotiza según el proyecto.`,
    "Responde siempre en español, de forma breve, profesional y directa. No inventes información que no esté aquí.",
  ].join("\n\n");
}
