import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { designTokens } from "./styles/tokens.css.js";
import {
  BODY_SYSTEMS,
  type BodySystemDefinition,
  type BodySystemId,
} from "./data/systems.js";
import { BODY_PARTS } from "./data/body-parts.js";
import {
  DEFAULT_SITE_NAV_ID,
  SITE_NAV_ITEMS,
  type SiteNavId,
  type SiteNavItem,
} from "./data/site-nav.js";

@customElement("body-map-sidebar")
export class BodyMapSidebar extends LitElement {
  static styles = [
    designTokens,
    css`
      :host {
        display: block;
        font-family: var(--bme-font-family);
        color: var(--bme-text);
      }

      .panel-header {
        background: linear-gradient(135deg, var(--bme-header-bg), #32485d);
        color: var(--bme-header-text);
        padding: var(--bme-space-sm) var(--bme-panel-padding);
        border-radius: var(--bme-radius-lg) var(--bme-radius-lg) 0 0;
        font-size: var(--bme-font-size-heading);
        font-weight: 600;
        letter-spacing: 0.01em;
        margin: 0;
      }

      .systems-list {
        list-style: none;
        margin: 0;
        padding: var(--bme-space-sm);
        display: grid;
        gap: var(--bme-space-xs);
        background: linear-gradient(
          180deg,
          var(--bme-panel),
          var(--bme-surface-elevated)
        );
      }

      .system-button {
        display: flex;
        align-items: center;
        gap: var(--bme-space-sm);
        width: 100%;
        padding: 10px 14px;
        background: transparent;
        border: 1px solid transparent;
        border-radius: var(--bme-radius-md);
        cursor: pointer;
        text-align: left;
        font-family: var(--bme-font-family);
        font-size: var(--bme-font-size-body);
        color: inherit;
        transition:
          background 0.15s ease,
          border-color 0.15s ease,
          box-shadow 0.15s ease,
          transform 0.15s ease;
      }

      .system-button:hover {
        background: var(--bme-accent-soft);
        border-color: rgba(79, 143, 206, 0.18);
        transform: translateY(-1px);
      }

      .system-button.active {
        background: linear-gradient(
          180deg,
          rgba(79, 143, 206, 0.18),
          rgba(79, 143, 206, 0.08)
        );
        border-color: rgba(79, 143, 206, 0.24);
        box-shadow: var(--bme-shadow-soft);
        font-weight: 600;
        color: var(--bme-accent-strong);
      }

      .system-button:focus-visible,
      .body-parts-header-toggle:focus-visible,
      .sort-toggle:focus-visible,
      .body-part-btn:focus-visible,
      .body-parts-search-input:focus-visible,
      .site-page-button:focus-visible {
        outline: none;
        box-shadow: var(--bme-focus-ring);
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
        border-radius: var(--bme-radius-sm);
        border: 1px solid var(--bme-border);
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
        border-top: 1px solid var(--bme-divider);
        background: linear-gradient(
          180deg,
          var(--bme-panel),
          var(--bme-surface-elevated)
        );
      }

      .body-parts-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--bme-space-sm) var(--bme-panel-padding);
        background: linear-gradient(135deg, var(--bme-header-bg), #32485d);
        color: var(--bme-header-text);
        cursor: pointer;
        user-select: none;
        font-size: var(--bme-font-size-heading);
        font-weight: 600;
      }

      .body-parts-header:hover {
        background: linear-gradient(135deg, #2d4055, #3b5369);
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
        border-radius: var(--bme-radius-sm);
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
        border-radius: var(--bme-radius-sm);
        cursor: pointer;
        font-family: inherit;
        transition:
          background 0.15s ease,
          border-color 0.15s ease;
      }

      .sort-toggle:hover,
      .sort-toggle.active {
        background: rgba(255, 255, 255, 0.3);
        border-color: rgba(255, 255, 255, 0.55);
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
        padding: var(--bme-space-sm) var(--bme-panel-padding) 4px;
      }

      .body-parts-search-input {
        width: 100%;
        box-sizing: border-box;
        padding: 10px 12px;
        border: 1px solid var(--bme-border);
        border-radius: var(--bme-radius-md);
        font-size: var(--bme-font-size-label);
        font-family: var(--bme-font-family);
        background: var(--bme-surface-elevated);
        outline: none;
        transition:
          border-color 0.15s ease,
          box-shadow 0.15s ease,
          background 0.15s ease;
      }

      .body-parts-search-input:focus-visible {
        border-color: var(--bme-accent-strong);
        background: var(--bme-panel);
      }

      .body-parts-list {
        list-style: none;
        margin: 0;
        padding: var(--bme-space-sm) var(--bme-space-sm) var(--bme-space-md);
        display: grid;
        gap: var(--bme-space-xs);
        max-height: 280px;
        overflow-y: auto;
      }

      .body-part-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
        padding: 8px 12px;
        background: transparent;
        border: 1px solid transparent;
        border-radius: var(--bme-radius-md);
        cursor: pointer;
        text-align: left;
        font-family: var(--bme-font-family);
        font-size: var(--bme-font-size-body);
        color: inherit;
        transition:
          background 0.15s ease,
          border-color 0.15s ease,
          box-shadow 0.15s ease;
      }

      .body-part-btn:hover {
        background: var(--bme-accent-soft);
        border-color: rgba(79, 143, 206, 0.18);
      }

      .body-part-btn.selected {
        background: linear-gradient(
          180deg,
          rgba(79, 143, 206, 0.18),
          rgba(79, 143, 206, 0.08)
        );
        border-color: rgba(79, 143, 206, 0.24);
        box-shadow: var(--bme-shadow-soft);
        font-weight: 600;
        color: var(--bme-accent-strong);
      }

      .body-part-icon {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        object-fit: cover;
        flex-shrink: 0;
        background: var(--bme-surface);
        border: 1px solid var(--bme-border);
      }

      .body-part-check {
        width: 14px;
        flex-shrink: 0;
        color: var(--bme-accent-strong);
        font-size: 12px;
      }

      .empty-parts {
        padding: var(--bme-space-md);
        color: var(--bme-text-muted);
        font-size: var(--bme-font-size-label);
        text-align: center;
      }

      .site-pages-section {
        border-top: 1px solid var(--bme-divider);
        background: linear-gradient(
          180deg,
          var(--bme-panel),
          var(--bme-surface-elevated)
        );
      }

      .site-pages-list {
        list-style: none;
        margin: 0;
        padding: var(--bme-space-sm);
        display: grid;
        gap: var(--bme-space-xs);
        max-height: 220px;
        overflow-y: auto;
      }

      .site-page-button {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--bme-space-sm);
        width: 100%;
        padding: 10px 12px;
        border: 1px solid transparent;
        border-radius: var(--bme-radius-md);
        background: transparent;
        color: inherit;
        font: inherit;
        text-align: left;
        cursor: pointer;
        transition:
          background var(--bme-motion-fast),
          border-color var(--bme-motion-fast),
          transform var(--bme-motion-fast);
      }

      .site-page-button:hover:not(:disabled),
      .site-page-button.active {
        background: var(--bme-accent-soft);
        border-color: rgba(79, 143, 206, 0.18);
        transform: translateY(-1px);
      }

      .site-page-button:disabled {
        cursor: not-allowed;
        opacity: 0.68;
      }

      .site-page-copy {
        min-width: 0;
      }

      .site-page-title {
        display: block;
        font-weight: 600;
      }

      .site-page-meta {
        display: block;
        margin-top: 4px;
        color: var(--bme-text-muted);
        font-size: 12px;
      }

      .site-page-badge {
        flex-shrink: 0;
        padding: 4px 8px;
        border-radius: 999px;
        background: rgba(32, 50, 69, 0.08);
        color: var(--bme-text-muted);
        font-size: 11px;
        font-weight: 600;
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

  @property({ attribute: false }) pageLinks: SiteNavItem[] = SITE_NAV_ITEMS;

  @property({ type: String, attribute: "active-nav-id" })
  activeNavId: SiteNavId = DEFAULT_SITE_NAV_ID;

  @state() private _bodyPartsExpanded = false;
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

  private _emitSiteNav(item: SiteNavItem) {
    if (!item.enabled) {
      return;
    }

    this.dispatchEvent(
      new CustomEvent("site-nav-request", {
        detail: { navId: item.id },
        bubbles: true,
        composed: true,
      }),
    );
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
                  loading="lazy"
                  decoding="async"
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
          ${this._bodyPartsExpanded
            ? html`
                <div class="body-parts-body-inner">
                  <div class="body-parts-search">
                    <input
                      class="body-parts-search-input"
                      type="text"
                      aria-label="Search body parts"
                      placeholder="Search body parts..."
                      .value=${this._bodyPartsSearch}
                      @input=${(e: Event) => {
                        this._bodyPartsSearch = (
                          e.target as HTMLInputElement
                        ).value;
                      }}
                    />
                  </div>
                  ${filteredBodyParts.length === 0
                    ? html`<p class="empty-parts">No results</p>`
                    : html`
                        <ul class="body-parts-list">
                          ${filteredBodyParts.map((bp) => {
                            const isSelected =
                              this.selectedBodyPartIds.includes(bp.id);
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
                                    this._emitBodyPartSelect(
                                      bp.id,
                                      bp.organIds,
                                    )}
                                >
                                  <img
                                    class="body-part-icon"
                                    src=${this._bodyPartImageUrl(bp.imageFile)}
                                    alt=""
                                    loading="lazy"
                                    decoding="async"
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
              `
            : nothing}
        </div>
      </div>

      <div class="site-pages-section">
        <div class="panel-header">Directory Pages</div>
        <ul class="site-pages-list">
          ${this.pageLinks.map(
            (item) => html`
              <li>
                <button
                  type="button"
                  class="site-page-button ${item.id === this.activeNavId
                    ? "active"
                    : ""}"
                  data-site-nav-id=${item.id}
                  ?disabled=${!item.enabled}
                  aria-current=${item.id === this.activeNavId
                    ? "page"
                    : nothing}
                  @click=${() => this._emitSiteNav(item)}
                >
                  <span class="site-page-copy">
                    <span class="site-page-title">${item.label}</span>
                    <span class="site-page-meta">${item.description}</span>
                  </span>
                  <span class="site-page-badge"
                    >${item.enabled ? "Live" : "Soon"}</span
                  >
                </button>
              </li>
            `,
          )}
        </ul>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "body-map-sidebar": BodyMapSidebar;
  }
}
