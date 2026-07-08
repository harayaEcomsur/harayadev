const STEPS = [
  {
    step: "PASO 01",
    title: "Demo gratis",
    description:
      "Me cuentas de tu negocio por WhatsApp y en 24 horas te muestro una demo funcionando con tu marca. Sin compromiso.",
  },
  {
    step: "PASO 02",
    title: "Apruebas y pagas",
    description:
      "Si la demo te convence, pagas el precio cerrado del plan. Ni un peso más: el precio incluye IVA, dominio y puesta en marcha.",
  },
  {
    step: "PASO 03",
    title: "Entrega en 72 horas",
    description:
      "Tu web queda publicada, con el asistente IA entrenado con la información de tu negocio y listo para atender clientes.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-t border-line bg-card px-4 py-16 sm:py-[90px] sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-11">
        <h2 className="m-0 text-3xl font-black tracking-tight sm:text-[44px]">Cómo funciona</h2>
        <div className="grid gap-[18px] sm:grid-cols-3">
          {STEPS.map((item) => (
            <div key={item.step} className="flex flex-col gap-3.5 rounded-[14px] border border-line bg-background p-8 pb-7">
              <span className="font-mono text-sm tracking-[0.12em] text-primary">{item.step}</span>
              <span className="text-2xl font-extrabold">{item.title}</span>
              <span className="text-base leading-[1.55] text-soft">{item.description}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
