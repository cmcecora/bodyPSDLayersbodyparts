import { css } from "lit";

export const designTokens = css`
  :host {
    /* Color tokens */
    --bme-surface: #f5f5f5;
    --bme-panel: #ffffff;
    --bme-header-bg: #434448;
    --bme-header-text: #ffffff;
    --bme-accent: #6cb5f4;
    --bme-hover-overlay: rgba(100, 180, 255, 0.35);
    --bme-border: #e0e0e0;
    --bme-divider: #f0f0f0;
    --bme-destructive: #dc2626;

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
  }
`;
