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

  it("renders sidebar imagery with lazy loading and async decoding", async () => {
    const toggle = sidebar.shadowRoot?.querySelector(
      ".body-parts-header-toggle",
    ) as HTMLButtonElement | null;
    toggle?.dispatchEvent(
      new MouseEvent("click", { bubbles: true, composed: true }),
    );
    await sidebar.updateComplete;

    const systemThumb = sidebar.shadowRoot?.querySelector(
      ".system-thumb",
    ) as HTMLImageElement | null;
    const bodyPartIcon = sidebar.shadowRoot?.querySelector(
      ".body-part-icon",
    ) as HTMLImageElement | null;

    expect(systemThumb?.getAttribute("loading")).toBe("lazy");
    expect(systemThumb?.getAttribute("decoding")).toBe("async");
    expect(bodyPartIcon?.getAttribute("loading")).toBe("lazy");
    expect(bodyPartIcon?.getAttribute("decoding")).toBe("async");
  });

  it("keeps body-part icons out of the DOM until the panel is expanded", async () => {
    const toggle = sidebar.shadowRoot?.querySelector(
      ".body-parts-header-toggle",
    ) as HTMLButtonElement | null;

    expect(toggle?.getAttribute("aria-expanded")).toBe("false");
    expect(sidebar.shadowRoot?.querySelector(".body-part-icon")).toBeNull();

    toggle?.dispatchEvent(
      new MouseEvent("click", { bubbles: true, composed: true }),
    );
    await sidebar.updateComplete;

    expect(toggle?.getAttribute("aria-expanded")).toBe("true");
    expect(sidebar.shadowRoot?.querySelector(".body-part-icon")).not.toBeNull();
  });

  it("renders a secondary page-links list for the shared site navigation", () => {
    const pageLinks = sidebar.shadowRoot?.querySelectorAll(
      "[data-site-nav-id]",
    );

    expect(pageLinks).toHaveLength(5);
    expect(pageLinks?.[0]?.textContent).toContain("Body Part");
    expect(pageLinks?.[1]?.textContent).toContain("Disease");
  });

  it("clicking the body-part page link dispatches site-nav-request", async () => {
    let event: CustomEvent<{ navId: string }> | null = null;

    sidebar.addEventListener("site-nav-request", (e) => {
      event = e as CustomEvent<{ navId: string }>;
    });

    const pageLink = sidebar.shadowRoot?.querySelector(
      '[data-site-nav-id="body-part"]',
    ) as HTMLButtonElement | null;

    pageLink?.dispatchEvent(
      new MouseEvent("click", { bubbles: true, composed: true }),
    );
    await sidebar.updateComplete;

    expect(event).not.toBeNull();
    expect(event?.detail).toEqual({ navId: "body-part" });
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
