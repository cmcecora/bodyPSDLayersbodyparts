import { LitElement, PropertyValues, css, html, nothing, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ORGANS, OrganDefinition } from "./data/organs.js";
import { SECTIONS, SectionDefinition } from "./data/sections.js";
import { getRegions } from "./data/body-part-highlight-regions.js";
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
        aspect-ratio: 698 / 1698;
      }

      .svg-wrapper.sections-mode {
        perspective: 1600px;
      }

      .svg-inner {
        position: relative;
        transform-style: preserve-3d;
        height: 100%;
      }

      .flip-scene {
        position: relative;
        width: 100%;
        height: 100%;
      }

      .flip-card {
        position: relative;
        width: 100%;
        height: 100%;
        transform-style: preserve-3d;
        transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
      }

      .flip-card.is-back {
        transform: rotateY(180deg);
      }

      .sections-face {
        position: absolute;
        inset: 0;
        backface-visibility: hidden;
        transform-style: preserve-3d;
      }

      .sections-face[data-facing="back"] {
        transform: rotateY(180deg);
      }

      .sections-face:not(.is-active) {
        pointer-events: none;
      }

      svg {
        display: block;
        width: 100%;
        height: 100%;
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

      .sections-disabled .section-hit-area {
        pointer-events: none;
      }

      .bp-highlight-ellipse {
        fill: rgba(76, 175, 80, 0.3);
        stroke: rgba(76, 175, 80, 0.55);
        stroke-width: 2;
        pointer-events: all;
        cursor: pointer;
        filter: url(#bp-glow);
        transition: fill 0.2s ease;
      }

      .bp-highlight-ellipse:hover {
        fill: rgba(76, 175, 80, 0.5);
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

  @property({ attribute: false }) highlightedBodyPartIds: string[] = [];

  private _selectedSections = new Set<string>();

  @state() private _activeKeyboardTargetId: string | null = null;
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
    const sectionsFaceGeometry =
      this.currentView === "sections"
        ? this._sectionsFaceGeometry(this._sectionsFacing)
        : null;

    return html`
      <div class="model-container">
        ${this._renderViewTabs()}
        ${this.currentView === "sections"
          ? html`
              <div class="section-controls">
                <button
                  class="rotate-btn"
                  type="button"
                  aria-label=${this._sectionsFacing === "front"
                    ? "View Back"
                    : "View Front"}
                  aria-pressed=${String(this._sectionsFacing === "back")}
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
        <div
          class=${`svg-wrapper ${
            this.currentView === "sections" ? "sections-mode" : ""
          }`.trim()}
          style=${sectionsFaceGeometry === null
            ? nothing
            : `aspect-ratio: ${sectionsFaceGeometry.bodyW} / ${sectionsFaceGeometry.bodyH};`}
        >
          <div class="svg-inner">
            ${this.currentView === "sections"
              ? this._renderSectionsScene()
              : this._renderOrgansSvg()}
          </div>
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
          aria-pressed=${String(this.currentView === "organs")}
          @click=${() => this._setView("organs")}
        >
          Organs
        </button>
        <button
          class="view-tab ${this.currentView === "organs2"
            ? "active-organs2"
            : ""}"
          type="button"
          aria-pressed=${String(this.currentView === "organs2")}
          @click=${() => this._setView("organs2")}
        >
          Organs 2
        </button>
        <button
          class="view-tab ${this.currentView === "sections"
            ? "active-sections"
            : ""}"
          type="button"
          aria-pressed=${String(this.currentView === "sections")}
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
          aria-pressed=${String(this.currentGender === "male")}
          @click=${() => this._setGender("male")}
        >
          Male
        </button>
        <button
          class="gender-btn ${this.currentGender === "female" ? "active" : ""}"
          type="button"
          aria-pressed=${String(this.currentGender === "female")}
          @click=${() => this._setGender("female")}
        >
          Female
        </button>
      </div>
    `;
  }

  private _renderOrgansSvg() {
    return svg`
      <svg viewBox="0 0 698 1698" xmlns="http://www.w3.org/2000/svg" aria-label="Interactive body map">
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
          <filter id="bp-glow">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="5"
              flood-color="#4caf50"
              flood-opacity="0.55"
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
        />

        <g
          id="organs-layer"
          class="svg-layer"
          style="opacity: 1; pointer-events: auto"
          @click=${this._handleOrganClick}
          @mouseover=${this._handleOrganHover}
          @mouseout=${this._handleOrganOut}
        >
          ${ORGANS.map((organ) => this._renderOrganGroup(organ))}
        </g>
      </svg>
    `;
  }

  private _renderSectionsScene() {
    const isBack = this._sectionsFacing === "back";

    return html`
      <div class="flip-scene">
        <div class=${`flip-card ${isBack ? "is-back" : ""}`.trim()}>
          ${this._renderSectionsFace("front", !isBack)}
          ${this._renderSectionsFace("back", isBack)}
        </div>
      </div>
    `;
  }

  private _renderSectionsFace(facing: "front" | "back", isActive: boolean) {
    const { viewBox, bodyW, bodyH, useLargeViewBox } =
      this._sectionsFaceGeometry(facing);

    return html`
      <div
        class=${`sections-face ${isActive ? "is-active" : ""}`.trim()}
        data-facing=${facing}
        aria-hidden=${String(!isActive)}
      >
        ${svg`
          <svg viewBox=${viewBox} xmlns="http://www.w3.org/2000/svg" aria-label="Interactive body map">
            <defs>
              <filter id="green-glow">
                <feDropShadow
                  dx="0"
                  dy="0"
                  stdDeviation="4"
                  flood-color="#4caf50"
                  flood-opacity="0.6"
                />
              </filter>
              <filter id="bp-glow">
                <feDropShadow
                  dx="0"
                  dy="0"
                  stdDeviation="5"
                  flood-color="#4caf50"
                  flood-opacity="0.55"
                />
              </filter>
            </defs>

            <g
              id=${
                facing === this._sectionsFacing
                  ? "sections-layer"
                  : `sections-layer-${facing}`
              }
              class=${`svg-layer ${isActive && this.highlightedBodyPartIds.length > 0 ? "sections-disabled" : ""}`.trim()}
              style=${`opacity: ${isActive ? "1" : "0"}; pointer-events: ${isActive ? "auto" : "none"}`}
              @click=${this._handleSectionClick}
            >
              ${
                isActive
                  ? svg`
                    <image
                      id="sections-base-body"
                      class="sections-base-body"
                      x="0"
                      y="0"
                      width=${String(bodyW)}
                      height=${String(bodyH)}
                      href=${this._sectionsBodyUrl(facing)}
                      pointer-events="none"
                    />
                  `
                  : nothing
              }
              ${this._visibleSectionsFor(facing).map((section) =>
                this._renderSectionGroup(section, isActive),
              )}
            </g>

            ${isActive ? this._renderBpHighlightLayer(useLargeViewBox) : nothing}
          </svg>
        `}
      </div>
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
    const keyboardId = organ.id;

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
        data-keyboard-id=${keyboardId}
        tabindex=${this._isKeyboardTargetActive(keyboardId) ? "0" : "-1"}
        focusable="true"
        role="button"
        aria-label=${`Select ${organ.name}`}
        aria-pressed=${String(isSelected)}
        @focus=${() => this._setActiveKeyboardTarget(keyboardId)}
        @keydown=${(event: KeyboardEvent) =>
          this._handleOrganKeydown(event, organ.id)}
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

  private _renderSectionGroup(section: SectionDefinition, interactive = true) {
    const isSelected = this._selectedSections.has(section.id);
    const keyboardId = section.entryId;

    return svg`
      <g
        id=${`section-${section.entryId}`}
        class=${`body-section-group ${isSelected ? "selected" : ""}`.trim()}
        data-part=${section.id}
        data-name=${section.name}
        data-keyboard-id=${keyboardId}
        tabindex=${interactive && this._isKeyboardTargetActive(keyboardId) ? "0" : "-1"}
        focusable=${interactive ? "true" : "false"}
        role="button"
        aria-label=${`Select ${section.name}`}
        aria-pressed=${String(isSelected)}
        @focus=${() => this._setActiveKeyboardTarget(keyboardId)}
        @keydown=${(event: KeyboardEvent) =>
          this._handleSectionKeydown(event, section)}
      >
        <path class="section-hit-area" d=${section.hitAreaPath} fill="transparent" pointer-events=${interactive ? "all" : "none"} />
      </g>
    `;
  }

  private _visibleOrgans(): OrganDefinition[] {
    return ORGANS.filter((organ) => {
      if (organ.isMaleRepro) {
        return this.currentGender === "male";
      }

      if (organ.isFemaleRepro) {
        return this.currentGender === "female";
      }

      return true;
    });
  }

  private _visibleSections(): SectionDefinition[] {
    return this._visibleSectionsFor(this._sectionsFacing);
  }

  private _visibleSectionsFor(facing: "front" | "back"): SectionDefinition[] {
    return SECTIONS.filter(
      (section) =>
        section.side === facing &&
        (!section.gender || section.gender === this.currentGender),
    );
  }

  private _visibleKeyboardTargetIds(): string[] {
    if (this.currentView === "sections") {
      return this._visibleSections().map((section) => section.entryId);
    }

    return this._visibleOrgans().map((organ) => organ.id);
  }

  private _resolvedKeyboardTargetId(): string | null {
    const visibleIds = this._visibleKeyboardTargetIds();
    if (visibleIds.length === 0) {
      return null;
    }

    if (
      this._activeKeyboardTargetId !== null &&
      visibleIds.includes(this._activeKeyboardTargetId)
    ) {
      return this._activeKeyboardTargetId;
    }

    return visibleIds[0] ?? null;
  }

  private _isKeyboardTargetActive(keyboardId: string): boolean {
    return this._resolvedKeyboardTargetId() === keyboardId;
  }

  private _setActiveKeyboardTarget(keyboardId: string) {
    this._activeKeyboardTargetId = keyboardId;
  }

  private _focusKeyboardTarget(keyboardId: string) {
    queueMicrotask(() => {
      const target = this.shadowRoot?.querySelector<SVGElement>(
        `[data-keyboard-id="${keyboardId}"]`,
      );
      target?.focus();
    });
  }

  private _moveKeyboardTarget(direction: -1 | 1) {
    const visibleIds = this._visibleKeyboardTargetIds();
    const currentId = this._resolvedKeyboardTargetId();

    if (visibleIds.length === 0 || currentId === null) {
      return;
    }

    const currentIndex = visibleIds.indexOf(currentId);
    if (currentIndex === -1) {
      return;
    }

    const nextIndex =
      (currentIndex + direction + visibleIds.length) % visibleIds.length;
    const nextId = visibleIds[nextIndex];

    if (!nextId) {
      return;
    }

    this._activeKeyboardTargetId = nextId;
    this._focusKeyboardTarget(nextId);
  }

  private _setView(view: ViewMode) {
    this.currentView = view;
    this.dispatchEvent(
      new CustomEvent("view-change", {
        detail: { view },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _setGender(gender: Gender) {
    this.currentGender = gender;
    this.dispatchEvent(
      new CustomEvent("gender-change", {
        detail: { gender },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _handleOrganClick(event: MouseEvent) {
    const group = (event.target as Element | null)?.closest(".body-part-group");
    const partId = group?.getAttribute("data-part");
    const keyboardId = group?.getAttribute("data-keyboard-id");

    if (!partId) {
      return;
    }

    if (keyboardId) {
      this._setActiveKeyboardTarget(keyboardId);
    }

    this._toggleOrganSelection(partId);
  }

  private _toggleOrganSelection(partId: string) {
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
    const keyboardId = group?.getAttribute("data-keyboard-id");
    const section = this._visibleSections().find(
      (entry) => entry.entryId === keyboardId,
    );

    if (!section) {
      return;
    }

    this._setActiveKeyboardTarget(section.entryId);
    this._toggleSectionSelection(section, event.clientX, event.clientY);
  }

  private _toggleSectionSelection(
    section: SectionDefinition,
    clientX: number,
    clientY: number,
  ) {
    if (this._selectedSections.has(section.id)) {
      this._selectedSections.delete(section.id);
    } else {
      this._selectedSections.add(section.id);
    }

    this.requestUpdate();

    const isNowSelected = this._selectedSections.has(section.id);

    this.dispatchEvent(
      new CustomEvent("section-click", {
        detail: {
          sectionId: section.id,
          sectionName: section.name,
          selected: isNowSelected,
          clientX,
          clientY,
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _handleOrganKeydown(event: KeyboardEvent, organId: string) {
    if (this._handleKeyboardNavigation(event)) {
      return;
    }

    if (
      event.key === "Enter" ||
      event.key === " " ||
      event.key === "Spacebar"
    ) {
      event.preventDefault();
      this._setActiveKeyboardTarget(organId);
      this._toggleOrganSelection(organId);
    }
  }

  private _handleSectionKeydown(
    event: KeyboardEvent,
    section: SectionDefinition,
  ) {
    if (this._handleKeyboardNavigation(event)) {
      return;
    }

    if (
      event.key === "Enter" ||
      event.key === " " ||
      event.key === "Spacebar"
    ) {
      event.preventDefault();
      this._setActiveKeyboardTarget(section.entryId);
      const rect = (
        event.currentTarget as SVGGraphicsElement | null
      )?.getBoundingClientRect();
      const clientX = rect ? rect.left + rect.width / 2 : 0;
      const clientY = rect ? rect.top + rect.height / 2 : 0;
      this._toggleSectionSelection(section, clientX, clientY);
    }
  }

  private _handleKeyboardNavigation(event: KeyboardEvent): boolean {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      this._moveKeyboardTarget(1);
      return true;
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      this._moveKeyboardTarget(-1);
      return true;
    }

    return false;
  }

  private _renderBpHighlightLayer(useLargeViewBox: boolean) {
    if (this.highlightedBodyPartIds.length === 0) return nothing;

    const scaleX = useLargeViewBox ? 960 / 698 : 1;
    const scaleY = useLargeViewBox ? 2600 / 1698 : 1;
    const needsScale = useLargeViewBox;

    const ellipses = this.highlightedBodyPartIds.flatMap((bpId) =>
      getRegions(bpId).map(
        (r) => svg`
          <ellipse
            class="bp-highlight-ellipse"
            cx=${String(r.cx)}
            cy=${String(r.cy)}
            rx=${String(r.rx)}
            ry=${String(r.ry)}
            data-bp-id=${bpId}
          />
        `,
      ),
    );

    return svg`
      <g
        id="bp-highlight-layer"
        @click=${this._handleBpHighlightClick}
        transform=${needsScale ? `scale(${scaleX}, ${scaleY})` : ""}
      >
        ${ellipses}
      </g>
    `;
  }

  private _handleBpHighlightClick(event: MouseEvent) {
    const target = event.target as Element | null;
    if (!target?.classList.contains("bp-highlight-ellipse")) return;

    event.stopPropagation();

    const bpId = target.getAttribute("data-bp-id");
    if (!bpId) return;

    this.dispatchEvent(
      new CustomEvent("bp-highlight-click", {
        detail: { bodyPartId: bpId },
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

  private _sectionsBodyUrl(facing: "front" | "back"): string {
    const genderPart = this.currentGender === "male" ? "-male" : "";
    const facingPart = facing === "back" ? "-back" : "";
    return `${this._assetPrefix()}/sections-body${genderPart}${facingPart}.webp`;
  }

  private _sectionsFaceGeometry(_facing: "front" | "back") {
    return {
      useLargeViewBox: true,
      viewBox: "0 0 960 2600",
      bodyW: 960,
      bodyH: 2600,
    };
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
