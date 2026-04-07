import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { designTokens } from "./styles/tokens.css.js";
import {
  BODY_SYSTEMS,
  type BodySystemDefinition,
  type BodySystemId,
} from "./data/systems.js";
import { BODY_PARTS } from "./data/body-parts.js";

@customElement("body-map-sidebar")
export class BodyMapSidebar extends LitElement {
  static styles = [
    designTokens,
    css`
      :host {
        display: block;
        font-family: var(--bme-font-family);
      }

      .panel-header {
        background: var(--bme-header-bg);
        color: var(--bme-header-text);
        padding: var(--bme-space-sm) var(--bme-space-md);
        border-radius: 8px 8px 0 0;
        font-size: var(--bme-font-size-heading);
        font-weight: 600;
        margin: 0;
      }

      .systems-list {
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .system-button {
        display: flex;
        align-items: center;
        gap: var(--bme-space-sm);
        width: 100%;
        padding: var(--bme-space-sm) var(--bme-space-md);
        background: none;
        border: none;
        border-bottom: 1px solid var(--bme-divider);
        cursor: pointer;
        text-align: left;
        font-family: var(--bme-font-family);
        font-size: var(--bme-font-size-body);
        color: inherit;
        transition: background 0.15s ease;
      }

      .system-button:hover {
        background: var(--bme-divider);
      }

      .system-button.active {
        background: var(--bme-hover-overlay);
        font-weight: 600;
      }

      .system-dot {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        flex-shrink: 0;
      }

      .system-thumb {
        width: 32px;
        height: 32px;
        object-fit: cover;
        border-radius: 4px;
        flex-shrink: 0;
      }

      .system-title {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      /* Body Parts panel */
      .body-parts-section {
        border-top: 2px solid var(--bme-divider);
        margin-top: 4px;
      }

      .body-parts-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--bme-space-sm) var(--bme-space-md);
        background: var(--bme-header-bg);
        color: var(--bme-header-text);
        cursor: pointer;
        user-select: none;
        font-size: var(--bme-font-size-heading);
        font-weight: 600;
      }

      .body-parts-header:hover {
        background: #3a4a5c;
      }

      .body-parts-header-toggle {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        flex: 1;
        border: none;
        background: transparent;
        color: inherit;
        cursor: pointer;
        font: inherit;
        padding: 0;
        text-align: left;
      }

      .body-parts-header-right {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-left: 12px;
      }

      .sort-toggle {
        background: rgba(255, 255, 255, 0.15);
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: #fff;
        font-size: 11px;
        font-weight: 600;
        padding: 2px 8px;
        border-radius: 4px;
        cursor: pointer;
        font-family: inherit;
        transition: background 0.15s ease;
      }

      .sort-toggle:hover,
      .sort-toggle.active {
        background: rgba(255, 255, 255, 0.3);
      }

      .body-parts-chevron {
        font-size: 10px;
        transition: transform 0.2s ease;
      }

      .body-parts-chevron.collapsed {
        transform: rotate(-90deg);
      }

      .body-parts-body {
        overflow: hidden;
        display: grid;
        grid-template-rows: 1fr;
        transition: grid-template-rows 0.2s ease;
      }

      .body-parts-body.collapsed {
        grid-template-rows: 0fr;
      }

      .body-parts-body-inner {
        overflow: hidden;
      }

      .body-parts-search {
        padding: 8px var(--bme-space-md) 4px;
      }

      .body-parts-search-input {
        width: 100%;
        box-sizing: border-box;
        padding: 7px 10px;
        border: 1px solid var(--bme-border);
        border-radius: 6px;
        font-size: var(--bme-font-size-label);
        font-family: var(--bme-font-family);
        outline: none;
      }

      .body-parts-search-input:focus {
        border-color: var(--bme-accent);
      }

      .body-parts-list {
        list-style: none;
        margin: 0;
        padding: 4px 0;
        max-height: 280px;
        overflow-y: auto;
      }

      .body-part-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
        padding: 7px var(--bme-space-md);
        background: none;
        border: none;
        border-bottom: 1px solid var(--bme-divider);
        cursor: pointer;
        text-align: left;
        font-family: var(--bme-font-family);
        font-size: var(--bme-font-size-body);
        color: inherit;
        transition: background 0.15s ease;
      }

      .body-part-btn:last-child {
        border-bottom: none;
      }

      .body-part-btn:hover {
        background: var(--bme-divider);
      }

      .body-part-btn.selected {
        background: var(--bme-hover-overlay);
        font-weight: 600;
        color: var(--bme-accent);
      }

      .body-part-icon {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        object-fit: cover;
        flex-shrink: 0;
        background: #f0f0f0;
      }

      .body-part-check {
        width: 14px;
        flex-shrink: 0;
        color: var(--bme-accent);
        font-size: 12px;
      }

      .empty-parts {
        padding: var(--bme-space-md);
        color: #9ca3af;
        font-size: var(--bme-font-size-label);
        text-align: center;
      }
    `,
  ];

  @property({ attribute: false }) systems: BodySystemDefinition[] =
    BODY_SYSTEMS;

  @property({ type: String }) activeSystemId: BodySystemId | null = null;

  @property({ attribute: false }) selectedOrganIds: string[] = [];

  /** bp_*-prefixed IDs of body parts selected from the sidebar panel. */
  @property({ attribute: false }) selectedBodyPartIds: string[] = [];

