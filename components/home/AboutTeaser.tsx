import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

export function AboutTeaser() {
  return (
    <section className="border-t border-line bg-card px-4 py-16 sm:py-[90px] sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 lg:flex-row lg:gap-14">
        <div className="relative h-[320px] w-[280px] shrink-0 overflow-hidden rounded-2xl border border-line">
          <Image
            src="/hector.jpg"
            alt={`${site.personName}, fundador de ${site.name}`}
            fill
            sizes="280px"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-[18px]">
          <span className="font-mono text-sm tracking-[0.14em] text-primary">QUIÉN ESTÁ DETRÁS</span>
          <h2 className="m-0 text-3xl font-black tracking-tight sm:text-[40px]">{site.personName}</h2>
          <p className="m-0 max-w-[620px] text-lg leading-[1.65] text-soft">
            Desarrollador senior con 7+ años de experiencia, fundador de {site.name}. Lidero cada proyecto de punta a punta —
            sitios, paneles administrativos, integraciones con IA — y según el tamaño del encargo se
            suman más desarrolladores del equipo. La misma experiencia que respalda operaciones a
            gran escala, empaquetada a precio pyme, siempre con un responsable directo: yo.
          </p>
          <div className="flex flex-wrap gap-6 font-mono text-[13px] tracking-[0.06em] text-soft">
            <span>NEXT.JS · REACT · NODE</span>
            <span>INTEGRACIONES IA</span>
            <span>WEBPAY · TRANSBANK</span>
          </div>
          <Link href="/proyectos" className="text-base font-bold text-primary">
            Ver proyectos y demos →
          </Link>
        </div>
      </div>
    </section>
  );
}
