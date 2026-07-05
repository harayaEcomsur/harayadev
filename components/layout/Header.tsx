import Link from "next/link";
import { site } from "@/lib/site";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/servicios", label: "Servicios" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/contacto", label: "Contacto" },
];

export function Header() {
  const demoHref = site.whatsapp
    ? buildWhatsAppLink(site.whatsapp, "Hola! Quiero pedir mi demo gratis")
    : "/contacto";

  return (
    <nav className="sticky top-0 z-50 border-b border-line bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-[76px] max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-2xl font-black tracking-tight text-foreground">
          haraya<span className="text-primary">dev</span>
        </Link>
        <div className="flex items-center gap-8 text-[15px] font-semibold">
          <div className="hidden items-center gap-8 sm:flex">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="text-soft transition-colors hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </div>
          <a
            href={demoHref}
            {...(site.whatsapp ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="rounded-lg bg-primary px-5 py-[11px] text-sm font-bold text-white transition-colors hover:bg-primary-hover"
          >
            Pide tu demo gratis
          </a>
        </div>
      </div>
    </nav>
  );
}
