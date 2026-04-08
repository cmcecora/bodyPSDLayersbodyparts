import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { designTokens } from "./styles/tokens.css.js";
import {
  BODY_PARTS,
  getBodyPartPhotoUrl,
  type BodyPartDefinition,
} from "./data/body-parts.js";

@customElement("body-part-grid-view")
export class BodyPartGridView extends LitElement {
  static styles = [
    designTokens,
    css`
      :host {
        display: block;
        height: 100%;
        font-family: var(--bme-font-family);
        color: var(--bme-text);
      }

      .panel {
        display: flex;
        flex-direction: column;
        gap: var(--bme-space-md);
        height: 100%;
        padding: var(--bme-panel-padding);
      }

      .hero {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: var(--bme-space-md);
      }

      .eyebrow {
        display: inline-flex;
        align-items: center;
        padding: 4px 10px;
        border-radius: 999px;
        background: rgba(79, 143, 206, 0.12);
        color: var(--bme-accent-strong);
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .title {
        margin: 10px 0 8px;
        font-size: 26px;
        line-height: 1.1;
      }

      .copy {
        margin: 0;
        color: var(--bme-text-muted);
        line-height: 1.6;
      }

      .toolbar {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 8px;
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.72);
        box-shadow: inset 0 0 0 1px rgba(32, 50, 69, 0.08);
      }

      .toolbar-label {
        padding-left: 4px;
        color: var(--bme-text-muted);
        font-size: var(--bme-font-size-label);
      }

      .toolbar-button {
        min-height: 40px;
        padding: 0 14px;
        border: none;
        border-radius: 12px;
        background: transparent;
        color: inherit;
        font: inherit;
        cursor: pointer;
        transition:
          background var(--bme-motion-fast),
          color var(--bme-motion-fast);
      }

      .toolbar-button:hover,
      .toolbar-button:focus-visible,
      .toolbar-button.active {
        outline: none;
        background: rgba(79, 143, 206, 0.14);
        color: var(--bme-accent-strong);
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: var(--bme-space-md);
      }

      .grid.compact {
        grid-template-columns: repeat(5, minmax(0, 1fr));
        gap: 12px;
      }

      .card {
        display: flex;
        flex-direction: column;
        gap: 12px;
        width: 100%;
        padding: 12px;
        border: 1px solid var(--bme-border);
        border-radius: 18px;
        background:
          linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(244, 249, 255, 0.96)),
          var(--bme-panel);
        box-shadow: var(--bme-shadow-soft);
        text-align: left;
        cursor: pointer;
        transition:
          transform var(--bme-motion-fast),
          box-shadow var(--bme-motion-fast),
          border-color var(--bme-motion-fast);
      }

      .card:hover,
      .card:focus-visible {
        outline: none;
        transform: translateY(-2px);
        border-color: rgba(79, 143, 206, 0.28);
        box-shadow: var(--bme-shadow-strong);
      }

      .grid.compact .card {
        padding: 10px;
      }

      .media {
        position: relative;
        overflow: hidden;
        border-radius: 16px;
        background: linear-gradient(180deg, rgba(234, 241, 248, 0.95), #f7fbff);
        aspect-ratio: 1 / 1;
      }

      .grid.compact .media {
        border-radius: 14px;
      }

      .media::before {
        content: "";
        position: absolute;
        inset: 0;
        background:
          linear-gradient(
            110deg,
            rgba(255, 255, 255, 0) 20%,
            rgba(255, 255, 255, 0.78) 48%,
            rgba(255, 255, 255, 0) 78%
          ),
          linear-gradient(180deg, rgba(221, 231, 243, 0.98), rgba(241, 246, 252, 0.98));
        background-size: 240px 100%, 100% 100%;
        animation: shimmer 1.4s linear infinite;
        opacity: 1;
        transition: opacity var(--bme-motion-fast);
      }

      .media.loaded::before {
        opacity: 0;
      }

      .image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0;
        transition: opacity var(--bme-motion-medium);
      }

      .media.loaded .image {
        opacity: 1;
      }

      .body {
        display: grid;
        gap: 6px;
      }

      .name {
        margin: 0;
        font-size: 16px;
        font-weight: 700;
      }

      .meta {
        color: var(--bme-text-muted);
        font-size: var(--bme-font-size-label);
      }

      .grid.compact .meta {
        display: none;
      }

      @keyframes shimmer {
        0% {
          background-position:
            -240px 0,
            0 0;
        }
        100% {
          background-position:
            calc(100% + 240px) 0,
            0 0;
        }
      }

      @media (max-width: 1280px) {
        .grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .grid.compact {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }
      }

      @media (max-width: 820px) {
        .hero {
          flex-direction: column;
        }

        .grid,
        .grid.compact {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
    `,
  ];

