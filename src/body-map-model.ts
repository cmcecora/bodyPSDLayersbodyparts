import { LitElement, PropertyValues, css, html, nothing, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ORGANS, OrganDefinition } from "./data/organs.js";
import { SECTIONS, SectionDefinition } from "./data/sections.js";
import { designTokens } from "./styles/tokens.css.js";

type ViewMode = "organs" | "organs2" | "sections";
type Gender = "male" | "female";

@customElement("body-map-model")
export class BodyMapModel extends LitElement {
  static styles = [
    designTokens,
    css`
      :host {
        display: block;
        width: 100%;
        color: #2d3748;
      }

      .model-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
      }

      .svg-wrapper {
        perspective: 1200px;
        max-width: 380px;
        width: 100%;
      }

      .svg-inner {
        position: relative;
        transform-style: preserve-3d;
      }

      svg {
        display: block;
        width: 100%;
        height: auto;
      }

      .view-tabs {
        display: flex;
        width: 100%;
        margin-bottom: 12px;
        overflow: hidden;
        border: 2px solid #d0d0d0;
        border-radius: 20px;
        background: #ffffff;
        box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
      }

      .view-tab {
        flex: 1;
        border: none;
        background: transparent;
        color: #666;
        cursor: pointer;
        font-family: inherit;
        font-size: 13px;
        font-weight: 500;
        padding: 6px 18px;
        text-align: center;
        transition: all 0.2s ease;
      }

      .view-tab:hover {
        background: #eef4fb;
      }

      .view-tab.active-organs {
        background: #4a90d9;
        color: #ffffff;
      }

      .view-tab.active-organs2 {
        background: #9b59b6;
        color: #ffffff;
      }

      .view-tab.active-sections {
        background: #2a7c44;
        color: #ffffff;
      }

      .gender-toggle {
        display: flex;
        width: 100%;
        margin-top: 12px;
        overflow: hidden;
        border: 2px solid #d0d0d0;
        border-radius: 20px;
        background: #ffffff;
        box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
      }

      .gender-btn {
        flex: 1;
        border: none;
        background: transparent;
        color: #666;
        cursor: pointer;
        font-family: inherit;
        font-size: 13px;
        font-weight: 500;
        padding: 6px 18px;
        text-align: center;
        transition: all 0.2s ease;
      }

      .gender-btn:hover {
        background: #eef4fb;
      }

      .gender-btn.active {
        background: #4a90d9;
        color: #ffffff;
      }

      .hit-area {
        fill: transparent;
        pointer-events: all;
        cursor: pointer;
        transition:
          fill 0.2s ease,
          opacity 0.2s ease;
      }

      .hit-area:hover {
        fill: rgba(100, 180, 255, 0.35);
      }

      .body-part-group.selected .hit-area {
        fill: rgba(66, 145, 230, 0.45);
      }

      .body-part-group.selected:hover .hit-area {
        fill: rgba(66, 145, 230, 0.55);
      }

      .body-part-group.system-highlighted .hit-area {
        fill: rgba(255, 165, 0, 0.3);
      }

      .body-part-group.system-highlighted:hover .hit-area {
        fill: rgba(255, 165, 0, 0.45);
      }

      .part-image {
        pointer-events: none;
      }

      .body-part-group:hover .part-image,
      .body-part-group.selected .part-image {
        filter: drop-shadow(0 0 6px rgba(66, 165, 245, 0.7));
      }

      .body-part-group.system-highlighted .part-image {
        filter: drop-shadow(0 0 5px rgba(255, 165, 0, 0.6));
      }

      .section-hit-area {
        fill: transparent;
        cursor: pointer;
        transition:
          fill 0.2s ease,
          opacity 0.2s ease;
      }

      .section-hit-area:hover {
        fill: rgba(76, 175, 80, 0.35);
      }

      .body-section-group.selected .section-hit-area {
        fill: rgba(144, 238, 144, 0.45);
      }

      .body-section-group.selected:hover .section-hit-area {
        fill: rgba(144, 238, 144, 0.55);
      }

      .svg-layer {
        transition: opacity 0.35s ease-in-out;
      }

      .male-repro {
        display: block;
      }

      .female-repro {
        display: none;
      }

      :host([current-gender="female"]) .male-repro {
        display: none;
      }

      :host([current-gender="female"]) .female-repro {
        display: block;
      }

      .section-controls {
        display: flex;
        width: 100%;
        justify-content: center;
        margin-bottom: 8px;
      }

      .rotate-btn {
        border: 2px solid #2a7c44;
        background: transparent;
        color: #2a7c44;
        cursor: pointer;
        font-family: inherit;
        font-size: 13px;
        font-weight: 500;
        padding: 5px 20px;
        border-radius: 20px;
        transition: all 0.2s ease;
      }

      .rotate-btn:hover {
        background: #2a7c44;
        color: #fff;
      }

      @keyframes fade-slide {
        from {
          opacity: 0;
          transform: translateY(8px);
        }

        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .animate-entrance {
        animation: fade-slide 0.4s ease-out;
      }
    `,
  ];

  @property({ type: String, reflect: true, attribute: "current-view" })
  currentView: ViewMode = "sections";

