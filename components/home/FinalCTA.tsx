import Link from "next/link";
import { site } from "@/lib/site";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden border-t border-line px-4 py-16 sm:py-[110px] sm:px-6 lg:px-8">
      <div
        className="pointer-events-none absolute -top-[300px] left-1/2 h-[800px] w-[1000px] -translate-x-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(255,61,61,0.13), transparent 62%)" }}
      />
      <div className="relative mx-auto flex max-w-[760px] flex-col items-center gap-[26px] text-center">
        <h2 className="m-0 text-4xl font-black leading-[1.02] tracking-tight sm:text-[56px]">
          Pide tu demo gratis hoy
        </h2>
        <p className="m-0 text-[19px] leading-[1.6] text-soft">
          En 24 horas ves tu web funcionando con tu marca. Si no te gusta, no pagas nada.
        </p>
        <div className="flex flex-wrap justify-center gap-3.5">
          {site.whatsapp && (
            <a
              href={buildWhatsAppLink(site.whatsapp, "Hola! Quiero pedir mi demo gratis")}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[10px] bg-primary px-[30px] py-4 text-[17px] font-extrabold text-white transition-[background-color,transform] duration-150 hover:bg-primary-hover active:scale-[0.98]"
            >
              Escríbeme por WhatsApp
            </a>
          )}
          <Link
            href="/contacto"
            className="rounded-[10px] border-[1.5px] border-line px-[30px] py-4 text-[17px] font-bold text-foreground transition-[border-color,transform] duration-150 hover:border-soft active:scale-[0.98]"
          >
            Formulario de contacto
          </Link>
        </div>
      </div>
    </section>
  );
}
