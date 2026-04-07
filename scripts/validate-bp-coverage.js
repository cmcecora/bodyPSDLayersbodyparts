#!/usr/bin/env node
/**
 * validate-bp-coverage.js
 *
 * Cross-checks all bp_ IDs across:
 *   - src/data/body-parts.ts
 *   - src/data/section-mapping.ts
 *   - src/data/systems.ts
 *   - public/data/diseases.json  (master index)
 *   - public/data/diseases/      (shard files)
 *   - public/data/symptoms-by-part.json
 *
 * Reports any ID that exists in code but not in data (or vice versa).
 * Exit code 0 = all clear, 1 = gaps found.
 *
 * Usage: node scripts/validate-bp-coverage.js
 */

import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// ── helpers ──────────────────────────────────────────────────────────────────

function readText(relPath) {
  return readFileSync(join(ROOT, relPath), "utf8");
}

function readJson(relPath) {
  return JSON.parse(readText(relPath));
}

/** Extract all bp_<word> tokens from a text file via regex. */
function extractBpIds(text) {
  const matches = text.match(/\bbp_[a-z][a-z0-9_]*/g) ?? [];
  return new Set(matches);
}

// ── collect IDs from source files ────────────────────────────────────────────

const sourceFiles = [
  "src/data/body-parts.ts",
  "src/data/section-mapping.ts",
  "src/data/systems.ts",
];

const codeIds = new Set();
for (const file of sourceFiles) {
  for (const id of extractBpIds(readText(file))) {
    codeIds.add(id);
  }
}

// ── collect IDs from data files ──────────────────────────────────────────────

const diseasesJson = readJson("public/data/diseases.json");
const diseasesMasterIds = new Set(Object.keys(diseasesJson));

const shardFiles = readdirSync(join(ROOT, "public/data/diseases")).filter((f) =>
  f.endsWith(".json"),
);
const shardIds = new Set(shardFiles.map((f) => f.replace(/\.json$/, "")));

const symptomsJson = readJson("public/data/symptoms-by-part.json");
const symptomIds = new Set(Object.keys(symptomsJson));

// ── report ───────────────────────────────────────────────────────────────────

let hasGaps = false;

function report(title, ids) {
  if (ids.size === 0) return;
  hasGaps = true;
  console.log(`\n❌ ${title} (${ids.size}):`);
  for (const id of [...ids].sort()) {
    console.log(`   ${id}`);
  }
}

function diff(a, b) {
  return new Set([...a].filter((x) => !b.has(x)));
}

console.log("=== bp_ Coverage Validation ===\n");
console.log(`Code IDs (from source files):        ${codeIds.size}`);
console.log(`diseases.json master keys:            ${diseasesMasterIds.size}`);
console.log(`Disease shard files:                  ${shardIds.size}`);
console.log(`symptoms-by-part.json keys:           ${symptomIds.size}`);

// Code IDs with no disease shard file
report("In code but missing disease shard file", diff(codeIds, shardIds));

// Code IDs with no entry in diseases.json master
report(
  "In code but missing from diseases.json master",
  diff(codeIds, diseasesMasterIds),
);

// Code IDs with no symptom data
report(
  "In code but missing from symptoms-by-part.json",
  diff(codeIds, symptomIds),
);

// Disease shard files with no corresponding code ID (orphan files)
report(
  "Disease shard file with no matching code ID (orphan)",
  diff(shardIds, codeIds),
);

// diseases.json master keys with no matching code ID (orphan)
report(
  "diseases.json master key with no matching code ID (orphan)",
  diff(diseasesMasterIds, codeIds),
);

// Symptom keys with no matching code ID (orphan)
report(
  "symptoms-by-part.json key with no matching code ID (orphan)",
  diff(symptomIds, codeIds),
);

// Master vs shard mismatch
const masterNotShard = diff(diseasesMasterIds, shardIds);
const shardNotMaster = diff(shardIds, diseasesMasterIds);
report("In diseases.json master but no shard file", masterNotShard);
report("Shard file exists but not in diseases.json master", shardNotMaster);

if (!hasGaps) {
  console.log("\n✅ All bp_ IDs are fully covered across code and data files.");
} else {
  console.log("\n(Gaps found — see above)");
}

process.exit(hasGaps ? 1 : 0);
