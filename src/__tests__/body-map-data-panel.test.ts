import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "../body-map-data-panel.js";
import { BodyMapDataPanel } from "../body-map-data-panel.js";
import type { DiseaseEntry } from "../data/data-service.js";

// Mock ORGANS so tests do not depend on the real organs data
vi.mock("../data/organs.js", () => ({
  ORGANS: [
    { id: "brain", name: "Brain" },
    { id: "heart", name: "Heart" },
    { id: "liver", name: "Liver" },
  ],
}));

async function createPanel(
  props: Partial<{
    selectedOrganIds: string[];
    diseasesMap: Map<string, DiseaseEntry[]>;
    symptomsMap: Map<string, string[]>;
    loadingIds: Set<string>;
    errorIds: Map<string, string>;
    filterQuery: string;
  }> = {},
): Promise<BodyMapDataPanel> {
  const el = document.createElement(
    "body-map-data-panel",
  ) as BodyMapDataPanel;
  if (props.selectedOrganIds !== undefined)
    el.selectedOrganIds = props.selectedOrganIds;
  if (props.diseasesMap !== undefined) el.diseasesMap = props.diseasesMap;
  if (props.symptomsMap !== undefined) el.symptomsMap = props.symptomsMap;
  if (props.loadingIds !== undefined) el.loadingIds = props.loadingIds;
  if (props.errorIds !== undefined) el.errorIds = props.errorIds;
  if (props.filterQuery !== undefined) el.filterQuery = props.filterQuery;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe("body-map-data-panel", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    vi.clearAllMocks();
  });

  describe("PANEL-01: empty state when no organs selected", () => {
    it("renders nothing meaningful when selectedOrganIds is empty", async () => {
      const el = await createPanel({ selectedOrganIds: [] });
      const content = el.shadowRoot?.textContent ?? "";
      // Should have a header but no organ cards
      expect(content).toContain("Diseases & Symptoms");
      const cards = el.shadowRoot?.querySelectorAll(".organ-card");
      expect(cards?.length ?? 0).toBe(0);
    });
  });

  describe("PANEL-02: renders a card per selected organ", () => {
    it("renders a card with organ name as header when an organ is selected and data is provided", async () => {
      const el = await createPanel({
        selectedOrganIds: ["brain"],
        diseasesMap: new Map([
          ["brain", [{ name: "Migraine" }, { name: "Stroke" }]],
        ]),
        symptomsMap: new Map([["brain", ["Headache", "Dizziness"]]]),
        loadingIds: new Set(),
        errorIds: new Map(),
      });
      const text = el.shadowRoot?.textContent ?? "";
      expect(text).toContain("Brain");
    });

    it("renders disease names in a list inside the card (no ICD codes)", async () => {
      const el = await createPanel({
        selectedOrganIds: ["brain"],
        diseasesMap: new Map([
          ["brain", [{ name: "Migraine" }, { name: "Stroke" }]],
        ]),
        symptomsMap: new Map([["brain", []]]),
        loadingIds: new Set(),
        errorIds: new Map(),
      });
      const text = el.shadowRoot?.textContent ?? "";
      expect(text).toContain("Migraine");
      expect(text).toContain("Stroke");
    });

    it("renders symptom names in a list inside the card", async () => {
      const el = await createPanel({
        selectedOrganIds: ["brain"],
        diseasesMap: new Map([["brain", []]]),
        symptomsMap: new Map([["brain", ["Headache", "Dizziness"]]]),
        loadingIds: new Set(),
        errorIds: new Map(),
      });
      const text = el.shadowRoot?.textContent ?? "";
      expect(text).toContain("Headache");
      expect(text).toContain("Dizziness");
    });

    it("renders multiple stacked cards when multiple organs are selected", async () => {
      const el = await createPanel({
        selectedOrganIds: ["brain", "heart"],
        diseasesMap: new Map([
          ["brain", [{ name: "Stroke" }]],
          ["heart", [{ name: "Arrhythmia" }]],
        ]),
        symptomsMap: new Map([
          ["brain", []],
          ["heart", []],
        ]),
        loadingIds: new Set(),
        errorIds: new Map(),
      });
      const text = el.shadowRoot?.textContent ?? "";
      expect(text).toContain("Brain");
      expect(text).toContain("Heart");
      const cards = el.shadowRoot?.querySelectorAll(".organ-card");
      expect(cards?.length).toBe(2);
    });
  });

  describe("PANEL-03: skeleton loading state", () => {
    it("renders skeleton shimmer bars when organ is in loadingIds set", async () => {
      const el = await createPanel({
        selectedOrganIds: ["brain"],
        diseasesMap: new Map(),
        symptomsMap: new Map(),
        loadingIds: new Set(["brain"]),
        errorIds: new Map(),
      });
      const skeletonBars = el.shadowRoot?.querySelectorAll(".skeleton-bar");
      expect((skeletonBars?.length ?? 0) > 0).toBe(true);
    });
  });

  describe("PANEL-04: empty data states", () => {
    it("renders 'No diseases found' when diseases array is empty", async () => {
      const el = await createPanel({
        selectedOrganIds: ["brain"],
        diseasesMap: new Map([["brain", []]]),
        symptomsMap: new Map([["brain", ["Headache"]]]),
        loadingIds: new Set(),
        errorIds: new Map(),
      });
      const text = el.shadowRoot?.textContent ?? "";
      expect(text).toContain("No diseases found");
    });

    it("renders 'No symptoms found' when symptoms array is empty", async () => {
      const el = await createPanel({
        selectedOrganIds: ["brain"],
        diseasesMap: new Map([["brain", [{ name: "Stroke" }]]]),
        symptomsMap: new Map([["brain", []]]),
        loadingIds: new Set(),
        errorIds: new Map(),
      });
      const text = el.shadowRoot?.textContent ?? "";
      expect(text).toContain("No symptoms found");
    });
  });

  describe("PANEL-05: error state with retry", () => {
    it("renders 'Failed to load data.' with a Retry button when organ is in errorIds map", async () => {
      const el = await createPanel({
        selectedOrganIds: ["brain"],
        diseasesMap: new Map(),
        symptomsMap: new Map(),
        loadingIds: new Set(),
        errorIds: new Map([["brain", "Network error"]]),
      });
      const text = el.shadowRoot?.textContent ?? "";
      expect(text).toContain("Failed to load data");
      const retryBtn = el.shadowRoot?.querySelector(".retry-btn");
      expect(retryBtn).not.toBeNull();
    });

    it("clicking Retry dispatches 'retry-organ' CustomEvent with organId in detail", async () => {
      const el = await createPanel({
        selectedOrganIds: ["brain"],
        diseasesMap: new Map(),
        symptomsMap: new Map(),
        loadingIds: new Set(),
        errorIds: new Map([["brain", "Network error"]]),
      });

      const events: CustomEvent[] = [];
      el.addEventListener("retry-organ", (e) => events.push(e as CustomEvent));

      const retryBtn = el.shadowRoot?.querySelector(
        ".retry-btn",
      ) as HTMLButtonElement | null;
      retryBtn?.click();
      await el.updateComplete;

      expect(events.length).toBe(1);
      expect(events[0].detail.organId).toBe("brain");
    });
  });

  describe("PANEL-06: search filter", () => {
    it("when filterQuery is set, only diseases matching the query are shown", async () => {
      const el = await createPanel({
        selectedOrganIds: ["brain"],
        diseasesMap: new Map([
          [
            "brain",
            [{ name: "Migraine" }, { name: "Stroke" }, { name: "Epilepsy" }],
          ],
        ]),
        symptomsMap: new Map([["brain", []]]),
        loadingIds: new Set(),
        errorIds: new Map(),
        filterQuery: "stroke",
      });
      const text = el.shadowRoot?.textContent ?? "";
      expect(text).toContain("Stroke");
      expect(text).not.toContain("Migraine");
      expect(text).not.toContain("Epilepsy");
    });

    it("typing in search input dispatches 'filter-change' CustomEvent with query string", async () => {
      const el = await createPanel({
        selectedOrganIds: ["brain"],
        diseasesMap: new Map([["brain", [{ name: "Stroke" }]]]),
        symptomsMap: new Map([["brain", []]]),
        loadingIds: new Set(),
        errorIds: new Map(),
      });

      const events: CustomEvent[] = [];
      el.addEventListener("filter-change", (e) =>
        events.push(e as CustomEvent),
      );

      const input = el.shadowRoot?.querySelector(
        ".search-input",
      ) as HTMLInputElement | null;
      expect(input).not.toBeNull();

      if (input) {
        input.value = "stroke";
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }

      // Wait for debounce (250ms) + extra buffer
      await new Promise((r) => setTimeout(r, 400));

      expect(events.length).toBeGreaterThanOrEqual(1);
      expect(events[events.length - 1].detail.query).toBe("stroke");
    });
  });

  describe("PANEL-07: collapsible cards", () => {
    it("clicking a card header toggles the collapsed state of that card", async () => {
      const el = await createPanel({
        selectedOrganIds: ["brain"],
        diseasesMap: new Map([["brain", [{ name: "Stroke" }]]]),
        symptomsMap: new Map([["brain", ["Headache"]]]),
        loadingIds: new Set(),
        errorIds: new Map(),
      });

      const header = el.shadowRoot?.querySelector(
        ".card-header",
      ) as HTMLElement | null;
      expect(header).not.toBeNull();

      // Click to collapse
      header?.click();
      await el.updateComplete;

      const cardContent = el.shadowRoot?.querySelector(".card-content");
      expect(cardContent?.classList.contains("collapsed")).toBe(true);
    });
  });
});
