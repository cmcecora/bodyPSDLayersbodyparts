#!/usr/bin/env python3
"""
Generates diseases-data.js and symptoms-by-bodypart-data.js from source data.

Disease data: joins batch_*.json (ICD code + name) with results_*.json (body parts)
Symptom data: reads BodyPart_Symp sheet from icd10cm_codes_2026.xlsx
"""

import json
import glob
import os

# ---------------------------------------------------------------------------
# Body part name mapping: data names → UI body part IDs
# ---------------------------------------------------------------------------
# The UI has 57 body parts with IDs like "bp_head", "bp_brain", etc.
# The disease/symptom data uses ~260 different anatomical names.
# This mapping normalizes them all to UI IDs.

BODY_PART_MAP = {
    # --- Direct matches ---
    "abdomen": "bp_abdomen",
    "anus": "bp_anus",
    "appendix": "bp_appendix",
    "bladder": "bp_bladder",
    "blood": "bp_blood",
    "brain": "bp_brain",
    "colon": "bp_colon",
    "esophagus": "bp_esophagus",
    "gallbladder": "bp_gallbladder",
    "gums": "bp_gums",
    "heart": "bp_heart",
    "intestines": "bp_intestines",
    "liver": "bp_liver",
    "mouth": "bp_mouth",
    "neck": "bp_neck",
    "nose": "bp_nose",
    "pancreas": "bp_pancreas",
    "penis": "bp_penis",
    "prostate": "bp_prostate",
    "skin": "bp_skin",
    "spine": "bp_spine",
    "spleen": "bp_spleen",
    "stomach": "bp_stomach",
    "teeth": "bp_teeth",
    "thyroid": "bp_thyroid",
    "urethra": "bp_urethra",
    "uterus": "bp_uterus",

    # --- Normalized / plural forms ---
    "lungs": "bp_lungs",
    "lung": "bp_lungs",
    "kidneys": "bp_kidneys",
    "kidney": "bp_kidneys",
    "muscles": "bp_muscles",
    "bones": "bp_bones",
    "joints": "bp_joints",
    "joint": "bp_joints",
    "testes": "bp_testicles",
    "testicles": "bp_testicles",
    "breast": "bp_breasts",
    "breasts": "bp_breasts",
    "bone": "bp_bones",

    # --- Head / Face ---
    "head": "bp_head",
    "face": "bp_face",
    "scalp": "bp_scalp",
    "forehead": "bp_face",
    "cheek": "bp_face",
    "chin": "bp_face",
    "skull": "bp_skull",

    # --- Eyes ---
    "eye": "bp_eyes",
    "eyes": "bp_eyes",
    "eyelid": "bp_eyes",
    "eyelids": "bp_eyes",
    "conjunctiva": "bp_eyes",
    "cornea": "bp_eyes",
    "left eye": "bp_eyes",
    "right eye": "bp_eyes",
    "left conjunctiva": "bp_eyes",
    "right conjunctiva": "bp_eyes",
    "left cornea": "bp_eyes",
    "right cornea": "bp_eyes",

    # --- Ears ---
    "ear": "bp_ears",
    "ears": "bp_ears",
    "left ear": "bp_ears",
    "right ear": "bp_ears",

    # --- Mouth / Throat ---
    "lip": "bp_lips",
    "lips": "bp_lips",
    "tongue": "bp_tongue",
    "throat": "bp_throat",
    "pharynx": "bp_throat",
    "tonsils": "bp_tonsils",
    "larynx": "bp_larynx",
    "trachea": "bp_throat",
    "salivary glands": "bp_salivary_glands",
    "salivary gland": "bp_salivary_glands",

    # --- Respiratory ---
    "bronchi": "bp_lungs",
    "bronchus": "bp_lungs",
    "pleura": "bp_lungs",
    "respiratory tract": "bp_respiratory_tract",
    "airway": "bp_lungs",

    # --- Chest ---
    "chest": "bp_chest",
    "chest wall": "bp_chest",
    "sternum": "bp_ribs",
    "ribs": "bp_ribs",
    "diaphragm": "bp_chest",

    # --- Back ---
    "back": "bp_back",
    "lower back": "bp_back",
    "upper back": "bp_back",

    # --- Abdomen / GI ---
    "abdominal wall": "bp_abdomen",
    "peritoneum": "bp_abdomen",
    "small intestine": "bp_intestines",
    "large intestine": "bp_colon",
    "gastrointestinal tract": "bp_intestines",
    "digestive tract": "bp_digestive_tract",
    "rectum": "bp_rectum",
    "bile duct": "bp_gallbladder",
    "gall bladder": "bp_gallbladder",

    # --- Arms ---
    "arm": "bp_arms",
    "forearm": "bp_arms",
    "upper arm": "bp_arms",
    "left arm": "bp_arms",
    "right arm": "bp_arms",
    "left forearm": "bp_arms",
    "right forearm": "bp_arms",
    "humerus": "bp_arms",
    "shoulder": "bp_shoulders",

    # --- Elbows ---
    "elbow": "bp_elbow",
    "left elbow": "bp_elbow",
    "right elbow": "bp_elbow",

    # --- Hands / Wrists / Fingers ---
    "hand": "bp_hands",
    "hands": "bp_hands",
    "left hand": "bp_hands",
    "right hand": "bp_hands",
    "palm": "bp_hands",
    "wrist": "bp_hands",
    "left wrist": "bp_hands",
    "right wrist": "bp_hands",
    "finger": "bp_fingers",
    "fingers": "bp_fingers",
    "left finger": "bp_fingers",
    "right finger": "bp_fingers",
    "index finger": "bp_fingers",
    "left index finger": "bp_fingers",
    "right index finger": "bp_fingers",
    "middle finger": "bp_fingers",
    "left middle finger": "bp_fingers",
    "right middle finger": "bp_fingers",
    "ring finger": "bp_fingers",
    "left ring finger": "bp_fingers",
    "right ring finger": "bp_fingers",
    "little finger": "bp_fingers",
    "left little finger": "bp_fingers",
    "right little finger": "bp_fingers",
    "thumb": "bp_fingers",
    "left thumb": "bp_fingers",
    "right thumb": "bp_fingers",
    "metacarpal bone": "bp_hands",
    "left metacarpal bone": "bp_hands",
    "right metacarpal bone": "bp_hands",
    "distal phalanx": "bp_fingers",
    "middle phalanx": "bp_fingers",
    "proximal phalanx": "bp_fingers",

    # --- Hips / Pelvis / Butt ---
    "hip": "bp_hips",
    "hips": "bp_hips",
    "left hip": "bp_hips",
    "right hip": "bp_hips",
    "pelvis": "bp_pelvis",
    "pelivs": "bp_pelvis",  # typo in source data
    "buttock": "bp_butt",
    "groin": "bp_groin",

    # --- Legs / Thighs ---
    "leg": "bp_legs",
    "thigh": "bp_thigh",
    "left thigh": "bp_thigh",
    "right thigh": "bp_thigh",
    "lower leg": "bp_legs",
    "left lower leg": "bp_legs",
    "right lower leg": "bp_legs",
    "femur": "bp_thigh",
    "left femur": "bp_thigh",
    "right femur": "bp_thigh",
    "fibula": "bp_legs",
    "tibia": "bp_legs",
    "anterior leg muscle": "bp_legs",
    "calf muscle": "bp_legs",
    "peroneal muscle": "bp_legs",

    # --- Knees ---
    "knee": "bp_knee",
    "left knee": "bp_knee",
    "right knee": "bp_knee",

    # --- Ankles ---
    "ankle": "bp_ankles",
    "left ankle": "bp_ankles",
    "right ankle": "bp_ankles",

    # --- Feet / Toes ---
    "foot": "bp_feet",
    "feet": "bp_feet",
    "left foot": "bp_feet",
    "right foot": "bp_feet",
    "heel": "bp_feet",
    "left heel": "bp_feet",
    "right heel": "bp_feet",
    "toe": "bp_toes",
    "toes": "bp_toes",
    "great toe": "bp_toes",
    "left great toe": "bp_toes",
    "right great toe": "bp_toes",
    "lesser toes": "bp_toes",
    "left lesser toes": "bp_toes",
    "right lesser toes": "bp_toes",
    "left toe": "bp_toes",
    "right toe": "bp_toes",
    "calcaneus": "bp_feet",
    "left calcaneus": "bp_feet",
    "right calcaneus": "bp_feet",
    "talus": "bp_feet",
    "left talus": "bp_feet",
    "right talus": "bp_feet",
    "tarsal bones": "bp_feet",
    "navicular bone": "bp_feet",
    "cuboid bone": "bp_feet",
    "intermediate cuneiform bone": "bp_feet",
    "lateral cuneiform bone": "bp_feet",
    "medial cuneiform bone": "bp_feet",
    "metatarsal": "bp_feet",
    "left metatarsal": "bp_feet",
    "right metatarsal": "bp_feet",
    "achilles tendon": "bp_feet",

    # --- Blood / Cardiovascular ---
    "blood vessels": "bp_blood_vessels",
    "blood vessel": "bp_blood_vessels",
    "arteries": "bp_blood",
    "veins": "bp_blood",
    "capillaries": "bp_blood",
    "red blood cells": "bp_blood",
    "white blood cells": "bp_white_blood_cells",
    "platelets": "bp_blood",
    "popliteal artery": "bp_blood",
    "popliteal vein": "bp_blood",
    "greater saphenous vein": "bp_blood",
    "lesser saphenous vein": "bp_blood",
    "anterior tibial artery": "bp_blood",
    "posterior tibial artery": "bp_blood",
    "peroneal artery": "bp_blood",
    "tibial artery": "bp_blood",
    "pericardium": "bp_heart",

    # --- Nervous system ---
    "meninges": "bp_brain",
    "spinal cord": "bp_brain",
    "nerves": "bp_nerves",
    "peripheral nerve": "bp_nerves",
    "peripheral nerves": "bp_nerves",
    "median nerve": "bp_hands",
    "radial nerve": "bp_arms",
    "ulnar nerve": "bp_arms",
    "tibial nerve": "bp_legs",
    "peroneal nerve": "bp_legs",

    # --- Lymphatic ---
    "lymph nodes": "bp_lymphnode",
    "lymph vessels": "bp_lymphnode",

    # --- Endocrine ---
    "adrenal glands": "bp_adrenal",
    "parathyroid glands": "bp_parathyroid",
    "parathyroid": "bp_parathyroid",
    "pituitary gland": "bp_pituitary",
    "thyroid gland": "bp_thyroid",
    "thymus": "bp_thymus",

    # --- Reproductive ---
    "ovaries": "bp_ovaries",
    "fallopian tubes": "bp_fallopian_tubes",
    "cervix": "bp_uterus",
    "vagina": "bp_vagina",
    "vulva": "bp_vulva",
    "placenta": "bp_uterus",
    "scrotum": "bp_testicles",
    "male genitalia": "bp_penis",

    # --- Connective / soft tissue ---
    "tendons": "bp_tendons",
    "tendon": "bp_tendons",
    "ligaments": "bp_muscles",
    "cartilage": "bp_cartilage",
    "connective tissue": "bp_muscles",
    "fat tissue": "bp_skin",

    # --- Skin / Integumentary ---
    "nails": "bp_nails",
    "nail": "bp_nails",
    "hair": "bp_hair",
    "mucous membranes": "bp_skin",

    # --- Misc bone ---
    "bone marrow": "bp_bones",
    "clavicle": "bp_bones",
    "scapula": "bp_bones",
    "radius": "bp_arms",
    "left radius": "bp_arms",
    "right radius": "bp_arms",
    "ulna": "bp_arms",
    "left ulna": "bp_arms",
    "right ulna": "bp_arms",

    # --- Jaw ---
    "jaw": "bp_mouth",

    # --- Nose / Sinuses ---
    "sinuses": "bp_sinuses",
    "nasal sinus": "bp_sinuses",
    "sinus": "bp_sinuses",
    "nostril": "bp_nose",

    # --- Kidney variants ---
    "renal*": "bp_kidneys",

    # --- Urinary ---
    "urinary tract": "bp_urinary_tract",

    # --- General / skip ---
    "trunk": "bp_chest",
    "axilla": "bp_arms",
}

