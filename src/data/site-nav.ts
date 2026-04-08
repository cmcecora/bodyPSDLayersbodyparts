export type SiteNavId =
  | "body-part"
  | "disease"
  | "symptom"
  | "medical-test"
  | "medical-treatment";

export type SiteShellView = "explorer" | "body-part-grid";

export interface SiteNavItem {
  id: SiteNavId;
  label: string;
  description: string;
  enabled: boolean;
  targetView: SiteShellView | null;
}

export const SITE_NAV_ITEMS: SiteNavItem[] = [
  {
    id: "body-part",
    label: "Body Part",
    description: "Browse body-part imagery and jump into the interactive map.",
    enabled: true,
    targetView: "body-part-grid",
  },
  {
    id: "disease",
    label: "Disease",
    description: "Planned directory page.",
    enabled: false,
    targetView: null,
  },
  {
    id: "symptom",
    label: "Symptom",
    description: "Planned directory page.",
    enabled: false,
    targetView: null,
  },
  {
    id: "medical-test",
    label: "Medical Test",
    description: "Planned directory page.",
    enabled: false,
    targetView: null,
  },
  {
    id: "medical-treatment",
    label: "Medical Treatment",
    description: "Planned directory page.",
    enabled: false,
    targetView: null,
  },
];

export const DEFAULT_SITE_NAV_ID: SiteNavId = "body-part";
