import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import "./body-map-model.js";
import "./body-map-sidebar.js";
import "./body-map-detail-panel.js";
import "./body-map-data-panel.js";
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
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "body-map-explorer": BodyMapExplorer;
  }
}
