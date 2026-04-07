export interface ModalAnchor {
  x: number;
  y: number;
}

const DEFAULT_ANCHOR: ModalAnchor = { x: 349, y: 530 };

/**
 * Approximate screen-space anchors for body-part sidebar entries.
 *
 * These values are adapted from the legacy interactive-body-model.html
 * BODY_PART_SVG_COORDS lookup so Organs 2 opens the modal near the relevant
 * anatomy instead of at an arbitrary origin.
 */
export const BODY_PART_MODAL_COORDS: Record<string, ModalAnchor> = {
  bp_head: { x: 349, y: 80 },
  bp_face: { x: 349, y: 95 },
  bp_ears: { x: 390, y: 100 },
  bp_eyes: { x: 349, y: 75 },
  bp_nose: { x: 349, y: 95 },
  bp_mouth: { x: 349, y: 115 },
  bp_gums: { x: 349, y: 115 },
  bp_teeth: { x: 349, y: 115 },
  bp_neck: { x: 349, y: 170 },
  bp_throat: { x: 349, y: 170 },
  bp_brain: { x: 349, y: 100 },
  bp_heart: { x: 349, y: 340 },
  bp_blood: { x: 349, y: 500 },
  bp_lungs: { x: 349, y: 340 },
  bp_pancreas: { x: 349, y: 470 },
  bp_adrenal: { x: 349, y: 470 },
  bp_parathyroid: { x: 349, y: 320 },
  bp_pituitary: { x: 349, y: 100 },
  bp_thyroid: { x: 349, y: 320 },
  bp_esophagus: { x: 349, y: 170 },
  bp_abdomen: { x: 349, y: 530 },
  bp_stomach: { x: 349, y: 470 },
  bp_liver: { x: 349, y: 470 },
  bp_intestines: { x: 349, y: 560 },
  bp_gallbladder: { x: 349, y: 560 },
  bp_colon: { x: 349, y: 560 },
  bp_bladder: { x: 349, y: 720 },
  bp_urethra: { x: 349, y: 720 },
  bp_lymphnode: { x: 349, y: 205 },
  bp_spleen: { x: 349, y: 560 },
  bp_appendix: { x: 349, y: 650 },
  bp_muscles: { x: 349, y: 600 },
  bp_skin: { x: 349, y: 600 },
  bp_bones: { x: 349, y: 1000 },
  bp_joints: { x: 349, y: 1000 },
  bp_spine: { x: 349, y: 500 },
  bp_back: { x: 349, y: 400 },
  bp_ankles: { x: 349, y: 1490 },
  bp_arms: { x: 349, y: 480 },
  bp_chest: { x: 349, y: 390 },
  bp_elbow: { x: 349, y: 530 },
  bp_feet: { x: 349, y: 1540 },
  bp_hands: { x: 349, y: 840 },
  bp_hips: { x: 349, y: 770 },
  bp_butt: { x: 349, y: 770 },
  bp_anus: { x: 349, y: 810 },
  bp_kidneys: { x: 349, y: 620 },
  bp_legs: { x: 349, y: 1100 },
  bp_pelvis: { x: 349, y: 760 },
  bp_ribs: { x: 349, y: 400 },
  bp_shoulders: { x: 349, y: 330 },
  bp_breasts: { x: 349, y: 455 },
  bp_mammary: { x: 349, y: 455 },
  bp_uterus: { x: 349, y: 830 },
  bp_penis: { x: 349, y: 870 },
  bp_prostate: { x: 349, y: 845 },
  bp_testicles: { x: 349, y: 905 },
};

function escapeSelector(value: string): string {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
    return CSS.escape(value);
  }

  return value.replace(/[^a-zA-Z0-9_-]/g, "\\$&");
}

export function getBodyPartModalAnchor(bodyPartId: string): ModalAnchor {
  return BODY_PART_MODAL_COORDS[bodyPartId] ?? DEFAULT_ANCHOR;
}

export function getOrganGroupModalAnchor(
  modelRoot: ParentNode | null | undefined,
  organId: string,
): ModalAnchor | null {
  if (!modelRoot) {
    return null;
  }

  const group = modelRoot.querySelector?.(
    `#group-${escapeSelector(organId)}, [data-part="${escapeSelector(organId)}"]`,
  ) as Element | null;
  if (!group) {
    return null;
  }

  const rect = group.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) {
    return null;
  }

  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}
