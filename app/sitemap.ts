import type { MetadataRoute } from "next";

const ROUTES = ["", "/servicios", "/demo", "/proyectos", "/sobre-mi", "/contacto", "/pagina-web-para-inmobiliarias"];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return ROUTES.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
