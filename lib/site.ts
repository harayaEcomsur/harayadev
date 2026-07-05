export const site = {
  name: "HarayaDev",
  legalName: "COMERCIAL HECTOR ALFONSO ARAYA EIRL",
  personName: "Hector Araya C.",
  tagline: "Desarrollo web y soluciones con IA para empresas y pymes chilenas.",
  description:
    "Desarrollo web full stack, integraciones con IA y sitios web con IA para pymes chilenas. Panel de proyectos, servicios y contacto de Hector Araya C. / HarayaDev.",
  billingNote: "Emitimos factura y boleta de honorarios.",
  locale: "es-CL",
  email: "harayadev@gmail.com",
  // No se hardcodea en el repo: se define como env var (WHATSAPP_NUMBER) por proyecto Vercel.
  whatsapp: process.env.WHATSAPP_NUMBER ?? "",
  github: "https://github.com/harayaEcomsur",
};
