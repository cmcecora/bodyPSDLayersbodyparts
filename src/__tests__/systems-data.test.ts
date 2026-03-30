import { describe, expect, it } from "vitest";
import { ORGANS } from "../data/organs.js";
import { BODY_SYSTEMS, ORGAN_TO_SYSTEM } from "../data/systems.js";

describe("systems data", () => {
  it("exposes the 11 canonical system ids in the planned order", () => {
    expect(BODY_SYSTEMS).toHaveLength(11);
    expect(BODY_SYSTEMS.map((system) => system.id)).toEqual([
      "cardiovascular",
      "digestive",
      "endocrine",
      "immune",
      "integumentary",
      "muscular",
      "nervous",
      "reproductive",
      "respiratory",
      "skeletal",
      "urinary",
    ]);
  });

  it("only references organ ids that exist and keeps integumentary empty", () => {
    const organIds = new Set(ORGANS.map((organ) => organ.id));

    BODY_SYSTEMS.forEach((system) => {
      system.organIds.forEach((organId) => {
        expect(organIds.has(organId)).toBe(true);
      });
    });

    expect(
      BODY_SYSTEMS.find((system) => system.id === "integumentary")?.organIds,
    ).toEqual([]);
  });

  it("builds the reverse organ lookup for shared and reproductive systems", () => {
    expect(ORGAN_TO_SYSTEM.heart).toEqual(["cardiovascular"]);
    expect(ORGAN_TO_SYSTEM.thymus).toEqual(["endocrine", "immune"]);
    expect(ORGAN_TO_SYSTEM.knee_joint).toEqual(["muscular", "skeletal"]);
    expect(ORGAN_TO_SYSTEM.male_reproductive).toEqual(["reproductive"]);
    expect(ORGAN_TO_SYSTEM.female_reproductive).toEqual(["reproductive"]);
  });
});
