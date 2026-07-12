export interface Project {
  slug: string;
  title: string;
  client: string;
  summary: string;
  stack: string[];
  role: string;
  highlights: string[];
  links?: {
    repo?: string;
    live?: { url: string; label: string };
  };
}

export const projects: Project[] = [
  {
    slug: "dz-building",
    title: "D&Z Building — sitio web + panel de administración (en producción)",
    client: "D&Z Building (climatización y refrigeración, Chile)",
    summary:
      "Sitio público más panel de administración completo para una empresa chilena de climatización y refrigeración: generación de cotizaciones, membretes e informes, firma de email y kit de marca, con persistencia real en base de datos.",
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4", "Neon (PostgreSQL serverless)", "Resend", "JWT (jose)"],
    role: "Diseño, desarrollo full stack y branding (extracción de imagotipo y kit de marca)",
    highlights: [
      "Sitio público con formulario de contacto vía Resend",
      "Panel admin con autenticación por sesión (JWT)",
      "Editores de cotización, membrete e informe con auto-guardado",
      "Firma de email y kit de marca (imagotipo, tarjeta, propuestas) entregado al cliente",
      "Persistencia en Neon Postgres, deploy en Vercel",
    ],
    links: {
      repo: "https://github.com/harayaEcomsur/dyzbuilding",
      live: { url: "https://www.dyzbuilding.cl", label: "Ver en producción" },
    },
  },
  {
    slug: "demo-franquicias",
    title: "Asesor gastronómico con IA para franquicias (demo)",
    client: "Herramienta de venta propia (demo para reuniones comerciales)",
    summary:
      "Demo funcional de un asistente con IA que responde preguntas de franquiciados usando la base de conocimiento de la marca, editable en vivo durante la misma reunión para demostrar el concepto en minutos.",
    stack: ["Next.js 14", "Google Gemini API"],
    role: "Concepto, diseño y desarrollo full stack",
    highlights: [
      "Vista franquiciado: preguntas sobre operación respondidas solo con el contenido cargado, citando la fuente",
      "Vista franquiciador: edita la base de conocimiento y el asistente responde con la info actualizada al instante",
      "Pensado como herramienta de venta: demuestra el concepto completo en una reunión de 5 minutos",
    ],
    links: {
      repo: "https://github.com/harayaEcomsur/demo-franquicias",
      live: { url: "https://demo-franquicias-2.vercel.app", label: "Ver demo" },
    },
  },
];
