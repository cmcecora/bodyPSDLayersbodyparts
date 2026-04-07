import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const source = JSON.parse(
  readFileSync(join(root, "public/data/diseases.json"), "utf-8"),
);
const outDir = join(root, "public/data/diseases");
mkdirSync(outDir, { recursive: true });

let count = 0;
for (const [key, entries] of Object.entries(source)) {
  const stripped = entries.map(({ name }) => ({ name }));
  writeFileSync(join(outDir, `${key}.json`), JSON.stringify(stripped), "utf-8");
  count++;
}
console.log(`Split ${count} body-part disease files to ${outDir}`);
