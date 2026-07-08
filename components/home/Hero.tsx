import Link from "next/link";
import { site } from "@/lib/site";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { PhoneMockup } from "./PhoneMockup";

export function Hero() {
  const demoHref = site.whatsapp
    ? buildWhatsAppLink(site.whatsapp, "Hola! Quiero pedir mi demo gratis")
    : "/contacto";

  return (
    <header className="relative overflow-hidden px-4 pb-16 pt-14 sm:pb-[110px] sm:pt-24 sm:px-6 lg:px-8">
      <div
        className="pointer-events-none absolute -right-[200px] -top-[100px] h-[900px] w-[900px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(255,61,61,0.14), transparent 62%)" }}
      />
      <div className="relative mx-auto flex max-w-6xl items-center gap-[72px]">
        <div className="flex flex-1 flex-col items-start gap-7">
          <span className="font-mono text-sm tracking-[0.14em] text-primary">
            {site.personName.toUpperCase()} · {site.name.toUpperCase()}
          </span>
          <h1 className="m-0 text-4xl font-black leading-[1.02] tracking-tight sm:text-[58px]">{site.tagline}</h1>
          <p className="m-0 max-w-[500px] text-xl leading-[1.55] text-soft">
            Desde sitios y paneles administrativos a medida hasta un producto propio: webs con chat IA
            para tu pyme, entregadas en horas, no semanas.
          </p>
          <div className="flex flex-wrap gap-3.5">
            <a
              href={demoHref}
              {...(site.whatsapp ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="rounded-[10px] bg-primary px-[30px] py-4 text-[17px] font-extrabold text-white transition-colors hover:bg-primary-hover"
            >
              Pide tu demo gratis →
            </a>
            <Link
              href="/servicios"
              className="rounded-[10px] border-[1.5px] border-line px-[30px] py-4 text-[17px] font-bold text-foreground transition-colors hover:border-soft"
            >
              Ver planes y precios
            </Link>
          </div>
          <div className="flex flex-wrap gap-7 font-mono text-[13px] tracking-[0.06em] text-soft">
            <span>✓ PRECIO CERRADO</span>
            <span>✓ DEMO ANTES DE PAGAR</span>
            <span>✓ IVA INCLUIDO</span>
          </div>
        </div>
        <div className="hidden lg:block">
          <PhoneMockup />
        </div>
      </div>
    </header>
  );
}
