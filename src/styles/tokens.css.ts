import { css } from "lit";

export const designTokens = css`
  :host {
    /* Color tokens */
    --bme-surface: #eef3f7;
    --bme-surface-elevated: #f8fbff;
    --bme-panel: #ffffff;
    --bme-header-bg: #253649;
    --bme-header-text: #ffffff;
    --bme-accent: #4f8fce;
    --bme-accent-strong: #2d71b8;
    --bme-accent-soft: rgba(79, 143, 206, 0.14);
    --bme-hover-overlay: rgba(79, 143, 206, 0.18);
    --bme-border: #d9e3ed;
    --bme-divider: #ebf0f5;
    --bme-destructive: #dc2626;
    --bme-text: #203245;
    --bme-text-muted: #5d6f81;

    /* Typography tokens */
    --bme-font-family:
      -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    --bme-font-size-body: 14px;
    --bme-font-size-label: 13px;
    --bme-font-size-heading: 16px;
    --bme-font-size-display: 20px;

    /* Spacing tokens (8-point scale) */
    --bme-space-xs: 4px;
    --bme-space-sm: 8px;
    --bme-space-md: 16px;
    --bme-space-lg: 24px;
    --bme-space-xl: 32px;
    --bme-space-2xl: 48px;
    --bme-space-3xl: 64px;

    /* Surface tokens */
    --bme-radius-sm: 8px;
    --bme-radius-md: 12px;
    --bme-radius-lg: 18px;
    --bme-shadow-soft: 0 14px 34px rgba(31, 52, 84, 0.1);
    --bme-shadow-strong: 0 18px 42px rgba(31, 52, 84, 0.16);
    --bme-focus-ring: 0 0 0 3px rgba(79, 143, 206, 0.26);
    --bme-panel-padding: 18px;
  }
`;