# Terms that are too broad to map to a single body part — skip these
SKIP_TERMS = {
    "whole body", "endocrine system", "reproductive system",
    "genitourinary tract", "genitourinary organs",
}


def map_body_part(name):
    """Map a disease/symptom body part name to a UI body part ID."""
    name = name.strip().lower()
    if name in SKIP_TERMS:
        return None
    if name in BODY_PART_MAP:
        return BODY_PART_MAP[name]
    return None


def generate_diseases():
    """Join batch + result files, group diseases by UI body part ID."""
    base = os.path.dirname(os.path.abspath(__file__))
    batch_dir = os.path.join(base, "docs", "body_parts_batches")
    result_dir = os.path.join(base, "docs", "body_parts_results")

    # Build row_num → {icd_code, disease_name} from batch files
    batch_data = {}
    for f in sorted(glob.glob(os.path.join(batch_dir, "batch_*.json"))):
        with open(f) as fh:
            for entry in json.load(fh):
                batch_data[entry["row_num"]] = {
                    "code": entry["icd_code"],
                    "name": entry["disease_name"],
                }

    # Build row_num → body_parts string from result files
    result_data = {}
    for f in sorted(glob.glob(os.path.join(result_dir, "results_*.json"))):
        with open(f) as fh:
            for entry in json.load(fh):
                bp = entry.get("body_parts", "")
                if bp:
                    result_data[entry["row_num"]] = bp

    # Join and group by UI body part ID
    diseases_by_bp = {}
    unmapped = set()

    for row_num, body_parts_str in result_data.items():
        batch = batch_data.get(row_num)
        if not batch:
            continue

        parts = [p.strip().lower() for p in body_parts_str.split(",") if p.strip()]
        for part in parts:
            bp_id = map_body_part(part)
            if bp_id is None:
                unmapped.add(part)
                continue
            if bp_id not in diseases_by_bp:
                diseases_by_bp[bp_id] = {}
            # Use disease name as key to deduplicate
            diseases_by_bp[bp_id][batch["name"]] = batch["code"]

    # Convert to sorted lists: [{code, name}, ...]
    result = {}
    for bp_id, disease_dict in diseases_by_bp.items():
        sorted_diseases = sorted(disease_dict.items(), key=lambda x: x[0].lower())
        result[bp_id] = [{"code": code, "name": name} for name, code in sorted_diseases]

    if unmapped:
        print(f"Warning: {len(unmapped)} unmapped disease body part terms:")
        for t in sorted(unmapped):
            print(f"  - {t}")

    return result


