import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { designTokens } from "./styles/tokens.css.js";
import {
  DEFAULT_SITE_NAV_ID,
  SITE_NAV_ITEMS,
  type SiteNavId,
  type SiteNavItem,
} from "./data/site-nav.js";

@customElement("body-map-header")
export class BodyMapHeader extends LitElement {
  static styles = [
    designTokens,
    css`
      :host {
        display: block;
        font-family: var(--bme-font-family);
        color: var(--bme-text);
      }

      .header {
        position: sticky;
        top: 0;
        z-index: 20;
        display: flex;
        align-items: center;
        gap: var(--bme-space-md);
        padding: 14px 18px;
        border: 1px solid var(--bme-header-border);
        border-radius: 24px;
        background: var(--bme-header-glass);
        backdrop-filter: blur(24px);
        box-shadow: var(--bme-shadow-soft);
        transition:
          border-color var(--bme-motion-medium),
          box-shadow var(--bme-motion-medium),
          transform var(--bme-motion-medium);
      }

      .header[data-scrolled="true"] {
        border-color: rgba(79, 143, 206, 0.24);
        box-shadow: var(--bme-shadow-strong);
        transform: translateY(-1px);
      }

      .brand {
        display: inline-flex;
        align-items: center;
        gap: 12px;
        min-width: 0;
        border: none;
        padding: 0;
        background: transparent;
        color: inherit;
        cursor: pointer;
        font: inherit;
        text-align: left;
      }

      .brand-mark {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
        border-radius: 14px;
        background:
          radial-gradient(circle at top, rgba(143, 196, 255, 0.32), transparent 68%),
          linear-gradient(135deg, rgba(44, 88, 142, 0.98), rgba(17, 34, 58, 0.94));
        color: #f8fbff;
        font-size: 16px;
        font-weight: 700;
        letter-spacing: 0.08em;
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);
      }

      .brand-text {
        min-width: 0;
      }

      .brand-kicker,
      .view-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 10px;
        border-radius: 999px;
        background: rgba(79, 143, 206, 0.12);
        color: var(--bme-accent-strong);
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .brand-title {
        margin: 6px 0 0;
        font-size: 18px;
        font-weight: 700;
        line-height: 1.1;
      }

      .brand-subtitle {
        margin: 4px 0 0;
        color: var(--bme-text-muted);
        font-size: var(--bme-font-size-label);
      }

      .nav {
        flex: 1;
        min-width: 0;
      }

      .nav-list {
        display: flex;
        align-items: center;
        gap: 8px;
        list-style: none;
        margin: 0;
        padding: 0;
        overflow-x: auto;
      }

      .nav-list::-webkit-scrollbar {
        display: none;
      }

      .nav-button,
      .icon-button,
      .menu-toggle {
        border: none;
        font: inherit;
        cursor: pointer;
      }

      .nav-button {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        min-height: 42px;
        padding: 10px 14px;
        border-radius: 14px;
        background: transparent;
        color: var(--bme-text);
        transition:
          background var(--bme-motion-fast),
          color var(--bme-motion-fast),
          transform var(--bme-motion-fast),
          box-shadow var(--bme-motion-fast);
      }

      .nav-button:hover:not(:disabled),
      .nav-button.active {
        background: rgba(79, 143, 206, 0.14);
        color: var(--bme-accent-strong);
        transform: translateY(-1px);
        box-shadow: inset 0 0 0 1px rgba(79, 143, 206, 0.18);
      }

      .nav-button:disabled {
        color: rgba(93, 111, 129, 0.72);
        cursor: not-allowed;
      }

      .nav-button:focus-visible,
      .brand:focus-visible,
      .icon-button:focus-visible,
      .menu-toggle:focus-visible {
        outline: none;
        box-shadow: var(--bme-focus-ring);
      }

      .nav-badge {
        padding: 3px 8px;
        border-radius: 999px;
        background: rgba(32, 50, 69, 0.08);
        color: var(--bme-text-muted);
        font-size: 11px;
        font-weight: 600;
      }

      .actions {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .icon-button,
      .menu-toggle {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: var(--bme-icon-button-size);
        height: var(--bme-icon-button-size);
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.68);
        color: var(--bme-text);
        box-shadow: inset 0 0 0 1px rgba(32, 50, 69, 0.08);
        transition:
          transform var(--bme-motion-fast),
          background var(--bme-motion-fast);
      }

      .icon-button:hover,
      .menu-toggle:hover {
        background: rgba(79, 143, 206, 0.14);
        transform: translateY(-1px);
      }

      .menu-toggle {
        display: none;
      }

      .icon {
        width: 18px;
        height: 18px;
      }

      .mobile-panel {
        display: none;
      }

      @media (max-width: 920px) {
        .header {
          flex-wrap: wrap;
          align-items: stretch;
        }

        .nav {
          display: none;
        }

        .actions {
          margin-left: auto;
        }

        .menu-toggle {
          display: inline-flex;
        }

        .mobile-panel {
          display: grid;
          width: 100%;
          gap: 8px;
          padding-top: 6px;
        }

        .mobile-panel[hidden] {
          display: none;
        }

        .mobile-nav-button {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          min-height: 46px;
          padding: 12px 14px;
          border: none;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.72);
          color: inherit;
          font: inherit;
          text-align: left;
        }
      }
    `,
  ];

