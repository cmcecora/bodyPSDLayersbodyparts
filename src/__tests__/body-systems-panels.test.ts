import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../body-map-sidebar.js";
import "../body-map-detail-panel.js";
import type { BodyMapSidebar } from "../body-map-sidebar.js";
import type { BodyMapDetailPanel } from "../body-map-detail-panel.js";
import { BODY_SYSTEMS } from "../data/systems.js";

async function createSidebar(): Promise<BodyMapSidebar> {
  const el = document.createElement("body-map-sidebar") as BodyMapSidebar;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

async function createDetailPanel(): Promise<BodyMapDetailPanel> {
  const el = document.createElement(
    "body-map-detail-panel",
  ) as BodyMapDetailPanel;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe("body-map-sidebar", () => {
  let sidebar: BodyMapSidebar;

  beforeEach(async () => {
    sidebar = await createSidebar();
  });

  afterEach(() => {
    sidebar.remove();
    document.body.innerHTML = "";
  });

  it("renders 11 system buttons with dot, thumb, and title for each row", async () => {
    const buttons = sidebar.shadowRoot?.querySelectorAll(
      "button.system-button",
    );

    expect(buttons).toHaveLength(11);

    buttons?.forEach((button, index) => {
      const system = BODY_SYSTEMS[index];
      expect(button.querySelector(".system-dot")).toBeTruthy();
      expect(button.querySelector(".system-thumb")).toBeTruthy();
      expect(button.textContent).toContain(system.title);
    });
  });

  it("each button carries the system id as data-system-id", () => {
    const buttons = sidebar.shadowRoot?.querySelectorAll(
      "button.system-button",
    );

    BODY_SYSTEMS.forEach((system, index) => {
      expect(buttons?.[index]?.getAttribute("data-system-id")).toBe(system.id);
    });
  });

  it("clicking a row dispatches system-toggle-request with systemId, bubbles, and composed", async () => {
    let event: CustomEvent<{ systemId: string }> | null = null;

    sidebar.addEventListener("system-toggle-request", (e) => {
      event = e as CustomEvent<{ systemId: string }>;
    });

    const firstButton = sidebar.shadowRoot?.querySelector(
      "button.system-button",
    );
    firstButton?.dispatchEvent(
      new MouseEvent("click", { bubbles: true, composed: true }),
    );
    await sidebar.updateComplete;

    expect(event).not.toBeNull();
    expect(event?.detail).toEqual({ systemId: "cardiovascular" });
    expect(event?.bubbles).toBe(true);
    expect(event?.composed).toBe(true);
  });
});

describe("body-map-detail-panel", () => {
  let detail: BodyMapDetailPanel;

  beforeEach(async () => {
    detail = await createDetailPanel();
  });

  afterEach(() => {
    detail.remove();
    document.body.innerHTML = "";
  });

  it("renders empty state when system is null", () => {
    expect(detail.shadowRoot?.textContent).toContain(
      "Select a body system or body part to see details.",
    );
  });

  it("renders system title, description, and thumbnail when system is provided", async () => {
    const cardiovascular = BODY_SYSTEMS.find(
      (system) => system.id === "cardiovascular",
    )!;

    detail.system = cardiovascular;
    await detail.updateComplete;

    const thumb = detail.shadowRoot?.querySelector(".detail-thumb");
    const title = detail.shadowRoot?.querySelector(".detail-title");
    const description = detail.shadowRoot?.querySelector(".detail-description");

    expect(thumb?.getAttribute("src")).toBe(cardiovascular.thumbnail);
    expect(thumb?.getAttribute("alt")).toBe(cardiovascular.title);
    expect(title?.textContent?.trim()).toBe(cardiovascular.title);
    expect(description?.textContent).toContain(
      cardiovascular.description.slice(0, 30),
    );
  });

  it("does not render the detail view when system is null", () => {
    const thumb = detail.shadowRoot?.querySelector(".detail-thumb");
    const title = detail.shadowRoot?.querySelector(".detail-title");
    const description = detail.shadowRoot?.querySelector(".detail-description");

    expect(thumb).toBeNull();
    expect(title).toBeNull();
    expect(description).toBeNull();
  });
});
