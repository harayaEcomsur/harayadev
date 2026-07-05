export interface Plan {
  tag: string;
  highlighted?: boolean;
  name: string;
  description: string;
  price: string;
  delivery: string;
}

export const plans: Plan[] = [
  {
    tag: "PARA PARTIR",
    name: "Landing Express",
    description: "Una página con tu oferta, botón de WhatsApp y asistente IA.",
    price: "$99.990",
    delivery: "72 HORAS",
  },
  {
    tag: "MÁS VENDIDO",
    highlighted: true,
    name: "Bot IA WhatsApp",
    description: "Tu negocio responde solo, 24/7, con la información de tu pyme.",
    price: "$149.990",
    delivery: "72 HORAS",
  },
  {
    tag: "SITIO COMPLETO",
    name: "Web Pyme",
    description: "Sitio de 5 secciones con asistente IA incluido.",
    price: "$249.990",
    delivery: "5 DÍAS",
  },
  {
    tag: "PARA VENDER",
    name: "Tienda Online",
    description: "Catálogo, carrito y pago con Webpay integrado.",
    price: "$449.990",
    delivery: "10 DÍAS",
  },
];
