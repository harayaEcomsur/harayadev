export interface Service {
  icon: string;
  title: string;
  description: string;
}

export const services: Service[] = [
  {
    icon: "Sparkles",
    title: "Sitios web con IA para pymes",
    description:
      "El producto: un starter kit config-driven que permite generar una demo personalizada en menos de 30 minutos y entregar el sitio final —con chat IA incluido— en menos de 4 horas de trabajo.",
  },
  {
    icon: "Code2",
    title: "Desarrollo web a medida",
    description:
      "Sitios y aplicaciones a medida con Next.js/React y TypeScript, de la landing más simple a plataformas con lógica de negocio propia.",
  },
  {
    icon: "MessageSquare",
    title: "Integraciones y asistentes con IA",
    description:
      "Chats y asistentes con base de conocimiento propia (Anthropic Claude, Google Gemini): desde demos comerciales hasta soporte de primer nivel en producción.",
  },
  {
    icon: "FileStack",
    title: "Paneles de administración y automatización de documentos",
    description:
      "Paneles con autenticación, generación de cotizaciones/informes/documentos y persistencia real en base de datos — como el panel construido para D&Z Building.",
  },
  {
    icon: "ShoppingCart",
    title: "E-commerce (VTEX IO)",
    description:
      "Migración de VTEX Legacy a VTEX IO, portales B2B y micro-frontends de checkout/cuenta, con foco en performance y conversión — experiencia en operaciones de gran escala (Cencosud/EASY.cl).",
  },
];
