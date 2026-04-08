import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const BUDGET_BYTES = 512000;
const rootDir = path.resolve(import.meta.dirname, "..");
const modelSourcePath = path.join(rootDir, "src", "body-map-model.ts");
const systemsSourcePath = path.join(rootDir, "src", "data", "systems.ts");
const distDir = path.join(rootDir, "dist");

function readDefaultModelState() {
  const source = fs.readFileSync(modelSourcePath, "utf8");
  const viewMatch = source.match(/currentView:\s*ViewMode\s*=\s*"([^"]+)"/);
  const genderMatch = source.match(/currentGender:\s*Gender\s*=\s*"([^"]+)"/);

  if (!viewMatch || !genderMatch) {
    throw new Error(
      "Unable to determine default body-map-model view/gender from src/body-map-model.ts",
    );
  }

  return {
    view: viewMatch[1],
    gender: genderMatch[1],
  };
}

function resolveCriticalAssetPaths(view, gender) {
  const systemsSource = fs.readFileSync(systemsSourcePath, "utf8");
  const sidebarSystemThumbnails = Array.from(
    systemsSource.matchAll(/thumbnail:\s*"([^"]+)"/g),
    (match) => path.join(distDir, match[1].replace(/^\/assets\//, "assets/")),
  );

  if (view === "sections") {
    const genderSuffix = gender === "male" ? "-male" : "";
    return [
      ...sidebarSystemThumbnails,
      path.join(
        distDir,
        "assets",
        `sections-body${genderSuffix}.webp`,
      ),
    ];
  }

  if (view === "organs" || view === "organs2") {
    return [
      ...sidebarSystemThumbnails,
      path.join(distDir, "assets", "silhouette.webp"),
    ];
  }

  throw new Error(`Unsupported default view "${view}" for budget check`);
}

function statSize(filePath) {
  const stats = fs.statSync(filePath);
  return {
    filePath,
    bytes: stats.size,
  };
}

const { view, gender } = readDefaultModelState();
const criticalPaths = [
  path.join(distDir, "body-map-explorer.es.js"),
  ...resolveCriticalAssetPaths(view, gender),
];
const sizeEntries = criticalPaths.map(statSize);
const totalBytes = sizeEntries.reduce((sum, entry) => sum + entry.bytes, 0);

console.log("Build budget check");
console.log(`Default initial render: ${view} / ${gender}`);
console.log(`Budget: ${BUDGET_BYTES} bytes`);
console.log("");

for (const entry of sizeEntries) {
  console.log(`${String(entry.bytes).padStart(7, " ")}  ${path.relative(rootDir, entry.filePath)}`);
}

console.log("");
console.log(
  `Total critical payload: ${totalBytes} bytes (${BUDGET_BYTES - totalBytes} bytes remaining)`,
);

if (totalBytes > BUDGET_BYTES) {
  console.error(
    `Budget check failed: critical payload exceeds ${BUDGET_BYTES} bytes.`,
  );
  process.exit(1);
}

console.log("Budget check passed.");
