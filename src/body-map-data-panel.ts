import { LitElement, html, css, nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { designTokens } from "./styles/tokens.css.js";
import type { DiseaseEntry } from "./data/data-service.js";
import { ORGANS } from "./data/organs.js";
import { BODY_PARTS } from "./data/body-parts.js";

/**
 * Standalone debounce utility — module-level, not inside render (per research Pitfall 3).
 */
function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * <body-map-data-panel> — 4th column component.
 *
 * Receives data props from parent explorer and renders collapsible per-organ
 * cards with disease and symptom lists, skeleton loading, empty states, and
 * error retry. Dispatches filter-change and retry-organ custom events upward.
 */
@customElement("body-map-data-panel")
export class BodyMapDataPanel extends LitElement {
  static styles = [
    designTokens,
    css`
      :host {
        display: block;
        font-family: var(--bme-font-family);
        overflow-y: auto;
        max-height: calc(100vh - 48px);
      }

      .panel-header {
        background: var(--bme-header-bg);
        color: var(--bme-header-text);
        padding: var(--bme-space-sm) var(--bme-space-md);
        border-radius: 8px 8px 0 0;
        font-size: var(--bme-font-size-heading);
        font-weight: 600;
        margin: 0;
        position: sticky;
        top: 0;
        z-index: 1;
      }

      .panel-body {
        padding: var(--bme-space-md);
      }

      .search-input {
        width: 100%;
        box-sizing: border-box;
        padding: 10px 14px;
        border: 1px solid var(--bme-border);
        border-radius: 8px;
        font-size: var(--bme-font-size-body);
        font-family: var(--bme-font-family);
        margin-bottom: var(--bme-space-md);
        outline: none;
      }

      .search-input:focus {
        border-color: var(--bme-accent);
      }

      .organ-card {
        background: var(--bme-panel);
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        margin-bottom: var(--bme-space-md);
        overflow: hidden;
        border: 1px solid var(--bme-border);
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 14px 20px;
        cursor: pointer;
        user-select: none;
        font-weight: 600;
        font-size: var(--bme-font-size-heading);
        color: #1f2937;
        transition: background 0.15s ease;
      }

      .card-header:hover {
        background: #f9fafb;
      }

      .count-badge {
        background: var(--bme-accent);
        color: #fff;
        font-size: 12px;
        padding: 2px 10px;
        border-radius: 10px;
        font-weight: 500;
        flex-shrink: 0;
      }

      /* Collapsible using grid-template-rows transition */
      .card-content {
        display: grid;
        grid-template-rows: 1fr;
        transition: grid-template-rows 0.2s ease;
      }

      .card-content.collapsed {
        grid-template-rows: 0fr;
      }

      .card-content-inner {
        overflow: hidden;
      }

      .subsection-heading {
        font-size: var(--bme-font-size-label);
        font-weight: 600;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        padding: 8px 20px 4px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        user-select: none;
        transition: background 0.15s ease;
      }

      .subsection-heading:hover {
        background: #f9fafb;
      }

      .subsection-chevron {
        font-size: 10px;
        transition: transform 0.2s ease;
      }

      .subsection-chevron.collapsed {
        transform: rotate(-90deg);
      }

      /* Collapsible sub-sections */
      .subsection-content {
        display: grid;
        grid-template-rows: 1fr;
        transition: grid-template-rows 0.2s ease;
      }

      .subsection-content.collapsed {
        grid-template-rows: 0fr;
      }

      .subsection-content-inner {
        overflow: hidden;
      }

      .data-list {
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .data-list li {
        padding: 10px 20px;
        border-bottom: 1px solid var(--bme-divider);
        font-size: var(--bme-font-size-body);
        color: #374151;
      }

      .data-list li:last-child {
        border-bottom: none;
      }

      .empty-state {
        color: #9ca3af;
        font-size: var(--bme-font-size-label);
        text-align: center;
        padding: var(--bme-space-md);
      }

      /* Error state */
      .error-card {
        background: var(--bme-panel);
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        margin-bottom: var(--bme-space-md);
        overflow: hidden;
        border: 1px solid var(--bme-border);
        padding: var(--bme-space-md);
        text-align: center;
      }

      .error-message {
        color: var(--bme-destructive);
        font-size: var(--bme-font-size-body);
        margin-bottom: var(--bme-space-sm);
      }

      .retry-btn {
        background: none;
        border: 1px solid var(--bme-destructive);
        color: var(--bme-destructive);
        padding: 4px 12px;
        border-radius: 6px;
        cursor: pointer;
        font-size: var(--bme-font-size-label);
        font-family: var(--bme-font-family);
      }

      .retry-btn:hover {
        background: rgba(220, 38, 38, 0.06);
      }

      /* Skeleton shimmer */
      .skeleton-card {
        background: var(--bme-panel);
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        margin-bottom: var(--bme-space-md);
        overflow: hidden;
        border: 1px solid var(--bme-border);
        padding: var(--bme-space-md);
      }

      .skeleton-bar {
        height: 14px;
        border-radius: 6px;
        background: linear-gradient(
          90deg,
          #e5e7eb 25%,
          #f3f4f6 50%,
          #e5e7eb 75%
        );
        background-size: 200% 100%;
        animation: skeleton-shimmer 1.2s ease-in-out infinite;
        margin-bottom: var(--bme-space-sm);
      }

      .skeleton-bar.short {
        width: 55%;
      }

      .skeleton-bar.medium {
        width: 72%;
      }

      .skeleton-bar.long {
        width: 90%;
      }

      @keyframes skeleton-shimmer {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }
    `,
  ];

  @property({ attribute: false }) selectedOrganIds: string[] = [];
  @property({ attribute: false }) diseasesMap: Map<string, DiseaseEntry[]> =
    new Map();
  @property({ attribute: false }) symptomsMap: Map<string, string[]> =
    new Map();
  @property({ attribute: false }) loadingIds: Set<string> = new Set();
  @property({ attribute: false }) errorIds: Map<string, string> = new Map();
  @property({ attribute: false }) filterQuery = "";

  @state() private _collapsedIds: Set<string> = new Set();
  @state() private _expandedDiseases: Set<string> = new Set();
  @state() private _expandedSymptoms: Set<string> = new Set();

  protected updated(changedProperties: PropertyValues<this>) {
    if (!changedProperties.has("selectedOrganIds")) {
      return;
    }

    const previous = new Set<string>(
      (changedProperties.get("selectedOrganIds") as string[] | undefined) ?? [],
    );
    const current = new Set(this.selectedOrganIds);

    const nextExpandedDiseases = new Set(this._expandedDiseases);
    const nextExpandedSymptoms = new Set(this._expandedSymptoms);

    for (const organId of previous) {
      if (!current.has(organId)) {
        nextExpandedDiseases.delete(organId);
        nextExpandedSymptoms.delete(organId);
      }
    }

    this._expandedDiseases = nextExpandedDiseases;
    this._expandedSymptoms = nextExpandedSymptoms;
  }

  // Debounced filter-change dispatcher — created as class field (not inside render)
  private _debouncedFilterChange = debounce((query: string) => {
    this.dispatchEvent(
      new CustomEvent("filter-change", {
        detail: { query },
        bubbles: true,
        composed: true,
      }),
    );
  }, 250);

  private _getOrganName(organId: string): string {
    return (
      ORGANS.find((o) => o.id === organId)?.name ??
      BODY_PARTS.find((p) => p.id === organId)?.name ??
      organId
    );
  }

  private _filterItems<T>(
    items: T[],
    query: string,
    getText: (item: T) => string,
  ): T[] {
    if (!query) return items;
    const q = query.toLowerCase();
    return items.filter((item) => getText(item).toLowerCase().includes(q));
  }

  private _toggleCollapse(organId: string) {
    const next = new Set(this._collapsedIds);
    if (next.has(organId)) {
      next.delete(organId);
    } else {
      next.add(organId);
    }
    this._collapsedIds = next;
  }

  private _toggleSubsection(organId: string, section: "diseases" | "symptoms") {
    const set =
      section === "diseases" ? this._expandedDiseases : this._expandedSymptoms;
    const next = new Set(set);
    if (next.has(organId)) {
      next.delete(organId);
    } else {
      next.add(organId);
    }
    if (section === "diseases") {
      this._expandedDiseases = next;
    } else {
      this._expandedSymptoms = next;
    }
  }

  private _handleRetryClick(organId: string) {
    this.dispatchEvent(
      new CustomEvent("retry-organ", {
        detail: { organId },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _renderSkeletonCard() {
    return html`
      <div class="skeleton-card">
        <div class="skeleton-bar long"></div>
        <div class="skeleton-bar medium"></div>
        <div class="skeleton-bar long"></div>
        <div class="skeleton-bar short"></div>
        <div class="skeleton-bar medium"></div>
        <div class="skeleton-bar short"></div>
      </div>
    `;
  }

  private _renderErrorCard(organId: string) {
    return html`
      <div class="error-card organ-card">
        <p class="error-message">Failed to load data.</p>
        <button
          class="retry-btn"
          @click=${() => this._handleRetryClick(organId)}
        >
          Retry
        </button>
      </div>
    `;
  }

  private _renderOrganCard(organId: string) {
    const name = this._getOrganName(organId);
    const diseases = this.diseasesMap.get(organId) ?? [];
    const symptoms = this.symptomsMap.get(organId) ?? [];

    const filteredDiseases = this._filterItems(
      diseases,
      this.filterQuery,
      (d) => d.name,
    );
    const filteredSymptoms = this._filterItems(
      symptoms,
      this.filterQuery,
      (s) => s,
    );

    const totalCount = filteredDiseases.length + filteredSymptoms.length;
    const isCollapsed = this._collapsedIds.has(organId);
    const diseasesCollapsed = !this._expandedDiseases.has(organId);
    const symptomsCollapsed = !this._expandedSymptoms.has(organId);

    return html`
      <div class="organ-card">
        <div class="card-header" @click=${() => this._toggleCollapse(organId)}>
          <span>${name}</span>
          <span class="count-badge">${totalCount}</span>
        </div>
        <div class="card-content ${isCollapsed ? "collapsed" : ""}">
          <div class="card-content-inner">
            <div
              class="subsection-heading"
              @click=${() => this._toggleSubsection(organId, "diseases")}
            >
              <span>Diseases (${filteredDiseases.length})</span>
              <span
                class="subsection-chevron ${diseasesCollapsed
                  ? "collapsed"
                  : ""}"
                >&#9660;</span
              >
            </div>
            <div
              class="subsection-content ${diseasesCollapsed ? "collapsed" : ""}"
            >
              <div class="subsection-content-inner">
                ${filteredDiseases.length === 0
                  ? html`<p class="empty-state">
                      No diseases found for ${name}
                    </p>`
                  : html`
                      <ul class="data-list">
                        ${filteredDiseases.map((d) => html`<li>${d.name}</li>`)}
                      </ul>
                    `}
              </div>
            </div>
            <div
              class="subsection-heading"
              @click=${() => this._toggleSubsection(organId, "symptoms")}
            >
              <span>Symptoms (${filteredSymptoms.length})</span>
              <span
                class="subsection-chevron ${symptomsCollapsed
                  ? "collapsed"
                  : ""}"
                >&#9660;</span
              >
            </div>
            <div
              class="subsection-content ${symptomsCollapsed ? "collapsed" : ""}"
            >
              <div class="subsection-content-inner">
                ${filteredSymptoms.length === 0
                  ? html`<p class="empty-state">
                      No symptoms found for ${name}
                    </p>`
                  : html`
                      <ul class="data-list">
                        ${filteredSymptoms.map((s) => html`<li>${s}</li>`)}
                      </ul>
                    `}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  render() {
    return html`
      <div class="panel-header">Diseases & Symptoms</div>
      <div class="panel-body">
        <input
          class="search-input"
          type="text"
          placeholder="Search diseases & symptoms..."
          @input=${(e: Event) =>
            this._debouncedFilterChange((e.target as HTMLInputElement).value)}
        />
        ${this.selectedOrganIds.map((organId) => {
          if (this.loadingIds.has(organId)) {
            return this._renderSkeletonCard();
          }
          if (this.errorIds.has(organId)) {
            return this._renderErrorCard(organId);
          }
          return this._renderOrganCard(organId);
        })}
        ${this.selectedOrganIds.length === 0 ? nothing : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "body-map-data-panel": BodyMapDataPanel;
  }
}
