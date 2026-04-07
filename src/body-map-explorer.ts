import { LitElement, html, css, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import "./body-map-model.js";
import "./body-map-sidebar.js";
import "./body-map-detail-panel.js";
import "./body-map-data-panel.js";
import "./body-map-modal.js";
import { designTokens } from "./styles/tokens.css.js";
import {
  BODY_SYSTEMS,
  ORGAN_TO_SYSTEM,
  type BodySystemId,
  type BodySystemDefinition,
} from "./data/systems.js";
import {
  fetchDiseases,
  fetchSymptomsForPart,
  type DiseaseEntry,
} from "./data/data-service.js";
import { SECTION_TO_BP_KEYS } from "./data/section-mapping.js";

@customElement("body-map-explorer")
export class BodyMapExplorer extends LitElement {
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

  @state() private activeSystemId: BodySystemId | null = null;

  @state() private selectedOrganIds: string[] = [];

  @state() private _diseasesMap: Map<string, DiseaseEntry[]> = new Map();
  @state() private _symptomsMap: Map<string, string[]> = new Map();
  @state() private _loadingIds: Set<string> = new Set();
  @state() private _errorIds: Map<string, string> = new Map();
  @state() private _filterQuery = "";

  // Modal state
  @state() private _modalSectionId: string | null = null;
  @state() private _modalSectionName = "";
  @state() private _modalAnchorX = 0;
  @state() private _modalAnchorY = 0;
  @state() private _modalDiseases: DiseaseEntry[] = [];
  @state() private _modalSymptoms: string[] = [];
  @state() private _modalLoading = false;
  @state() private _modalError: string | null = null;

  private get activeSystem(): BodySystemDefinition | null {
    if (this.activeSystemId === null) return null;
    return BODY_SYSTEMS.find((s) => s.id === this.activeSystemId) ?? null;
  }

  private get systemHighlightOrganIds(): string[] {
    return this.activeSystem?.organIds ?? [];
  }

  private _handleSystemToggleRequest(
    event: CustomEvent<{ systemId: BodySystemId }>,
  ) {
    const { systemId } = event.detail;
    if (systemId === this.activeSystemId) {
      this.activeSystemId = null;
    } else {
      this.activeSystemId = systemId;
    }
  }

  private _handleOrganSelectionChange(
    event: CustomEvent<{
      selectedOrganIds: string[];
      lastToggled: string;
      isSelected: boolean;
    }>,
  ) {
    this.selectedOrganIds = event.detail.selectedOrganIds;

    const mappedSystemIds = ORGAN_TO_SYSTEM[event.detail.lastToggled] ?? [];

    if (event.detail.isSelected) {
      this.activeSystemId = mappedSystemIds[0] ?? this.activeSystemId;
      this._loadOrganData(event.detail.lastToggled);
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

    this._loadingIds = new Set([...this._loadingIds, organId]);

    try {
      const [diseases, symptoms] = await Promise.all([
        fetchDiseases(organId),
        fetchSymptomsForPart(organId),
      ]);

      const nextDiseases = new Map(this._diseasesMap);
      nextDiseases.set(organId, diseases);
      this._diseasesMap = nextDiseases;

      const nextSymptoms = new Map(this._symptomsMap);
      nextSymptoms.set(organId, symptoms);
      this._symptomsMap = nextSymptoms;
    } catch (err) {
      const nextErr = new Map(this._errorIds);
      nextErr.set(organId, String(err));
      this._errorIds = nextErr;
    } finally {
      const next = new Set(this._loadingIds);
      next.delete(organId);
      this._loadingIds = next;
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
    }>,
  ) {
    const { sectionId, sectionName, clientX, clientY } = event.detail;

    // Toggle: clicking the same section closes the modal
    if (this._modalSectionId === sectionId) {
      this._closeModal();
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
      // Fetch diseases and symptoms for all body parts in this section
      const [diseasesArrays, symptomsArrays] = await Promise.all([
        Promise.all(bpKeys.map((key) => fetchDiseases(key).catch(() => []))),
        Promise.all(
          bpKeys.map((key) => fetchSymptomsForPart(key).catch(() => [])),
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
        detail: { sectionId, sectionName, clientX, clientY },
      }) as CustomEvent<{
        sectionId: string;
        sectionName: string;
        clientX: number;
        clientY: number;
      }>,
    );
  }

  private _handleSymptomToggle(
    _event: CustomEvent<{ symptom: string; checked: boolean }>,
  ) {
    // Pass-through for now — selected symptom state lives in body-map-modal itself
  }

  render() {
    return html`
      <div class="layout">
        <div class="panel">
          <body-map-sidebar
            .systems=${BODY_SYSTEMS}
            .activeSystemId=${this.activeSystemId}
            @system-toggle-request=${this._handleSystemToggleRequest}
          ></body-map-sidebar>
        </div>
        <div class="body-model-area">
          <body-map-model
            .selectedOrganIds=${this.selectedOrganIds}
            .systemHighlightOrganIds=${this.systemHighlightOrganIds}
            @organ-selection-change=${this._handleOrganSelectionChange}
            @section-click=${this._handleSectionClick}
          ></body-map-model>
        </div>
        <div class="panel">
          <body-map-detail-panel
            .system=${this.activeSystem}
          ></body-map-detail-panel>
        </div>
        <!-- col 4: data panel -->
        <div class="panel data-panel-col">
          <body-map-data-panel
            .selectedOrganIds=${this.selectedOrganIds}
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