  @property({ attribute: false }) items: SiteNavItem[] = SITE_NAV_ITEMS;

  @property({ type: String, attribute: "active-nav-id" })
  activeNavId: SiteNavId = DEFAULT_SITE_NAV_ID;

  @property({ type: String, attribute: "current-view-label" })
  currentViewLabel = "Explorer";

  @state() private _mobileMenuOpen = false;
  @state() private _scrolled = false;

  private readonly _handleScroll = () => {
    this._scrolled = window.scrollY > 12;
  };

  connectedCallback(): void {
    super.connectedCallback();
    this._handleScroll();
    window.addEventListener("scroll", this._handleScroll, { passive: true });
  }

  disconnectedCallback(): void {
    window.removeEventListener("scroll", this._handleScroll);
    super.disconnectedCallback();
  }

  private _emitHomeRequest() {
    this.dispatchEvent(
      new CustomEvent("home-request", {
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _emitSiteNavRequest(item: SiteNavItem) {
    if (!item.enabled) {
      return;
    }

    this._mobileMenuOpen = false;
    this.dispatchEvent(
      new CustomEvent("site-nav-request", {
        detail: { navId: item.id },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _renderNavButton(item: SiteNavItem, mobile = false) {
    const classes = [
      mobile ? "mobile-nav-button" : "nav-button",
      item.id === this.activeNavId ? "active" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return html`
      <button
        type="button"
        class=${classes}
        data-site-nav-id=${item.id}
        ?disabled=${!item.enabled}
        aria-current=${item.id === this.activeNavId ? "page" : nothing}
        @click=${() => this._emitSiteNavRequest(item)}
      >
        <span>${item.label}</span>
        ${item.enabled
          ? nothing
          : html`<span class="nav-badge">Soon</span>`}
      </button>
    `;
  }

  render() {
    return html`
      <header class="header" data-scrolled=${String(this._scrolled)}>
        <button class="brand" type="button" @click=${this._emitHomeRequest}>
          <span class="brand-mark" aria-hidden="true">BA</span>
          <span class="brand-text">
            <span class="brand-kicker">Shared Shell</span>
            <p class="brand-title">Body Atlas Explorer</p>
            <p class="brand-subtitle">Modern body-part discovery UI</p>
          </span>
        </button>

        <nav class="nav" aria-label="Primary">
          <ul class="nav-list">
            ${this.items.map(
              (item) => html`<li>${this._renderNavButton(item)}</li>`,
            )}
          </ul>
        </nav>

        <div class="actions">
          <span class="view-pill">${this.currentViewLabel}</span>
          <button class="icon-button" type="button" aria-label="Settings">
            <svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z"
                stroke="currentColor"
                stroke-width="1.7"
              />
              <path
                d="m19.4 13.5.1-3-1.9-.5a5.7 5.7 0 0 0-.8-1.5l1-1.7-2.1-2.1-1.7 1a5.7 5.7 0 0 0-1.5-.8L13.5 3h-3l-.5 1.9a5.7 5.7 0 0 0-1.5.8l-1.7-1L4.7 6.8l1 1.7a5.7 5.7 0 0 0-.8 1.5L3 10.5v3l1.9.5c.2.5.5 1 .8 1.5l-1 1.7 2.1 2.1 1.7-1c.5.3 1 .6 1.5.8l.5 1.9h3l.5-1.9c.5-.2 1-.5 1.5-.8l1.7 1 2.1-2.1-1-1.7c.3-.5.6-1 .8-1.5l1.9-.5Z"
                stroke="currentColor"
                stroke-width="1.4"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <button class="icon-button" type="button" aria-label="Profile">
            <svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
                stroke="currentColor"
                stroke-width="1.7"
              />
              <path
                d="M5 19.5a7 7 0 0 1 14 0"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
              />
            </svg>
          </button>
          <button
            class="menu-toggle"
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded=${String(this._mobileMenuOpen)}
            @click=${() => {
              this._mobileMenuOpen = !this._mobileMenuOpen;
            }}
          >
            <svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
              />
            </svg>
          </button>
        </div>

        <div class="mobile-panel" ?hidden=${!this._mobileMenuOpen}>
          ${this.items.map((item) => this._renderNavButton(item, true))}
        </div>
      </header>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "body-map-header": BodyMapHeader;
  }
}
