// @vitest-environment node
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  LEGACY_REFERENCE_ORGAN_IDS,
  getBodyPartPhotoEntriesForOrganIds,
  getBodyPartPhotoUrl,
} from "../data/body-parts.js";

describe("body part photo mapping", () => {
  it("maps every legacy organ id to at least one body-part photo entry", () => {
    const coverage = LEGACY_REFERENCE_ORGAN_IDS.map((organId) => ({
      organId,
      entries: getBodyPartPhotoEntriesForOrganIds([organId]),
    }));

    expect(coverage.every(({ entries }) => entries.length > 0)).toBe(true);
  });

  it("deduplicates merged system organ mappings into a stable photo stack", () => {
    const entries = getBodyPartPhotoEntriesForOrganIds([
      "lungs_left",
      "lungs_right",
      "larynx_trachea",
    ]);

    expect(entries.map((entry) => entry.id)).toEqual([
      "bp_lungs",
      "bp_neck",
      "bp_throat",
      "bp_esophagus",
    ]);
  });

  it("builds body-part photo urls with the shared assets convention", () => {
    expect(getBodyPartPhotoUrl("heart.webp")).toBe(
      "/assets/body-parts/heart.webp",
    );
    expect(getBodyPartPhotoUrl("heart.webp", "/preview/")).toBe(
      "/preview/assets/body-parts/heart.webp",
    );
  });

  it("references photo asset files that exist for every legacy organ mapping", () => {
    const missingFiles = LEGACY_REFERENCE_ORGAN_IDS.flatMap((organId) =>
      getBodyPartPhotoEntriesForOrganIds([organId])
        .map((entry) => entry.imageFile)
        .filter(
          (imageFile, index, imageFiles) =>
            imageFiles.indexOf(imageFile) === index,
        )
        .filter((imageFile) => {
          const imagePath = resolve(
            process.cwd(),
            "public/assets/body-parts",
            imageFile,
          );
          return !existsSync(imagePath);
        })
        .map((imageFile) => ({ organId, imageFile })),
    );

    expect(missingFiles).toEqual([]);
  });
});
