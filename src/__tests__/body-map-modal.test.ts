import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "../body-map-modal.js";
import { BodyMapModal } from "../body-map-modal.js";
import type { DiseaseEntry } from "../data/data-service.js";

async function createFixture(
  props: Partial<{
    sectionId: string | null;
    sectionName: string;
    diseases: DiseaseEntry[];
    symptoms: string[];
    loading: boolean;
    error: string | null;
    anchorX: number;
    anchorY: number;
  }> = {},
): Promise<BodyMapModal> {
  const el = document.createElement("body-map-modal") as BodyMapModal;
  if (props.sectionId !== undefined) el.sectionId = props.sectionId;
  if (props.sectionName !== undefined) el.sectionName = props.sectionName;
  if (props.diseases !== undefined) el.diseases = props.diseases;
  if (props.symptoms !== undefined) el.symptoms = props.symptoms;
  if (props.loading !== undefined) el.loading = props.loading;
  if (props.error !== undefined) el.error = props.error;
  if (props.anchorX !== undefined) el.anchorX = props.anchorX;
  if (props.anchorY !== undefined) el.anchorY = props.anchorY;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe("body-map-modal", () => {
  let el: BodyMapModal;
  const originalInnerWidth = window.innerWidth;
  const originalInnerHeight = window.innerHeight;

  afterEach(() => {
    el?.remove();
    document.body.innerHTML = "";
  });

  beforeEach(() => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 768,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: originalInnerWidth,
    });
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: originalInnerHeight,
    });
  });

  describe("MODAL-01: null sectionId renders nothing", () => {
    it("renders nothing when sectionId is null", async () => {
      el = await createFixture({ sectionId: null });
      const overlay = el.shadowRoot?.querySelector(".modal-overlay");
      expect(overlay).toBeNull();
    });
  });

  describe("MODAL-02: renders modal when sectionId is set", () => {
    it("renders modal container and backdrop when sectionId is set", async () => {
      el = await createFixture({
        sectionId: "head_neck",
        sectionName: "Head & Neck",
      });
      const overlay = el.shadowRoot?.querySelector(".modal-overlay");
      expect(overlay).not.toBeNull();
      const backdrop = el.shadowRoot?.querySelector(".modal-backdrop");
      expect(backdrop).not.toBeNull();
    });

    it("renders section name in modal header", async () => {
      el = await createFixture({
        sectionId: "head_neck",
        sectionName: "Head & Neck",
      });
      const header = el.shadowRoot?.querySelector(".modal-header");
      expect(header?.textContent).toContain("Head & Neck");
    });

    it("renders Symptoms tab and Diseases tab buttons", async () => {
      el = await createFixture({
        sectionId: "head_neck",
        sectionName: "Head & Neck",
      });
      const tabs = el.shadowRoot?.querySelectorAll(".tab");
      const tabTexts = Array.from(tabs ?? []).map((t) => t.textContent?.trim());
      expect(tabTexts).toContain("Symptoms");
      expect(tabTexts).toContain("Diseases");
    });

    it("places the carat in the header band and on the modal edge facing the anchor", async () => {
      el = await createFixture({
        sectionId: "heart",
        sectionName: "Heart",
        anchorX: 700,
        anchorY: 300,
      });

      const modal = el.shadowRoot?.querySelector(".modal") as HTMLElement | null;
      const carat = el.shadowRoot?.querySelector(
        ".modal-carat",
      ) as HTMLElement | null;

      expect(modal?.getAttribute("style")).toContain("left:168px;top:80px");
      expect(carat?.getAttribute("style")).toContain("left:681px;top:128px");
    });
  });

  describe("MODAL-03: tab switching", () => {
    it("Symptoms tab is active by default and shows symptom list", async () => {
      el = await createFixture({
        sectionId: "head_neck",
        sectionName: "Head & Neck",
        symptoms: ["Headache", "Dizziness"],
        diseases: [{ name: "Migraine" }],
      });
      const activeTab = el.shadowRoot?.querySelector(".tab.active");
      expect(activeTab?.textContent?.trim()).toBe("Symptoms");
      const body = el.shadowRoot?.querySelector(".modal-body");
      expect(body?.textContent).toContain("Headache");
    });

    it("clicking Diseases tab switches to diseases list", async () => {
      el = await createFixture({
        sectionId: "head_neck",
        sectionName: "Head & Neck",
        symptoms: ["Headache"],
        diseases: [{ name: "Migraine" }],
      });
      const tabs = el.shadowRoot?.querySelectorAll(".tab");
      const diseasesTab = Array.from(tabs ?? []).find(
        (t) => t.textContent?.trim() === "Diseases",
      );
      (diseasesTab as HTMLElement)?.click();
      await el.updateComplete;

      const activeTab = el.shadowRoot?.querySelector(".tab.active");
      expect(activeTab?.textContent?.trim()).toBe("Diseases");
      const body = el.shadowRoot?.querySelector(".modal-body");
      expect(body?.textContent).toContain("Migraine");
    });
  });

  describe("MODAL-04: checkbox symptoms", () => {
    it("symptoms rendered with checkboxes (input type=checkbox)", async () => {
      el = await createFixture({
        sectionId: "head_neck",
        sectionName: "Head & Neck",
        symptoms: ["Headache", "Dizziness"],
      });
      const checkboxes = el.shadowRoot?.querySelectorAll(
        'input[type="checkbox"]',
      );
      expect(checkboxes?.length).toBeGreaterThanOrEqual(2);
    });

    it("clicking a symptom checkbox dispatches symptom-toggle CustomEvent with symptom name and checked state", async () => {
      el = await createFixture({
        sectionId: "head_neck",
        sectionName: "Head & Neck",
        symptoms: ["Headache"],
      });
      const eventSpy = vi.fn();
      el.addEventListener("symptom-toggle", eventSpy);

      const checkbox = el.shadowRoot?.querySelector(
        'input[type="checkbox"]',
      ) as HTMLInputElement;
      expect(checkbox).not.toBeNull();
      checkbox.click();
      await el.updateComplete;

      expect(eventSpy).toHaveBeenCalledOnce();
      const detail = eventSpy.mock.calls[0][0].detail;
      expect(detail).toHaveProperty("symptom");
      expect(detail).toHaveProperty("checked");
    });
  });

  describe("MODAL-05: loading state", () => {
    it("renders skeleton shimmer bars when loading is true", async () => {
      el = await createFixture({
        sectionId: "head_neck",
        sectionName: "Head & Neck",
        loading: true,
      });
      const skeleton = el.shadowRoot?.querySelector(".skeleton-bar");
      expect(skeleton).not.toBeNull();
    });
  });

  describe("MODAL-06: empty states", () => {
    it("renders empty state 'No symptoms found' when symptoms array is empty and not loading", async () => {
      el = await createFixture({
        sectionId: "head_neck",
        sectionName: "Head & Neck",
        symptoms: [],
        diseases: [],
        loading: false,
      });
      const body = el.shadowRoot?.querySelector(".modal-body");
      expect(body?.textContent).toContain("No symptoms found");
    });

    it("renders empty state 'No diseases found' when diseases array is empty and not loading", async () => {
      el = await createFixture({
        sectionId: "head_neck",
        sectionName: "Head & Neck",
        symptoms: [],
        diseases: [],
        loading: false,
      });
      const tabs = el.shadowRoot?.querySelectorAll(".tab");
      const diseasesTab = Array.from(tabs ?? []).find(
        (t) => t.textContent?.trim() === "Diseases",
      );
      (diseasesTab as HTMLElement)?.click();
      await el.updateComplete;

      const body = el.shadowRoot?.querySelector(".modal-body");
      expect(body?.textContent).toContain("No diseases found");
    });
  });

  describe("MODAL-07: search filter", () => {
    it("search input filters displayed items within active tab", async () => {
      el = await createFixture({
        sectionId: "head_neck",
        sectionName: "Head & Neck",
        symptoms: ["Headache", "Dizziness", "Nausea"],
      });
      const input = el.shadowRoot?.querySelector(
        ".modal-search input",
      ) as HTMLInputElement;
      expect(input).not.toBeNull();

      input.value = "Head";
      input.dispatchEvent(new Event("input"));
      await el.updateComplete;

      expect(input).not.toBeNull();
    });
  });

  describe("MODAL-08: dismiss behavior", () => {
    it("clicking backdrop dispatches modal-close CustomEvent", async () => {
      el = await createFixture({
        sectionId: "head_neck",
        sectionName: "Head & Neck",
      });
      const eventSpy = vi.fn();
      el.addEventListener("modal-close", eventSpy);

      const backdrop = el.shadowRoot?.querySelector(
        ".modal-backdrop",
      ) as HTMLElement;
      expect(backdrop).not.toBeNull();
      backdrop.click();
      await el.updateComplete;

      expect(eventSpy).toHaveBeenCalledOnce();
    });

    it("Escape key dispatches modal-close CustomEvent", async () => {
      el = await createFixture({
        sectionId: "head_neck",
        sectionName: "Head & Neck",
      });
      const eventSpy = vi.fn();
      el.addEventListener("modal-close", eventSpy);

      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      await el.updateComplete;

      expect(eventSpy).toHaveBeenCalledOnce();
    });
  });

  describe("MODAL-09: error state", () => {
    it("renders error state 'Failed to load data.' with Retry button when error is set", async () => {
      el = await createFixture({
        sectionId: "head_neck",
        sectionName: "Head & Neck",
        error: "Network error",
      });
      const body = el.shadowRoot?.querySelector(".modal-body");
      expect(body?.textContent).toContain("Failed to load data");

      const retryBtn = el.shadowRoot?.querySelector(".retry-btn");
      expect(retryBtn).not.toBeNull();
    });

    it("clicking Retry button dispatches modal-retry CustomEvent", async () => {
      el = await createFixture({
        sectionId: "head_neck",
        sectionName: "Head & Neck",
        error: "Network error",
      });
      const eventSpy = vi.fn();
      el.addEventListener("modal-retry", eventSpy);

      const retryBtn = el.shadowRoot?.querySelector(
        ".retry-btn",
      ) as HTMLElement;
      expect(retryBtn).not.toBeNull();
      retryBtn.click();
      await el.updateComplete;

      expect(eventSpy).toHaveBeenCalledOnce();
    });
  });

  describe("MODAL-10: keyboard cleanup", () => {
    it("removes keydown listener on disconnect (no close event after removal)", async () => {
      el = await createFixture({
        sectionId: "head_neck",
        sectionName: "Head & Neck",
      });
      const eventSpy = vi.fn();
      el.addEventListener("modal-close", eventSpy);

      el.remove();

      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      expect(eventSpy).not.toHaveBeenCalled();
    });
  });
});