  @property({ type: String, reflect: true, attribute: "current-gender" })
  currentGender: Gender = "male";

  @property({ type: String, attribute: "asset-base" })
  assetBase = "";

  @property({ attribute: false }) selectedOrganIds: string[] = [];

  @property({ attribute: false }) systemHighlightOrganIds: string[] = [];

  private _selectedSections = new Set<string>();

  @state() private _sectionsFacing: "front" | "back" = "front";

  protected firstUpdated(): void {
    this.shadowRoot
      ?.querySelector(".model-container")
      ?.classList.add("animate-entrance");
  }

  protected willUpdate(changedProperties: PropertyValues<this>): void {
    if (
      changedProperties.has("currentView") &&
      this.currentView !== "sections"
    ) {
      this._selectedSections.clear();
    }

    if (changedProperties.has("currentGender")) {
      const removedId =
        this.currentGender === "female"
          ? "male_reproductive"
          : "female_reproductive";

      if (this.selectedOrganIds.includes(removedId)) {
        const nextSelectedOrganIds = this.selectedOrganIds.filter(
          (id) => id !== removedId,
        );
        this.selectedOrganIds = nextSelectedOrganIds;
        this.dispatchEvent(
          new CustomEvent("organ-selection-change", {
            detail: {
              selected: nextSelectedOrganIds,
              selectedOrganIds: nextSelectedOrganIds,
              lastToggled: removedId,
              isSelected: false,
            },
            bubbles: true,
            composed: true,
          }),
        );
      }
    }
  }

  render() {
    return html`
      <div class="model-container">
        ${this._renderViewTabs()}
        ${this.currentView === "sections"
          ? html`
              <div class="section-controls">
                <button
                  class="rotate-btn"
                  type="button"
                  @click=${this._toggleFacing}
                >
                  &#x21BB;
                  ${this._sectionsFacing === "front"
                    ? "View Back"
                    : "View Front"}
                </button>
              </div>
            `
          : nothing}
        <div class="svg-wrapper">
          <div class="svg-inner">${this._renderSvg()}</div>
        </div>
        ${this._renderGenderToggle()}
      </div>
    `;
  }

  private _renderViewTabs() {
    return html`
      <div class="view-tabs" aria-label="Body view mode">
        <button
          class="view-tab ${this.currentView === "organs"
            ? "active-organs"
            : ""}"
          type="button"
          @click=${() => this._setView("organs")}
        >
          Organs
        </button>
        <button
          class="view-tab ${this.currentView === "organs2"
            ? "active-organs2"
            : ""}"
          type="button"
          @click=${() => this._setView("organs2")}
        >
          Organs 2
        </button>
        <button
          class="view-tab ${this.currentView === "sections"
            ? "active-sections"
            : ""}"
          type="button"
          @click=${() => this._setView("sections")}
        >
          Body Sections
        </button>
      </div>
    `;
  }

  private _renderGenderToggle() {
    return html`
      <div class="gender-toggle" aria-label="Gender">
        <button
          class="gender-btn ${this.currentGender === "male" ? "active" : ""}"
          type="button"
          @click=${() => this._setGender("male")}
        >
          Male
        </button>
        <button
          class="gender-btn ${this.currentGender === "female" ? "active" : ""}"
          type="button"
          @click=${() => this._setGender("female")}
        >
          Female
        </button>
      </div>
    `;
  }

  private _renderSvg() {
    const organsVisible = this.currentView !== "sections";
    const sectionsVisible = this.currentView === "sections";
    const showingBack = sectionsVisible && this._sectionsFacing === "back";
    const viewBox = showingBack ? "0 0 960 2600" : "0 0 698 1698";
    const bodyW = showingBack ? 960 : 698;
    const bodyH = showingBack ? 2600 : 1698;

    return svg`
      <svg viewBox=${viewBox} xmlns="http://www.w3.org/2000/svg" aria-label="Interactive body map">
        <defs>
          <filter id="blue-glow">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="4"
              flood-color="#42a5f5"
              flood-opacity="0.6"
            />
          </filter>
          <filter id="green-glow">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="4"
              flood-color="#4caf50"
              flood-opacity="0.6"
            />
          </filter>
        </defs>

        <image
          id="base-body"
          x="0"
          y="0"
          width="698"
          height="1698"
          href=${this._silhouetteUrl()}
          pointer-events="none"
          style=${`opacity: ${sectionsVisible ? "0" : "1"}; transition: opacity 0.35s ease-in-out`}
        />

        <g
          id="organs-layer"
          class="svg-layer"
          style=${`opacity: ${organsVisible ? "1" : "0"}; pointer-events: ${organsVisible ? "auto" : "none"}`}
          @click=${this._handleOrganClick}
          @mouseover=${this._handleOrganHover}
          @mouseout=${this._handleOrganOut}
        >
          ${ORGANS.map((organ) => this._renderOrganGroup(organ))}
        </g>

        <g
          id="sections-layer"
          class="svg-layer"
          style=${`opacity: ${sectionsVisible ? "1" : "0"}; pointer-events: ${sectionsVisible ? "auto" : "none"}`}
          @click=${this._handleSectionClick}
        >
          <image
            id="sections-base-body"
            x="0"
            y="0"
            width=${String(bodyW)}
            height=${String(bodyH)}
            href=${this._sectionsBodyUrl()}
            pointer-events="none"
          />
          ${SECTIONS.filter(
            (section) => section.side === this._sectionsFacing,
          ).map((section) => this._renderSectionGroup(section))}
        </g>
      </svg>
    `;
  }