def generate_symptoms():
    """Read BodyPart_Symp sheet, group symptoms by UI body part ID."""
    import openpyxl

    base = os.path.dirname(os.path.abspath(__file__))
    xlsx = os.path.join(base, "docs", "icd10cm_codes_2026.xlsx")

    wb = openpyxl.load_workbook(xlsx, read_only=True)
    ws = wb["BodyPart_Symp"]

    symptoms_by_bp = {}
    unmapped = set()

    for row in ws.iter_rows(min_row=2, max_col=2, values_only=True):
        part_name = str(row[0]).strip() if row[0] else ""
        symptom = str(row[1]).strip() if row[1] else ""
        if not part_name or not symptom:
            continue

        bp_id = map_body_part(part_name)
        if bp_id is None:
            unmapped.add(part_name.lower())
            continue

        if bp_id not in symptoms_by_bp:
            symptoms_by_bp[bp_id] = set()
        symptoms_by_bp[bp_id].add(symptom)

    wb.close()

    # Convert to sorted lists
    result = {}
    for bp_id, symptom_set in symptoms_by_bp.items():
        result[bp_id] = sorted(symptom_set, key=str.lower)

    if unmapped:
        print(f"Warning: {len(unmapped)} unmapped symptom body part terms:")
        for t in sorted(unmapped):
            print(f"  - {t}")

    return result


