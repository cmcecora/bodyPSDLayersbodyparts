import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "../body-map-explorer.js";
import { BodyMapExplorer } from "../body-map-explorer.js";
import { BodyMapSidebar } from "../body-map-sidebar.js";
import { BodyMapModel } from "../body-map-model.js";
import { BodyMapDetailPanel } from "../body-map-detail-panel.js";
import { BodyMapDataPanel } from "../body-map-data-panel.js";
import { BodyMapModal } from "../body-map-modal.js";
import { BODY_PARTS, BODY_PARTS_BY_ID } from "../data/body-parts.js";
import { BODY_SYSTEMS, BODY_SYSTEMS_BY_ID } from "../data/systems.js";
import { designTokens } from "../styles/tokens.css.js";

// Mock fetchDiseases and fetchSymptomsForPart to avoid real network calls in explorer tests
vi.mock("../data/data-service.js", () => ({
  fetchDiseases: vi.fn().mockResolvedValue([{ name: "Test Disease" }]),
  fetchSymptomsForPart: vi.fn().mockResolvedValue(["Test Symptom"]),
  clearCache: vi.fn(),
  ORGAN_TO_DATA_KEY: {},
}));

async function createFixture(): Promise<BodyMapExplorer> {
  const el = document.createElement("body-map-explorer") as BodyMapExplorer;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

async function getShadowChildren(explorer: BodyMapExplorer) {
  const sidebar = explorer.shadowRoot?.querySelector(
    "body-map-sidebar",
  ) as BodyMapSidebar | null;
  const model = explorer.shadowRoot?.querySelector(
    "body-map-model",
  ) as BodyMapModel | null;
  const detail = explorer.shadowRoot?.querySelector(
    "body-map-detail-panel",
  ) as BodyMapDetailPanel | null;

  if (sidebar) await sidebar.updateComplete;
  if (model) await model.updateComplete;
  if (detail) await detail.updateComplete;

  return { sidebar, model, detail };
}

describe("body-map-explorer", () => {
  let el: BodyMapExplorer;

  beforeEach(async () => {
    el = await createFixture();
  });

  afterEach(() => {
    el.remove();
    document.body.innerHTML = "";
  });

  describe("EXPLORER-01: initial render", () => {
    it("renders sidebar, model, and detail panel child components", async () => {
      const { sidebar, model, detail } = await getShadowChildren(el);
      expect(sidebar).not.toBeNull();
      expect(model).not.toBeNull();
      expect(detail).not.toBeNull();
    });

    it("exports body-part and system lookup maps keyed by id", () => {
      expect(BODY_PARTS_BY_ID).toBeInstanceOf(Map);
      expect(BODY_PARTS_BY_ID.size).toBe(BODY_PARTS.length);
      expect(BODY_PARTS_BY_ID.get("bp_heart")?.name).toBe("Heart");

      expect(BODY_SYSTEMS_BY_ID).toBeInstanceOf(Map);
      expect(BODY_SYSTEMS_BY_ID.size).toBe(BODY_SYSTEMS.length);
      expect(BODY_SYSTEMS_BY_ID.get("cardiovascular")?.title).toBe(
        "Cardiovascular",
      );
    });

    it("starts with no active system — detail panel shows empty state", async () => {
      const { detail } = await getShadowChildren(el);
      expect(detail?.system).toBeNull();
      const emptyText = detail?.shadowRoot?.textContent ?? "";
      expect(emptyText).toContain(
        "Select a body system or body part to see details.",
      );
    });
  });

  describe("EXPLORER-02: sidebar system toggle activates system state", () => {
    it("clicking cardiovascular sidebar row sets activeSystemId and systemHighlightOrganIds", async () => {
      const { sidebar, model } = await getShadowChildren(el);
      expect(sidebar).not.toBeNull();

      sidebar!.dispatchEvent(
        new CustomEvent("system-toggle-request", {
          detail: { systemId: "cardiovascular" },
          bubbles: true,
          composed: true,
        }),
      );

      await el.updateComplete;
      await model?.updateComplete;

      expect(sidebar!.activeSystemId).toBe("cardiovascular");
      expect(model!.systemHighlightOrganIds).toEqual(["heart"]);
    });

    it("activating a system shows the system details in the detail panel", async () => {
      const { sidebar, detail } = await getShadowChildren(el);

      sidebar!.dispatchEvent(
        new CustomEvent("system-toggle-request", {
          detail: { systemId: "cardiovascular" },
          bubbles: true,
          composed: true,
        }),
      );

      await el.updateComplete;
      await detail?.updateComplete;

      expect(detail!.system?.id).toBe("cardiovascular");
    });

    it("activating a system renders the related body-part photo stack", async () => {
      const { sidebar, detail } = await getShadowChildren(el);

      sidebar!.dispatchEvent(
        new CustomEvent("system-toggle-request", {
          detail: { systemId: "respiratory" },
          bubbles: true,
          composed: true,
        }),
      );

      await el.updateComplete;
      await detail?.updateComplete;

      const photoIds = Array.from(
        detail!.shadowRoot?.querySelectorAll("[data-photo-id]") ?? [],
      ).map((node) => node.getAttribute("data-photo-id"));

      expect(photoIds).toEqual([
        "bp_lungs",
        "bp_neck",
        "bp_throat",
        "bp_esophagus",
      ]);
    });

    it("systems without organ photo mappings can render configured fallback body-part photos", async () => {
      const { sidebar, detail } = await getShadowChildren(el);

      sidebar!.dispatchEvent(
        new CustomEvent("system-toggle-request", {
          detail: { systemId: "integumentary" },
          bubbles: true,
          composed: true,
        }),
      );

      await el.updateComplete;
      await detail?.updateComplete;

      const photoIds = Array.from(
        detail!.shadowRoot?.querySelectorAll("[data-photo-id]") ?? [],
      ).map((node) => node.getAttribute("data-photo-id"));

      expect(photoIds).toEqual(["bp_skin"]);
    });

    it("clicking the same sidebar row again clears activeSystemId and systemHighlightOrganIds", async () => {
      const { sidebar, model } = await getShadowChildren(el);

      sidebar!.dispatchEvent(
        new CustomEvent("system-toggle-request", {
          detail: { systemId: "cardiovascular" },
          bubbles: true,
          composed: true,
        }),
      );
      await el.updateComplete;

      sidebar!.dispatchEvent(
        new CustomEvent("system-toggle-request", {
          detail: { systemId: "cardiovascular" },
          bubbles: true,
          composed: true,
        }),
      );
      await el.updateComplete;
      await model?.updateComplete;

      expect(sidebar!.activeSystemId).toBeNull();
      expect(model!.systemHighlightOrganIds).toEqual([]);
    });

    it("toggling off restores detail panel to empty state", async () => {
      const { sidebar, detail } = await getShadowChildren(el);

      sidebar!.dispatchEvent(
        new CustomEvent("system-toggle-request", {
          detail: { systemId: "cardiovascular" },
          bubbles: true,
          composed: true,
        }),
      );
      await el.updateComplete;
      await detail?.updateComplete;

      sidebar!.dispatchEvent(
        new CustomEvent("system-toggle-request", {
          detail: { systemId: "cardiovascular" },
          bubbles: true,
          composed: true,
        }),
      );
      await el.updateComplete;
      await detail?.updateComplete;

      expect(detail!.system).toBeNull();
      const emptyText = detail?.shadowRoot?.textContent ?? "";
      expect(emptyText).toContain(
        "Select a body system or body part to see details.",
      );
    });

    it("toggling off does not change existing selectedOrganIds", async () => {
      const { sidebar, model } = await getShadowChildren(el);

      model!.dispatchEvent(
        new CustomEvent("organ-selection-change", {
          detail: {
            selected: ["brain"],
            selectedOrganIds: ["brain"],
            lastToggled: "brain",
            isSelected: true,
          },
          bubbles: true,
          composed: true,
        }),
      );
      await el.updateComplete;

      sidebar!.dispatchEvent(
        new CustomEvent("system-toggle-request", {
          detail: { systemId: "cardiovascular" },
          bubbles: true,
          composed: true,
        }),
      );
      await el.updateComplete;

      sidebar!.dispatchEvent(
        new CustomEvent("system-toggle-request", {
          detail: { systemId: "cardiovascular" },
          bubbles: true,
          composed: true,
        }),
      );
      await el.updateComplete;
      await model?.updateComplete;

      expect(model!.selectedOrganIds).toContain("brain");
    });
  });

  describe("EXPLORER-03: organ click drives system activation", () => {
    it("organ-selection-change for heart activates cardiovascular system", async () => {
      const { sidebar, model, detail } = await getShadowChildren(el);

      model!.dispatchEvent(
        new CustomEvent("organ-selection-change", {
          detail: {
            selected: ["heart"],
            selectedOrganIds: ["heart"],
            lastToggled: "heart",
            isSelected: true,
          },
          bubbles: true,
          composed: true,
        }),
      );

      await el.updateComplete;
      await sidebar?.updateComplete;
      await detail?.updateComplete;

      expect(sidebar!.activeSystemId).toBe("cardiovascular");
      expect(detail!.system?.id).toBe("cardiovascular");
    });

    it("deselecting heart when no other cardiovascular organs are selected clears active system", async () => {
      const { sidebar, model, detail } = await getShadowChildren(el);

      model!.dispatchEvent(
        new CustomEvent("organ-selection-change", {
          detail: {
            selected: ["heart"],
            selectedOrganIds: ["heart"],
            lastToggled: "heart",
            isSelected: true,
          },
          bubbles: true,
          composed: true,
        }),
      );
      await el.updateComplete;

      model!.dispatchEvent(
        new CustomEvent("organ-selection-change", {
          detail: {
            selected: [],
            selectedOrganIds: [],
            lastToggled: "heart",
            isSelected: false,
          },
          bubbles: true,
          composed: true,
        }),
      );
      await el.updateComplete;
      await sidebar?.updateComplete;
      await detail?.updateComplete;

      expect(sidebar!.activeSystemId).toBeNull();
      expect(detail!.system).toBeNull();
      const emptyText = detail?.shadowRoot?.textContent ?? "";
      expect(emptyText).toContain(
        "Select a body system or body part to see details.",
      );
    });

    it("organ-selection-change updates model selectedOrganIds via explorer binding", async () => {
      const { model } = await getShadowChildren(el);

      model!.dispatchEvent(
        new CustomEvent("organ-selection-change", {
          detail: {
            selected: ["heart"],
            selectedOrganIds: ["heart"],
            lastToggled: "heart",
            isSelected: true,
          },
          bubbles: true,
          composed: true,
        }),
      );

      await el.updateComplete;
      await model?.updateComplete;

      expect(model!.selectedOrganIds).toEqual(["heart"]);
    });
  });

  describe("EXPLORER-03B: body-part detail panel state", () => {
    it("selecting a standalone body part shows its photo in the detail panel", async () => {
      const { sidebar, detail } = await getShadowChildren(el);

      sidebar!.dispatchEvent(
        new CustomEvent("body-part-select-request", {
          detail: { bodyPartId: "bp_face", organIds: [] },
          bubbles: true,
          composed: true,
        }),
      );

      await el.updateComplete;
      await detail?.updateComplete;

      const photoIds = Array.from(
        detail!.shadowRoot?.querySelectorAll("[data-photo-id]") ?? [],
      ).map((node) => node.getAttribute("data-photo-id"));

      expect(detail!.system).toBeNull();
      expect(photoIds).toEqual(["bp_face"]);
      expect(detail!.shadowRoot?.textContent ?? "").toContain("Face");
    });

    it("selecting a standalone body part overrides a previously active system", async () => {
      const { sidebar, detail } = await getShadowChildren(el);

      sidebar!.dispatchEvent(
        new CustomEvent("system-toggle-request", {
          detail: { systemId: "cardiovascular" },
          bubbles: true,
          composed: true,
        }),
      );
      await el.updateComplete;

      sidebar!.dispatchEvent(
        new CustomEvent("body-part-select-request", {
          detail: { bodyPartId: "bp_face", organIds: [] },
          bubbles: true,
          composed: true,
        }),
      );

      await el.updateComplete;
      await detail?.updateComplete;

      const photoIds = Array.from(
        detail!.shadowRoot?.querySelectorAll("[data-photo-id]") ?? [],
      ).map((node) => node.getAttribute("data-photo-id"));

      expect(detail!.system).toBeNull();
      expect(photoIds).toEqual(["bp_face"]);
      expect(detail!.shadowRoot?.textContent ?? "").toContain("Face");
    });

    it("passes asset-base through to detail photo urls", async () => {
      el.remove();
      document.body.innerHTML = "";

      el = document.createElement("body-map-explorer") as BodyMapExplorer;
      el.setAttribute("asset-base", "/preview");
      document.body.appendChild(el);
      await el.updateComplete;

      const { sidebar, detail } = await getShadowChildren(el);
      sidebar!.dispatchEvent(
        new CustomEvent("system-toggle-request", {
          detail: { systemId: "cardiovascular" },
          bubbles: true,
          composed: true,
        }),
      );

      await el.updateComplete;
      await detail?.updateComplete;

      const image = detail!.shadowRoot?.querySelector(
        ".detail-photo",
      ) as HTMLImageElement | null;

      expect(image?.getAttribute("src")).toBe(
        "/preview/assets/body-parts/heart.webp",
      );
    });

    it("renders detail images with lazy loading and async decoding", async () => {
      const { sidebar, detail } = await getShadowChildren(el);

      sidebar!.dispatchEvent(
        new CustomEvent("system-toggle-request", {
          detail: { systemId: "cardiovascular" },
          bubbles: true,
          composed: true,
        }),
      );

      await el.updateComplete;
      await detail?.updateComplete;

      const thumbnail = detail!.shadowRoot?.querySelector(
        ".detail-thumb",
      ) as HTMLImageElement | null;
      const photo = detail!.shadowRoot?.querySelector(
        ".detail-photo",
      ) as HTMLImageElement | null;

      expect(thumbnail?.getAttribute("loading")).toBe("lazy");
      expect(thumbnail?.getAttribute("decoding")).toBe("async");
      expect(photo?.getAttribute("loading")).toBe("lazy");
      expect(photo?.getAttribute("decoding")).toBe("async");
    });
  });

  describe("EXPLORER-04: state isolation", () => {
    it("system highlights do not appear in selectedOrganIds", async () => {
      const { sidebar, model } = await getShadowChildren(el);

      sidebar!.dispatchEvent(
        new CustomEvent("system-toggle-request", {
          detail: { systemId: "cardiovascular" },
          bubbles: true,
          composed: true,
        }),
      );
      await el.updateComplete;
      await model?.updateComplete;

      expect(model!.systemHighlightOrganIds).toEqual(["heart"]);
      expect(model!.selectedOrganIds).toEqual([]);
    });

    it('expect(model.systemHighlightOrganIds).toEqual(["heart"])', async () => {
      const { sidebar, model } = await getShadowChildren(el);

      sidebar!.dispatchEvent(
        new CustomEvent("system-toggle-request", {
          detail: { systemId: "cardiovascular" },
          bubbles: true,
          composed: true,
        }),
      );
      await el.updateComplete;
      await model?.updateComplete;

      expect(model!.systemHighlightOrganIds).toEqual(["heart"]);
      expect(sidebar!.activeSystemId).toBe("cardiovascular");
    });

    it('expect(detail.system?.id).toBe("cardiovascular")', async () => {
      const { sidebar, detail } = await getShadowChildren(el);

      sidebar!.dispatchEvent(
        new CustomEvent("system-toggle-request", {
          detail: { systemId: "cardiovascular" },
          bubbles: true,
          composed: true,
        }),
      );
      await el.updateComplete;
      await detail?.updateComplete;

      expect(detail!.system?.id).toBe("cardiovascular");
    });

    it("expect(detail.system).toBeNull() after deselection", async () => {
      const { sidebar, detail } = await getShadowChildren(el);

      sidebar!.dispatchEvent(
        new CustomEvent("system-toggle-request", {
          detail: { systemId: "cardiovascular" },
          bubbles: true,
          composed: true,
        }),
      );
      await el.updateComplete;

      sidebar!.dispatchEvent(
        new CustomEvent("system-toggle-request", {
          detail: { systemId: "cardiovascular" },
          bubbles: true,
          composed: true,
        }),
      );
      await el.updateComplete;
      await detail?.updateComplete;

      expect(detail!.system).toBeNull();
    });
  });

  describe("EXPLORER-06: modal integration", () => {
    it("explorer does NOT render body-map-modal when _modalSectionId is null (initial state)", async () => {
      const modal = el.shadowRoot?.querySelector(
        "body-map-modal",
      ) as BodyMapModal | null;
      expect(modal).toBeNull();
    });

    it("explorer renders body-map-modal element when section-click event is dispatched", async () => {
      const { model } = await getShadowChildren(el);

      model!.dispatchEvent(
        new CustomEvent("section-click", {
          detail: {
            sectionId: "head_neck",
            sectionName: "Head & Neck",
            clientX: 200,
            clientY: 300,
          },
          bubbles: true,
          composed: true,
        }),
      );

      await el.updateComplete;

      const modal = el.shadowRoot?.querySelector(
        "body-map-modal",
      ) as BodyMapModal | null;
      expect(modal).not.toBeNull();
    });

    it("explorer has @section-click handler — body-map-model dispatches section-click and explorer responds", async () => {
      const { model } = await getShadowChildren(el);

      // Dispatch the event
      model!.dispatchEvent(
        new CustomEvent("section-click", {
          detail: {
            sectionId: "upper_body",
            sectionName: "Upper Body",
            clientX: 100,
            clientY: 200,
          },
          bubbles: true,
          composed: true,
        }),
      );

      await el.updateComplete;

      // Modal should now exist and have the correct sectionId
      const modal = el.shadowRoot?.querySelector(
        "body-map-modal",
      ) as BodyMapModal | null;
      expect(modal).not.toBeNull();
      expect(modal?.sectionId).toBe("upper_body");
    });

    it("closing a section modal clears the section highlight in the body model", async () => {
      const { model } = await getShadowChildren(el);

      model!.currentView = "sections";
      await model?.updateComplete;

      const hitArea = model!.shadowRoot?.querySelector(
        '[data-part="head_neck"] .section-hit-area',
      ) as SVGElement | null;
      expect(hitArea).not.toBeNull();

      hitArea?.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          composed: true,
          clientX: 200,
          clientY: 300,
        }),
      );

      await model?.updateComplete;
      await el.updateComplete;

      const selectedSectionBeforeClose = model!.shadowRoot?.querySelector(
        '[data-part="head_neck"].selected',
      );
      expect(selectedSectionBeforeClose).not.toBeNull();

      const modal = el.shadowRoot?.querySelector(
        "body-map-modal",
      ) as BodyMapModal | null;
      expect(modal).not.toBeNull();

      modal?.dispatchEvent(
        new CustomEvent("modal-close", {
          bubbles: true,
          composed: true,
        }),
      );

      await el.updateComplete;
      await model?.updateComplete;

      const selectedSectionAfterClose = model!.shadowRoot?.querySelector(
        '[data-part="head_neck"].selected',
      );
      const closedModal = el.shadowRoot?.querySelector("body-map-modal");

      expect(closedModal).toBeNull();
      expect(selectedSectionAfterClose).toBeNull();
    });

    it("Organs 2 body-part clicks anchor the modal to the selected body location", async () => {
      const { sidebar, model } = await getShadowChildren(el);

      model!.currentView = "organs2";
      await model?.updateComplete;
      model!.dispatchEvent(
        new CustomEvent("view-change", {
          detail: { view: "organs2" },
          bubbles: true,
          composed: true,
        }),
      );
      await el.updateComplete;
      await model?.updateComplete;

      sidebar!.dispatchEvent(
        new CustomEvent("body-part-select-request", {
          detail: { bodyPartId: "bp_heart", organIds: ["heart"] },
          bubbles: true,
          composed: true,
        }),
      );

      await el.updateComplete;
      await model?.updateComplete;

      const modal = el.shadowRoot?.querySelector(
        "body-map-modal",
      ) as BodyMapModal | null;
      expect(modal).not.toBeNull();
      expect(modal?.sectionId).toBe("bp_heart");
      expect(modal?.anchorX).toBe(349);
      expect(modal?.anchorY).toBe(340);
    });

    it("Organs 2 modal anchoring does not depend on querying body-map-model from renderRoot", async () => {
      const { sidebar, model } = await getShadowChildren(el);

      model!.currentView = "organs2";
      await model?.updateComplete;
      model!.dispatchEvent(
        new CustomEvent("view-change", {
          detail: { view: "organs2" },
          bubbles: true,
          composed: true,
        }),
      );
      await el.updateComplete;
      await model?.updateComplete;

      const originalQuerySelector = el.renderRoot.querySelector.bind(
        el.renderRoot,
      );
      const querySpy = vi
        .spyOn(el.renderRoot, "querySelector")
        .mockImplementation((selector: string) => {
          if (selector === "body-map-model") {
            throw new Error("explorer should use a cached model reference");
          }
          return originalQuerySelector(selector);
        });

      sidebar!.dispatchEvent(
        new CustomEvent("body-part-select-request", {
          detail: { bodyPartId: "bp_heart", organIds: ["heart"] },
          bubbles: true,
          composed: true,
        }),
      );

      await el.updateComplete;
      await model?.updateComplete;

      const modal = el.shadowRoot?.querySelector(
        "body-map-modal",
      ) as BodyMapModal | null;
      expect(modal).not.toBeNull();
      expect(modal?.anchorX).toBe(349);
      expect(modal?.anchorY).toBe(340);

      querySpy.mockRestore();
    });
  });

  describe("EXPLORER-07: accessibility announcements and sidebar semantics", () => {
    it("renders a polite live announcer and updates it for organ selection events", async () => {
      const { sidebar, model } = await getShadowChildren(el);
      const announcer = () =>
        el.shadowRoot?.querySelector(
          '[data-testid="live-announcer"]',
        ) as HTMLDivElement | null;

      expect(announcer()?.getAttribute("aria-live")).toBe("polite");

      model!.dispatchEvent(
        new CustomEvent("organ-selection-change", {
          detail: {
            selected: ["heart"],
            selectedOrganIds: ["heart"],
            lastToggled: "heart",
            isSelected: true,
          },
          bubbles: true,
          composed: true,
        }),
      );
      await el.updateComplete;

      expect(announcer()?.textContent?.trim()).toBe(
        "Heart selected. Body system: Cardiovascular.",
      );
      expect(sidebar?.activeSystemId).toBe("cardiovascular");
    });

    it("announces system selection when the sidebar activates a system", async () => {
      const { sidebar } = await getShadowChildren(el);
      const announcer = () =>
        el.shadowRoot?.querySelector(
          '[data-testid="live-announcer"]',
        ) as HTMLDivElement | null;

      sidebar!.dispatchEvent(
        new CustomEvent("system-toggle-request", {
          detail: { systemId: "cardiovascular" },
          bubbles: true,
          composed: true,
        }),
      );
      await el.updateComplete;

      expect(announcer()?.textContent?.trim()).toBe(
        "Cardiovascular system selected.",
      );
    });

    it("exposes expanded, search, and pressed state on sidebar body-part controls", async () => {
      const { sidebar } = await getShadowChildren(el);
      const bodyPartsToggle = sidebar!.shadowRoot?.querySelector(
        ".body-parts-header-toggle",
      ) as HTMLButtonElement | null;
      expect(bodyPartsToggle?.getAttribute("aria-expanded")).toBe("false");
      expect(bodyPartsToggle?.getAttribute("aria-controls")).toBe(
        "body-parts-panel",
      );
      expect(
        sidebar!.shadowRoot?.querySelector(".body-parts-search-input"),
      ).toBeNull();
      expect(
        sidebar!.shadowRoot?.querySelector('[data-body-part-id="bp_face"]'),
      ).toBeNull();

      bodyPartsToggle?.dispatchEvent(
        new MouseEvent("click", { bubbles: true, composed: true }),
      );
      await sidebar?.updateComplete;

      const searchInput = sidebar!.shadowRoot?.querySelector(
        ".body-parts-search-input",
      ) as HTMLInputElement | null;
      let faceButton = sidebar!.shadowRoot?.querySelector(
        '[data-body-part-id="bp_face"]',
      ) as HTMLButtonElement | null;

      expect(bodyPartsToggle?.getAttribute("aria-expanded")).toBe("true");
      expect(searchInput?.getAttribute("aria-label")).toBe("Search body parts");
      expect(faceButton?.getAttribute("aria-pressed")).toBe("false");

      sidebar!.dispatchEvent(
        new CustomEvent("body-part-select-request", {
          detail: { bodyPartId: "bp_face", organIds: [] },
          bubbles: true,
          composed: true,
        }),
      );
      await el.updateComplete;
      await sidebar?.updateComplete;

      faceButton = sidebar!.shadowRoot?.querySelector(
        '[data-body-part-id="bp_face"]',
      ) as HTMLButtonElement | null;

      expect(faceButton?.getAttribute("aria-pressed")).toBe("true");
    });
  });

  describe("EXPLORER-08: responsive shell style contract", () => {
    it("declares container-query layout breakpoints on the explorer shell", () => {
      const styleEntries = (
        Array.isArray(BodyMapExplorer.styles)
          ? BodyMapExplorer.styles
          : [BodyMapExplorer.styles]
      ) as Array<{ cssText: string }>;
      const styles = styleEntries.map((style) => style.cssText).join("\n");

      expect(styles).toContain("container-type: inline-size");
      expect(styles).toContain("@container (max-width: 1280px)");
      expect(styles).toContain("@container (max-width: 820px)");
    });

    it("drops sticky viewport locking from the data panel in narrow container mode", () => {
      const styleEntries = (
        Array.isArray(BodyMapExplorer.styles)
          ? BodyMapExplorer.styles
          : [BodyMapExplorer.styles]
      ) as Array<{ cssText: string }>;
      const styles = styleEntries.map((style) => style.cssText).join("\n");

      expect(styles).toContain(".data-panel-col");
      expect(styles).toContain("position: static");
      expect(styles).toContain("max-height: none");
    });
  });

  describe("EXPLORER-09: polish token and focus contract", () => {
    it("defines shared polish tokens for radius, shadow, and focus treatment", () => {
      const styles = designTokens.cssText;

      expect(styles).toContain("--bme-radius-lg");
      expect(styles).toContain("--bme-shadow-soft");
      expect(styles).toContain("--bme-focus-ring");
    });

    it("applies shared polish tokens and focus-visible states across panel components", () => {
      const sidebarStyles = (
        Array.isArray(BodyMapSidebar.styles)
          ? BodyMapSidebar.styles
          : [BodyMapSidebar.styles]
      )
        .map((style) => style.cssText)
        .join("\n");
      const detailStyles = (
        Array.isArray(BodyMapDetailPanel.styles)
          ? BodyMapDetailPanel.styles
          : [BodyMapDetailPanel.styles]
      )
        .map((style) => style.cssText)
        .join("\n");
      const dataStyles = (
        Array.isArray(BodyMapDataPanel.styles)
          ? BodyMapDataPanel.styles
          : [BodyMapDataPanel.styles]
      )
        .map((style) => style.cssText)
        .join("\n");

      expect(sidebarStyles).toContain(":focus-visible");
      expect(sidebarStyles).toContain("var(--bme-focus-ring)");
      expect(sidebarStyles).toContain("var(--bme-radius-lg)");

      expect(detailStyles).toContain("var(--bme-radius-lg)");
      expect(detailStyles).toContain("var(--bme-shadow-soft)");

      expect(dataStyles).toContain(":focus-visible");
      expect(dataStyles).toContain("var(--bme-shadow-soft)");
    });
  });

  describe("EXPLORER-05: 4th column data panel integration", () => {
    it("explorer renders body-map-data-panel element in shadow DOM", async () => {
      const dataPanel = el.shadowRoot?.querySelector(
        "body-map-data-panel",
      ) as BodyMapDataPanel | null;
      expect(dataPanel).not.toBeNull();
    });

    it("explorer grid has 4 columns (minmax(280px, 1fr) present in styles)", () => {
      // Check the static styles contain the 4-column declaration
      const stylesText = BodyMapExplorer.styles
        .map((s) => s.toString())
        .join(" ");
      expect(stylesText).toContain("minmax(280px");
    });

    it("selecting an organ causes the data panel to receive that organ ID in selectedOrganIds", async () => {
      const { model } = await getShadowChildren(el);

      model!.dispatchEvent(
        new CustomEvent("organ-selection-change", {
          detail: {
            selectedOrganIds: ["heart"],
            lastToggled: "heart",
            isSelected: true,
          },
          bubbles: true,
          composed: true,
        }),
      );

      await el.updateComplete;

      const dataPanel = el.shadowRoot?.querySelector(
        "body-map-data-panel",
      ) as BodyMapDataPanel | null;
      await dataPanel?.updateComplete;

      expect(dataPanel?.selectedOrganIds).toContain("heart");
    });
  });

  describe("EXPLORER-10: shared shell header and body-part-grid mode", () => {
    it("renders the shared site header above the explorer layout", () => {
      const header = el.shadowRoot?.querySelector("body-map-header");

      expect(header).not.toBeNull();
    });

    it("switches into body-part-grid mode from the shared header nav", async () => {
      const header = el.shadowRoot?.querySelector(
        "body-map-header",
      ) as HTMLElement | null;

      header?.dispatchEvent(
        new CustomEvent("site-nav-request", {
          detail: { navId: "body-part" },
          bubbles: true,
          composed: true,
        }),
      );

      await el.updateComplete;

      const layout = el.shadowRoot?.querySelector(".layout");
      const gridView = el.shadowRoot?.querySelector("body-part-grid-view");
      const dataPanel = el.shadowRoot?.querySelector("body-map-data-panel");
      const detailPanel = el.shadowRoot?.querySelector("body-map-detail-panel");

      expect(layout?.classList.contains("grid-mode")).toBe(true);
      expect(gridView).not.toBeNull();
      expect(dataPanel).toBeNull();
      expect(detailPanel).toBeNull();
    });

    it("opens a body part from the grid and returns to the explorer detail panel", async () => {
      const header = el.shadowRoot?.querySelector(
        "body-map-header",
      ) as HTMLElement | null;

      header?.dispatchEvent(
        new CustomEvent("site-nav-request", {
          detail: { navId: "body-part" },
          bubbles: true,
          composed: true,
        }),
      );
      await el.updateComplete;

      const gridView = el.shadowRoot?.querySelector(
        "body-part-grid-view",
      ) as HTMLElement | null;

      gridView?.dispatchEvent(
        new CustomEvent("body-part-card-open-request", {
          detail: { bodyPartId: "bp_heart" },
          bubbles: true,
          composed: true,
        }),
      );
      await el.updateComplete;

      const detailPanel = el.shadowRoot?.querySelector(
        "body-map-detail-panel",
      ) as BodyMapDetailPanel | null;
      await detailPanel?.updateComplete;

      expect(el.shadowRoot?.querySelector("body-part-grid-view")).toBeNull();
      expect(detailPanel?.bodyPart?.id).toBe("bp_heart");
      expect(detailPanel?.shadowRoot?.textContent).toContain("Heart");
    });
  });
});
