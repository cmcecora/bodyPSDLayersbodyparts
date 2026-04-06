import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { designTokens } from "./styles/tokens.css.js";
import {
  BODY_SYSTEMS,
  type BodySystemDefinition,
  type BodySystemId,
} from "./data/systems.js";

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
    `,
  ];

  @property({ attribute: false }) systems: BodySystemDefinition[] =
    BODY_SYSTEMS;

  @property({ type: String }) activeSystemId: BodySystemId | null = null;

  private _emitToggle(systemId: BodySystemId) {
    this.dispatchEvent(
      new CustomEvent("system-toggle-request", {
        detail: { systemId },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
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
                <img class="system-thumb" src=${system.thumbnail} alt="" />
                <span class="system-title">${system.title}</span>
              </button>
            </li>
          `,
        )}
      </ul>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "body-map-sidebar": BodyMapSidebar;
  }
}
