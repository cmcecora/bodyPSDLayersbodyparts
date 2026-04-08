import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../body-part-grid-view.js";
import { BodyPartGridView } from "../body-part-grid-view.js";
import { BODY_PARTS } from "../data/body-parts.js";

async function createGrid(): Promise<BodyPartGridView> {
  const el = document.createElement("body-part-grid-view") as BodyPartGridView;
  el.bodyParts = BODY_PARTS.slice(0, 3);
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe("body-part-grid-view", () => {
  let grid: BodyPartGridView;

  beforeEach(async () => {
    grid = await createGrid();
  });

  afterEach(() => {
    grid.remove();
    document.body.innerHTML = "";
  });

  it("declares a 4-up grid layout and lazy image loading for cards", () => {
    const styles = (
      Array.isArray(BodyPartGridView.styles)
        ? BodyPartGridView.styles
        : [BodyPartGridView.styles]
    )
      .map((style) => style.cssText)
      .join("\n");
    const image = grid.shadowRoot?.querySelector(".image") as
      | HTMLImageElement
      | null;

    expect(styles).toContain("grid-template-columns: repeat(4, minmax(0, 1fr))");
    expect(image?.getAttribute("loading")).toBe("lazy");
    expect(image?.getAttribute("decoding")).toBe("async");
  });

  it("dispatches compact-mode-toggle-request from the compact toggle", async () => {
    let event: CustomEvent<{ compact: boolean }> | null = null;

    grid.addEventListener("compact-mode-toggle-request", (value) => {
      event = value as CustomEvent<{ compact: boolean }>;
    });

    const compactButton = Array.from(
      grid.shadowRoot?.querySelectorAll(".toolbar-button") ?? [],
    ).find((button) => button.textContent?.includes("Compact")) as
      | HTMLButtonElement
      | undefined;

    compactButton?.dispatchEvent(
      new MouseEvent("click", { bubbles: true, composed: true }),
    );
    await grid.updateComplete;

    expect(event).not.toBeNull();
    expect(event?.detail).toEqual({ compact: true });
  });

  it("marks a card media region as loaded after its image load event fires", async () => {
    const media = grid.shadowRoot?.querySelector(".media") as HTMLElement | null;
    const image = grid.shadowRoot?.querySelector(".image") as
      | HTMLImageElement
      | null;

    expect(media?.classList.contains("loaded")).toBe(false);

    image?.dispatchEvent(new Event("load"));
    await grid.updateComplete;

    expect(media?.classList.contains("loaded")).toBe(true);
  });

  it("dispatches body-part-card-open-request when a card is clicked", async () => {
    let event: CustomEvent<{ bodyPartId: string }> | null = null;

    grid.addEventListener("body-part-card-open-request", (value) => {
      event = value as CustomEvent<{ bodyPartId: string }>;
    });

    const card = grid.shadowRoot?.querySelector(
      '[data-body-part-id="bp_head"]',
    ) as HTMLButtonElement | null;

    card?.dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true }));
    await grid.updateComplete;

    expect(event).not.toBeNull();
    expect(event?.detail).toEqual({ bodyPartId: "bp_head" });
  });
});
