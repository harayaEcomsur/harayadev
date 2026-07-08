# harayadev

Monorepo con dos partes, cada una desplegada como proyecto Vercel independiente:

- **raíz** — sitio de HarayaDev (nombre de fantasía; razón social COMERCIAL HECTOR
  ALFONSO ARAYA EIRL): presentación personal de Hector Araya C., presentación de la
  empresa, servicios, portafolio de proyectos, contacto y un chat IA en vivo (el mismo
  producto que se vende, funcionando en el propio sitio). También es el sitio de ventas
  del starter-kit. Deploy en Vercel con Root Directory = raíz.
  Producción: https://harayadev-harayaecomsurs-projects.vercel.app
- **`starter-kit/`** — el producto: template Next.js config-driven para generar
  webs con chat IA para pymes chilenas. Ver `starter-kit/README.md` para comandos,
  arquitectura y flujo por cliente. Deploy en Vercel con Root Directory = `starter-kit`.
  Producción: https://starter-kit-harayaecomsurs-projects.vercel.app

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
- `WHATSAPP_NUMBER` — opcional, formato E.164 sin "+" (ej. `56912345678`). No se hardcodea
  en el código a propósito; si no está definida, el link/botón de WhatsApp no se muestra.
- `GEMINI_API_KEY` — requerido para el chat IA (widget flotante en todo el sitio). Si
  falta, el widget muestra un mensaje de error amigable en vez de fallar en silencio.
- `COMPANY_RUT` y `BANK_*` — datos de la EIRL y de la cuenta bancaria mostrados en el
  contrato generado por `/contratar` (ver `.env.example`). Con fallbacks elegantes si faltan.

## Estructura

- `app/` — páginas: home (`/`), `/servicios`, `/proyectos`, `/sobre-mi`, `/contacto`,
  `/contratar` (flujo de contratación: plan + forma de pago por transferencia → genera un
  contrato-borrador imprimible y avisa por email), más `app/api/contact/route.ts`,
  `app/api/chat/route.ts`, `app/api/contract/route.ts`, `sitemap.ts` y `robots.ts`.
- `content/projects.ts`, `content/services.ts`, `content/plans.ts` (planes con precio
  cerrado + mantención/mejora a cotización) y `content/faq.ts` — contenido tipado (no
  config-driven: esta es una sola marca con contenido fijo, a diferencia del starter-kit).
  El chat IA arma su system prompt dinámicamente desde estos mismos archivos
  (`lib/chat-prompt.ts`), así que no hay que mantener el contenido dos veces.
- `lib/contract.ts` — schema zod del pedido + armado del contrato (número, cláusulas,
  hitos de pago 100%/50-50/mensual, datos bancarios desde env).
- `lib/site.ts` — constantes de marca (nombre de fantasía, razón social, tagline, contacto).
- `lib/seo.ts` — metadata y JSON-LD (`Organization` con `name`/`legalName` separados, + `Person`).
- `components/` — mismo patrón de UI que `starter-kit/` (Container, Header, Footer,
  secciones, ChatWidget), pero sin el mecanismo config-driven multi-tenant.

## Pendiente

- Imágenes reales de los 3 proyectos en `/proyectos` (hoy solo texto).
- El chat usa Gemini (`gemini-2.5-flash-lite`) por ahora en vez de Anthropic Claude, porque la
  cuenta de Anthropic no tenía saldo. Volver a Anthropic es un cambio acotado a
  `lib/gemini.ts` + `app/api/chat/route.ts` cuando se resuelva.
