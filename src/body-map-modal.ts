import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { designTokens } from "./styles/tokens.css.js";
import type { DiseaseEntry } from "./data/data-service.js";

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
 * <body-map-modal> — positioned body section modal with tabbed content.
 *
 * Renders a fixed-position modal near the user's click point (anchorX/anchorY),
 * with a triangular carat pointer. Shows Symptoms and Diseases tabs, checkbox-
 * selectable symptoms, debounced search filter, skeleton loading, error retry,
 * and dismiss-on-backdrop-click / Escape-key behavior.
 *
 * Threat model compliance:
 * - T-04-08: All disease names and symptom strings rendered via Lit html template
 *   auto-escaping. No unsafeHTML, no direct DOM construction with user data.
 * - T-04-09: Search query used only in .toLowerCase().includes() comparison.
 *   Never reflected into DOM outside Lit auto-escaped binding.
 */
@customElement("body-map-modal")
export class BodyMapModal extends LitElement {
  static styles = [
    designTokens,
    css`
      :host {
        font-family: var(--bme-font-family);
      }

      .modal-overlay {
        position: fixed;
        inset: 0;
        z-index: 1000;
        pointer-events: none;
      }

      .modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.08);
        pointer-events: all;
      }

      .modal-carat {
        position: fixed;
        width: 14px;
        height: 14px;
        background: #f3f4f6;
        transform: rotate(45deg);
        z-index: 1002;
        box-shadow: -2px -2px 4px rgba(0, 0, 0, 0.06);
        pointer-events: none;
      }

      .modal {
        position: fixed;
        background: #fff;
        border-radius: 14px;
        box-shadow:
          0 12px 48px rgba(0, 0, 0, 0.15),
          0 2px 8px rgba(0, 0, 0, 0.08);
        width: 520px;
        max-width: calc(100vw - 32px);
        max-height: min(440px, 70vh);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        z-index: 1001;
        pointer-events: all;
      }

      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 24px 14px;
        background: #f3f4f6;
        border-bottom: 1px solid #e5e7eb;
        flex-shrink: 0;
      }

      .modal-header h3 {
        margin: 0;
        font-size: 17px;
        font-weight: 600;
        color: #1f2937;
      }

      .modal-close {
        background: none;
        border: none;
        font-size: 22px;
        color: #9ca3af;
        cursor: pointer;
        padding: 2px 6px;
        border-radius: 6px;
        line-height: 1;
        font-family: var(--bme-font-family);
      }

      .modal-close:hover {
        color: #374151;
        background: rgba(0, 0, 0, 0.06);
      }

      .modal-tabs {
        display: flex;
        border-bottom: 1px solid #e5e7eb;
        flex-shrink: 0;
      }

      .tab {
        flex: 1;
        padding: 10px;
        background: none;
        border: none;
        border-bottom: 2px solid transparent;
        cursor: pointer;
        font-size: 14px;
        color: #6b7280;
        font-family: var(--bme-font-family);
        transition: color 0.15s ease;
      }

      .tab.active {
        border-bottom-color: var(--bme-accent);
        color: #1f2937;
        font-weight: 600;
      }

      .tab:hover:not(.active) {
        color: #374151;
      }

      .modal-search {
        flex-shrink: 0;
        padding: 0 24px;
      }

      .modal-search input {
        width: 100%;
        box-sizing: border-box;
        margin: 12px 0;
        padding: 8px 14px;
        border: 1px solid var(--bme-border);
        border-radius: 8px;
        font-size: 14px;
        font-family: var(--bme-font-family);
        outline: none;
      }

      .modal-search input:focus {
        border-color: var(--bme-accent);
      }

      .modal-body {
        overflow-y: auto;
        flex: 1;
      }

      .modal-body ul {
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .modal-body li {
        padding: 14px 24px;
        font-size: 15px;
        color: #374151;
        border-bottom: 1px solid #f3f4f6;
        display: flex;
        align-items: center;
      }

      .modal-body li:hover {
        background: #eff6ff;
      }

      .modal-body li:last-child {
        border-bottom: none;
      }

      .symptom-checkbox {
        margin-right: 12px;
        accent-color: var(--bme-accent);
        cursor: pointer;
        flex-shrink: 0;
      }

      .symptom-label {
        cursor: pointer;
        user-select: none;
      }

      .empty-state {
        color: #9ca3af;
        font-size: 14px;
        text-align: center;
        padding: 32px 24px;
      }

      /* Error state */
      .error-state {
        text-align: center;
        padding: 32px 24px;
      }

      .error-message {
        color: var(--bme-destructive);
        font-size: 15px;
        margin-bottom: 12px;
      }

      .retry-btn {
        background: none;
        border: 1px solid var(--bme-destructive);
        color: var(--bme-destructive);
        padding: 6px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-family: var(--bme-font-family);
      }

      .retry-btn:hover {
        background: rgba(220, 38, 38, 0.06);
      }

      /* Skeleton shimmer */
      .skeleton-list {
        list-style: none;
        margin: 0;
        padding: 16px 24px;
      }

      .skeleton-list li {
        padding: 0;
        border: none;
        display: block;
        margin-bottom: 12px;
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

  // Public properties (received from explorer parent)
  @property({ attribute: false }) sectionId: string | null = null;
  @property({ attribute: false }) sectionName = "";
  @property({ attribute: false }) diseases: DiseaseEntry[] = [];
  @property({ attribute: false }) symptoms: string[] = [];
  @property({ type: Boolean }) loading = false;
  @property({ attribute: false }) error: string | null = null;
  @property({ type: Number }) anchorX = 0;
  @property({ type: Number }) anchorY = 0;

  // Internal state
  @state() private _activeTab: "symptoms" | "diseases" = "symptoms";
  @state() private _searchQuery = "";
  @state() private _selectedSymptoms: Set<string> = new Set();
  @state() private _modalStyle = "";
  @state() private _caratStyle = "";

  // Debounced search handler — module-level debounce (Pitfall 3 prevention)
  private _debouncedSearch = debounce((query: string) => {
    this._searchQuery = query;
  }, 250);

  // Bound keydown handler for cleanup (Pitfall 2: proper listener management)
  private _boundKeyDown!: (e: KeyboardEvent) => void;

  connectedCallback() {
    super.connectedCallback();
    this._boundKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") this._close();
    };
    document.addEventListener("keydown", this._boundKeyDown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("keydown", this._boundKeyDown);
  }

  /**
   * Compute modal and carat positions based on anchor point.
   * Clamps to viewport bounds to prevent overflow (MODAL-02, D-10).
   */
  private _computePosition() {
    const modalW = 520;
    const modalH = 440;
    const gap = 12;
    const caratSize = 14;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const headerTopOffset = 12;
    const headerBottomOffset = 48;

    const placeRight = this.anchorX < vw / 2;
    let left = placeRight ? this.anchorX + gap : this.anchorX - modalW - gap;
    let top = this.anchorY - modalH / 2;

    // Flip to the opposite side if the preferred side would overflow.
    if (placeRight && left + modalW > vw - 16) {
      left = this.anchorX - modalW - gap;
    } else if (!placeRight && left < 16) {
      left = this.anchorX + gap;
    }

    // Clamp vertical position to viewport
    top = Math.max(16, Math.min(top, vh - modalH - 16));

    this._modalStyle = `left:${left}px;top:${top}px`;

    const caratLeft = placeRight
      ? left - caratSize / 2
      : left + modalW - caratSize / 2;
    const headerTop = top + headerTopOffset;
    const headerBottom = top + headerBottomOffset;
    const caratTop = Math.max(
      headerTop,
      Math.min(this.anchorY - caratSize / 2, headerBottom),
    );
    this._caratStyle = `left:${caratLeft}px;top:${caratTop}px`;
  }

  willUpdate(changedProperties: Map<string | symbol, unknown>) {
    if (changedProperties.has("anchorX") || changedProperties.has("anchorY")) {
      this._computePosition();
    }
    // Reset active tab to symptoms when a new section is opened
    if (changedProperties.has("sectionId")) {
      this._activeTab = "symptoms";
      this._searchQuery = "";
      this._selectedSymptoms = new Set();
      this._computePosition();
    }
  }

  private _close() {
    this.dispatchEvent(
      new CustomEvent("modal-close", { bubbles: true, composed: true }),
    );
  }

  private _handleRetry() {
    this.dispatchEvent(
      new CustomEvent("modal-retry", { bubbles: true, composed: true }),
    );
  }

  private _handleSymptomToggle(symptom: string, checked: boolean) {
    const next = new Set(this._selectedSymptoms);
    if (checked) {
      next.add(symptom);
    } else {
      next.delete(symptom);
    }
    this._selectedSymptoms = next;
    this.dispatchEvent(
      new CustomEvent("symptom-toggle", {
        detail: { symptom, checked },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _filterItems(items: string[], query: string): string[] {
    if (!query) return items;
    const q = query.toLowerCase();
    return items.filter((item) => item.toLowerCase().includes(q));
  }

  private _filterDiseases(
    diseases: DiseaseEntry[],
    query: string,
  ): DiseaseEntry[] {
    if (!query) return diseases;
    const q = query.toLowerCase();
    return diseases.filter((d) => d.name.toLowerCase().includes(q));
  }

  private _renderSkeleton() {
    return html`
      <ul class="skeleton-list">
        <li><div class="skeleton-bar long"></div></li>
        <li><div class="skeleton-bar medium"></div></li>
        <li><div class="skeleton-bar long"></div></li>
        <li><div class="skeleton-bar short"></div></li>
        <li><div class="skeleton-bar medium"></div></li>
        <li><div class="skeleton-bar short"></div></li>
      </ul>
    `;
  }

  private _renderError() {
    return html`
      <div class="error-state">
        <p class="error-message">Failed to load data.</p>
        <button class="retry-btn" @click=${this._handleRetry}>Retry</button>
      </div>
    `;
  }

  private _renderSymptomsTab() {
    const filtered = this._filterItems(this.symptoms, this._searchQuery);
    if (filtered.length === 0) {
      return html`<p class="empty-state">No symptoms found</p>`;
    }
    return html`
      <ul>
        ${filtered.map(
          (symptom) => html`
            <li>
              <input
                type="checkbox"
                class="symptom-checkbox"
                .checked=${this._selectedSymptoms.has(symptom)}
                @change=${(e: Event) =>
                  this._handleSymptomToggle(
                    symptom,
                    (e.target as HTMLInputElement).checked,
                  )}
              />
              <span class="symptom-label">${symptom}</span>
            </li>
          `,
        )}
      </ul>
    `;
  }

  private _renderDiseasesTab() {
    const filtered = this._filterDiseases(this.diseases, this._searchQuery);
    if (filtered.length === 0) {
      return html`<p class="empty-state">No diseases found</p>`;
    }
    return html`
      <ul>
        ${filtered.map((disease) => html`<li>${disease.name}</li>`)}
      </ul>
    `;
  }

  render() {
    if (this.sectionId === null) {
      return nothing;
    }

    let bodyContent;
    if (this.loading) {
      bodyContent = this._renderSkeleton();
    } else if (this.error !== null) {
      bodyContent = this._renderError();
    } else if (this._activeTab === "symptoms") {
      bodyContent = this._renderSymptomsTab();
    } else {
      bodyContent = this._renderDiseasesTab();
    }

    return html`
      <div class="modal-overlay">
        <div class="modal-backdrop" @click=${this._close}></div>
        <div class="modal-carat" style=${this._caratStyle}></div>
        <div class="modal" style=${this._modalStyle}>
          <div class="modal-header">
            <h3>${this.sectionName}</h3>
            <button class="modal-close" @click=${this._close}>&times;</button>
          </div>
          <div class="modal-tabs">
            <button
              class="tab ${this._activeTab === "symptoms" ? "active" : ""}"
              @click=${() => {
                this._activeTab = "symptoms";
              }}
            >
              Symptoms
            </button>
            <button
              class="tab ${this._activeTab === "diseases" ? "active" : ""}"
              @click=${() => {
                this._activeTab = "diseases";
              }}
            >
              Diseases
            </button>
          </div>
          <div class="modal-search">
            <input
              type="text"
              placeholder="Search..."
              @input=${(e: Event) =>
                this._debouncedSearch((e.target as HTMLInputElement).value)}
            />
          </div>
          <div class="modal-body">${bodyContent}</div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "body-map-modal": BodyMapModal;
  }
}