def write_js_file(filepath, var_name, data):
    """Write data as a window-scoped JavaScript variable."""
    json_str = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    with open(filepath, "w") as f:
        f.write(f"// Auto-generated — do not edit manually\n")
        f.write(f"window.{var_name} = {json_str};\n")
    size_kb = os.path.getsize(filepath) / 1024
    print(f"Wrote {filepath} ({size_kb:.0f} KB, {len(data)} body parts)")


def main():
    base = os.path.dirname(os.path.abspath(__file__))

    print("=== Generating disease data ===")
    diseases = generate_diseases()
    total_diseases = sum(len(v) for v in diseases.values())
    print(f"Total: {total_diseases} disease entries across {len(diseases)} body parts")
    write_js_file(os.path.join(base, "diseases-data.js"), "DISEASES_BY_BODY_PART", diseases)

    print("\n=== Generating symptom data ===")
    symptoms = generate_symptoms()
    total_symptoms = sum(len(v) for v in symptoms.values())
    print(f"Total: {total_symptoms} symptom entries across {len(symptoms)} body parts")
    write_js_file(
        os.path.join(base, "symptoms-by-bodypart-data.js"),
        "SYMPTOMS_BY_BODY_PART",
        symptoms,
    )

    print("\nDone!")


if __name__ == "__main__":
    main()
