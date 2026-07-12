export const site = {
  name: "HarayaDev",
  legalName: "COMERCIAL HECTOR ALFONSO ARAYA CASTILLO E.I.R.L.",
  personName: "Hector Araya C.",
  tagline: "Desarrollo web y soluciones con IA para pymes chilenas",
  description:
    "HarayaDev: empresa chilena de desarrollo web e IA. Sitios web con IA para pymes, desarrollo a medida, implementaciones y mantención. Fundada y liderada por Hector Araya C.",
  billingNote: "Emitimos factura y boleta de honorarios.",
  locale: "es-CL",
  email: "harayadev@gmail.com",
  // No se hardcodea en el repo: se define como env var (WHATSAPP_NUMBER) por proyecto Vercel.
  whatsapp: process.env.WHATSAPP_NUMBER ?? "",
  github: "https://github.com/harayaEcomsur",
};
