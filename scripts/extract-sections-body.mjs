#!/usr/bin/env node

import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { tmpdir } from "os";
import { execFileSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");
const htmlPath = join(rootDir, "interactive-body-model.html");
const outputPath = join(rootDir, "public", "assets", "sections-body.webp");
const fallbackOutputPath = join(
  rootDir,
  "public",
  "assets",
  "sections-body.png",
);

function extractHrefBase64(text, offset) {
  const marker = 'href="data:image/png;base64,';
  const markerIdx = text.indexOf(marker, offset);
  if (markerIdx === -1) {
    throw new Error(
      "Could not locate base64 PNG data after sections-base-body image",
    );
  }

  const start = markerIdx + marker.length;
  const end = text.indexOf('"', start);
  if (end === -1) {
    throw new Error("Could not find the end of the base64 PNG string");
  }

  return text.slice(start, end);
}

const html = readFileSync(htmlPath, "utf8");
const sectionsBaseBodyIndex = html.indexOf('id="sections-base-body"');
if (sectionsBaseBodyIndex === -1) {
  throw new Error(
    'Could not find id="sections-base-body" in interactive-body-model.html',
  );
}

const base64 = extractHrefBase64(html, sectionsBaseBodyIndex);
const buffer = Buffer.from(base64, "base64");
const tempDir = mkdtempSync(join(tmpdir(), "body-map-sections-body-"));
const tempPngPath = join(tempDir, "sections-body.png");

mkdirSync(join(rootDir, "public", "assets"), { recursive: true });
writeFileSync(tempPngPath, buffer);

try {
  execFileSync("cwebp", ["-q", "90", tempPngPath, "-o", outputPath], {
    stdio: "inherit",
  });
  console.log("Extracted sections body to public/assets/sections-body.webp");
} catch (error) {
  writeFileSync(fallbackOutputPath, buffer);
  console.warn(
    "cwebp not available; extracted sections body to public/assets/sections-body.png instead",
  );
}

rmSync(tempDir, { recursive: true, force: true });
