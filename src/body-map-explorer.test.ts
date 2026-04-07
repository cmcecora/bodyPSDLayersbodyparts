import { expect, test, describe, beforeEach, afterEach, vi } from "vitest";
import "./body-map-explorer.js";
import { BodyMapExplorer } from "./body-map-explorer.js";
import { clearCache } from "./data/data-service.js";

describe("BodyMapExplorer API", () => {
  let el: BodyMapExplorer;

  beforeEach(async () => {
    clearCache();
    vi.restoreAllMocks();
    el = document.createElement("body-map-explorer") as BodyMapExplorer;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    document.body.removeChild(el);
    clearCache();
    vi.restoreAllMocks();
  });

  test("is defined", () => {
    expect(el).toBeInstanceOf(BodyMapExplorer);
  });

  describe("Properties and Attributes", () => {
    test("reflects active-system-id attribute to activeSystemId property", async () => {
      el.setAttribute("active-system-id", "nervous");
      await el.updateComplete;
      expect(el.activeSystemId).toBe("nervous");
    });

    test("reflects activeSystemId property to active-system-id attribute", async () => {
      el.activeSystemId = "skeletal";
      await el.updateComplete;
      expect(el.getAttribute("active-system-id")).toBe("skeletal");
    });

    test("reflects selected-organ-ids attribute to selectedOrganIds property (comma-separated)", async () => {
      el.setAttribute("selected-organ-ids", "heart,brain,lungs");
      await el.updateComplete;
      expect(el.selectedOrganIds).toEqual(["heart", "brain", "lungs"]);
    });

    test("reflects selectedOrganIds property to selected-organ-ids attribute", async () => {
      el.selectedOrganIds = ["liver", "kidneys"];
      await el.updateComplete;
      expect(el.getAttribute("selected-organ-ids")).toBe("liver,kidneys");
    });

    test("handles empty selected-organ-ids attribute", async () => {
      el.setAttribute("selected-organ-ids", "");
      await el.updateComplete;
      expect(el.selectedOrganIds).toEqual([]);
    });

    test("reflects asset-base property to asset-base attribute", async () => {
      el.assetBase = "/custom/assets/";
      await el.updateComplete;
      expect(el.getAttribute("asset-base")).toBe("/custom/assets/");
    });

    test("prefixes system thumbnails with asset-base in the sidebar and detail panel", async () => {
      el.assetBase = "/cdn";
      el.activeSystemId = "nervous";
      await el.updateComplete;

      const sidebar = el.shadowRoot!.querySelector("body-map-sidebar")!;
      const detail = el.shadowRoot!.querySelector("body-map-detail-panel")!;
      await sidebar.updateComplete;
      await detail.updateComplete;

      const sidebarThumb = sidebar.shadowRoot!.querySelector(".system-thumb")!;
      const detailThumb = detail.shadowRoot!.querySelector(".detail-thumb")!;

      expect(sidebarThumb.getAttribute("src")?.startsWith("/cdn/")).toBe(true);
      expect(detailThumb.getAttribute("src")).toBe(
        "/cdn/assets/systems/nervous.webp",
      );
    });
  });

  describe("Events", () => {
    test("dispatches system-selected event when activeSystemId changes via UI", async () => {
      let eventDetail: any = null;
      el.addEventListener("system-selected", (e: any) => {
        eventDetail = e.detail;
      });
      
      // Simulate internal system toggle request from sidebar
      const sidebar = el.shadowRoot!.querySelector("body-map-sidebar")!;
      sidebar.dispatchEvent(new CustomEvent("system-toggle-request", {
        detail: { systemId: "nervous" },
        bubbles: true,
        composed: true
      }));

      expect(eventDetail).toEqual({ systemId: "nervous", active: true });
    });

    test("dispatches organ-selected event when an organ is selected", async () => {
        let eventDetail: any = null;
        el.addEventListener("organ-selected", (e: any) => {
            eventDetail = e.detail;
        });
        
        const sidebar = el.shadowRoot!.querySelector("body-map-sidebar")!;
        sidebar.dispatchEvent(new CustomEvent("organ-select-request", {
            detail: { organId: "heart" },
            bubbles: true,
            composed: true
        }));

        expect(eventDetail).toEqual({ organId: "heart" });
    });

    test("dispatches organ-deselected event when an organ is deselected", async () => {
        el.selectedOrganIds = ["heart"];
        await el.updateComplete;

        let eventDetail: any = null;
        el.addEventListener("organ-deselected", (e: any) => {
            eventDetail = e.detail;
        });
        
        const sidebar = el.shadowRoot!.querySelector("body-map-sidebar")!;
        sidebar.dispatchEvent(new CustomEvent("organ-select-request", {
            detail: { organId: "heart" },
            bubbles: true,
            composed: true
        }));

        expect(eventDetail).toEqual({ organId: "heart" });
    });

    test("dispatches body-part-selected event when an organ is selected", async () => {
        let eventDetail: any = null;
        el.addEventListener("body-part-selected", (e: any) => {
            eventDetail = e.detail;
        });

        const sidebar = el.shadowRoot!.querySelector("body-map-sidebar")!;
        sidebar.dispatchEvent(new CustomEvent("organ-select-request", {
            detail: { organId: "heart" },
            bubbles: true,
            composed: true
        }));

        expect(eventDetail).toEqual({ organId: "heart", bodyPartId: "heart" });
    });

    test("dispatches body-part-deselected event when an organ is deselected", async () => {
        el.selectedOrganIds = ["heart"];
        await el.updateComplete;

        let eventDetail: any = null;
        el.addEventListener("body-part-deselected", (e: any) => {
            eventDetail = e.detail;
        });

        const sidebar = el.shadowRoot!.querySelector("body-map-sidebar")!;
        sidebar.dispatchEvent(new CustomEvent("organ-select-request", {
            detail: { organId: "heart" },
            bubbles: true,
            composed: true
        }));

        expect(eventDetail).toEqual({ organId: "heart", bodyPartId: "heart" });
    });
  });

  describe("Dual Data Mode", () => {
    async function toggleHeartSelection() {
      const sidebar = el.shadowRoot!.querySelector("body-map-sidebar")!;
      sidebar.dispatchEvent(
        new CustomEvent("organ-select-request", {
          detail: { organId: "heart" },
          bubbles: true,
          composed: true,
        }),
      );

      await el.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 0));
      await el.updateComplete;
    }

    async function readDataPanelText() {
      const dataPanel = el.shadowRoot!.querySelector("body-map-data-panel")!;
      await dataPanel.updateComplete;
      return dataPanel.shadowRoot!.textContent ?? "";
    }

    test("supports static object injection via externalData", async () => {
      const mockData = {
        diseases: {
          brain: [{ name: "Static Disease" }],
        },
        symptoms: {
          brain: ["Static Symptom"],
        },
      };

      el.externalData = mockData;
      await el.updateComplete;

      // Select brain organ
      const sidebar = el.shadowRoot!.querySelector("body-map-sidebar")!;
      sidebar.dispatchEvent(
        new CustomEvent("organ-select-request", {
          detail: { organId: "brain" },
          bubbles: true,
          composed: true,
        }),
      );

      await el.updateComplete;

      // Wait for async load (simulated with await)
      await new Promise((r) => setTimeout(r, 0));
      await el.updateComplete;

      const dataPanel = el.shadowRoot!.querySelector("body-map-data-panel")!;
      await dataPanel.updateComplete;
      
      const content = dataPanel.shadowRoot!.innerHTML;
      expect(content).toContain("Static Disease");
      expect(content).toContain("Static Symptom");
    });

    test("supports custom DataProvider injection via externalData", async () => {
      const mockProvider = {
        fetchDiseases: vi.fn().mockResolvedValue([{ name: "Provider Disease" }]),
        fetchSymptoms: vi.fn().mockResolvedValue(["Provider Symptom"]),
      };

      el.externalData = mockProvider;
      await el.updateComplete;

      const sidebar = el.shadowRoot!.querySelector("body-map-sidebar")!;
      sidebar.dispatchEvent(
        new CustomEvent("organ-select-request", {
          detail: { organId: "heart" },
          bubbles: true,
          composed: true,
        }),
      );

      await el.updateComplete;
      await new Promise((r) => setTimeout(r, 0));
      await el.updateComplete;

      expect(mockProvider.fetchDiseases).toHaveBeenCalledWith("heart");
      expect(mockProvider.fetchSymptoms).toHaveBeenCalledWith("heart");

      const dataPanel = el.shadowRoot!.querySelector("body-map-data-panel")!;
      await dataPanel.updateComplete;
      const content = dataPanel.shadowRoot!.innerHTML;
      expect(content).toContain("Provider Disease");
      expect(content).toContain("Provider Symptom");
    });

    test("refreshes loaded organ cards when switching from bundled data to static externalData", async () => {
      const mockFetch = vi.fn().mockImplementation((url: string) => {
        if (url.includes("/data/diseases/bp_heart.json")) {
          return Promise.resolve({
            json: () => Promise.resolve([{ name: "Internal Disease" }]),
          } as Response);
        }

        if (url.includes("/data/symptoms-by-part.json")) {
          return Promise.resolve({
            json: () => Promise.resolve({ bp_heart: ["Internal Symptom"] }),
          } as Response);
        }

        return Promise.reject(new Error(`unexpected url: ${url}`));
      });
      vi.stubGlobal("fetch", mockFetch);

      await toggleHeartSelection();
      expect(await readDataPanelText()).toContain("Internal Disease");

      el.externalData = {
        diseases: {
          heart: [{ name: "Static Disease" }],
        },
        symptoms: {
          heart: ["Static Symptom"],
        },
      };
      await el.updateComplete;

      await toggleHeartSelection();
      await toggleHeartSelection();

      const panelText = await readDataPanelText();
      expect(panelText).toContain("Static Disease");
      expect(panelText).toContain("Static Symptom");
    });

    test("refreshes loaded organ cards when switching from bundled data to provider externalData", async () => {
      const mockFetch = vi.fn().mockImplementation((url: string) => {
        if (url.includes("/data/diseases/bp_heart.json")) {
          return Promise.resolve({
            json: () => Promise.resolve([{ name: "Internal Disease" }]),
          } as Response);
        }

        if (url.includes("/data/symptoms-by-part.json")) {
          return Promise.resolve({
            json: () => Promise.resolve({ bp_heart: ["Internal Symptom"] }),
          } as Response);
        }

        return Promise.reject(new Error(`unexpected url: ${url}`));
      });
      vi.stubGlobal("fetch", mockFetch);

      await toggleHeartSelection();
      expect(await readDataPanelText()).toContain("Internal Disease");

      const mockProvider = {
        fetchDiseases: vi.fn().mockResolvedValue([{ name: "Provider Disease" }]),
        fetchSymptoms: vi.fn().mockResolvedValue(["Provider Symptom"]),
      };

      el.externalData = mockProvider;
      await el.updateComplete;

      await toggleHeartSelection();
      await toggleHeartSelection();

      const panelText = await readDataPanelText();
      expect(mockProvider.fetchDiseases).toHaveBeenCalledWith("heart");
      expect(mockProvider.fetchSymptoms).toHaveBeenCalledWith("heart");
      expect(panelText).toContain("Provider Disease");
      expect(panelText).toContain("Provider Symptom");
    });

    test("supports section modal data injection", async () => {
      const mockData = {
        diseases: {
          bp_head: [{ name: "Head Section Disease" }],
        },
        symptoms: {
          bp_head: ["Head Section Symptom"],
        },
      };

      el.externalData = mockData;
      await el.updateComplete;

      // Simulate section click on 'head_neck' (which includes bp_head)
      const model = el.shadowRoot!.querySelector("body-map-model")!;
      model.dispatchEvent(
        new CustomEvent("section-click", {
          detail: {
            sectionId: "head_neck",
            sectionName: "Head",
            clientX: 100,
            clientY: 100,
          },
          bubbles: true,
          composed: true,
        }),
      );

      // Wait for async load in explorer
      await new Promise((r) => setTimeout(r, 50));
      await el.updateComplete;

      const modal = el.shadowRoot!.querySelector("body-map-modal");
      expect(modal).not.toBeNull();
      await modal!.updateComplete;
      
      const modalContent = modal!.shadowRoot!.innerHTML;
      expect(modalContent).toContain("Head Section Symptom");

      // Switch to diseases tab
      const diseasesTab = modal!.shadowRoot!.querySelectorAll(".tab")[1] as HTMLElement;
      diseasesTab.click();
      await modal!.updateComplete;
      
      const modalContentDiseases = modal!.shadowRoot!.innerHTML;
      expect(modalContentDiseases).toContain("Head Section Disease");
    });
  });
});
