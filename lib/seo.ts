import type { Metadata } from "next";
import { site } from "./site";

function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export function buildMetadata(overrides: { title?: string; description?: string } = {}, path = ""): Metadata {
  const base = getSiteUrl();
  const url = `${base}${path}`;
  const description = overrides.description ?? site.description;
  // Para páginas internas el og:title lleva la marca ya resuelta (el template `%s · marca`
  // solo aplica al <title>, no a Open Graph).
  const socialTitle = overrides.title ? `${overrides.title} · ${site.name}` : `${site.name} — ${site.tagline}`;

  return {
    metadataBase: new URL(base),
    title: overrides.title ?? {
      default: `${site.name} — ${site.tagline}`,
      template: `%s · ${site.name}`,
    },
    description,
    alternates: {
      // El mismo contenido se sirve bajo varios aliases *.vercel.app (los de equipo llevan
      // X-Robots-Tag: noindex) — el canonical fija cuál es la URL indexable.
      canonical: url,
    },
    openGraph: {
      title: socialTitle,
      description,
      url,
      siteName: site.name,
      locale: site.locale,
      type: "website",
      // Explícita porque las páginas que definen su propio openGraph no heredan la
      // imagen del file convention app/opengraph-image.tsx del layout raíz.
      images: [{ url: `${base}/opengraph-image`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [`${base}/opengraph-image`],
    },
  };
}

export function buildPersonOrgJsonLd() {
  const base = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${base}/#organization`,
        name: site.name,
        legalName: site.legalName,
        url: base,
        founder: { "@id": `${base}/#person` },
      },
      {
        "@type": "Person",
        "@id": `${base}/#person`,
        name: site.personName,
        url: base,
        worksFor: { "@id": `${base}/#organization` },
      },
    ],
  };
}
