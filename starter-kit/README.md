# Starter kit — webs con IA para pymes chilenas

Sitio Next.js config-driven: todo el contenido de un cliente vive en un único
archivo `config/client.config.ts`, validado con zod. El mismo código sirve para
cualquier cliente cambiando solo ese archivo (y las imágenes en `public/clients/<slug>/`).

## Comandos

```bash
npm install
npm run dev          # http://localhost:3000
npm run build
npm run start
npm run lint
npm run typecheck
npm run new-client -- --name "Panadería Rosita" [--preset restaurante|barberia|profesional]
npm run palette -- ruta/al/logo.svg   # extrae la paleta del logo del cliente (svg/png/jpg)
```

### Layouts por rubro

`branding.layout` cambia la estructura de la home para que dos clientes de rubros
distintos no se vean como el mismo sitio con otra paleta:

- `clasico` (default) — cards centradas, el layout original. Sirve para cualquier rubro.
- `inmobiliaria` — hero full-screen con la propiedad como protagonista, servicios como
  lista aireada sin cards y galería tipo "Propiedades destacadas" (inspirado en
  corretajes premium como Property Partners y Engel & Völkers).
- `corporativo` — banda oscura sobria, áreas de práctica numeradas (01, 02…) y
  tipografía en mayúsculas con tracking (inspirado en grandes estudios jurídicos).

Además `branding.logoIncludesName: true` oculta el nombre en texto del header cuando el
archivo del logo ya lo trae escrito — el logo va grande (es la marca del cliente).

### Paleta desde el logo y variantes de diseño

- `npm run palette -- logo.png` extrae los colores dominantes del logo del cliente e
  imprime el bloque `palette` listo para pegar en `config/client.config.ts`, validando
  contraste WCAG AA (oscurece automáticamente lo que no cumple y avisa). También sugiere
  un bloque `themeVariants` con 2 alternativas (acento protagonista y modo oscuro).
- `themeVariants` en el config habilita **`/variantes`**: una página interna (noindex,
  fuera del sitemap) que muestra la misma home con cada paleta lado a lado, para que el
  cliente elija "A, B o C" — útil como parte del gancho de venta de la demo. Cada
  variante se puede abrir a pantalla completa en `/variantes/<id>`.

Variables de entorno (`.env.local`, ver `.env.example`):

- `GEMINI_API_KEY` — requerido para el chat IA (modelo `gemini-2.5-flash-lite`, tier gratuito en Google AI Studio).
- `RESEND_API_KEY` — opcional, requerido solo si el módulo `contactForm` debe enviar emails reales.
- `NEXT_PUBLIC_SITE_URL` — usado en metadata, sitemap.xml y robots.txt.

## Flujo de trabajo por cliente

**Premisa: ninguna demo genérica.** Cada cliente recibe un toque de personalización:
layout según su rubro, paleta desde su logo, y referencias de su competencia registradas
para rescatar 1-2 detalles distintivos al armar la demo.

1. `npm run new-client` — wizard interactivo que pregunta nombre, rubro, logo,
   sitios de inspiración/competencia y estilo; sugiere layout y preset según el rubro,
   extrae la paleta del logo (con variantes A/B/C para `/variantes`), y deja todo
   registrado en un `BRIEF.md` dentro del branch `client/<slug>` que crea.
   (Modo no interactivo: `npm run new-client -- --name "..." --preset <p> --logo <ruta>`.)
2. Completa los datos reales del cliente en `config/client.config.ts` (identidad,
   servicios, horarios, preguntas frecuentes del chat, etc.) y sube sus imágenes a
   `public/clients/<slug>/`.
3. Sube el branch (`git push -u origin client/<slug>`) y crea un proyecto en Vercel
   apuntando a ese branch, con **Root Directory = `starter-kit`** (este repo es un
   monorepo: la raíz aloja el sitio que vende estos servicios, ver README de la raíz).
4. Configura las variables de entorno del proyecto en Vercel y comparte el link de
   preview con el cliente para validar.
5. Ajusta lo que pida el cliente sobre el mismo branch/config.
6. Conecta su dominio propio en Vercel y promueve el deploy a producción.

## Arquitectura

- **Config-driven**: `config/schema.ts` define el schema zod (`ClientConfig`) que
  valida y tipa todo el contenido. `config/client.config.ts` es la config activa;
  `config/presets/*.config.ts` son configs completas de ejemplo (y punto de partida
  para clientes nuevos vía `new-client`).
- **Theming sin recompilar Tailwind**: `app/layout.tsx` inyecta la paleta del
  cliente como variables CSS (`lib/theme.ts`) directamente en el `<html>`, y
  `tailwind.config.ts` referencia esas variables (`bg-primary`, `text-accent`, etc.).
  Cambiar de cliente es solo cambiar el archivo de config, no el build.
- **Tipografías**: 3 pares precargados con `next/font/google` en `lib/fonts.ts`
  (`modern`, `elegante`, `amigable`), elegidos por `branding.fontPairing` en el config.
- **Íconos**: `components/ui/IconResolver.tsx` resuelve cualquier ícono de
  `lucide-react` por nombre en runtime — no hay una lista fija, así que sirve para
  cualquier rubro.
- **Secciones** (`components/sections/*`) se renderizan u ocultan según
  `client.config.ts#modules` (flags) y si el cliente llenó el contenido correspondiente.
- **Chat IA** (`app/api/chat/route.ts`): streaming con Vercel AI SDK + Google Gemini
  (`gemini-2.5-flash-lite` por defecto, configurable en `client.config.ts#chat.model`). El
  system prompt se arma dinámicamente desde
  `client.config.ts#chat` (descripción del negocio + hasta 40 pares P/R), con
  instrucción de derivar a WhatsApp si no sabe la respuesta. Rate limiting básico
  por IP en `lib/rate-limit.ts` (en memoria, best-effort por isolate — suficiente
  para tráfico de una pyme; si un cliente crece mucho, reemplazar por Upstash sin
  tocar el resto del código).
- **Formulario de contacto** (`app/api/contact/route.ts`): envía el mensaje por la
  API de Resend al `contact.email` del cliente. Si falta `RESEND_API_KEY` o el
  cliente no configuró email, responde 501 explícito (no simula un envío exitoso).
- **SEO**: `lib/seo.ts` genera `Metadata` (Open Graph, Twitter card) y el JSON-LD
  `LocalBusiness` (o subtipo, vía `seo.businessType`) desde el config. `sitemap.ts`
  y `robots.ts` usan `NEXT_PUBLIC_SITE_URL`.

## Presets incluidos

- `restaurante` — food truck ficticio en Providencia.
- `barberia` — barbería ficticia en Ñuñoa.
- `profesional` — estudio jurídico/contable ficticio en Las Condes.
- `_template` — plantilla en blanco (placeholders `TODO`), usada por defecto en `new-client`.

Los rubros reales de tus clientes no están limitados a estos 3 — `meta.rubro` es
texto libre. Los presets son solo puntos de partida para demos rápidas según a qué
se parezca más el prospecto.