  private _renderOrganGroup(organ: OrganDefinition) {
    const isSelected = this.selectedOrganIds.includes(organ.id);
    const isSystemHighlighted = this.systemHighlightOrganIds.includes(organ.id);
    const reproClass = organ.isMaleRepro
      ? "male-repro"
      : organ.isFemaleRepro
        ? "female-repro"
        : "";

    const classes = [
      "body-part-group",
      isSelected ? "selected" : "",
      isSystemHighlighted && !isSelected ? "system-highlighted" : "",
      reproClass,
    ]
      .filter(Boolean)
      .join(" ");

    return svg`
      <g
        id=${`group-${organ.id}`}
        class=${`body-part-group ${isSelected ? "selected" : ""} ${isSystemHighlighted && !isSelected ? "system-highlighted" : ""} ${reproClass}`.trim()}
        data-part=${organ.id}
        data-name=${organ.name}
      >
        <image
          class="part-image"
          href=${this._organImageUrl(organ.id)}
          x=${String(organ.imageX)}
          y=${String(organ.imageY)}
          width=${String(organ.imageWidth)}
          height=${String(organ.imageHeight)}
          pointer-events="none"
        />
        <path class="hit-area" d=${organ.hitAreaPath} transform=${`translate(${organ.imageX},${organ.imageY})`} />
      </g>
    `;
  }

  private _renderSectionGroup(section: SectionDefinition) {
    const isSelected = this._selectedSections.has(section.id);
    const active = this.currentView === "sections";

    return svg`
      <g
        id=${`section-${section.entryId}`}
        class=${`body-section-group ${isSelected ? "selected" : ""}`.trim()}
        data-part=${section.id}
        data-name=${section.name}
      >
        <path class="section-hit-area" d=${section.hitAreaPath} fill="transparent" pointer-events=${active ? "all" : "none"} />
      </g>
    `;
  }

  private _setView(view: ViewMode) {
    this.currentView = view;
  }

  private _setGender(gender: Gender) {
    this.currentGender = gender;
  }

  private _handleOrganClick(event: MouseEvent) {
    const group = (event.target as Element | null)?.closest(".body-part-group");
    const partId = group?.getAttribute("data-part");

    if (!partId) {
      return;
    }

    if (this.currentView === "organs2") {
      this.dispatchEvent(
        new CustomEvent("organ2-click", {
          detail: { organId: partId },
          bubbles: true,
          composed: true,
        }),
      );
      return;
    }

    const wasSelected = this.selectedOrganIds.includes(partId);
    const nextSelectedOrganIds = wasSelected
      ? this.selectedOrganIds.filter((id) => id !== partId)
      : [...this.selectedOrganIds, partId];

    this.selectedOrganIds = nextSelectedOrganIds;

    this.dispatchEvent(
      new CustomEvent("organ-selection-change", {
        detail: {
          selected: nextSelectedOrganIds,
          selectedOrganIds: nextSelectedOrganIds,
          lastToggled: partId,
          isSelected: !wasSelected,
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _handleOrganHover(_event: MouseEvent) {
    // CSS handles hover visuals. JS hook is preserved for future tooltip work.
  }

  private _handleOrganOut(_event: MouseEvent) {
    // CSS handles hover removal. JS hook is preserved for future tooltip work.
  }

  private _handleSectionClick(event: MouseEvent) {
    const group = (event.target as Element | null)?.closest(
      ".body-section-group",
    );
    const partId = group?.getAttribute("data-part");
    const partName = group?.getAttribute("data-name") ?? "";

    if (!partId) {
      return;
    }

    if (this._selectedSections.has(partId)) {
      this._selectedSections.delete(partId);
    } else {
      this._selectedSections.add(partId);
    }

    this.requestUpdate();

    this.dispatchEvent(
      new CustomEvent("section-click", {
        detail: {
          sectionId: partId,
          sectionName: partName,
          clientX: event.clientX,
          clientY: event.clientY,
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _organImageUrl(id: string): string {
    return `${this._assetPrefix()}/organs/${id}.webp`;
  }

  private _silhouetteUrl(): string {
    return `${this._assetPrefix()}/silhouette.webp`;
  }

  private _sectionsBodyUrl(): string {
    const suffix = this._sectionsFacing === "back" ? "-back" : "";
    return `${this._assetPrefix()}/sections-body${suffix}.webp`;
  }

  private _toggleFacing() {
    this._sectionsFacing = this._sectionsFacing === "front" ? "back" : "front";
  }

  private _assetPrefix(): string {
    const base = this.assetBase.replace(/\/$/, "");
    return base ? `${base}/assets` : "/assets";
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "body-map-model": BodyMapModel;
  }
}
