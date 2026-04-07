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
    it("renders a body-map-model custom element with an SVG viewport", async () => {
      el.currentView = "organs";
      await el.updateComplete;

      const svg = el.shadowRoot?.querySelector("svg");

      expect(el.shadowRoot).toBeTruthy();
      expect(el.tagName.toLowerCase()).toBe("body-map-model");
      expect(svg?.getAttribute("viewBox")).toBe("0 0 698 1698");
    });

    it("renders 19 organ groups with hit-area paths and images", async () => {
      el.currentView = "organs";
      await el.updateComplete;

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

    it("renders the body silhouette image", async () => {
      el.currentView = "organs";
      await el.updateComplete;

      const silhouette = el.shadowRoot?.querySelector("#base-body");

      expect(silhouette).toBeTruthy();
      expect(silhouette?.getAttribute("href")).toContain("silhouette");
    });

    it("every hit-area path has a transform matching its organ position", async () => {
      el.currentView = "organs";
      await el.updateComplete;

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
      el.currentView = "organs";
      await el.updateComplete;

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
      el.currentView = "organs";
      await el.updateComplete;

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
      el.currentView = "organs";
      await el.updateComplete;

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
      el.currentView = "organs";
      await el.updateComplete;

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
    it("defaults to sections view and shows the sections layer", () => {
      const sectionsLayer = el.shadowRoot?.querySelector("#sections-layer");

      expect(el.currentView).toBe("sections");
      expect(sectionsLayer?.getAttribute("style")).toContain("opacity: 1");
    });

    it("switching to sections hides organs and shows front section groups", async () => {
      el.currentView = "sections";
      await el.updateComplete;

      const organsLayer = el.shadowRoot?.querySelector("#organs-layer");
      const sectionsLayer = el.shadowRoot?.querySelector("#sections-layer");
      const sectionGroups =
        el.shadowRoot?.querySelectorAll(
          ".sections-face.is-active .body-section-group",
        ) ?? [];

      expect(organsLayer).toBeNull();
      expect(sectionsLayer?.getAttribute("style")).toContain("opacity: 1");
      expect(sectionGroups).toHaveLength(
        SECTIONS.filter(
          (s) => s.side === "front" && (!s.gender || s.gender === "male"),
        ).length,
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
      expect(sectionsBaseBody?.getAttribute("href")).toContain(
        "sections-body-male",
      );
      expect(sectionsBaseBody?.getAttribute("href")).not.toContain(
        "silhouette",
      );
      expect(sectionsBaseBody?.getAttribute("pointer-events")).toBe("none");
    });

    it("sections view renders female body image when gender is female", async () => {
      el.currentView = "sections";
      el.currentGender = "female";
      await el.updateComplete;

      const sectionsBaseBody = el.shadowRoot?.querySelector(
        "#sections-base-body",
      );

      expect(sectionsBaseBody?.getAttribute("href")).toContain("sections-body");
      expect(sectionsBaseBody?.getAttribute("href")).not.toContain(
        "sections-body-male",
      );
    });

    it("sections view shows only 7 male front sections when gender is male", async () => {
      el.currentView = "sections";
      el.currentGender = "male";
      await el.updateComplete;
      const sectionGroups =
        el.shadowRoot?.querySelectorAll(
          ".sections-face.is-active .body-section-group",
        ) ?? [];
      expect(sectionGroups).toHaveLength(7);
    });

    it("sections view shows only 7 female front sections when gender is female", async () => {
      el.currentView = "sections";
      el.currentGender = "female";
      await el.updateComplete;
      const sectionGroups =
        el.shadowRoot?.querySelectorAll(
          ".sections-face.is-active .body-section-group",
        ) ?? [];
      expect(sectionGroups).toHaveLength(7);
    });

    it("uses 960x2600 viewBox for male front sections", async () => {
      el.currentView = "sections";
      el.currentGender = "male";
      await el.updateComplete;
      const svg = el.shadowRoot?.querySelector("svg");
      expect(svg?.getAttribute("viewBox")).toBe("0 0 960 2600");
    });

    it("uses 698x1698 viewBox for female front sections", async () => {
      el.currentView = "sections";
      el.currentGender = "female";
      await el.updateComplete;
      const svg = el.shadowRoot?.querySelector("svg");
      expect(svg?.getAttribute("viewBox")).toBe("0 0 698 1698");
    });
  });

  describe("MODEL-06B: sections front/back flip scene", () => {
    function getActiveFace(element: BodyMapModel): Element | null {
      return (
        element.shadowRoot?.querySelector(".sections-face.is-active") ?? null
      );
    }

    function getActiveFaceAssetHref(element: BodyMapModel): string | null {
      return (
        getActiveFace(element)
          ?.querySelector(".sections-base-body")
          ?.getAttribute("href") ?? null
      );
    }

    async function setSectionsState(
      element: BodyMapModel,
      gender: "male" | "female",
      facing: "front" | "back",
    ): Promise<void> {
      element.currentView = "sections";
      element.currentGender = gender;
      await element.updateComplete;

      const shouldFaceBack = facing === "back";
      const rotateBtn = element.shadowRoot?.querySelector(
        ".rotate-btn",
      ) as HTMLButtonElement | null;
      if (
        (rotateBtn?.getAttribute("aria-pressed") === "true") !==
        shouldFaceBack
      ) {
        rotateBtn?.dispatchEvent(
          new MouseEvent("click", { bubbles: true, composed: true }),
        );
        await element.updateComplete;
      }
    }

    it("declares a 3D flip scene with hidden backfaces in the component styles", () => {
      const styleEntries = (
        Array.isArray(BodyMapModel.styles)
          ? BodyMapModel.styles
          : [BodyMapModel.styles]
      ) as Array<{ cssText: string }>;
      const styles = styleEntries.map((style) => style.cssText).join("\n");

      expect(styles).toContain(".flip-scene");
      expect(styles).toContain(".flip-card");
      expect(styles).toContain("backface-visibility: hidden");
      expect(styles).toContain("rotateY(180deg)");
    });

    it("renders explicit front/back section faces and toggles the active face on rotate", async () => {
      el.currentView = "sections";
      el.currentGender = "female";
      await el.updateComplete;

      const flipScene = el.shadowRoot?.querySelector(".flip-scene");
      const flipCard = el.shadowRoot?.querySelector(".flip-card");
      const frontFace = el.shadowRoot?.querySelector(
        '.sections-face[data-facing="front"]',
      );
      const backFace = el.shadowRoot?.querySelector(
        '.sections-face[data-facing="back"]',
      );
      const rotateBtn = el.shadowRoot?.querySelector(
        ".rotate-btn",
      ) as HTMLButtonElement | null;

      expect(flipScene).not.toBeNull();
      expect(flipCard).not.toBeNull();
      expect(frontFace).not.toBeNull();
      expect(backFace).not.toBeNull();
      expect(frontFace?.classList.contains("is-active")).toBe(true);
      expect(backFace?.classList.contains("is-active")).toBe(false);
      expect(rotateBtn?.getAttribute("aria-label")).toBe("View Back");

      rotateBtn?.dispatchEvent(
        new MouseEvent("click", { bubbles: true, composed: true }),
      );
      await el.updateComplete;

      expect(flipCard?.classList.contains("is-back")).toBe(true);
      expect(frontFace?.classList.contains("is-active")).toBe(false);
      expect(backFace?.classList.contains("is-active")).toBe(true);
      expect(rotateBtn?.getAttribute("aria-label")).toBe("View Front");
      expect(rotateBtn?.getAttribute("aria-pressed")).toBe("true");
    });

    it("omits the inactive face asset ref from the initial sections render", async () => {
      await setSectionsState(el, "female", "front");

      const frontFace = el.shadowRoot?.querySelector(
        '.sections-face[data-facing="front"]',
      );
      const backFace = el.shadowRoot?.querySelector(
        '.sections-face[data-facing="back"]',
      );

      expect(frontFace?.querySelector(".sections-base-body")).not.toBeNull();
      expect(backFace?.querySelector(".sections-base-body")).toBeNull();
      expect(
        backFace?.querySelector('image[href*="sections-body-back"]'),
      ).toBeNull();
    });

    it("swaps the face asset ref when rotating to the back view", async () => {
      await setSectionsState(el, "female", "back");

      const frontFace = el.shadowRoot?.querySelector(
        '.sections-face[data-facing="front"]',
      );
      const backFace = el.shadowRoot?.querySelector(
        '.sections-face[data-facing="back"]',
      );

      expect(frontFace?.querySelector(".sections-base-body")).toBeNull();
      expect(backFace?.querySelector(".sections-base-body")).not.toBeNull();
      expect(
        backFace
          ?.querySelector(".sections-base-body")
          ?.getAttribute("href"),
      ).toContain("sections-body-back.webp");
    });

    it("uses the correct asset and visible section count for female front", async () => {
      await setSectionsState(el, "female", "front");

      expect(getActiveFace(el)?.getAttribute("data-facing")).toBe("front");
      expect(getActiveFaceAssetHref(el)).toContain("sections-body.webp");
      expect(getActiveFaceAssetHref(el)).not.toContain("male");
      expect(getActiveFaceAssetHref(el)).not.toContain("back");
      expect(
        getActiveFace(el)?.querySelectorAll(".body-section-group"),
      ).toHaveLength(7);
    });

    it("uses the correct asset and visible section count for female back", async () => {
      await setSectionsState(el, "female", "back");

      expect(getActiveFace(el)?.getAttribute("data-facing")).toBe("back");
      expect(getActiveFaceAssetHref(el)).toContain("sections-body-back.webp");
      expect(getActiveFaceAssetHref(el)).not.toContain("male");
      expect(
        getActiveFace(el)?.querySelectorAll(".body-section-group"),
      ).toHaveLength(7);
    });

    it("uses the correct asset and visible section count for male front", async () => {
      await setSectionsState(el, "male", "front");

      expect(getActiveFace(el)?.getAttribute("data-facing")).toBe("front");
      expect(getActiveFaceAssetHref(el)).toContain("sections-body-male.webp");
      expect(getActiveFaceAssetHref(el)).not.toContain("back");
      expect(
        getActiveFace(el)?.querySelectorAll(".body-section-group"),
      ).toHaveLength(7);
    });

    it("uses the correct asset and visible section count for male back", async () => {
      await setSectionsState(el, "male", "back");

      expect(getActiveFace(el)?.getAttribute("data-facing")).toBe("back");
      expect(getActiveFaceAssetHref(el)).toContain(
        "sections-body-male-back.webp",
      );
      expect(
        getActiveFace(el)?.querySelectorAll(".body-section-group"),
      ).toHaveLength(7);
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

    it("sections.ts exports 28 section definitions", () => {
      expect(SECTIONS).toHaveLength(28);
    });

    it("sections include 14 front and 14 back entries", () => {
      expect(
        SECTIONS.filter((section) => section.side === "front"),
      ).toHaveLength(14);
      expect(
        SECTIONS.filter((section) => section.side === "back"),
      ).toHaveLength(14);
    });

    it("front sections split evenly between male and female", () => {
      const front = SECTIONS.filter((s) => s.side === "front");
      expect(front.filter((s) => s.gender === "female")).toHaveLength(7);
      expect(front.filter((s) => s.gender === "male")).toHaveLength(7);
    });

    it("back sections split evenly between male and female", () => {
      const back = SECTIONS.filter((s) => s.side === "back");
      expect(back.filter((s) => s.gender === "female")).toHaveLength(7);
      expect(back.filter((s) => s.gender === "male")).toHaveLength(7);
    });
  });

  describe("MODEL-08: controlled organ selection via selectedOrganIds", () => {
    it("setting selectedOrganIds externally renders the heart group with selected class without any click", async () => {
      el.currentView = "organs";
      el.selectedOrganIds = ["heart"];
      await el.updateComplete;

      const heartGroup = el.shadowRoot?.querySelector('[data-part="heart"]');
      expect(heartGroup?.classList.contains("selected")).toBe(true);
    });

    it("setting selectedOrganIds to empty array clears all selected classes", async () => {
      el.currentView = "organs";
      el.selectedOrganIds = ["heart"];
      await el.updateComplete;
      el.selectedOrganIds = [];
      await el.updateComplete;

      const selected =
        el.shadowRoot?.querySelectorAll(".body-part-group.selected") ?? [];
      expect(selected).toHaveLength(0);
    });
  });

  describe("MODEL-09: system-highlight via systemHighlightOrganIds", () => {
    it("setting systemHighlightOrganIds renders those groups with system-highlighted class", async () => {
      el.currentView = "organs";
      el.systemHighlightOrganIds = ["heart", "lungs_left"];
      await el.updateComplete;

      const heartGroup = el.shadowRoot?.querySelector('[data-part="heart"]');
      const lungsGroup = el.shadowRoot?.querySelector(
        '[data-part="lungs_left"]',
      );

      expect(heartGroup?.classList.contains("system-highlighted")).toBe(true);
      expect(lungsGroup?.classList.contains("system-highlighted")).toBe(true);
    });

    it("systemHighlightOrganIds does not affect selectedOrganIds", async () => {
      el.currentView = "organs";
      el.systemHighlightOrganIds = ["heart", "lungs_left"];
      await el.updateComplete;

      expect(el.selectedOrganIds).toEqual([]);
      const selected =
        el.shadowRoot?.querySelectorAll(".body-part-group.selected") ?? [];
      expect(selected).toHaveLength(0);
    });

    it("system-highlighted groups do not gain selected class", async () => {
      el.currentView = "organs";
      el.systemHighlightOrganIds = ["heart"];
      await el.updateComplete;

      const heartGroup = el.shadowRoot?.querySelector('[data-part="heart"]');
      expect(heartGroup?.classList.contains("system-highlighted")).toBe(true);
      expect(heartGroup?.classList.contains("selected")).toBe(false);
    });
  });

  describe("section-click event", () => {
    async function switchToSections(element: BodyMapModel): Promise<void> {
      element.currentView = "sections";
      await element.updateComplete;
    }

    function getSectionGroup(element: BodyMapModel): Element | null {
      return element.shadowRoot?.querySelector(".body-section-group") ?? null;
    }

    function clickSectionGroup(sectionGroup: Element): void {
      const hitArea =
        sectionGroup.querySelector(".section-hit-area") ?? sectionGroup;
      hitArea.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          composed: true,
          clientX: 350,
          clientY: 200,
        }),
      );
    }

    it("dispatches a section-click CustomEvent when a section group is clicked", async () => {
      await switchToSections(el);
      const sectionGroup = getSectionGroup(el);
      let fired = false;
      el.addEventListener("section-click", () => {
        fired = true;
      });
      clickSectionGroup(sectionGroup!);
      await el.updateComplete;
      expect(fired).toBe(true);
    });

    it("section-click event detail contains sectionId matching data-part attribute", async () => {
      await switchToSections(el);
      const sectionGroup = getSectionGroup(el);
      const expectedId = sectionGroup?.getAttribute("data-part");
      let receivedId: string | undefined;
      el.addEventListener("section-click", (event) => {
        receivedId = (event as CustomEvent).detail.sectionId;
      });
      clickSectionGroup(sectionGroup!);
      await el.updateComplete;
      expect(receivedId).toBe(expectedId);
    });

    it("section-click event detail contains sectionName matching data-name attribute", async () => {
      await switchToSections(el);
      const sectionGroup = getSectionGroup(el);
      const expectedName = sectionGroup?.getAttribute("data-name");
      let receivedName: string | undefined;
      el.addEventListener("section-click", (event) => {
        receivedName = (event as CustomEvent).detail.sectionName;
      });
      clickSectionGroup(sectionGroup!);
      await el.updateComplete;
      expect(receivedName).toBe(expectedName);
    });

    it("section-click event detail contains clientX and clientY numbers", async () => {
      await switchToSections(el);
      const sectionGroup = getSectionGroup(el);
      let receivedX: number | undefined;
      let receivedY: number | undefined;
      el.addEventListener("section-click", (event) => {
        receivedX = (event as CustomEvent).detail.clientX;
        receivedY = (event as CustomEvent).detail.clientY;
      });
      clickSectionGroup(sectionGroup!);
      await el.updateComplete;
      expect(typeof receivedX).toBe("number");
      expect(typeof receivedY).toBe("number");
    });

    it("section-click event has bubbles: true and composed: true", async () => {
      await switchToSections(el);
      const sectionGroup = getSectionGroup(el);
      let receivedEvent: CustomEvent | undefined;
      el.addEventListener("section-click", (event) => {
        receivedEvent = event as CustomEvent;
      });
      clickSectionGroup(sectionGroup!);
      await el.updateComplete;
      expect(receivedEvent?.bubbles).toBe(true);
      expect(receivedEvent?.composed).toBe(true);
    });

    it("existing section toggle selection behavior still works after click", async () => {
      await switchToSections(el);
      const sectionGroup = getSectionGroup(el);
      // First click — should add to selection
      clickSectionGroup(sectionGroup!);
      await el.updateComplete;
      expect(sectionGroup?.classList.contains("selected")).toBe(true);
      // Second click — should remove from selection
      clickSectionGroup(sectionGroup!);
      await el.updateComplete;
      expect(sectionGroup?.classList.contains("selected")).toBe(false);
    });
  });

  describe("MODEL-10: organ-selection-change event detail", () => {
    it("clicking an organ emits organ-selection-change with lastToggled and selectedOrganIds", async () => {
      el.currentView = "organs";
      await el.updateComplete;

      let detail: {
        selected: string[];
        selectedOrganIds: string[];
        lastToggled: string;
        isSelected: boolean;
      } | null = null;
      const brainHitArea = el.shadowRoot?.querySelector(
        '[data-part="brain"] .hit-area',
      );

      el.addEventListener("organ-selection-change", (event) => {
        detail = (event as CustomEvent).detail;
      });

      brainHitArea?.dispatchEvent(
        new MouseEvent("click", { bubbles: true, composed: true }),
      );
      await el.updateComplete;

      expect(detail).not.toBeNull();
      expect(detail?.lastToggled).toBe("brain");
      expect(detail?.selectedOrganIds).toContain("brain");
      expect(detail?.isSelected).toBe(true);
    });

    it("deselecting an organ emits isSelected false and excludes it from selectedOrganIds", async () => {
      el.currentView = "organs";
      el.selectedOrganIds = ["brain"];
      await el.updateComplete;

      let detail: {
        selected: string[];
        selectedOrganIds: string[];
        lastToggled: string;
        isSelected: boolean;
      } | null = null;
      const brainHitArea = el.shadowRoot?.querySelector(
        '[data-part="brain"] .hit-area',
      );

      el.addEventListener("organ-selection-change", (event) => {
        detail = (event as CustomEvent).detail;
      });

      brainHitArea?.dispatchEvent(
        new MouseEvent("click", { bubbles: true, composed: true }),
      );
      await el.updateComplete;

      expect(detail?.lastToggled).toBe("brain");
      expect(detail?.isSelected).toBe(false);
      expect(detail?.selectedOrganIds).not.toContain("brain");
    });

    it("organs2 view still emits organ2-click on click", async () => {
      el.currentView = "organs2";
      await el.updateComplete;

      let organ2Detail: { organId: string } | null = null;
      el.addEventListener("organ2-click", (event) => {
        organ2Detail = (event as CustomEvent).detail;
      });

      const hitArea = el.shadowRoot?.querySelector(".hit-area");
      hitArea?.dispatchEvent(
        new MouseEvent("click", { bubbles: true, composed: true }),
      );
      await el.updateComplete;

      expect(organ2Detail).not.toBeNull();
      expect(organ2Detail?.organId).toBeTruthy();
    });
  });

  describe("MODEL-10: keyboard and aria accessibility", () => {
    it("exposes roving tabindex and pressed semantics for organ targets", async () => {
      el.currentView = "organs";
      await el.updateComplete;

      const brainGroup = el.shadowRoot?.querySelector(
        "#group-brain",
      ) as SVGGElement | null;
      const larynxGroup = el.shadowRoot?.querySelector(
        "#group-larynx_trachea",
      ) as SVGGElement | null;
      const activeViewTab = el.shadowRoot?.querySelector(
        ".view-tab.active-organs",
      ) as HTMLButtonElement | null;
      const activeGenderButton = el.shadowRoot?.querySelector(
        ".gender-btn.active",
      ) as HTMLButtonElement | null;

      expect(brainGroup?.getAttribute("tabindex")).toBe("0");
      expect(larynxGroup?.getAttribute("tabindex")).toBe("-1");
      expect(brainGroup?.getAttribute("role")).toBe("button");
      expect(brainGroup?.getAttribute("aria-label")).toBe("Select Brain");
      expect(brainGroup?.getAttribute("aria-pressed")).toBe("false");

      expect(activeViewTab?.getAttribute("aria-pressed")).toBe("true");
      expect(activeGenderButton?.getAttribute("aria-pressed")).toBe("true");
    });

    it("moves organ focus with ArrowRight and selects the active organ with Enter", async () => {
      el.currentView = "organs";
      await el.updateComplete;

      const brainGroup = el.shadowRoot?.querySelector(
        "#group-brain",
      ) as SVGGElement | null;
      const larynxGroup = el.shadowRoot?.querySelector(
        "#group-larynx_trachea",
      ) as SVGGElement | null;
      let detail:
        | {
            selectedOrganIds: string[];
            lastToggled: string;
            isSelected: boolean;
          }
        | undefined;

      el.addEventListener("organ-selection-change", (event) => {
        detail = (event as CustomEvent<typeof detail>).detail ?? undefined;
      });

      brainGroup?.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "ArrowRight",
          bubbles: true,
          composed: true,
        }),
      );
      await el.updateComplete;

      expect(brainGroup?.getAttribute("tabindex")).toBe("-1");
      expect(larynxGroup?.getAttribute("tabindex")).toBe("0");

      larynxGroup?.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Enter",
          bubbles: true,
          composed: true,
        }),
      );
      await el.updateComplete;

      expect(detail).toMatchObject({
        lastToggled: "larynx_trachea",
        isSelected: true,
      });
      expect(detail?.selectedOrganIds).toContain("larynx_trachea");
    });

    it("exposes pressed state on sections controls", async () => {
      el.currentView = "sections";
      await el.updateComplete;

      const activeViewTab = el.shadowRoot?.querySelector(
        ".view-tab.active-sections",
      ) as HTMLButtonElement | null;
      const activeGenderButton = el.shadowRoot?.querySelector(
        ".gender-btn.active",
      ) as HTMLButtonElement | null;
      const rotateButton = el.shadowRoot?.querySelector(
        ".rotate-btn",
      ) as HTMLButtonElement | null;

      expect(activeViewTab?.getAttribute("aria-pressed")).toBe("true");
      expect(activeGenderButton?.getAttribute("aria-pressed")).toBe("true");
      expect(rotateButton?.getAttribute("aria-label")).toBe("View Back");
      expect(rotateButton?.getAttribute("aria-pressed")).toBe("false");
    });

    it("supports keyboard semantics for visible body sections", async () => {
      el.currentView = "sections";
      el.currentGender = "male";
      await el.updateComplete;

      const sectionGroups = Array.from(
        el.shadowRoot?.querySelectorAll(".body-section-group") ?? [],
      ) as SVGGElement[];
      const [headSection, upperBodySection] = sectionGroups;
      let sectionDetail:
        | {
            sectionId: string;
            selected: boolean;
          }
        | undefined;

      el.addEventListener("section-click", (event) => {
        sectionDetail = (event as CustomEvent<typeof sectionDetail>).detail;
      });

      expect(headSection?.getAttribute("tabindex")).toBe("0");
      expect(upperBodySection?.getAttribute("tabindex")).toBe("-1");
      expect(headSection?.getAttribute("role")).toBe("button");
      expect(headSection?.getAttribute("aria-label")).toBe(
        "Select Head & Neck",
      );
      expect(headSection?.getAttribute("aria-pressed")).toBe("false");

      headSection?.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "ArrowRight",
          bubbles: true,
          composed: true,
        }),
      );
      await el.updateComplete;

      expect(headSection?.getAttribute("tabindex")).toBe("-1");
      expect(upperBodySection?.getAttribute("tabindex")).toBe("0");

      upperBodySection?.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: " ",
          bubbles: true,
          composed: true,
        }),
      );
      await el.updateComplete;

      expect(sectionDetail).toMatchObject({
        sectionId: "upper_body",
        selected: true,
      });
    });
  });
});
