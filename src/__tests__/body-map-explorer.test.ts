import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "../body-map-explorer.js";
import { BodyMapExplorer } from "../body-map-explorer.js";
import { BodyMapSidebar } from "../body-map-sidebar.js";
import { BodyMapModel } from "../body-map-model.js";
import { BodyMapDetailPanel } from "../body-map-detail-panel.js";
import { BodyMapDataPanel } from "../body-map-data-panel.js";

// Mock fetchDiseases and fetchSymptomsForPart to avoid real network calls in explorer tests
vi.mock("../data/data-service.js", () => ({
  fetchDiseases: vi.fn().mockResolvedValue([{ name: "Test Disease" }]),
  fetchSymptomsForPart: vi.fn().mockResolvedValue(["Test Symptom"]),
  clearCache: vi.fn(),
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

    it("starts with no active system — detail panel shows empty state", async () => {
      const { detail } = await getShadowChildren(el);
      expect(detail?.system).toBeNull();
      const emptyText = detail?.shadowRoot?.textContent ?? "";
      expect(emptyText).toContain("Select a body system to see details.");
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
      expect(emptyText).toContain("Select a body system to see details.");
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
      expect(emptyText).toContain("Select a body system to see details.");
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
});
