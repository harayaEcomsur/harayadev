import type { Metadata } from "next";
import { site } from "./site";

function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export function buildMetadata(overrides: Metadata = {}, path = ""): Metadata {
  const base = getSiteUrl();
  const url = `${base}${path}`;

  return {
    metadataBase: new URL(base),
    title: {
      default: `${site.name} — ${site.tagline}`,
      template: `%s · ${site.name}`,
    },
    description: site.description,
    openGraph: {
      title: site.name,
      description: site.description,
      url,
      siteName: site.name,
      locale: site.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: site.name,
      description: site.description,
    },
    ...overrides,
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
