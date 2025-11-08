// reports.js - Archivo principal coordinador
import { AuthManager } from "./modules/auth-manager.js";
import { ReportDefinitions } from "./modules/report-definitions.js"; // Usa el export nombrado
import { FilterManager } from "./modules/filter-manager.js";
import { TableGenerator } from "./modules/table-generator.js";
import { UIManager } from "./modules/ui-manager.js";

const ReportsModule = (() => {
  let currentSection = null;
  let currentReportId = null;

  const init = () => {
    // Inicializar todos los módulos
    AuthManager.init();
    ReportDefinitions.init();
    UIManager.init();

    // ❗ NUEVA LÍNEA: Configurar el listener de exportación ❗
    TableGenerator.setupExportListener();

    // Configurar event listeners
    setupEventListeners();
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
    if (e.target.id === "logout-btn") {
      AuthManager.handleLogout();
    } else if (e.target.classList.contains("compound-filter-btn")) {
      handleCompoundFilterClick(e);
    } else if (e.target.id === "apply-compound-filters-btn") {
      handleApplyCompoundFilters(e);
    } else if (e.target.id === "clear-compound-filters-btn") {
      handleClearCompoundFilters(e);
    }
  };

  const handleReportSelectChange = (e) => {
    const section = e.target.dataset.section;
    const reportId = e.target.value;

    currentSection = section;
    currentReportId = reportId;

    UIManager.updateUIState(section, reportId);

    if (reportId) {
      generateReport(section, reportId);
    } else {
      TableGenerator.clearResults();
    }
  };

  const handleSearchInput = (e) => {
    const section = e.target.dataset.section;
    if (currentSection === section && currentReportId) {
      generateReport(section, currentReportId);
    }
  };

  const handleCompoundFilterClick = (e) => {
    const section = e.target.dataset.section;
    if (!currentReportId) {
      console.warn("No se puede abrir el modal: No hay reporte seleccionado.");
      return;
    }
    FilterManager.openCompoundFilterModal(section, currentReportId);
  };

  const handleApplyCompoundFilters = () => {
    FilterManager.applyCompoundFiltersFromModal();
    if (currentSection && currentReportId) {
      generateReport(currentSection, currentReportId);
    }
  };

  const handleClearCompoundFilters = () => {
    FilterManager.clearCompoundFilters();
    if (currentSection && currentReportId) {
      generateReport(currentSection, currentReportId);
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