  @property({ attribute: false }) bodyParts: BodyPartDefinition[] = BODY_PARTS;

  @property({ type: Boolean, reflect: true }) compact = false;

  @property({ type: String, attribute: "asset-base" }) assetBase = "";

  @state() private _loadedImageIds = new Set<string>();

  private _emitCompactToggle(compact: boolean) {
    this.dispatchEvent(
      new CustomEvent("compact-mode-toggle-request", {
        detail: { compact },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _emitBodyPartOpen(bodyPartId: string) {
    this.dispatchEvent(
      new CustomEvent("body-part-card-open-request", {
        detail: { bodyPartId },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _handleImageLoad(bodyPartId: string) {
    if (this._loadedImageIds.has(bodyPartId)) {
      return;
    }

    const next = new Set(this._loadedImageIds);
    next.add(bodyPartId);
    this._loadedImageIds = next;
  }

  private _metaLine(bodyPart: BodyPartDefinition) {
    if (bodyPart.organIds.length === 0) {
      return "General region";
    }

    return bodyPart.organIds.length === 1
      ? "1 linked organ"
      : `${bodyPart.organIds.length} linked organs`;
  }

  render() {
    return html`
      <section class="panel">
        <div class="hero">
          <div>
            <span class="eyebrow">Body Part Grid</span>
            <h2 class="title">Scan thumbnails, then jump into the explorer.</h2>
            <p class="copy">
              This mirrored gallery keeps image loading local to the content
              region while the shared shell and body model stay mounted.
            </p>
          </div>

          <div class="toolbar" role="group" aria-label="Grid density">
            <span class="toolbar-label">Density</span>
            <button
              type="button"
              class="toolbar-button ${this.compact ? "" : "active"}"
              aria-pressed=${String(!this.compact)}
              @click=${() => this._emitCompactToggle(false)}
            >
              Cards
            </button>
            <button
              type="button"
              class="toolbar-button ${this.compact ? "active" : ""}"
              aria-pressed=${String(this.compact)}
              @click=${() => this._emitCompactToggle(true)}
            >
              Compact
            </button>
          </div>
        </div>

        <div class="grid ${this.compact ? "compact" : ""}">
          ${this.bodyParts.map((bodyPart) => {
            const loaded = this._loadedImageIds.has(bodyPart.id);

            return html`
              <button
                type="button"
                class="card"
                data-body-part-id=${bodyPart.id}
                @click=${() => this._emitBodyPartOpen(bodyPart.id)}
              >
                <div class="media ${loaded ? "loaded" : ""}">
                  <img
                    class="image"
                    src=${getBodyPartPhotoUrl(bodyPart.imageFile, this.assetBase)}
                    alt=${bodyPart.name}
                    loading="lazy"
                    decoding="async"
                    @load=${() => this._handleImageLoad(bodyPart.id)}
                  />
                </div>
                <div class="body">
                  <p class="name">${bodyPart.name}</p>
                  <span class="meta">${this._metaLine(bodyPart)}</span>
                </div>
              </button>
            `;
          })}
        </div>
      </section>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "body-part-grid-view": BodyPartGridView;
  }
}
