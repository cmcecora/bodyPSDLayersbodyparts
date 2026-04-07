import { LitElement, html, css, nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import "./body-map-model.js";
import "./body-map-sidebar.js";
import "./body-map-detail-panel.js";
import "./body-map-data-panel.js";
import "./body-map-modal.js";
import { designTokens } from "./styles/tokens.css.js";
import { ORGANS } from "./data/organs.js";
import {
  BODY_SYSTEMS,
  ORGAN_TO_SYSTEM,
  type BodySystemId,
  type BodySystemDefinition,
} from "./data/systems.js";
import {
  fetchDiseases,
  fetchSymptomsForPart,
  getDefaultDataProvider,
  ORGAN_TO_DATA_KEY,
  type DiseaseEntry,
  type DataProvider,
} from "./data/data-service.js";
import { SECTION_TO_BP_KEYS } from "./data/section-mapping.js";
import {
  BODY_PARTS,
  getBodyPartPhotoEntriesByIds,
  getBodyPartPhotoEntriesForOrganIds,
  type BodyPartDefinition,
  type BodyPartPhotoEntry,
} from "./data/body-parts.js";
import {
  getBodyPartModalAnchor,
  getOrganGroupModalAnchor,
} from "./data/body-part-modal-anchor.js";

@customElement("body-map-explorer")
export class BodyMapExplorer extends LitElement {
  private _dataSourceEpoch = 0;

  static styles = [
    designTokens,
    css`
      :host {
        display: block;
        font-family: var(--bme-font-family);
        background: var(--bme-surface);
        color: #333;
      }

      .layout {
        display: grid;
        grid-template-columns: 260px 1fr 300px minmax(280px, 1fr);
        min-height: 100vh;
        gap: var(--bme-space-md);
        padding: var(--bme-space-md);
      }

      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }

      .panel {
        background: var(--bme-panel);
        border: 1px solid var(--bme-border);
        border-radius: 8px;
        overflow: hidden;
      }

      .body-model-area {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        background: var(--bme-panel);
        border: 1px solid var(--bme-border);
        border-radius: 8px;
        padding: var(--bme-space-md);
        min-height: 600px;
      }

      body-map-model {
        width: min(100%, 380px);
      }

      .data-panel-col {
        overflow-y: auto;
        max-height: 100vh;
        position: sticky;
        top: var(--bme-space-md);
      }
    `,
  ];

  @property({ type: String, attribute: "active-system-id", reflect: true })
  activeSystemId: BodySystemId | null = null;

  @property({
    type: Array,
    attribute: "selected-organ-ids",
    reflect: true,
    converter: {
      fromAttribute: (value: string) => (value ? value.split(",") : []),
      toAttribute: (value: string[]) =>
        value.length > 0 ? value.join(",") : null,
    },
  })
  selectedOrganIds: string[] = [];

  /** bp_*-prefixed IDs of body parts selected from the sidebar panel. */
  @state() private _selectedBodyPartIds: string[] = [];
  @state() private _detailBodyPartId: string | null = null;

  @state() private _diseasesMap: Map<string, DiseaseEntry[]> = new Map();
  @state() private _symptomsMap: Map<string, string[]> = new Map();
  @state() private _loadingIds: Set<string> = new Set();
  @state() private _errorIds: Map<string, string> = new Map();
  @state() private _filterQuery = "";

  @state() private _currentGender: "male" | "female" = "male";
  @state() private _currentView: "organs" | "organs2" | "sections" = "organs";
  @state() private _liveAnnouncement = "";

  // Modal state
  @state() private _modalSectionId: string | null = null;
  @state() private _modalSectionName = "";
  @state() private _modalAnchorX = 0;
  @state() private _modalAnchorY = 0;
  @state() private _modalDiseases: DiseaseEntry[] = [];
  @state() private _modalSymptoms: string[] = [];
  @state() private _modalLoading = false;
  @state() private _modalError: string | null = null;

  @property({ type: String, attribute: "asset-base", reflect: true })
  assetBase = "";

  /**
   * Optional external data source. Can be:
   * 1. A DataProvider object with fetchDiseases and fetchSymptoms methods.
   * 2. A static object with diseases and symptoms maps.
   */
  @property({ type: Object, attribute: "external-data" })
  externalData: any = null;

  private get _activeDataProvider(): DataProvider {
    const data = this.externalData;

    // 1. DataProvider instance
    if (
      data &&
      typeof data.fetchDiseases === "function" &&
      typeof data.fetchSymptoms === "function"
    ) {
      return data as DataProvider;
    }

    // 2. Static object
    if (data && (data.diseases || data.symptoms)) {
      return {
        fetchDiseases: async (id: string) => data.diseases?.[id] ?? [],
        fetchSymptoms: async (id: string) => data.symptoms?.[id] ?? [],
      };
    }

    // 3. Fallback to default
    return getDefaultDataProvider(this.assetBase);
  }

  private get activeSystem(): BodySystemDefinition | null {
    if (this.activeSystemId === null) return null;
    return BODY_SYSTEMS.find((s) => s.id === this.activeSystemId) ?? null;
  }

  private get systemHighlightOrganIds(): string[] {
    return this.activeSystem?.organIds ?? [];
  }

  private get _activeDetailBodyPart(): BodyPartDefinition | null {
    if (this._detailBodyPartId === null) return null;
    return (
      BODY_PARTS.find((part) => part.id === this._detailBodyPartId) ?? null
    );
  }

  private get _detailPhotoEntries(): BodyPartPhotoEntry[] {
    if (this.activeSystem !== null) {
      let entries: BodyPartPhotoEntry[];
      if (this.activeSystem.organIds.length > 0) {
        entries = getBodyPartPhotoEntriesForOrganIds(
          this.activeSystem.organIds,
        );
        // Merge in any explicitly listed detailBodyPartIds not already present
        const extraIds = (this.activeSystem.detailBodyPartIds ?? []).filter(
          (id) => !entries.some((e) => e.id === id),
        );
        if (extraIds.length > 0) {
          entries = [...entries, ...getBodyPartPhotoEntriesByIds(extraIds)];
        }
      } else {
        entries = getBodyPartPhotoEntriesByIds(
          this.activeSystem.detailBodyPartIds ?? [],
        );
      }
      // Filter reproductive system entries by current gender
      if (this.activeSystem.id === "reproductive") {
        const excludeOrganId =
          this._currentGender === "male"
            ? "female_reproductive"
            : "male_reproductive";
        const maleBpIds = new Set(["bp_penis", "bp_prostate", "bp_testicles"]);
        const femaleBpIds = new Set([
          "bp_vagina",
          "bp_vulva",
          "bp_fallopian_tubes",
          "bp_ovaries",
          "bp_breasts",
        ]);
        const excludedBpIds =
          this._currentGender === "male" ? femaleBpIds : maleBpIds;
        entries = entries.filter(
          (e) =>
            !e.organIds.includes(excludeOrganId) && !excludedBpIds.has(e.id),
        );
      }

      const focusedBodyPartId = this._activeDetailBodyPart?.id;

      if (focusedBodyPartId === undefined) {
        return entries;
      }

      const focusedIndex = entries.findIndex(
        (entry) => entry.id === focusedBodyPartId,
      );

      if (focusedIndex <= 0) {
        return entries;
      }

      return [
        entries[focusedIndex],
        ...entries.slice(0, focusedIndex),
        ...entries.slice(focusedIndex + 1),
      ];
    }

    const activeBodyPart = this._activeDetailBodyPart;
    if (activeBodyPart === null) {
      return [];
    }

    return [
      {
        id: activeBodyPart.id,
        label: activeBodyPart.name,
        imageFile: activeBodyPart.imageFile,
        organIds: [...activeBodyPart.organIds],
      },
    ];
  }

  private get _panelOrganIds(): string[] {
    // Organs from selectedOrganIds that are "covered" by a body part selection
    // (e.g. "heart" is covered when "bp_heart" is in _selectedBodyPartIds)
    // are excluded to prevent duplicate cards in the data panel.
    const coveredByBodyParts = new Set<string>();
    for (const bpId of this._selectedBodyPartIds) {
      const bp = BODY_PARTS.find((b) => b.id === bpId);
      bp?.organIds.forEach((id) => coveredByBodyParts.add(id));
    }
    const filteredSelectedOrgans = this.selectedOrganIds.filter(
      (id) => !coveredByBodyParts.has(id),
    );

    // Deduplicate systemHighlightOrganIds by data key so e.g. lungs_left and
    // lungs_right don't produce two identical cards — keep first occurrence.
    const seenDataKeys = new Set<string>();
    const dedupedSystem = this.systemHighlightOrganIds.filter((id) => {
      const key = ORGAN_TO_DATA_KEY[id] ?? id;
      if (seenDataKeys.has(key)) return false;
      seenDataKeys.add(key);
      return true;
    });

    // Include bp_ items explicitly listed in the active system's detailBodyPartIds
    let systemDetailIds = this.activeSystem?.detailBodyPartIds ?? [];
    let filteredDedupedSystem = dedupedSystem;

    // Filter reproductive system display by current gender
    if (this.activeSystem?.id === "reproductive") {
      const maleBpIds = new Set(["bp_penis", "bp_prostate", "bp_testicles"]);
      const femaleBpIds = new Set([
        "bp_vagina",
        "bp_vulva",
        "bp_fallopian_tubes",
        "bp_ovaries",
        "bp_breasts",
      ]);
      const excludedBpIds =
        this._currentGender === "male" ? femaleBpIds : maleBpIds;
      const excludeOrganId =
        this._currentGender === "male"
          ? "female_reproductive"
          : "male_reproductive";
      systemDetailIds = systemDetailIds.filter((id) => !excludedBpIds.has(id));
      filteredDedupedSystem = filteredDedupedSystem.filter(
        (id) => id !== excludeOrganId,
      );
    }

    return Array.from(
      new Set([
        ...filteredSelectedOrgans,
        ...this._selectedBodyPartIds,
        ...filteredDedupedSystem,
        ...systemDetailIds,
      ]),
    );
  }

  private _dispatchOrganSelectionEvent(
    eventName: "organ-selected" | "organ-deselected",
    organId: string,
  ) {
    this.dispatchEvent(
      new CustomEvent(eventName, {
        detail: { organId },
        bubbles: true,
        composed: true,
      }),
    );

    this.dispatchEvent(
      new CustomEvent(
        eventName === "organ-selected"
          ? "body-part-selected"
          : "body-part-deselected",
        {
          detail: { organId, bodyPartId: organId },
          bubbles: true,
          composed: true,
        },
      ),
    );
  }

  private _handleSystemToggleRequest(
    event: CustomEvent<{ systemId: BodySystemId }>,
  ) {
    const { systemId } = event.detail;
    this._detailBodyPartId = null;
    if (systemId === this.activeSystemId) {
      this.activeSystemId = null;
    } else {
      this.activeSystemId = systemId;
      // Load data for all organs and explicit body parts in the newly selected system
      const system = BODY_SYSTEMS.find((s) => s.id === systemId);
      system?.organIds.forEach((id) => this._loadOrganData(id));
      system?.detailBodyPartIds?.forEach((id) => this._loadOrganData(id));
    }

    if (this.activeSystemId === systemId) {
      this._announce(`${this._systemTitle(systemId)} system selected.`);
    }

    this.dispatchEvent(
      new CustomEvent("system-selected", {
        detail: { systemId, active: this.activeSystemId === systemId },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _handleOrganSelectRequest(event: CustomEvent<{ organId: string }>) {
    const { organId } = event.detail;
    this._detailBodyPartId = null;
    const wasSelected = this.selectedOrganIds.includes(organId);
    const nextIds = wasSelected
      ? this.selectedOrganIds.filter((id) => id !== organId)
      : [...this.selectedOrganIds, organId];

    this.selectedOrganIds = nextIds;

    this._dispatchOrganSelectionEvent(
      wasSelected ? "organ-deselected" : "organ-selected",
      organId,
    );

    if (!wasSelected) {
      this._loadOrganData(organId);
      const mappedSystemIds = ORGAN_TO_SYSTEM[organId] ?? [];
      this.activeSystemId = mappedSystemIds[0] ?? this.activeSystemId;
      this._announceSelection(this._organName(organId), mappedSystemIds[0]);
    } else if (this.activeSystemId !== null) {
      const mappedSystemIds = ORGAN_TO_SYSTEM[organId] ?? [];
      if (mappedSystemIds.includes(this.activeSystemId)) {
        const activeOrgans = this.activeSystem?.organIds ?? [];
        const anyStillSelected = nextIds.some((id) =>
          activeOrgans.includes(id),
        );
        if (!anyStillSelected) this.activeSystemId = null;
      }
    }
  }

  private async _handleBodyPartSelectRequest(
    event: CustomEvent<{ bodyPartId: string; organIds: string[] }>,
  ) {
    const { bodyPartId, organIds } = event.detail;

    // In Organs2 view, sidebar clicks open the modal instead of toggling selection
    if (this._currentView === "organs2") {
      const bodyPart = BODY_PARTS.find((bp) => bp.id === bodyPartId);
      const displayName = bodyPart?.name ?? bodyPartId;
      const anchor = this._resolveOrgans2ModalAnchor(bodyPartId, organIds);
      this._modalSectionId = bodyPartId;
      this._modalSectionName = displayName;
      this._modalAnchorX = anchor.x;
      this._modalAnchorY = anchor.y;
      this._modalDiseases = [];
      this._modalSymptoms = [];
      this._modalError = null;
      this._modalLoading = true;
      try {
        const provider = this._activeDataProvider;
        const [diseases, symptoms] = await Promise.all([
          provider.fetchDiseases(bodyPartId).catch(() => [] as DiseaseEntry[]),
          provider.fetchSymptoms(bodyPartId).catch(() => [] as string[]),
        ]);
        this._modalDiseases = Array.from(
          new Map(diseases.map((d) => [d.name, d])).values(),
        );
        this._modalSymptoms = [...new Set(symptoms)].sort();
      } catch (err) {
        this._modalError = String(err);
      } finally {
        this._modalLoading = false;
      }
      this._announceSelection(displayName, this._bodyPartSystemId(bodyPartId));
      return;
    }

    // Toggle data-panel tracking by bodyPartId (bp_* key maps directly to data files)
    const isBodyPartSelected = this._selectedBodyPartIds.includes(bodyPartId);
    let nextSelectedBodyPartIds: string[];
    if (isBodyPartSelected) {
      nextSelectedBodyPartIds = this._selectedBodyPartIds.filter(
        (id) => id !== bodyPartId,
      );
    } else {
      nextSelectedBodyPartIds = [...this._selectedBodyPartIds, bodyPartId];
      this._loadOrganData(bodyPartId);
    }
    this._selectedBodyPartIds = nextSelectedBodyPartIds;
    this._detailBodyPartId = isBodyPartSelected
      ? (nextSelectedBodyPartIds[nextSelectedBodyPartIds.length - 1] ?? null)
      : bodyPartId;
    // Body part selection always clears any active system — body part and system
    // selections are mutually exclusive for column 3/4 display.
    this.activeSystemId = null;

    // Toggle SVG highlighting via organIds (may be empty for non-SVG body parts)
    if (organIds.length > 0) {
      const anyOrganSelected = organIds.some((id) =>
        this.selectedOrganIds.includes(id),
      );
      if (anyOrganSelected) {
        this.selectedOrganIds = this.selectedOrganIds.filter(
          (id) => !organIds.includes(id),
        );
      } else {
        this.selectedOrganIds = [
          ...this.selectedOrganIds,
          ...organIds.filter((id) => !this.selectedOrganIds.includes(id)),
        ];
        // NOTE: intentionally NOT activating activeSystemId here
      }
    }

    if (!isBodyPartSelected) {
      this._announceSelection(
        this._bodyPartName(bodyPartId),
        this._bodyPartSystemId(bodyPartId),
      );
    }
  }

  private _handleBpHighlightClick(event: CustomEvent<{ bodyPartId: string }>) {
    const { bodyPartId } = event.detail;
    const bp = BODY_PARTS.find((b) => b.id === bodyPartId);
    if (!bp) return;

    // Deselect the body part
    this._selectedBodyPartIds = this._selectedBodyPartIds.filter(
      (id) => id !== bodyPartId,
    );
    this._detailBodyPartId =
      this._selectedBodyPartIds[this._selectedBodyPartIds.length - 1] ?? null;

    // Remove associated organ highlights if no other selected body part maps to them
    if (bp.organIds.length > 0) {
      const stillNeeded = new Set<string>();
      for (const bpId of this._selectedBodyPartIds) {
        const other = BODY_PARTS.find((b) => b.id === bpId);
        other?.organIds.forEach((id) => stillNeeded.add(id));
      }
      this.selectedOrganIds = this.selectedOrganIds.filter(
        (id) => !bp.organIds.includes(id) || stillNeeded.has(id),
      );
    }
  }

  private _resolveOrgans2ModalAnchor(
    bodyPartId: string,
    organIds: string[],
  ): { x: number; y: number } {
    const model = this.renderRoot.querySelector("body-map-model");
    const modelRoot = model?.shadowRoot ?? null;

    for (const organId of organIds) {
      const anchor = getOrganGroupModalAnchor(modelRoot, organId);
      if (anchor !== null) {
        return anchor;
      }
    }

    return getBodyPartModalAnchor(bodyPartId);
  }

  private _handleOrganSelectionChange(
    event: CustomEvent<{
      selectedOrganIds: string[];
      lastToggled: string;
      isSelected: boolean;
    }>,
  ) {
    const { selectedOrganIds, lastToggled, isSelected } = event.detail;
    this.selectedOrganIds = selectedOrganIds;
    this._detailBodyPartId = null;

    this._dispatchOrganSelectionEvent(
      isSelected ? "organ-selected" : "organ-deselected",
      lastToggled,
    );

    const mappedSystemIds = ORGAN_TO_SYSTEM[lastToggled] ?? [];

    if (isSelected) {
      this.activeSystemId = mappedSystemIds[0] ?? this.activeSystemId;
      this._loadOrganData(lastToggled);
      this._announceSelection(this._organName(lastToggled), mappedSystemIds[0]);
    } else {
      if (
        this.activeSystemId !== null &&
        mappedSystemIds.includes(this.activeSystemId)
      ) {
        const activeSystemOrgans = this.activeSystem?.organIds ?? [];
        const anyActiveSystemOrganStillSelected = this.selectedOrganIds.some(
          (id) => activeSystemOrgans.includes(id),
        );
        if (!anyActiveSystemOrganStillSelected) {
          this.activeSystemId = null;
        }
      }
    }
  }

  private async _loadOrganData(organId: string) {
    if (this._diseasesMap.has(organId) || this._loadingIds.has(organId)) return;

    const loadEpoch = this._dataSourceEpoch;
    this._loadingIds = new Set([...this._loadingIds, organId]);

    try {
      const provider = this._activeDataProvider;
      const [diseases, symptoms] = await Promise.all([
        provider.fetchDiseases(organId),
        provider.fetchSymptoms(organId),
      ]);

      if (loadEpoch !== this._dataSourceEpoch) {
        return;
      }

      const nextDiseases = new Map(this._diseasesMap);
      nextDiseases.set(organId, diseases);
      this._diseasesMap = nextDiseases;

      const nextSymptoms = new Map(this._symptomsMap);
      nextSymptoms.set(organId, symptoms);
      this._symptomsMap = nextSymptoms;
    } catch (err) {
      if (loadEpoch !== this._dataSourceEpoch) {
        return;
      }

      const nextErr = new Map(this._errorIds);
      nextErr.set(organId, String(err));
      this._errorIds = nextErr;
    } finally {
      if (loadEpoch !== this._dataSourceEpoch) {
        return;
      }

      const next = new Set(this._loadingIds);
      next.delete(organId);
      this._loadingIds = next;
    }
  }

  protected override updated(changedProperties: PropertyValues<this>) {
    if (
      changedProperties.has("externalData") ||
      changedProperties.has("assetBase")
    ) {
      this._dataSourceEpoch += 1;
      this._diseasesMap = new Map();
      this._symptomsMap = new Map();
      this._errorIds = new Map();
      this._loadingIds = new Set();

      for (const organId of this._panelOrganIds) {
        void this._loadOrganData(organId);
      }
    }
  }

  private _handleAllBodyPartsToggle(
    event: CustomEvent<{ selectAll: boolean }>,
  ) {
    const { selectAll } = event.detail;
    this.activeSystemId = null;
    this._detailBodyPartId = null;
    if (selectAll) {
      this._selectedBodyPartIds = BODY_PARTS.map((bp) => bp.id);
      this.selectedOrganIds = [
        ...new Set(BODY_PARTS.flatMap((bp) => bp.organIds)),
      ];
      for (const bp of BODY_PARTS) {
        void this._loadOrganData(bp.id);
      }
    } else {
      this._selectedBodyPartIds = [];
      this.selectedOrganIds = [];
    }
  }

  private _handleRetryOrgan(event: CustomEvent<{ organId: string }>) {
    const { organId } = event.detail;
    const nextErr = new Map(this._errorIds);
    nextErr.delete(organId);
    this._errorIds = nextErr;
    this._loadOrganData(organId);
  }

  private _handleFilterChange(event: CustomEvent<{ query: string }>) {
    this._filterQuery = event.detail.query;
  }

  private async _handleSectionClick(
    event: CustomEvent<{
      sectionId: string;
      sectionName: string;
      clientX: number;
      clientY: number;
      selected?: boolean;
    }>,
  ) {
    const {
      sectionId,
      sectionName,
      clientX,
      clientY,
      selected = true,
    } = event.detail;

    // If the section was deselected, close its modal (if open) and return
    if (!selected) {
      if (this._modalSectionId === sectionId) this._closeModal();
      return;
    }

    this._modalSectionId = sectionId;
    this._modalSectionName = sectionName;
    this._modalAnchorX = clientX;
    this._modalAnchorY = clientY;
    this._modalDiseases = [];
    this._modalSymptoms = [];
    this._modalError = null;
    this._modalLoading = true;

    // Look up body part keys for this section
    const bpKeys = SECTION_TO_BP_KEYS[sectionId] ?? [];

    try {
      const provider = this._activeDataProvider;

      // Fetch diseases and symptoms for all body parts in this section
      const [diseasesArrays, symptomsArrays] = await Promise.all([
        Promise.all(
          bpKeys.map((key) => provider.fetchDiseases(key).catch(() => [])),
        ),
        Promise.all(
          bpKeys.map((key) => provider.fetchSymptoms(key).catch(() => [])),
        ),
      ]);

      // Flatten and deduplicate diseases by name
      const allDiseases = diseasesArrays.flat();
      const uniqueDiseases = Array.from(
        new Map(allDiseases.map((d) => [d.name, d])).values(),
      );

      // Flatten and deduplicate symptoms
      const allSymptoms = symptomsArrays.flat();
      const uniqueSymptoms = Array.from(new Set(allSymptoms));

      this._modalDiseases = uniqueDiseases;
      this._modalSymptoms = uniqueSymptoms.sort();
    } catch (err) {
      this._modalError = String(err);
    } finally {
      this._modalLoading = false;
    }
  }

  private _closeModal() {
    this._modalSectionId = null;
    this._modalDiseases = [];
    this._modalSymptoms = [];
    this._modalError = null;
    this._modalLoading = false;
  }

  private _handleModalClose() {
    this._closeModal();
  }

  private _handleModalRetry() {
    if (!this._modalSectionId) return;
    // Save the current section context before clearing
    const sectionId = this._modalSectionId;
    const sectionName = this._modalSectionName;
    const clientX = this._modalAnchorX;
    const clientY = this._modalAnchorY;
    // Clear _modalSectionId FIRST so the toggle-close guard in _handleSectionClick
    // does not fire (guard checks if sectionId === _modalSectionId and closes if so)
    this._modalSectionId = null;
    void this._handleSectionClick(
      new CustomEvent("section-click", {
        detail: { sectionId, sectionName, clientX, clientY, selected: true },
      }) as CustomEvent<{
        sectionId: string;
        sectionName: string;
        clientX: number;
        clientY: number;
        selected?: boolean;
      }>,
    );
  }

  private _handleGenderChange(
    event: CustomEvent<{ gender: "male" | "female" }>,
  ) {
    this._currentGender = event.detail.gender;
  }

  private _handleViewChange(
    event: CustomEvent<{ view: "organs" | "organs2" | "sections" }>,
  ) {
    this._currentView = event.detail.view;
  }

  private async _handleOrgan2Click(event: CustomEvent<{ organId: string }>) {
    const { organId } = event.detail;
    const dataKey = ORGAN_TO_DATA_KEY[organId] ?? organId;
    const bpKey = `bp_${dataKey}`;
    const bodyPart = BODY_PARTS.find((bp) => bp.organIds.includes(organId));
    const displayName = bodyPart?.name ?? organId;

    this._modalSectionId = bpKey;
    this._modalSectionName = displayName;
    this._modalAnchorX = 0;
    this._modalAnchorY = 0;
    this._modalDiseases = [];
    this._modalSymptoms = [];
    this._modalError = null;
    this._modalLoading = true;

    try {
      const provider = this._activeDataProvider;
      const [diseases, symptoms] = await Promise.all([
        provider.fetchDiseases(bpKey).catch(() => [] as DiseaseEntry[]),
        provider.fetchSymptoms(bpKey).catch(() => [] as string[]),
      ]);
      this._modalDiseases = Array.from(
        new Map(diseases.map((d) => [d.name, d])).values(),
      );
      this._modalSymptoms = [...new Set(symptoms)].sort();
    } catch (err) {
      this._modalError = String(err);
    } finally {
      this._modalLoading = false;
    }
  }

  private _handleSymptomToggle(
    _event: CustomEvent<{ symptom: string; checked: boolean }>,
  ) {
    // Pass-through for now — selected symptom state lives in body-map-modal itself
  }

  private _announceSelection(label: string, systemId?: BodySystemId) {
    const systemTitle = systemId ? this._systemTitle(systemId) : null;
    const message = systemTitle
      ? `${label} selected. Body system: ${systemTitle}.`
      : `${label} selected.`;
    this._announce(message);
  }

  private _announce(message: string) {
    if (this._liveAnnouncement === message) {
      this._liveAnnouncement = "";
      queueMicrotask(() => {
        this._liveAnnouncement = message;
      });
      return;
    }

    this._liveAnnouncement = message;
  }

  private _organName(organId: string): string {
    return ORGANS.find((organ) => organ.id === organId)?.name ?? organId;
  }

  private _bodyPartName(bodyPartId: string): string {
    return BODY_PARTS.find((bodyPart) => bodyPart.id === bodyPartId)?.name ?? bodyPartId;
  }

  private _systemTitle(systemId: BodySystemId): string {
    return BODY_SYSTEMS.find((system) => system.id === systemId)?.title ?? systemId;
  }

  private _bodyPartSystemId(bodyPartId: string): BodySystemId | undefined {
    const bodyPart = BODY_PARTS.find((entry) => entry.id === bodyPartId);
    return bodyPart?.organIds.flatMap((organId) => ORGAN_TO_SYSTEM[organId] ?? [])[0];
  }

  render() {
    return html`
      <div class="sr-only" aria-live="polite" data-testid="live-announcer">
        ${this._liveAnnouncement}
      </div>
      <div class="layout">
        <div class="panel">
          <body-map-sidebar
            .systems=${BODY_SYSTEMS}
            .activeSystemId=${this.activeSystemId}
            .selectedOrganIds=${this.selectedOrganIds}
            .selectedBodyPartIds=${this._selectedBodyPartIds}
            .assetBase=${this.assetBase}
            @system-toggle-request=${this._handleSystemToggleRequest}
            @organ-select-request=${this._handleOrganSelectRequest}
            @body-part-select-request=${this._handleBodyPartSelectRequest}
            @body-parts-all-toggle-request=${this._handleAllBodyPartsToggle}
          ></body-map-sidebar>
        </div>
        <div class="body-model-area">
          <body-map-model
            .selectedOrganIds=${this.selectedOrganIds}
            .systemHighlightOrganIds=${this.systemHighlightOrganIds}
            .highlightedBodyPartIds=${this._selectedBodyPartIds}
            .assetBase=${this.assetBase}
            @organ-selection-change=${this._handleOrganSelectionChange}
            @section-click=${this._handleSectionClick}
            @organ2-click=${this._handleOrgan2Click}
            @gender-change=${this._handleGenderChange}
            @view-change=${this._handleViewChange}
            @bp-highlight-click=${this._handleBpHighlightClick}
          ></body-map-model>
        </div>
        <div class="panel">
          <body-map-detail-panel
            .system=${this.activeSystem}
            .bodyPart=${this.activeSystem === null
              ? this._activeDetailBodyPart
              : null}
            .photoEntries=${this._detailPhotoEntries}
            .assetBase=${this.assetBase}
          ></body-map-detail-panel>
        </div>
        <!-- col 4: data panel -->
        <div class="panel data-panel-col">
          <body-map-data-panel
            .selectedOrganIds=${this._panelOrganIds}
            .diseasesMap=${this._diseasesMap}
            .symptomsMap=${this._symptomsMap}
            .loadingIds=${this._loadingIds}
            .errorIds=${this._errorIds}
            .filterQuery=${this._filterQuery}
            @filter-change=${this._handleFilterChange}
            @retry-organ=${this._handleRetryOrgan}
          ></body-map-data-panel>
        </div>
      </div>
      ${this._modalSectionId !== null
        ? html`
            <body-map-modal
              .sectionId=${this._modalSectionId}
              .sectionName=${this._modalSectionName}
              .diseases=${this._modalDiseases}
              .symptoms=${this._modalSymptoms}
              .loading=${this._modalLoading}
              .error=${this._modalError}
              .anchorX=${this._modalAnchorX}
              .anchorY=${this._modalAnchorY}
              @modal-close=${this._handleModalClose}
              @modal-retry=${this._handleModalRetry}
              @symptom-toggle=${this._handleSymptomToggle}
            ></body-map-modal>
          `
        : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "body-map-explorer": BodyMapExplorer;
  }
}
