// reports.js - Archivo principal coordinador
import { AuthManager } from "./modules/auth-manager.js";
import { ReportDefinitions } from "./modules/report-definitions.js"; // Usa el export nombrado
import { FilterManager } from "./modules/filter-manager.js";
import { TableGenerator } from "./modules/table-generator.js";
import { UIManager } from "./modules/ui-manager.js";

const ReportsModule = (() => {
  const state = {
  currentSection : null,
  currentReportId : null,
  }

  const init = async () => {
    try {
      // 1. Esperar la carga de todas las definiciones de reportes dinámicas
      //    ReportDefinitions.init() ahora debe esperar a todas las llamadas
      //    a importarModulosDesdeNavegador.
      await ReportDefinitions.init();
      console.log("✅ Inicialización de ReportDefinitions completada.");

      // 2. Inicializar el resto de módulos (solo después de que los reportes estén cargados)
      AuthManager.init();
      UIManager.init();
      TableGenerator.setupExportListener();
      setupEventListeners();
    } catch (error) {
      console.error(
        "❌ Error crítico durante la inicialización de módulos:",
        error
      );
      // Aquí puedes mostrar una alerta de error al usuario
    }
  };

  const setupEventListeners = () => {
    // Delegación de eventos para mejor performance
    document.addEventListener("change", handleGlobalChange);
    document.addEventListener("input", handleGlobalInput);
    document.addEventListener("click", handleGlobalClick);
  };

  const handleGlobalChange = (e) => {
    if (e.target.classList.contains("report-select")) {
      handleReportSelectChange(e);
    }
  };

  const handleGlobalInput = (e) => {
    if (e.target.classList.contains("search-filter-input")) {
      handleSearchInput(e);
    }
  };

  const handleGlobalClick = (e) => {
    const target = e.target;
    if (target.id === "logout-btn") {
      AuthManager.handleLogout();
    } else if (target.classList.contains("compound-filter-btn")) {
      handleCompoundFilterClick(e);
    } else if (target.id === "apply-compound-filters-btn") {
      handleApplyCompoundFilters(e);
    } else if (target.id === "clear-compound-filters-btn") {
      handleClearCompoundFilters(e);
    }
  };

  const handleReportSelectChange = (e) => {
    const section = e.target.dataset.section;
    const reportId = e.target.value;

    state.currentSection = section;
    state.currentReportId = reportId;

    UIManager.updateUIState(section, reportId);

    if (reportId) {
      generateReport(section, reportId);
    } else {
      TableGenerator.clearResults();
    }
  };

  const handleSearchInput = (e) => {
    const section = e.target.dataset.section;
    if (state.currentSection === section && state.currentReportId) {
      generateReport(section, state.currentReportId);
    }
  };

  const handleCompoundFilterClick = (e) => {
    const section = e.target.dataset.section;
    if (!state.currentReportId) {
      console.warn("No se puede abrir el modal: No hay reporte seleccionado.");
      return;
    }
    FilterManager.openCompoundFilterModal(section, state.currentReportId);
  };

  const handleApplyCompoundFilters = () => {
    FilterManager.applyCompoundFiltersFromModal();
    if (state.currentSection && state.currentReportId) {
      generateReport(state.currentSection, state.currentReportId);
    }
  };

  const handleClearCompoundFilters = () => {
    FilterManager.clearCompoundFilters();
    if (state.currentSection && state.currentReportId) {
      generateReport(state.currentSection, state.currentReportId);
    }
  };

  const generateReport = (section, reportId) => {
    try {
      const reportDefinition = ReportDefinitions.getReportDefinition(
        section,
        reportId
      );
      const searchString = UIManager.getSearchValue(section);

      let institutions = ReportDefinitions.getAllInstitutions();

      // Aplicar filtros
      institutions = FilterManager.applyAllFilters(
        institutions,
        reportDefinition,
        searchString
      );

      // Generar tabla
      TableGenerator.generateTable(institutions, reportDefinition);

      // Actualizar leyenda de filtros
      FilterManager.updateFilterLegend(reportDefinition);
    } catch (error) {
      console.error("Error generating report:", error);
      TableGenerator.showError("Error al generar el reporte");
    }
  };

  return { init };
})();

// Inicializar la aplicación
document.addEventListener("DOMContentLoaded", ReportsModule.init);
