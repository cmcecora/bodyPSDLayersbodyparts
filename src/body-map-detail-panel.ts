import { LitElement, html, nothing, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { designTokens } from "./styles/tokens.css.js";
import { type BodySystemDefinition } from "./data/systems.js";

@customElement("body-map-detail-panel")
export class BodyMapDetailPanel extends LitElement {
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

      .empty-state {
        padding: var(--bme-space-md);
        color: #999;
        font-size: var(--bme-font-size-label);
        text-align: center;
      }

      .detail-content {
        padding: var(--bme-space-md);
      }

      .detail-thumb {
        width: 100%;
        height: auto;
        border-radius: 6px;
        margin-bottom: var(--bme-space-md);
        display: block;
      }

      .detail-title {
        font-size: var(--bme-font-size-display);
        font-weight: 600;
        margin: 0 0 var(--bme-space-sm) 0;
        color: #333;
      }

      .detail-description {
        font-size: var(--bme-font-size-body);
        line-height: 1.6;
        color: #555;
        margin: 0;
      }
    `,
  ];

  @property({ attribute: false }) system: BodySystemDefinition | null = null;

  render() {
    return html`
      <div class="panel-header">Detail Panel</div>
      ${this.system === null
        ? html`<p class="empty-state">Select a body system to see details.</p>`
        : html`
            <div class="detail-content">
              <img
                class="detail-thumb"
                src=${this.system.thumbnail}
                alt=${this.system.title}
              />
              <h3 class="detail-title">${this.system.title}</h3>
              <p class="detail-description">${this.system.description}</p>
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
