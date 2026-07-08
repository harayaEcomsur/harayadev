import Link from "next/link";

const CARDS = [
  {
    href: "/servicios",
    tag: "A MEDIDA",
    title: "Desarrollo web full stack",
    description:
      "Sitios, paneles administrativos y sistemas construidos de punta a punta con Next.js, Node y PostgreSQL.",
    cta: "Ver servicios →",
  },
  {
    href: "/servicios",
    tag: "INTEGRACIONES",
    title: "Soluciones con IA",
    description:
      "Asistentes que responden clientes, agendan horas y toman pedidos, integrados a tu web o WhatsApp.",
    cta: "Ver servicios →",
  },
  {
    href: "/proyectos",
    tag: "CASOS REALES",
    title: "Proyectos construidos",
    description:
      "Sitios, paneles de administración y demos con IA construidos de punta a punta. Míralos funcionando.",
    cta: "Ver proyectos →",
  },
];

export function Capabilities() {
  return (
    <section className="border-t border-line px-4 py-16 sm:py-[90px] sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-11">
        <h2 className="m-0 text-3xl font-black tracking-tight sm:text-[44px]">Qué puedo hacer por tu negocio</h2>
        <div className="grid gap-[18px] sm:grid-cols-3">
          {CARDS.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="flex flex-col gap-3.5 rounded-[14px] border border-line bg-card p-8 pb-7 text-foreground transition-colors hover:border-primary"
            >
              <span className="font-mono text-[13px] tracking-[0.12em] text-primary">{card.tag}</span>
              <span className="text-2xl font-extrabold">{card.title}</span>
              <span className="flex-1 text-base leading-[1.55] text-soft">{card.description}</span>
              <span className="text-[15px] font-bold text-primary">{card.cta}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
