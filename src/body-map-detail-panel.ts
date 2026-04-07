import { LitElement, html, nothing, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { designTokens } from "./styles/tokens.css.js";
import { type BodySystemDefinition } from "./data/systems.js";
import {
  getBodyPartPhotoUrl,
  type BodyPartDefinition,
  type BodyPartPhotoEntry,
} from "./data/body-parts.js";

@customElement("body-map-detail-panel")
export class BodyMapDetailPanel extends LitElement {
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

      .empty-state {
        padding: var(--bme-panel-padding);
        color: var(--bme-text-muted);
        font-size: var(--bme-font-size-label);
        text-align: center;
      }

      .detail-content {
        padding: var(--bme-panel-padding);
        display: flex;
        flex-direction: column;
        gap: var(--bme-space-md);
      }

      .detail-thumb {
        width: 100%;
        height: auto;
        border-radius: var(--bme-radius-lg);
        display: block;
        border: 1px solid var(--bme-border);
        box-shadow: var(--bme-shadow-soft);
        background: var(--bme-surface-elevated);
      }

      .detail-title {
        font-size: var(--bme-font-size-display);
        font-weight: 600;
        margin: 0;
        color: var(--bme-text);
      }

      .detail-description {
        font-size: var(--bme-font-size-body);
        line-height: 1.6;
        color: var(--bme-text-muted);
        margin: 0;
      }

      .photo-section {
        margin-top: 0;
        padding-top: var(--bme-space-sm);
        border-top: 1px solid var(--bme-divider);
      }

      .photo-section-title {
        font-size: var(--bme-font-size-heading);
        font-weight: 600;
        margin: 0 0 var(--bme-space-sm) 0;
        color: var(--bme-text);
      }

      .photo-stack {
        display: flex;
        flex-direction: column;
        gap: var(--bme-space-sm);
      }

      .photo-card {
        margin: 0;
        border: 1px solid var(--bme-border);
        border-radius: var(--bme-radius-lg);
        overflow: hidden;
        background: linear-gradient(
          180deg,
          var(--bme-panel),
          var(--bme-surface-elevated)
        );
        box-shadow: var(--bme-shadow-soft);
      }

      .detail-photo {
        display: block;
        width: 100%;
        height: auto;
        background: #f6f7f9;
      }

      .photo-caption {
        padding: 10px 12px;
        font-size: var(--bme-font-size-label);
        color: var(--bme-text-muted);
        border-top: 1px solid var(--bme-divider);
        background: var(--bme-surface-elevated);
      }
    `,
  ];

  @property({ attribute: false }) system: BodySystemDefinition | null = null;
  @property({ attribute: false }) bodyPart: BodyPartDefinition | null = null;
  @property({ attribute: false }) photoEntries: BodyPartPhotoEntry[] = [];
  @property({ type: String, attribute: "asset-base" }) assetBase = "";

  private get _title(): string | null {
    return this.system?.title ?? this.bodyPart?.name ?? null;
  }

  private get _description(): string | null {
    return this.system?.description ?? null;
  }

  private _systemThumbnailUrl(thumbnail: string): string {
    const base = this.assetBase.replace(/\/$/, "");
    return base ? `${base}${thumbnail}` : thumbnail;
  }

  render() {
    const title = this._title;
    const description = this._description;
    const hasContent = title !== null || this.photoEntries.length > 0;

    return html`
      <div class="panel-header">Detail Panel</div>
      ${!hasContent
        ? html`
            <p class="empty-state">
              Select a body system or body part to see details.
            </p>
          `
        : html`
            <div class="detail-content">
              ${this.system !== null
                ? html`
                    <img
                      class="detail-thumb"
                      src=${this._systemThumbnailUrl(this.system.thumbnail)}
                      alt=${this.system.title}
                    />
                  `
                : nothing}
              ${title !== null
                ? html`<h3 class="detail-title">${title}</h3>`
                : nothing}
              ${description !== null
                ? html`<p class="detail-description">${description}</p>`
                : nothing}
              ${this.photoEntries.length > 0
                ? html`
                    <section class="photo-section">
                      <h4 class="photo-section-title">Body Part Photos</h4>
                      <div class="photo-stack">
                        ${this.photoEntries.map(
                          (entry) => html`
                            <figure
                              class="photo-card"
                              data-photo-id=${entry.id}
                            >
                              <img
                                class="detail-photo"
                                src=${getBodyPartPhotoUrl(
                                  entry.imageFile,
                                  this.assetBase,
                                )}
                                alt=${entry.label}
                              />
                              <figcaption class="photo-caption">
                                ${entry.label}
                              </figcaption>
                            </figure>
                          `,
                        )}
                      </div>
                    </section>
                  `
                : nothing}
            </div>
          `}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "body-map-detail-panel": BodyMapDetailPanel;
  }
}
