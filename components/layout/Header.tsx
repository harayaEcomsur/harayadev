"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { site } from "@/lib/site";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { Logo } from "@/components/layout/Logo";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/servicios", label: "Servicios" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/contacto", label: "Contacto" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const demoHref = site.whatsapp
    ? buildWhatsAppLink(site.whatsapp, "Hola! Quiero pedir mi demo gratis")
    : "/contacto";

  return (
    <nav className="sticky top-0 z-50 border-b border-line bg-background/90 backdrop-blur-md print:hidden">
      <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-4 sm:h-[76px] sm:px-6 lg:px-8">
        <Logo chipSize={34} textClassName="text-2xl" onClick={() => setOpen(false)} />
        <div className="flex items-center gap-4 text-[15px] font-semibold sm:gap-8">
          <div className="hidden items-center gap-8 sm:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-foreground ${
                  pathname === link.href ? "text-foreground" : "text-soft"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <a
            href={demoHref}
            {...(site.whatsapp ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-hover sm:px-5 sm:py-[11px]"
          >
            Pide tu demo gratis
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            className="text-foreground sm:hidden"
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-line bg-background px-4 py-3 sm:hidden">
          <div className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`border-b border-line/50 py-3.5 text-base font-semibold last:border-b-0 ${
                  pathname === link.href ? "text-foreground" : "text-soft"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
