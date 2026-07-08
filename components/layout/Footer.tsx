import Link from "next/link";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-line px-4 py-9 sm:px-6 lg:px-8 print:hidden">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6">
        <Link href="/" className="text-xl font-black text-foreground">
          Haraya<span className="text-primary">Dev</span>
        </Link>
        <div className="flex flex-wrap items-center gap-7 font-mono text-[13px] text-soft">
          {site.whatsapp && <span>+{site.whatsapp}</span>}
          <a href={`mailto:${site.email}`} className="transition-colors hover:text-foreground">
            {site.email}
          </a>
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            GitHub
          </a>
          <Link href="/sobre-mi" className="transition-colors hover:text-foreground">
            Sobre mí
          </Link>
        </div>
        <span className="text-[13px] text-soft/60">
          © {new Date().getFullYear()} {site.legalName}
        </span>
      </div>
    </footer>
  );
}
