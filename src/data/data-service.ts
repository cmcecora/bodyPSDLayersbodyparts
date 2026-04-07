/**
 * DataService — singleton fetch/cache module for disease and symptom data.
 *
 * Design decisions:
 * - Organ IDs in this app are un-prefixed ("brain", "heart") while JSON data
 *   files use bp_-prefixed keys ("bp_brain", "bp_heart"). All public functions
 *   accept un-prefixed IDs and apply the prefix internally.
 * - Disease entries strip the ICD-10-CM code (D-04 requirement) — only `name`
 *   is returned to consumers.
 * - Symptoms are loaded from a single bulk file (symptoms-by-part.json) shared
 *   across all body parts (D-06), preventing N network requests.
 * - A Map cache prevents duplicate fetch calls for the same body part (D-08).
 */

export interface DiseaseEntry {
  name: string;
}

/**
 * Interface for data providers. Allows swapping between internal JSON files
 * and external API/static data sources.
 */
export interface DataProvider {
  fetchDiseases(bodyPartId: string): Promise<DiseaseEntry[]>;
  fetchSymptoms(bodyPartId: string): Promise<string[]>;
}

// Module-level singleton state
const _diseaseCache = new Map<string, DiseaseEntry[]>();
let _symptomsData: Record<string, string[]> | null = null;
let _symptomsLoading: Promise<Record<string, string[]>> | null = null;

/**
 * Maps SVG organ IDs (used for rendering) to their data-file equivalents.
 * Some SVG organs (lungs_left/right, muscle, knee_joint, etc.) don't have
 * individual data files — they share a file with a simpler key.
 */
export const ORGAN_TO_DATA_KEY: Record<string, string> = {
  lungs_left: "lungs",
  lungs_right: "lungs",
  muscle: "muscles",
  knee_joint: "knee",
  larynx_trachea: "larynx",
  female_reproductive: "uterus",
  male_reproductive: "penis",
};

function applyBpPrefix(bodyPartId: string): string {
  if (bodyPartId.startsWith("bp_")) return bodyPartId;
  const translated = ORGAN_TO_DATA_KEY[bodyPartId] ?? bodyPartId;
  return `bp_${translated}`;
}

/**
 * Fetch diseases for a body part. Returns name-only entries (ICD code stripped).
 * Results are cached by bp_-prefixed key — subsequent calls return cached data.
 *
 * @param bodyPartId - un-prefixed organ ID (e.g. "brain") or bp_-prefixed key
 * @param assetBase  - optional base URL prefix (default: "")
 */
export async function fetchDiseases(
  bodyPartId: string,
  assetBase = "",
): Promise<DiseaseEntry[]> {
  const key = applyBpPrefix(bodyPartId);
  const cached = _diseaseCache.get(key);
  if (cached !== undefined) {
    return cached;
  }

  const prefix = assetBase.replace(/\/$/, "");
  const url = `${prefix}/data/diseases/${key}.json`;

  let raw: Array<{ code: string; name: string }>;
  try {
    const response = await fetch(url);
    raw = await response.json();
  } catch (err) {
    throw new Error(
      `DataService: failed to fetch diseases for ${key} from ${url}: ${String(err)}`,
    );
  }

  const entries: DiseaseEntry[] = raw.map(({ name }) => ({ name }));
  _diseaseCache.set(key, entries);
  return entries;
}

/**
 * Fetch symptoms for a body part. All parts share a single bulk file load.
 * Returns empty array for unknown body part keys (graceful — D-15).
 *
 * @param bodyPartId - un-prefixed organ ID (e.g. "brain") or bp_-prefixed key
 * @param assetBase  - optional base URL prefix (default: "")
 */
export async function fetchSymptomsForPart(
  bodyPartId: string,
  assetBase = "",
): Promise<string[]> {
  const key = applyBpPrefix(bodyPartId);

  if (_symptomsData !== null) {
    return _symptomsData[key] ?? [];
  }

  if (_symptomsLoading === null) {
    const prefix = assetBase.replace(/\/$/, "");
    const url = `${prefix}/data/symptoms-by-part.json`;
    _symptomsLoading = fetch(url)
      .then((res) => res.json() as Promise<Record<string, string[]>>)
      .then((data) => {
        _symptomsData = data;
        return data;
      });
  }

  const data = await _symptomsLoading;
  return data[key] ?? [];
}

/**
 * Returns a DataProvider implementation that uses the default internal
 * DataService functions.
 *
 * @param assetBase - optional base URL prefix for JSON files
 */
export function getDefaultDataProvider(assetBase = ""): DataProvider {
  return {
    fetchDiseases: (id) => fetchDiseases(id, assetBase),
    fetchSymptoms: (id) => fetchSymptomsForPart(id, assetBase),
  };
}

/**
 * Reset all caches. Exported for testing — call in beforeEach to isolate tests.
 */
export function clearCache(): void {
  _diseaseCache.clear();
  _symptomsData = null;
  _symptomsLoading = null;
}
