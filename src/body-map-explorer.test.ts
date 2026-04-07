import { expect, test, describe, beforeEach, afterEach } from "vitest";
import "./body-map-explorer.js";
import { BodyMapExplorer } from "./body-map-explorer.js";

describe("BodyMapExplorer API", () => {
  let el: BodyMapExplorer;

  beforeEach(async () => {
    el = document.createElement("body-map-explorer") as BodyMapExplorer;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    document.body.removeChild(el);
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
  });
});