  @property({ type: String, attribute: "asset-base" }) assetBase = "";

  @state() private _bodyPartsExpanded = true;
  @state() private _bodyPartsSearch = "";
  @state() private _bodyPartsSortAZ = false;

  private get _isAllSelected(): boolean {
    return (
      BODY_PARTS.length > 0 &&
      BODY_PARTS.every((bp) => this.selectedBodyPartIds.includes(bp.id))
    );
  }

  private _emitAllToggle() {
    this.dispatchEvent(
      new CustomEvent("body-parts-all-toggle-request", {
        detail: { selectAll: !this._isAllSelected },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _emitToggle(systemId: BodySystemId) {
    this.dispatchEvent(
      new CustomEvent("system-toggle-request", {
        detail: { systemId },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _emitBodyPartSelect(bodyPartId: string, organIds: string[]) {
    this.dispatchEvent(
      new CustomEvent("body-part-select-request", {
        detail: { bodyPartId, organIds },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _filteredBodyParts() {
    const q = this._bodyPartsSearch.toLowerCase();
    let parts = q
      ? BODY_PARTS.filter((p) => p.name.toLowerCase().includes(q))
      : BODY_PARTS;
    if (this._bodyPartsSortAZ) {
      parts = [...parts].sort((a, b) => a.name.localeCompare(b.name));
    }
    return parts;
  }

  private _bodyPartImageUrl(imageFile: string): string {
    const base = this.assetBase.replace(/\/$/, "");
    const prefix = base ? `${base}/assets` : "/assets";
    return `${prefix}/body-parts/${imageFile}`;
  }

  private _systemThumbnailUrl(thumbnail: string): string {
    const base = this.assetBase.replace(/\/$/, "");
    return base ? `${base}${thumbnail}` : thumbnail;
  }

  render() {
    const filteredBodyParts = this._filteredBodyParts();

    return html`
      <div class="panel-header">Body Systems</div>
      <ul class="systems-list">
        ${this.systems.map(
          (system) => html`
            <li>
              <button
                type="button"
                class="system-button${system.id === this.activeSystemId
                  ? " active"
                  : ""}"
                data-system-id=${system.id}
                aria-pressed=${String(system.id === this.activeSystemId)}
                @click=${() => this._emitToggle(system.id)}
              >
                <span
                  class="system-dot"
                  style="background:${system.color}"
                ></span>
                <img
                  class="system-thumb"
                  src=${this._systemThumbnailUrl(system.thumbnail)}
                  alt=""
                />
                <span class="system-title">${system.title}</span>
              </button>
            </li>
          `,
        )}
      </ul>

      <div class="body-parts-section">
        <div class="body-parts-header">
          <button
            class="body-parts-header-toggle"
            type="button"
            aria-controls="body-parts-panel"
            aria-expanded=${String(this._bodyPartsExpanded)}
            @click=${() => {
              this._bodyPartsExpanded = !this._bodyPartsExpanded;
            }}
          >
            <span>Body Parts</span>
            <span
              class="body-parts-chevron ${this._bodyPartsExpanded
                ? ""
                : "collapsed"}"
              >&#9660;</span
            >
          </button>
          <div class="body-parts-header-right">
            <button
              class="sort-toggle ${this._isAllSelected ? "active" : ""}"
              type="button"
              title="Select all body parts"
              @click=${() => this._emitAllToggle()}
            >
              All
            </button>
            <button
              class="sort-toggle ${this._bodyPartsSortAZ ? "active" : ""}"
              type="button"
              title="Sort A-Z"
              @click=${() => {
                this._bodyPartsSortAZ = !this._bodyPartsSortAZ;
              }}
            >
              A-Z
            </button>
          </div>
        </div>
        <div
          id="body-parts-panel"
          class="body-parts-body ${this._bodyPartsExpanded ? "" : "collapsed"}"
        >
          <div class="body-parts-body-inner">
            <div class="body-parts-search">
              <input
                class="body-parts-search-input"
                type="text"
                aria-label="Search body parts"
                placeholder="Search body parts..."
                .value=${this._bodyPartsSearch}
                @input=${(e: Event) => {
                  this._bodyPartsSearch = (e.target as HTMLInputElement).value;
                }}
              />
            </div>
            ${filteredBodyParts.length === 0
              ? html`<p class="empty-parts">No results</p>`
              : html`
                  <ul class="body-parts-list">
                    ${filteredBodyParts.map((bp) => {
                      const isSelected = this.selectedBodyPartIds.includes(
                        bp.id,
                      );
                      return html`
                        <li>
                          <button
                            type="button"
                            class="body-part-btn ${isSelected
                              ? "selected"
                              : ""}"
                            data-body-part-id=${bp.id}
                            aria-pressed=${String(isSelected)}
                            @click=${() =>
                              this._emitBodyPartSelect(bp.id, bp.organIds)}
                          >
                            <img
                              class="body-part-icon"
                              src=${this._bodyPartImageUrl(bp.imageFile)}
                              alt=""
                            />
                            <span class="body-part-check"
                              >${isSelected ? "✓" : nothing}</span
                            >
                            ${bp.name}
                          </button>
                        </li>
                      `;
                    })}
                  </ul>
                `}
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "body-map-sidebar": BodyMapSidebar;
  }
}
