export interface BodyPartDefinition {
  id: string;
  name: string;
  imageFile: string;
  organIds: string[];
}

export interface BodyPartPhotoEntry {
  id: string;
  label: string;
  imageFile: string;
  organIds: string[];
}

export const BODY_PARTS: BodyPartDefinition[] = [
  { id: "bp_head", name: "Head", imageFile: "head.webp", organIds: [] },
  { id: "bp_face", name: "Face", imageFile: "face.webp", organIds: [] },
  { id: "bp_ears", name: "Ears", imageFile: "ear.webp", organIds: [] },
  { id: "bp_eyes", name: "Eyes", imageFile: "eye.webp", organIds: [] },
  { id: "bp_nose", name: "Nose", imageFile: "nose.webp", organIds: [] },
  {
    id: "bp_mouth",
    name: "Mouth",
    imageFile: "mouthteethgums.webp",
    organIds: [],
  },
  {
    id: "bp_gums",
    name: "Gums",
    imageFile: "mouthteethgums.webp",
    organIds: [],
  },
  {
    id: "bp_teeth",
    name: "Teeth",
    imageFile: "mouthteethgums.webp",
    organIds: [],
  },
  {
    id: "bp_neck",
    name: "Neck",
    imageFile: "neck.webp",
    organIds: ["larynx_trachea"],
  },
  {
    id: "bp_throat",
    name: "Throat",
    imageFile: "esophagus.webp",
    organIds: ["larynx_trachea"],
  },
  {
    id: "bp_brain",
    name: "Brain",
    imageFile: "brain.webp",
    organIds: ["brain"],
  },
  {
    id: "bp_heart",
    name: "Heart",
    imageFile: "heart.webp",
    organIds: ["heart"],
  },
  {
    id: "bp_blood",
    name: "Blood",
    imageFile: "bloodvessel.webp",
    organIds: [],
  },
  {
    id: "bp_lungs",
    name: "Lungs",
    imageFile: "lungs.webp",
    organIds: ["lungs_right", "lungs_left"],
  },
  {
    id: "bp_pancreas",
    name: "Pancreas",
    imageFile: "pancreas.webp",
    organIds: ["pancreas"],
  },
  {
    id: "bp_adrenal",
    name: "Adrenal Gland",
    imageFile: "adrenal-gland.webp",
    organIds: [],
  },
  {
    id: "bp_parathyroid",
    name: "Parathyroid Gland",
    imageFile: "parathyroid.webp",
    organIds: [],
  },
  {
    id: "bp_pituitary",
    name: "Pituitary Gland",
    imageFile: "pituitary.webp",
    organIds: [],
  },
  {
    id: "bp_thyroid",
    name: "Thyroid",
    imageFile: "thyroid.webp",
    organIds: ["thyroid"],
  },
  {
    id: "bp_esophagus",
    name: "Esophagus",
    imageFile: "esophagus.webp",
    organIds: ["larynx_trachea"],
  },
  {
    id: "bp_abdomen",
    name: "Abdomen",
    imageFile: "abdomen.webp",
    organIds: [],
  },
  {
    id: "bp_stomach",
    name: "Stomach",
    imageFile: "stomach.webp",
    organIds: ["stomach"],
  },
  {
    id: "bp_liver",
    name: "Liver",
    imageFile: "liver.webp",
    organIds: ["liver"],
  },
  {
    id: "bp_intestines",
    name: "Intestines",
    imageFile: "intestines.webp",
    organIds: ["intestines"],
  },
  {
    id: "bp_gallbladder",
    name: "Gallbladder",
    imageFile: "gallbladder.webp",
    organIds: ["gallbladder"],
  },
  {
    id: "bp_colon",
    name: "Colon",
    imageFile: "colon.webp",
    organIds: ["intestines"],
  },
  {
    id: "bp_bladder",
    name: "Bladder",
    imageFile: "bladder.webp",
    organIds: ["bladder"],
  },
  {
    id: "bp_urethra",
    name: "Urethra",
    imageFile: "urethra.webp",
    organIds: [],
  },
  {
    id: "bp_lymphnode",
    name: "Lymph Node",
    imageFile: "lymphnode.webp",
    organIds: [],
  },
  {
    id: "bp_spleen",
    name: "Spleen",
    imageFile: "spleen.webp",
    organIds: ["spleen"],
  },
  {
    id: "bp_appendix",
    name: "Appendix",
    imageFile: "appendix.webp",
    organIds: [],
  },
  {
    id: "bp_muscles",
    name: "Muscles",
    imageFile: "upperextremitymuscle.webp",
    organIds: ["muscle"],
  },
  {
    id: "bp_skin",
    name: "Skin & Tissue",
    imageFile: "skin.webp",
    organIds: [],
  },
  {
    id: "bp_bones",
    name: "Bones",
    imageFile: "bonesjoints.webp",
    organIds: ["knee_joint"],
  },
  {
    id: "bp_joints",
    name: "Joints",
    imageFile: "bonesjoints.webp",
    organIds: ["knee_joint"],
  },
  { id: "bp_spine", name: "Spine", imageFile: "spine.webp", organIds: [] },
  { id: "bp_back", name: "Back", imageFile: "spine.webp", organIds: [] },
  { id: "bp_ankles", name: "Ankles", imageFile: "ankle.webp", organIds: [] },
  { id: "bp_arms", name: "Arms", imageFile: "forearm.webp", organIds: [] },
  { id: "bp_chest", name: "Chest", imageFile: "chest.webp", organIds: [] },
  { id: "bp_elbow", name: "Elbow", imageFile: "elbow.webp", organIds: [] },
  { id: "bp_feet", name: "Feet", imageFile: "foot.webp", organIds: [] },
  { id: "bp_hands", name: "Hands", imageFile: "hand.webp", organIds: [] },
  { id: "bp_hips", name: "Hips", imageFile: "pelvis.webp", organIds: [] },
  { id: "bp_butt", name: "Butt", imageFile: "pelvis.webp", organIds: [] },
  { id: "bp_anus", name: "Anus", imageFile: "pelvis.webp", organIds: [] },
  {
    id: "bp_kidneys",
    name: "Kidneys",
    imageFile: "kidneys.webp",
    organIds: ["kidneys"],
  },
  { id: "bp_legs", name: "Legs", imageFile: "legbone.webp", organIds: [] },
  { id: "bp_pelvis", name: "Pelvis", imageFile: "pelvis.webp", organIds: [] },
  { id: "bp_ribs", name: "Ribs", imageFile: "ribs.webp", organIds: [] },
  {
    id: "bp_shoulders",
    name: "Shoulders",
    imageFile: "shoulder.webp",
    organIds: [],
  },
  {
    id: "bp_breasts",
    name: "Breasts",
    imageFile: "breastultra.webp",
    organIds: [],
  },
  {
    id: "bp_mammary",
    name: "Mammary Glands",
    imageFile: "mammary.webp",
    organIds: [],
  },
  {
    id: "bp_uterus",
    name: "Uterus",
    imageFile: "uterus.webp",
    organIds: ["female_reproductive"],
  },
  {
    id: "bp_penis",
    name: "Penis",
    imageFile: "malerepro.webp",
    organIds: ["male_reproductive"],
  },
  {
    id: "bp_prostate",
    name: "Prostate",
    imageFile: "prostate.webp",
    organIds: ["male_reproductive"],
  },
  {
    id: "bp_testicles",
    name: "Testicles",
    imageFile: "malerepro.webp",
    organIds: ["male_reproductive"],
  },
  {
    id: "bp_blood_vessels",
    name: "Blood Vessels",
    imageFile: "bloodvessel.webp",
    organIds: [],
  },
  {
    id: "bp_cartilage",
    name: "Cartilage",
    imageFile: "bonesjoints.webp",
    organIds: [],
  },
  {
    id: "bp_digestive_tract",
    name: "Digestive Tract",
    imageFile: "intestines.webp",
    organIds: [],
  },
  {
    id: "bp_fallopian_tubes",
    name: "Fallopian Tubes",
    imageFile: "uterus.webp",
    organIds: [],
  },
  { id: "bp_fingers", name: "Fingers", imageFile: "hand.webp", organIds: [] },
  { id: "bp_groin", name: "Groin", imageFile: "pelvis.webp", organIds: [] },
  { id: "bp_hair", name: "Hair", imageFile: "head.webp", organIds: [] },
  { id: "bp_knee", name: "Knee", imageFile: "bonesjoints.webp", organIds: [] },
  { id: "bp_larynx", name: "Larynx", imageFile: "neck.webp", organIds: [] },
  {
    id: "bp_lips",
    name: "Lips",
    imageFile: "mouthteethgums.webp",
    organIds: [],
  },
  { id: "bp_nails", name: "Nails", imageFile: "hand.webp", organIds: [] },
  { id: "bp_sinuses", name: "Sinuses", imageFile: "nose.webp", organIds: [] },
  { id: "bp_nerves", name: "Nerves", imageFile: "brain.webp", organIds: [] },
  { id: "bp_ovaries", name: "Ovaries", imageFile: "uterus.webp", organIds: [] },
  { id: "bp_rectum", name: "Rectum", imageFile: "colon.webp", organIds: [] },
  {
    id: "bp_respiratory_tract",
    name: "Respiratory Tract",
    imageFile: "lungs.webp",
    organIds: [],
  },
  {
    id: "bp_salivary_glands",
    name: "Salivary Glands",
    imageFile: "mouthteethgums.webp",
    organIds: [],
  },
  { id: "bp_scalp", name: "Scalp", imageFile: "head.webp", organIds: [] },
  { id: "bp_skull", name: "Skull", imageFile: "skull.webp", organIds: [] },
  {
    id: "bp_tendons",
    name: "Tendons",
    imageFile: "upperextremitymuscle.webp",
    organIds: [],
  },
  { id: "bp_thigh", name: "Thigh", imageFile: "femur.webp", organIds: [] },
  {
    id: "bp_thymus",
    name: "Thymus",
    imageFile: "chest.webp",
    organIds: ["thymus"],
  },
  { id: "bp_toes", name: "Toes", imageFile: "foot.webp", organIds: [] },
  {
    id: "bp_tongue",
    name: "Tongue",
    imageFile: "mouthteethgums.webp",
    organIds: [],
  },
  { id: "bp_tonsils", name: "Tonsils", imageFile: "neck.webp", organIds: [] },
  {
    id: "bp_urinary_tract",
    name: "Urinary Tract",
    imageFile: "urinarytract.webp",
    organIds: [],
  },
  { id: "bp_vagina", name: "Vagina", imageFile: "uterus.webp", organIds: [] },
  { id: "bp_vulva", name: "Vulva", imageFile: "uterus.webp", organIds: [] },
  {
    id: "bp_white_blood_cells",
    name: "White Blood Cells",
    imageFile: "circulatory.webp",
    organIds: [],
  },
];

