import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../body-map-model.js";
import { BodyMapModel } from "../body-map-model.js";
import { ORGANS } from "../data/organs.js";
import { SECTIONS } from "../data/sections.js";

async function createFixture(): Promise<BodyMapModel> {
  const el = document.createElement("body-map-model") as BodyMapModel;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe("body-map-model", () => {
  let el: BodyMapModel;

  beforeEach(async () => {
    el = await createFixture();
  });

  afterEach(() => {
    el.remove();
    document.body.innerHTML = "";
  });

  describe("MODEL-01: organ layer rendering", () => {
    it("renders a body-map-model custom element with an SVG viewport", () => {
      const svg = el.shadowRoot?.querySelector("svg");

      expect(el.shadowRoot).toBeTruthy();
      expect(el.tagName.toLowerCase()).toBe("body-map-model");
      expect(svg?.getAttribute("viewBox")).toBe("0 0 698 1698");
    });

    it("renders 19 organ groups with hit-area paths and images", () => {
      const groups = el.shadowRoot?.querySelectorAll(".body-part-group") ?? [];

      expect(groups).toHaveLength(19);

      groups.forEach((group) => {
        expect(group.querySelector(".hit-area")?.tagName.toLowerCase()).toBe(
          "path",
        );
        expect(group.querySelector(".part-image")?.tagName.toLowerCase()).toBe(
          "image",
        );
      });
    });

    it("renders the body silhouette image", () => {
      const silhouette = el.shadowRoot?.querySelector("#base-body");

      expect(silhouette).toBeTruthy();
      expect(silhouette?.getAttribute("href")).toContain("silhouette");
    });

    it("every hit-area path has a transform matching its organ position", () => {
      const organsLayer = el.shadowRoot?.querySelector("#organs-layer");
      const hitAreas = organsLayer?.querySelectorAll(".hit-area") ?? [];

      expect(hitAreas.length).toBeGreaterThan(0);

      hitAreas.forEach((path) => {
        const group = path.closest(".body-part-group");
        const partId = group?.getAttribute("data-part");
        const organ = ORGANS.find((o) => o.id === partId);

        expect(organ).toBeTruthy();
        expect(path.getAttribute("transform")).toBe(
          `translate(${organ!.imageX},${organ!.imageY})`,
        );
      });
    });
  });

  describe("MODEL-02: hit-area clickability", () => {
    it("clicking a hit-area fires organ-selection-change", async () => {
      let detail: string[] | null = null;
      const hitArea = el.shadowRoot?.querySelector(".hit-area");

      el.addEventListener("organ-selection-change", (event) => {
        detail = (event as CustomEvent<{ selected: string[] }>).detail.selected;
      });

      hitArea?.dispatchEvent(
        new MouseEvent("click", { bubbles: true, composed: true }),
      );
      await el.updateComplete;

      expect(detail).toContain("brain");
    });
  });

  describe("MODEL-03: hover feedback", () => {
    it("declares the blue hover and glow interaction styles", () => {
      const styleEntries = (
        Array.isArray(BodyMapModel.styles)
          ? BodyMapModel.styles
          : [BodyMapModel.styles]
      ) as Array<{ cssText: string }>;
      const styles = styleEntries.map((style) => style.cssText).join("\n");

      expect(styles).toContain("rgba(100, 180, 255, 0.35)");
      expect(styles).toContain("drop-shadow(0 0 6px rgba(66, 165, 245, 0.7))");
    });
  });

  describe("MODEL-04: click selection toggle", () => {
    it("toggles selected state on repeated clicks", async () => {
      const hitArea = el.shadowRoot?.querySelector(".hit-area");

      hitArea?.dispatchEvent(
        new MouseEvent("click", { bubbles: true, composed: true }),
      );
      await el.updateComplete;
      expect(
        hitArea?.closest(".body-part-group")?.classList.contains("selected"),
      ).toBe(true);

      hitArea?.dispatchEvent(
        new MouseEvent("click", { bubbles: true, composed: true }),
      );
      await el.updateComplete;
      expect(
        hitArea?.closest(".body-part-group")?.classList.contains("selected"),
      ).toBe(false);
    });

    it("allows multiple organ selections at once", async () => {
      const hitAreas = el.shadowRoot?.querySelectorAll(".hit-area") ?? [];

      hitAreas[0]?.dispatchEvent(
        new MouseEvent("click", { bubbles: true, composed: true }),
      );
      hitAreas[1]?.dispatchEvent(
        new MouseEvent("click", { bubbles: true, composed: true }),
      );
      await el.updateComplete;

      expect(
        el.shadowRoot?.querySelectorAll(".body-part-group.selected"),
      ).toHaveLength(2);
    });
  });

  describe("MODEL-05: gender toggle", () => {
    it("defaults to male and reflects gender changes to the host attribute", async () => {
      expect(el.currentGender).toBe("male");
      expect(el.getAttribute("current-gender")).toBe("male");

      el.currentGender = "female";
      await el.updateComplete;

      expect(el.getAttribute("current-gender")).toBe("female");
    });

    it("clears a hidden reproductive organ selection when gender changes", async () => {
      const maleGroup = el.shadowRoot?.querySelector(
        '[data-part="male_reproductive"] .hit-area',
      );

      maleGroup?.dispatchEvent(
        new MouseEvent("click", { bubbles: true, composed: true }),
      );
      await el.updateComplete;
      expect(
        el.shadowRoot
          ?.querySelector('[data-part="male_reproductive"]')
          ?.classList.contains("selected"),
      ).toBe(true);

      el.currentGender = "female";
      await el.updateComplete;

      expect(
        el.shadowRoot
          ?.querySelector('[data-part="male_reproductive"]')
          ?.classList.contains("selected"),
      ).toBe(false);
    });
  });

  describe("MODEL-06: view switching", () => {
    it("defaults to organs view and shows the organs layer", () => {
      const organsLayer = el.shadowRoot?.querySelector("#organs-layer");

      expect(el.currentView).toBe("organs");
      expect(organsLayer?.getAttribute("style")).toContain("opacity: 1");
    });

    it("switching to sections hides organs and shows front section groups", async () => {
      el.currentView = "sections";
      await el.updateComplete;

      const organsLayer = el.shadowRoot?.querySelector("#organs-layer");
      const sectionsLayer = el.shadowRoot?.querySelector("#sections-layer");
      const sectionGroups =
        el.shadowRoot?.querySelectorAll(".body-section-group") ?? [];

      expect(organsLayer?.getAttribute("style")).toContain("opacity: 0");
      expect(sectionsLayer?.getAttribute("style")).toContain("opacity: 1");
      expect(sectionGroups).toHaveLength(
        SECTIONS.filter((section) => section.side === "front").length,
      );
    });

    it("keeps the organs layer visible in organs2 mode", async () => {
      el.currentView = "organs2";
      await el.updateComplete;

      expect(
        el.shadowRoot?.querySelector("#organs-layer")?.getAttribute("style"),
      ).toContain("opacity: 1");
    });

    it("sections view renders green body background image", async () => {
      el.currentView = "sections";
      await el.updateComplete;

      const sectionsBaseBody = el.shadowRoot?.querySelector(
        "#sections-base-body",
      );

      expect(sectionsBaseBody).toBeTruthy();
      expect(sectionsBaseBody?.getAttribute("href")).toContain("sections-body");
      expect(sectionsBaseBody?.getAttribute("href")).not.toContain(
        "silhouette",
      );
      expect(sectionsBaseBody?.getAttribute("pointer-events")).toBe("none");
    });
  });

  describe("MODEL-07: external image loading", () => {
    it("uses external webp organ assets with no base64 data", () => {
      const images = el.shadowRoot?.querySelectorAll(".part-image") ?? [];

      images.forEach((image) => {
        const href = image.getAttribute("href") ?? "";
        expect(href).toContain(".webp");
        expect(href).not.toContain("base64");
      });
    });
  });

  describe("data files", () => {
    it("organs.ts exports 19 organ definitions", () => {
      expect(ORGANS).toHaveLength(19);
    });

    it("each organ has required fields", () => {
      for (const organ of ORGANS) {
        expect(organ.id).toBeTruthy();
        expect(organ.name).toBeTruthy();
        expect(organ.hitAreaPath).toBeTruthy();
        expect(organ.imageX).toBeDefined();
        expect(organ.imageY).toBeDefined();
        expect(organ.imageWidth).toBeGreaterThan(0);
        expect(organ.imageHeight).toBeGreaterThan(0);
      }
    });

    it("organs include exactly one male and one female reproductive entry", () => {
      const male = ORGANS.find((organ) => organ.isMaleRepro);
      const female = ORGANS.find((organ) => organ.isFemaleRepro);

      expect(male?.id).toBe("male_reproductive");
      expect(female?.id).toBe("female_reproductive");
      expect(male?.isFemaleRepro).not.toBe(true);
      expect(female?.isMaleRepro).not.toBe(true);
    });

    it("sections.ts exports 14 section definitions", () => {
      expect(SECTIONS).toHaveLength(14);
    });

    it("sections include 7 front and 7 back entries", () => {
      expect(
        SECTIONS.filter((section) => section.side === "front"),
      ).toHaveLength(7);
      expect(
        SECTIONS.filter((section) => section.side === "back"),
      ).toHaveLength(7);
    });
  });
});
