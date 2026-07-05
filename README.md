# harayadev

Monorepo con dos partes, cada una desplegada como proyecto Vercel independiente:

- **raíz** — sitio de Haraya Ecomsur (EIRL): presentación personal de Hector Araya C.,
  presentación de la empresa, servicios, portafolio de proyectos y contacto. También
  es el sitio de ventas del starter-kit. Deploy en Vercel con Root Directory = raíz.
- **`starter-kit/`** — el producto: template Next.js config-driven para generar
  webs con chat IA para pymes chilenas. Ver `starter-kit/README.md` para comandos,
  arquitectura y flujo por cliente. Deploy en Vercel con Root Directory = `starter-kit`.

## Sitio raíz — comandos

```bash
npm install
npm run dev          # http://localhost:3000
npm run build
npm run start
npm run lint
npm run typecheck
```

Variables de entorno (`.env.local`, ver `.env.example`):

- `RESEND_API_KEY` — opcional, requerido solo para que el formulario de contacto envíe emails reales.
- `CONTACT_TO_EMAIL` — opcional, email de destino del formulario (si no se define, usa `lib/site.ts#email`).
- `NEXT_PUBLIC_SITE_URL` — usado en metadata, sitemap.xml y robots.txt.

## Estructura

- `app/` — páginas: home (`/`), `/servicios`, `/proyectos`, `/sobre-mi`, `/contacto`,
  más `app/api/contact/route.ts`, `sitemap.ts` y `robots.ts`.
- `content/projects.ts` y `content/services.ts` — contenido tipado (no config-driven:
  esta es una sola marca con contenido fijo, a diferencia del starter-kit).
- `lib/site.ts` — constantes de marca (nombre, tagline, contacto).
- `lib/seo.ts` — metadata y JSON-LD (`Organization` + `Person`).
- `components/` — mismo patrón de UI que `starter-kit/` (Container, Header, Footer,
  secciones), pero sin el mecanismo config-driven multi-tenant.

## Pendiente

- `app/sobre-mi/page.tsx` tiene un placeholder `TODO` para la experiencia profesional
  real (empresas, cargos, períodos) — no se completó con datos inferidos de repos de
  GitHub para evitar publicar historial laboral no confirmado.
- Imágenes reales de los 3 proyectos en `/proyectos` (hoy solo texto).
- Deploy real en Vercel de este sitio raíz.
