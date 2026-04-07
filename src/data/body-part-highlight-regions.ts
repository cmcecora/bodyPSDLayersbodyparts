export interface EllipseRegion {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

export type HighlightRegion = EllipseRegion | EllipseRegion[];

/**
 * Ellipse overlay coordinates for each body part, calibrated against the
 * 698x1698 SVG viewBox (female front silhouette). Bilateral structures
 * (ears, kidneys, etc.) use arrays of regions.
 */
export const BODY_PART_HIGHLIGHT_REGIONS: Record<string, HighlightRegion> = {
  // --- Head & Neck ---
  bp_head: { cx: 345, cy: 160, rx: 63, ry: 75 },
  bp_face: { cx: 345, cy: 186, rx: 45, ry: 45 },
  bp_ears: [
    { cx: 280, cy: 180, rx: 7, ry: 22 },
    { cx: 410, cy: 180, rx: 7, ry: 22 },
  ],
  bp_eyes: [
    { cx: 310, cy: 175, rx: 10, ry: 6 },
    { cx: 380, cy: 175, rx: 10, ry: 6 },
  ],
  bp_nose: { cx: 345, cy: 200, rx: 6, ry: 8 },
  bp_mouth: { cx: 345, cy: 235, rx: 12, ry: 5 },
  bp_gums: { cx: 345, cy: 235, rx: 15, ry: 8 },
  bp_teeth: { cx: 345, cy: 235, rx: 10, ry: 4 },
  bp_neck: { cx: 345, cy: 290, rx: 42, ry: 18 },
  bp_throat: { cx: 345, cy: 290, rx: 16, ry: 18 },
  bp_brain: { cx: 345, cy: 100, rx: 38, ry: 35 },
  bp_pituitary: { cx: 345, cy: 112, rx: 8, ry: 8 },

  // --- Chest / Upper Body ---
  bp_heart: { cx: 370, cy: 420, rx: 32, ry: 42 },
  bp_blood: { cx: 345, cy: 500, rx: 80, ry: 150 },
  bp_lungs: [
    { cx: 300, cy: 430, rx: 50, ry: 55 },
    { cx: 400, cy: 430, rx: 50, ry: 55 },
  ],
  bp_chest: { cx: 345, cy: 390, rx: 98, ry: 70 },
  bp_ribs: { cx: 345, cy: 400, rx: 82, ry: 65 },
  bp_breasts: [
    { cx: 295, cy: 455, rx: 40, ry: 40 },
    { cx: 405, cy: 455, rx: 40, ry: 40 },
  ],
  bp_mammary: [
    { cx: 295, cy: 455, rx: 24, ry: 20 },
    { cx: 405, cy: 455, rx: 24, ry: 20 },
  ],
  bp_thyroid: { cx: 350, cy: 320, rx: 22, ry: 20 },
  bp_esophagus: { cx: 345, cy: 360, rx: 14, ry: 95 },
  bp_thymus: { cx: 355, cy: 310, rx: 16, ry: 20 },
  bp_shoulders: [
    { cx: 230, cy: 330, rx: 32, ry: 20 },
    { cx: 490, cy: 330, rx: 32, ry: 20 },
  ],

  // --- Abdomen ---
  bp_abdomen: { cx: 345, cy: 650, rx: 78, ry: 110 },
  bp_stomach: { cx: 370, cy: 610, rx: 50, ry: 40 },
  bp_liver: { cx: 327, cy: 610, rx: 58, ry: 38 },
  bp_gallbladder: { cx: 304, cy: 570, rx: 14, ry: 18 },
  bp_spleen: { cx: 430, cy: 555, rx: 24, ry: 22 },
  bp_pancreas: { cx: 355, cy: 565, rx: 42, ry: 24 },
  bp_kidneys: [
    { cx: 310, cy: 620, rx: 28, ry: 25 },
    { cx: 410, cy: 620, rx: 28, ry: 25 },
  ],
  bp_adrenal: [
    { cx: 300, cy: 595, rx: 15, ry: 10 },
    { cx: 391, cy: 595, rx: 15, ry: 10 },
  ],
  bp_intestines: { cx: 355, cy: 690, rx: 80, ry: 60 },
  bp_colon: { cx: 355, cy: 710, rx: 85, ry: 55 },
  bp_appendix: { cx: 306, cy: 735, rx: 15, ry: 18 },
  bp_lymphnode: { cx: 345, cy: 205, rx: 24, ry: 16 },
  bp_parathyroid: { cx: 345, cy: 320, rx: 18, ry: 14 },

  // --- Lower Torso / Pelvis ---
  bp_pelvis: { cx: 345, cy: 760, rx: 75, ry: 40 },
  bp_hips: [
    { cx: 290, cy: 770, rx: 35, ry: 30 },
    { cx: 400, cy: 770, rx: 35, ry: 30 },
  ],
  bp_bladder: { cx: 355, cy: 810, rx: 35, ry: 30 },
  bp_urethra: { cx: 345, cy: 835, rx: 10, ry: 18 },
  bp_butt: { cx: 345, cy: 770, rx: 62, ry: 35 },
  bp_anus: { cx: 345, cy: 810, rx: 10, ry: 10 },
  bp_uterus: { cx: 355, cy: 830, rx: 48, ry: 30 },
  bp_penis: { cx: 355, cy: 870, rx: 30, ry: 40 },
  bp_prostate: { cx: 355, cy: 845, rx: 22, ry: 18 },
  bp_testicles: { cx: 355, cy: 905, rx: 26, ry: 22 },

  // --- Arms ---
  bp_arms: [
    { cx: 225, cy: 480, rx: 20, ry: 140 },
    { cx: 465, cy: 480, rx: 20, ry: 140 },
  ],
  bp_elbow: [
    { cx: 205, cy: 530, rx: 16, ry: 22 },
    { cx: 485, cy: 530, rx: 16, ry: 22 },
  ],
  bp_hands: [
    { cx: 135, cy: 840, rx: 22, ry: 35 },
    { cx: 575, cy: 840, rx: 22, ry: 35 },
  ],

  // --- Legs ---
  bp_legs: [
    { cx: 310, cy: 1100, rx: 30, ry: 200 },
    { cx: 400, cy: 1100, rx: 30, ry: 200 },
  ],
  bp_thigh: [
    { cx: 310, cy: 930, rx: 32, ry: 70 },
    { cx: 400, cy: 930, rx: 32, ry: 70 },
  ],
  bp_knee: [
    { cx: 305, cy: 1190, rx: 22, ry: 30 },
    { cx: 400, cy: 1190, rx: 22, ry: 30 },
  ],
  bp_ankles: [
    { cx: 300, cy: 1490, rx: 15, ry: 18 },
    { cx: 410, cy: 1490, rx: 15, ry: 18 },
  ],
  bp_feet: [
    { cx: 290, cy: 1540, rx: 28, ry: 45 },
    { cx: 420, cy: 1540, rx: 28, ry: 45 },
  ],

  // --- Whole-body / diffuse ---
  bp_muscles: { cx: 345, cy: 600, rx: 90, ry: 250 },
  bp_skin: { cx: 345, cy: 600, rx: 100, ry: 280 },
  bp_bones: { cx: 345, cy: 600, rx: 80, ry: 260 },
  bp_joints: [
    { cx: 305, cy: 1190, rx: 22, ry: 30 },
    { cx: 400, cy: 1190, rx: 22, ry: 30 },
  ],
  bp_spine: { cx: 345, cy: 500, rx: 15, ry: 200 },
  bp_back: { cx: 345, cy: 450, rx: 70, ry: 140 },

  // --- Head subparts ---
  bp_scalp: { cx: 345, cy: 80, rx: 40, ry: 25 },
  bp_skull: { cx: 345, cy: 120, rx: 42, ry: 50 },
  bp_hair: { cx: 345, cy: 75, rx: 42, ry: 22 },
  bp_sinuses: { cx: 345, cy: 185, rx: 18, ry: 14 },
  bp_lips: { cx: 345, cy: 240, rx: 14, ry: 5 },
  bp_tongue: { cx: 345, cy: 245, rx: 10, ry: 8 },
  bp_salivary_glands: [
    { cx: 305, cy: 225, rx: 12, ry: 10 },
    { cx: 385, cy: 225, rx: 12, ry: 10 },
  ],

  // --- Throat subparts ---
  bp_larynx: { cx: 345, cy: 280, rx: 14, ry: 12 },
  bp_tonsils: [
    { cx: 332, cy: 268, rx: 6, ry: 6 },
    { cx: 358, cy: 268, rx: 6, ry: 6 },
  ],

  // --- Systemic / diffuse ---
  bp_blood_vessels: { cx: 345, cy: 500, rx: 75, ry: 140 },
  bp_nerves: { cx: 345, cy: 500, rx: 70, ry: 200 },
  bp_cartilage: { cx: 345, cy: 700, rx: 75, ry: 200 },
  bp_tendons: { cx: 345, cy: 800, rx: 80, ry: 200 },
  bp_white_blood_cells: { cx: 345, cy: 500, rx: 65, ry: 130 },
  bp_respiratory_tract: { cx: 345, cy: 400, rx: 80, ry: 70 },
  bp_digestive_tract: { cx: 355, cy: 650, rx: 70, ry: 120 },

  // --- Abdomen / Pelvis subparts ---
  bp_rectum: { cx: 355, cy: 770, rx: 16, ry: 16 },
  bp_groin: [
    { cx: 310, cy: 800, rx: 25, ry: 20 },
    { cx: 400, cy: 800, rx: 25, ry: 20 },
  ],
  bp_urinary_tract: { cx: 355, cy: 820, rx: 28, ry: 35 },

  // --- Reproductive subparts ---
  bp_ovaries: [
    { cx: 320, cy: 820, rx: 14, ry: 12 },
    { cx: 390, cy: 820, rx: 14, ry: 12 },
  ],
  bp_fallopian_tubes: [
    { cx: 330, cy: 815, rx: 25, ry: 12 },
    { cx: 380, cy: 815, rx: 25, ry: 12 },
  ],
  bp_vagina: { cx: 355, cy: 850, rx: 18, ry: 22 },
  bp_vulva: { cx: 355, cy: 865, rx: 22, ry: 15 },

  // --- Extremity subparts ---
  bp_fingers: [
    { cx: 135, cy: 825, rx: 18, ry: 20 },
    { cx: 575, cy: 825, rx: 18, ry: 20 },
  ],
  bp_toes: [
    { cx: 280, cy: 1570, rx: 18, ry: 12 },
    { cx: 430, cy: 1570, rx: 18, ry: 12 },
  ],
  bp_nails: [
    { cx: 135, cy: 855, rx: 12, ry: 8 },
    { cx: 575, cy: 855, rx: 12, ry: 8 },
  ],
};

/** Normalise a region entry to always be an array. */
export function getRegions(bpId: string): EllipseRegion[] {
  const data = BODY_PART_HIGHLIGHT_REGIONS[bpId];
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
}
