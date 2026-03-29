import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { designTokens } from "./styles/tokens.css.js";

@customElement("body-map-explorer")
export class BodyMapExplorer extends LitElement {
  static styles = [
    designTokens,
    css`
      :host {
        display: block;
        font-family: var(--bme-font-family);
        background: var(--bme-surface);
        color: #333;
      }

      .layout {
        display: grid;
        grid-template-columns: 260px 1fr 300px;
        min-height: 100vh;
        gap: var(--bme-space-md);
        padding: var(--bme-space-md);
      }

      .panel {
        background: var(--bme-panel);
        border: 1px solid var(--bme-border);
        border-radius: 8px;
        padding: var(--bme-space-md);
      }

      .panel-header {
        background: var(--bme-header-bg);
        color: var(--bme-header-text);
        padding: var(--bme-space-sm) var(--bme-space-md);
        border-radius: 8px 8px 0 0;
        margin: calc(-1 * var(--bme-space-md));
        margin-bottom: var(--bme-space-md);
        font-size: var(--bme-font-size-heading);
        font-weight: 600;
      }

      .body-model-area {
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--bme-panel);
        border: 1px solid var(--bme-border);
        border-radius: 8px;
        min-height: 600px;
        color: #999;
        font-size: var(--bme-font-size-body);
      }
    `,
  ];

  render() {
    return html`
      <div class="layout">
        <div class="panel">
          <div class="panel-header">Body Systems</div>
          <p style="color: #999; font-size: 13px;">
            Phase 2 will render the systems sidebar here.
          </p>
        </div>
        <div class="body-model-area">
          Phase 2 will render the SVG body model here.
        </div>
        <div class="panel">
          <div class="panel-header">Detail Panel</div>
          <p style="color: #999; font-size: 13px;">
            Phase 3 will render system details here.
          </p>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "body-map-explorer": BodyMapExplorer;
  }
}
