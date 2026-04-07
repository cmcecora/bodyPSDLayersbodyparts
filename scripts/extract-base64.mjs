#!/usr/bin/env node
/**
 * extract-base64.mjs
 * Extracts base64-encoded organ images from the monolithic HTML file.
 * Also extracts body system thumbnail images from the BODY_SYSTEMS JS array.
 *
 * Outputs:
 *   public/assets/organs/{data-part}.png  -- one PNG per SVG body-part-group
 *   public/assets/systems/{system_id}.png -- one PNG per body system thumbnail
 *
 * Run: node scripts/extract-base64.mjs
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");
const htmlPath = join(rootDir, "interactive-body-model.html");

console.log("Reading interactive-body-model.html ...");
const html = readFileSync(htmlPath, "utf8");

// Helper: find base64 data in text starting at offset.
// Looks for href="data:image/png;base64,...  and reads until closing double-quote
function extractHrefBase64(text, offset) {
  const marker = 'href="data:image/png;base64,';
  const markerIdx = text.indexOf(marker, offset);
  if (markerIdx === -1) return null;
  const start = markerIdx + marker.length;
  const end = text.indexOf('"', start);
  if (end === -1) return null;
  return { base64: text.slice(start, end), markerIdx };
}

// Helper: find thumbnail base64 from thumbnail: \n  "data:image/png;base64,..."
function extractThumbnailBase64(text, offset) {
  // Match thumbnail: followed by optional whitespace/newlines then "data:image/png;base64,..."
  const thumbnailMarker = 'thumbnail:';
  const dataMarker = 'data:image/png;base64,';
  
  let pos = text.indexOf(thumbnailMarker, offset);
  if (pos === -1) return null;
  
  // Look for data:image/png;base64, within 200 chars after thumbnail:
  const searchArea = text.slice(pos, pos + 200);
  const dataPos = searchArea.indexOf(dataMarker);
  if (dataPos === -1) return null;
  
  const start = pos + dataPos + dataMarker.length;
  const end = text.indexOf('"', start);
  if (end === -1) return null;
  
  return { base64: text.slice(start, end), markerIdx: pos };
}

// ---------------------------------------------------------------------------
// Step 1: Extract organ images from SVG body-part-group elements
// ---------------------------------------------------------------------------
const organsDir = join(rootDir, "public", "assets", "organs");
mkdirSync(organsDir, { recursive: true });

const sectionParts = new Set([
  "head_neck", "upper_body", "midsection_lower_torso", "upper_extremities",
  "lower_extremities", "back_head", "back_upper_back", "back_middle_lower_back",
  "back_upper_extremities", "back_lower_extremities", "back_lower_body"
]);

// Find all data-part="..." occurrences and their positions
const dataPartRe = /data-part="([^"]+)"/g;
let match;
const dataParts = [];
while ((match = dataPartRe.exec(html)) !== null) {
  dataParts.push({ part: match[1], index: match.index });
}

const seenParts = new Set();
let organCount = 0;

for (const { part, index } of dataParts) {
  if (sectionParts.has(part)) continue;
  if (seenParts.has(part)) continue;
  // Skip template literals that got captured
  if (part.startsWith("'") || part.startsWith("$") || part.startsWith("+")) continue;
  seenParts.add(part);

  // Find the <g tag that contains this data-part attribute
  const gTagStart = html.lastIndexOf("<g", index);
  
  // Look for href="data:image/png;base64,..." starting from the <g tag
  const result = extractHrefBase64(html, gTagStart);
  if (!result) {
    console.warn("  WARNING: No base64 image found for data-part=" + part);
    continue;
  }

  const base64Data = result.base64;
  const buffer = Buffer.from(base64Data, "base64");
  const outPath = join(organsDir, part + ".png");
  writeFileSync(outPath, buffer);
  organCount++;
  console.log("  Extracted organ: " + part + ".png (" + Math.round(buffer.length / 1024) + " KB)");
}

console.log("\nExtracted " + organCount + " organ PNGs to public/assets/organs/");

// ---------------------------------------------------------------------------
// Step 2: Extract body system thumbnails from the BODY_SYSTEMS JS array
// ---------------------------------------------------------------------------
const systemsDir = join(rootDir, "public", "assets", "systems");
mkdirSync(systemsDir, { recursive: true });

// Find the BODY_SYSTEMS array and extract each system's id and thumbnail
// Pattern: id: "systemId", followed within ~100 chars by thumbnail: \n "data:image/..."
const systemIdRe = /\bid:\s*"([^"]+)"/g;
const seenSystems = new Set();
let systemCount = 0;

while ((match = systemIdRe.exec(html)) !== null) {
  const systemId = match[1];
  if (seenSystems.has(systemId)) continue;

  // Look for thumbnail within next 300 chars (within same system object)
  const searchStart = match.index;
  const result = extractThumbnailBase64(html, searchStart);
  if (!result) continue;
  // Make sure the thumbnail is within a reasonable range (same object)
  if (result.markerIdx - searchStart > 300) continue;

  seenSystems.add(systemId);
  const base64Data = result.base64;
  const buffer = Buffer.from(base64Data, "base64");
  const outPath = join(systemsDir, systemId + ".png");
  writeFileSync(outPath, buffer);
  systemCount++;
  console.log("  Extracted system: " + systemId + ".png (" + Math.round(buffer.length / 1024) + " KB)");
}

console.log("\nExtracted " + systemCount + " system PNGs to public/assets/systems/");
console.log("\nDone. Total extracted: " + (organCount + systemCount) + " PNG files.");
