#!/usr/bin/env tsx
// Wizard de cliente nuevo. Premisa del starter-kit: ninguna demo genérica —
// cada cliente recibe un toque de personalización (layout según su rubro,
// paleta desde su logo, referencias de inspiración registradas en un BRIEF.md).
//
// Uso interactivo:   npm run new-client
// No interactivo:    npm run new-client -- --name "Panadería Rosita" [--preset restaurante]
//                    (salta las preguntas que ya respondiste por flag)
import { parseArgs } from "node:util";
import { existsSync, readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
import { execSync } from "node:child_process";
import readline from "node:readline/promises";
import path from "node:path";
import {
  extractColors,
  pickPalette,
  ensureContrastWithWhite,
  hexToRgb,
  rgbToHex,
  hslToRgb,
} from "./palette-core";

const { values } = parseArgs({
  options: {
    name: { type: "string" },
    preset: { type: "string" },
    logo: { type: "string" },
    layout: { type: "string" },
  },
});

// El async iterator bufferiza las líneas internamente, así el wizard funciona
// igual en TTY que con respuestas por pipe (rl.question pierde líneas en pipes).
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const lineIter = rl[Symbol.asyncIterator]();

async function ask(question: string, fallback = ""): Promise<string> {
  process.stdout.write(question);
  const { value, done } = await lineIter.next();
  const answer = done ? "" : String(value).trim();
  if (!process.stdin.isTTY) console.log(answer); // eco para logs cuando viene por pipe
  return answer || fallback;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// El layout es lo primero que evita que todo se vea igual: se sugiere por rubro
// y siempre se confirma con un humano.
function suggestLayout(rubro: string): "inmobiliaria" | "corporativo" | "clasico" {
  const r = rubro.toLowerCase();
  if (/(inmobili|propiedad|corretaje|corredor)/.test(r)) return "inmobiliaria";
  if (/(abogad|juridic|jurídic|legal|contab|contador|consultor|auditor|notari|arquitect|ingenier)/.test(r))
    return "corporativo";
  return "clasico";
}

function suggestPreset(rubro: string): string {
  const r = rubro.toLowerCase();
  if (/(restauran|comida|food|cafe|café|pasteler|panader|sushi|pizz)/.test(r)) return "restaurante";
  if (/(barber|peluquer|estetic|estétic|salon|salón|spa|manicur)/.test(r)) return "barberia";
  if (/(abogad|jurid|juríd|contab|contador|consultor|inmobili|propiedad)/.test(r)) return "profesional";
  return "_template";
}

async function main() {
  console.log("\n═══ Cliente nuevo — starter-kit ═══");
  console.log("Premisa: nada genérico. Un par de preguntas para darle su toque.\n");

  const businessName = values.name ?? (await ask("Nombre del negocio: "));
  if (!businessName) {
    console.error("El nombre es obligatorio.");
    process.exit(1);
  }
  const slug = slugify(businessName);

  const rubro = await ask("Rubro (ej: corretaje de propiedades, estudio jurídico, restaurante): ");

  const layoutSuggested = (values.layout as ReturnType<typeof suggestLayout>) || suggestLayout(rubro);
  const layout =
    (await ask(
      `Layout [clasico | inmobiliaria | corporativo] (sugerido por rubro: ${layoutSuggested}): `,
      layoutSuggested
    )) || layoutSuggested;

  const presetSuggested = values.preset ?? suggestPreset(rubro);
  const preset = await ask(
    `Preset base [restaurante | barberia | profesional | _template] (sugerido: ${presetSuggested}): `,
    presetSuggested
  );

  const logoPath = values.logo ?? (await ask("Ruta al logo del cliente (enter si aún no hay): "));

  const inspiration = await ask(
    "Sitios de inspiración/competencia (URLs separadas por coma, enter si ninguna): "
  );

  const style = await ask("Estilo tipográfico [modern | elegante | amigable] (enter = según preset): ");

  let colorNotes = "";
  if (!logoPath) {
    colorNotes = await ask("Colores preferidos del cliente (ej: 'verde y dorado', enter si no sabe): ");
  }

  // Contexto del negocio: alimenta el copy, el chat y el SEO de la demo. La
  // cobertura por defecto es todo Chile — solo se acota si el cliente lo dice.
  const historia = await ask("Contexto del negocio (historia, años, qué lo distingue — 1-2 líneas): ");
  const serviciosNotas = await ask("Servicios principales (separados por coma, enter = los del preset): ");
  const cobertura = await ask("Zonas de cobertura (enter = todo Chile; indica base/ciudad si la hay): ", "todo Chile");

  rl.close();

  // --- config desde el preset ---
  const presetFile = path.join(process.cwd(), "config", "presets", `${preset}.config.ts`);
  if (!existsSync(presetFile)) {
    console.error(`No existe el preset "${preset}" en config/presets/`);
    process.exit(1);
  }
  let content = readFileSync(presetFile, "utf-8")
    .replace(/slug:\s*"[^"]*"/, `slug: "${slug}"`)
    .replace(/businessName:\s*"[^"]*"/, `businessName: "${businessName}"`);
  if (rubro) content = content.replace(/rubro:\s*"[^"]*"/, `rubro: "${rubro}"`);
  if (style) content = content.replace(/fontPairing:\s*"[^"]*"/, `fontPairing: "${style}"`);
  // Los presets exportan default; la config activa debe exportar `clientConfig`.
  content = content
    .replace(/const clientConfig = defineClientConfig\(/, "export const clientConfig = defineClientConfig(")
    .replace(/\nexport default clientConfig;\n?/, "\n");
  if (!content.includes("layout:")) {
    content = content.replace(/fontPairing:\s*"([^"]*)",/, `fontPairing: "$1",\n    layout: "${layout}",`);
  }

  // --- paleta desde el logo, si hay ---
  let paletteBlock = "";
  if (logoPath && existsSync(logoPath)) {
    const assetsDir = path.join(process.cwd(), "public", "clients", slug);
    mkdirSync(assetsDir, { recursive: true });
    const ext = path.extname(logoPath).toLowerCase();
    const logoDest = path.join(assetsDir, `logo${ext}`);
    copyFileSync(logoPath, logoDest);

    try {
      const p = pickPalette(extractColors(logoPath));
      const accentAsPrimary = ensureContrastWithWhite(hexToRgb(p.accent)!);
      const darkBg = hslToRgb(p.baseHsl.h, 0.3, 0.1);
      const darkPrimary = ensureContrastWithWhite(hslToRgb(p.baseHsl.h, Math.max(p.baseHsl.s, 0.5), 0.45));
      content = content
        .replace(/logoUrl:\s*"[^"]*"/, `logoUrl: "/clients/${slug}/logo${ext}"`)
        .replace(/faviconUrl:\s*"[^"]*"/, `faviconUrl: "/clients/${slug}/logo${ext}"`)
        .replace(/primary:\s*"[^"]*"/, `primary: "${p.primary}"`)
        .replace(/accent:\s*"[^"]*"/, `accent: "${p.accent}"`)
        .replace(/background:\s*"[^"]*"/, `background: "${p.background}"`)
        .replace(/foreground:\s*"[^"]*"/, `foreground: "${p.foreground}"`);
      // Variantes A/B/C para que el cliente elija en /variantes.
      const variants = `
  themeVariants: [
    { id: "a", name: "Fiel al logo", palette: { primary: "${p.primary}", accent: "${p.accent}", background: "${p.background}", foreground: "${p.foreground}" } },
    { id: "b", name: "Acento protagonista", palette: { primary: "${rgbToHex(accentAsPrimary.color)}", accent: "${p.primary}", background: "${rgbToHex(hslToRgb(p.accentHsl.h, 0.18, 0.98))}", foreground: "${p.foreground}" } },
    { id: "c", name: "Modo oscuro", palette: { primary: "${rgbToHex(darkPrimary.color)}", accent: "${p.accent}", background: "${rgbToHex(darkBg)}", foreground: "#F4F2EF" } },
  ],
`;
      content = content.replace(/\n  seo: \{/, `${variants}\n  seo: {`);
      paletteBlock = `- Paleta extraída del logo: primary ${p.primary}, accent ${p.accent}${
        p.primaryAdjusted ? ` (primary oscurecido desde ${p.primaryOriginal} por contraste WCAG)` : ""
      }\n- Variantes A/B/C generadas — enviar /variantes al cliente para que elija.`;
    } catch {
      paletteBlock = "- ⚠ No se pudo extraer paleta del logo (¿blanco y negro?). Elegir a mano.";
    }
  }

  writeFileSync(path.join(process.cwd(), "config", "client.config.ts"), content, "utf-8");
  console.log(`\n✔ Config creado en config/client.config.ts (preset ${preset}, layout ${layout})`);

  // --- BRIEF.md: las respuestas y referencias viven en el branch del cliente ---
  const brief = `# Brief — ${businessName}

- **Rubro:** ${rubro || "(por definir)"}
- **Layout:** ${layout}
- **Estilo tipográfico:** ${style || "(el del preset)"}
- **Logo:** ${logoPath ? `public/clients/${slug}/` : "(pendiente — pedir al cliente; luego correr npm run palette)"}
${paletteBlock ? paletteBlock + "\n" : ""}${colorNotes ? `- **Colores preferidos:** ${colorNotes}\n` : ""}
## Contexto del negocio

- **Historia / diferenciales:** ${historia || "(por completar con el cliente)"}
- **Servicios principales:** ${serviciosNotas || "(los del preset — validar con el cliente)"}
- **Cobertura:** ${cobertura}${cobertura === "todo Chile" ? " (default — confirmar si tiene base/zona principal)" : ""}

> Usar este contexto en el copy del hero/nosotros, las FAQ, el prompt del chat
> (businessDescription y qaPairs) y el SEO. Si la cobertura tiene una base o zona
> principal, dale jerarquía en el copy (ej: "base en X, especialista en Y, con
> operación en todo Chile").

## Inspiración / competencia

${
  inspiration
    ? inspiration
        .split(",")
        .map((u) => `- ${u.trim()}`)
        .join("\n")
    : "- (ninguna registrada)"
}

> Al armar la demo: revisar estas referencias y rescatar **1 o 2 detalles
> distintivos** (estructura del hero, cómo presentan el servicio estrella, tono
> del copy). La premisa es que ningún cliente reciba una demo genérica.

## Pendientes

- [ ] Volcar el contexto del negocio (historia, servicios, cobertura) al copy, chat y SEO del config
- [ ] Completar datos reales en config/client.config.ts (contacto, precios, FAQ, chat)
- [ ] Fotos reales o de stock acordes al rubro en public/clients/${slug}/
- [ ] ${logoPath ? "Confirmar variante de diseño elegida por el cliente (/variantes)" : "Conseguir el logo y correr: npm run palette -- <logo>"}
- [ ] Revisar la demo contra las referencias de inspiración
`;
  writeFileSync(path.join(process.cwd(), "BRIEF.md"), brief, "utf-8");
  console.log("✔ BRIEF.md creado con las respuestas e inspiraciones");

  // --- branch de git ---
  const branchName = `client/${slug}`;
  try {
    execSync("git rev-parse --is-inside-work-tree", { stdio: "ignore" });
    execSync(`git checkout -b ${branchName}`, { stdio: "inherit" });
    execSync("git add config/client.config.ts BRIEF.md public/clients", { stdio: "inherit" });
    execSync(`git commit -m "Nuevo cliente: ${businessName}"`, { stdio: "inherit" });
    console.log(`✔ Branch "${branchName}" creado con config + brief`);
  } catch {
    console.warn("⚠ No se pudo crear el branch de git automáticamente. Puedes crearlo manualmente.");
  }

  console.log(`
Próximos pasos:
1. Revisa BRIEF.md y las referencias de inspiración antes de tocar el diseño
2. Completa los datos reales en config/client.config.ts
3. Agrega imágenes en public/clients/${slug}/
4. npm run dev y revisa la demo (y /variantes si hay logo)
`);
}

main();
