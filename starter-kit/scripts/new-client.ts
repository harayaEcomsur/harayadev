#!/usr/bin/env tsx
import { parseArgs } from "node:util";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";

const { values } = parseArgs({
  options: {
    name: { type: "string" },
    preset: { type: "string", default: "_template" },
  },
});

if (!values.name) {
  console.error(
    'Uso: npm run new-client -- --name "Nombre del Negocio" [--preset restaurante|barberia|profesional]'
  );
  process.exit(1);
}

const businessName = values.name;
const slug = businessName
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/(^-|-$)/g, "");

const presetsDir = path.join(process.cwd(), "config", "presets");
const presetFile = path.join(presetsDir, `${values.preset}.config.ts`);
const targetFile = path.join(process.cwd(), "config", "client.config.ts");

if (!existsSync(presetFile)) {
  console.error(`No existe el preset "${values.preset}" en ${presetsDir}`);
  process.exit(1);
}

let content = readFileSync(presetFile, "utf-8");
content = content
  .replace(/slug:\s*"[^"]*"/, `slug: "${slug}"`)
  .replace(/businessName:\s*"[^"]*"/, `businessName: "${businessName}"`);

writeFileSync(targetFile, content, "utf-8");
console.log(`✔ Config creado en config/client.config.ts a partir de "${values.preset}"`);

const branchName = `client/${slug}`;
try {
  execSync("git rev-parse --is-inside-work-tree", { stdio: "ignore" });
  execSync(`git checkout -b ${branchName}`, { stdio: "inherit" });
  execSync("git add config/client.config.ts", { stdio: "inherit" });
  execSync(`git commit -m "Nuevo cliente: ${businessName}"`, { stdio: "inherit" });
  console.log(`✔ Branch "${branchName}" creado con el config inicial`);
} catch {
  console.warn("⚠ No se pudo crear el branch de git automáticamente (¿estás en un repo git?). Puedes crearlo manualmente.");
}

console.log(`
Próximos pasos:
1. Completa los datos reales en config/client.config.ts (logo, colores, servicios, horarios, preguntas del chat, etc.)
2. Agrega las imágenes en public/clients/${slug}/
3. Sube el branch: git push -u origin ${branchName}
4. En Vercel: crea un proyecto apuntando a este branch, con "Root Directory" = starter-kit
5. Configura las variables de entorno (ANTHROPIC_API_KEY, NEXT_PUBLIC_SITE_URL, RESEND_API_KEY) en Vercel
6. Comparte el link de preview con el cliente. Cuando esté aprobado, conecta el dominio propio y promueve a producción.
`);
