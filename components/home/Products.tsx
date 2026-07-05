import Link from "next/link";
import { plans } from "@/content/plans";

export function Products() {
  return (
    <section className="border-t border-line px-4 py-[90px] sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-11">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-3">
            <span className="font-mono text-sm tracking-[0.14em] text-primary">
              EL PRODUCTO · TU WEB CON IA EN 72 HORAS
            </span>
            <h2 className="m-0 text-3xl font-black tracking-tight sm:text-[44px]">Algunos productos</h2>
          </div>
          <Link href="/servicios" className="text-base font-bold text-primary">
            Ver el detalle de cada plan →
          </Link>
        </div>
        <div className="grid gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <Link
              key={plan.name}
              href="/servicios"
              className={`flex flex-col gap-3.5 rounded-[14px] border bg-card p-[30px] pb-7 text-foreground transition-all hover:-translate-y-[3px] hover:border-primary ${
                plan.highlighted ? "border-primary" : "border-line"
              }`}
            >
              <span
                className={`font-mono text-[13px] tracking-[0.12em] ${plan.highlighted ? "text-primary" : "text-soft"}`}
              >
                {plan.tag}
              </span>
              <span className="text-2xl font-extrabold tracking-tight">{plan.name}</span>
              <span className="flex-1 text-[15px] leading-[1.5] text-soft">{plan.description}</span>
              <span className="flex flex-col gap-[3px]">
                <span className="text-[34px] font-black tracking-tight">{plan.price}</span>
                <span className="font-mono text-[11px] tracking-[0.1em] text-soft/60">
                  IVA INCLUIDO · {plan.delivery}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