export const LEGACY_REFERENCE_ORGAN_IDS = [
  "brain",
  "larynx_trachea",
  "thyroid",
  "liver",
  "lungs_right",
  "heart",
  "lungs_left",
  "knee_joint",
  "gallbladder",
  "spleen",
  "pancreas",
  "kidneys",
  "stomach",
  "intestines",
  "muscle",
  "thymus",
  "bladder",
  "male_reproductive",
  "female_reproductive",
] as const;

export function getBodyPartPhotoUrl(imageFile: string, assetBase = ""): string {
  const base = assetBase.replace(/\/$/, "");
  const prefix = base ? `${base}/assets` : "/assets";
  return `${prefix}/body-parts/${imageFile}`;
}

export function getBodyPartPhotoEntriesForOrganIds(
  organIds: readonly string[],
): BodyPartPhotoEntry[] {
  const orderedUniqueOrganIds = Array.from(new Set(organIds));
  const seenPartIds = new Set<string>();
  const entries: BodyPartPhotoEntry[] = [];

  orderedUniqueOrganIds.forEach((organId) => {
    BODY_PARTS.forEach((part) => {
      if (seenPartIds.has(part.id) || !part.organIds.includes(organId)) {
        return;
      }

      seenPartIds.add(part.id);
      entries.push({
        id: part.id,
        label: part.name,
        imageFile: part.imageFile,
        organIds: [...part.organIds],
      });
    });
  });

  return entries;
}

export function getBodyPartPhotoEntriesByIds(
  bodyPartIds: readonly string[],
): BodyPartPhotoEntry[] {
  const orderedUniqueBodyPartIds = Array.from(new Set(bodyPartIds));

  return orderedUniqueBodyPartIds
    .map(
      (bodyPartId) => BODY_PARTS.find((part) => part.id === bodyPartId) ?? null,
    )
    .filter((part): part is BodyPartDefinition => part !== null)
    .map((part) => ({
      id: part.id,
      label: part.name,
      imageFile: part.imageFile,
      organIds: [...part.organIds],
    }));
}
