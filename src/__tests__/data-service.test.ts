import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fetchDiseases,
  fetchSymptomsForPart,
  getDefaultDataProvider,
  clearCache,
  type DiseaseEntry,
} from "../data/data-service.js";

function makeFetchMock(jsonData: unknown, ok = true): ReturnType<typeof vi.fn> {
  return vi.fn().mockResolvedValue({
    ok,
    status: ok ? 200 : 404,
    json: () => Promise.resolve(jsonData),
  } as unknown as Response);
}

const SAMPLE_DISEASES_RAW = [
  { code: "G912", name: "(Idiopathic) normal pressure hydrocephalus" },
  { code: "G40919", name: "Epilepsy, unspecified" },
];

const SAMPLE_SYMPTOMS_BY_PART: Record<string, string[]> = {
  bp_brain: ["Headache", "Memory loss", "Confusion"],
  bp_heart: ["Chest pain", "Palpitations", "Shortness of breath"],
};

describe("DataService", () => {
  beforeEach(() => {
    clearCache();
    vi.restoreAllMocks();
  });

  it("fetchDiseases calls fetch with URL containing /data/diseases/bp_brain.json", async () => {
    const mockFetch = makeFetchMock(SAMPLE_DISEASES_RAW);
    vi.stubGlobal("fetch", mockFetch);

    await fetchDiseases("brain");

    expect(mockFetch).toHaveBeenCalledOnce();
    const calledUrl: string = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain("/data/diseases/bp_brain.json");
  });

  it("fetchDiseases returns array of DiseaseEntry objects with name property only (no code)", async () => {
    const mockFetch = makeFetchMock(SAMPLE_DISEASES_RAW);
    vi.stubGlobal("fetch", mockFetch);

    const result = await fetchDiseases("brain");

    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty("name");
    expect(result[0]).not.toHaveProperty("code");
    expect(result[0].name).toBe("(Idiopathic) normal pressure hydrocephalus");
  });

  it("calling fetchDiseases('brain') twice only calls fetch once (cache hit)", async () => {
    const mockFetch = makeFetchMock(SAMPLE_DISEASES_RAW);
    vi.stubGlobal("fetch", mockFetch);

    await fetchDiseases("brain");
    await fetchDiseases("brain");

    expect(mockFetch).toHaveBeenCalledOnce();
  });

  it("fetchSymptomsForPart returns string array from bp_brain key", async () => {
    const mockFetch = makeFetchMock(SAMPLE_SYMPTOMS_BY_PART);
    vi.stubGlobal("fetch", mockFetch);

    const result = await fetchSymptomsForPart("brain");

    expect(result).toEqual(["Headache", "Memory loss", "Confusion"]);
  });

  it("fetchSymptomsForPart for brain and heart only calls fetch once (single bulk file)", async () => {
    const mockFetch = makeFetchMock(SAMPLE_SYMPTOMS_BY_PART);
    vi.stubGlobal("fetch", mockFetch);

    const brainSymptoms = await fetchSymptomsForPart("brain");
    const heartSymptoms = await fetchSymptomsForPart("heart");

    expect(mockFetch).toHaveBeenCalledOnce();
    const calledUrl: string = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain("symptoms-by-part.json");
    expect(brainSymptoms).toEqual(["Headache", "Memory loss", "Confusion"]);
    expect(heartSymptoms).toEqual([
      "Chest pain",
      "Palpitations",
      "Shortness of breath",
    ]);
  });

  it("fetchDiseases with network error rejects with Error containing the URL", async () => {
    const mockFetch = vi
      .fn()
      .mockRejectedValue(new TypeError("Failed to fetch"));
    vi.stubGlobal("fetch", mockFetch);

    await expect(fetchDiseases("brain")).rejects.toThrow(
      /data\/diseases\/bp_brain\.json/,
    );
  });

  it("fetchSymptomsForPart with missing key returns empty array (not throws)", async () => {
    const mockFetch = makeFetchMock(SAMPLE_SYMPTOMS_BY_PART);
    vi.stubGlobal("fetch", mockFetch);

    const result = await fetchSymptomsForPart("elbow");

    expect(result).toEqual([]);
  });

  it("clearCache resets both disease and symptom caches so next call re-fetches", async () => {
    const mockFetch = makeFetchMock(SAMPLE_DISEASES_RAW);
    vi.stubGlobal("fetch", mockFetch);

    await fetchDiseases("brain");
    expect(mockFetch).toHaveBeenCalledOnce();

    clearCache();

    await fetchDiseases("brain");
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("getDefaultDataProvider returns a DataProvider that calls the internal functions", async () => {
    const mockDiseases = makeFetchMock(SAMPLE_DISEASES_RAW);
    const mockSymptoms = makeFetchMock(SAMPLE_SYMPTOMS_BY_PART);
    const mockFetch = vi
      .fn()
      .mockImplementation((url: string) =>
        url.includes("diseases") ? mockDiseases() : mockSymptoms(),
      );
    vi.stubGlobal("fetch", mockFetch);

    const provider = getDefaultDataProvider("/my-assets");
    const diseases = await provider.fetchDiseases("brain");
    const symptoms = await provider.fetchSymptoms("brain");

    expect(diseases).toHaveLength(2);
    expect(symptoms).toEqual(["Headache", "Memory loss", "Confusion"]);
    expect(mockFetch).toHaveBeenCalledTimes(2);

    const diseaseUrl: string = mockFetch.mock.calls[0][0] as string;
    expect(diseaseUrl).toContain("/my-assets/data/diseases/bp_brain.json");
    const symptomUrl: string = mockFetch.mock.calls[1][0] as string;
    expect(symptomUrl).toContain("/my-assets/data/symptoms-by-part.json");
  });
});
