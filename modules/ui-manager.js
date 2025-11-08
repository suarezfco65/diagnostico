// modules/ui-manager.js - Gestión de interfaz de usuario
import { ReportDefinitions } from "./report-definitions.js";

const UIManager = (() => {
  const init = () => {
    renderReportSelects();
    setupTabHandling();

    // ❗ NUEVA LÍNEA: Forzar la actualización del estado de UI al cargar ❗
    // Se asume que la sección 'I' es la pestaña inicial y que no hay reporte seleccionado (null).
    // Esto asegura que los botones y campos estén deshabilitados al inicio.
    updateUIState("I", null);
  };

  const renderReportSelects = () => {
    const sections = ["I", "II", "III", "IV", "V", "VI", "VII"];

    sections.forEach((section) => {
      const select = document.getElementById(`report-select-${section}`);
      if (select) {
        select.innerHTML = buildReportOptions(section);
      }
    });
  };

  const buildReportOptions = (section) => {
    const definitions = ReportDefinitions.getSectionDefinitions(section);
    const options = definitions
      .map((def) => `<option value="${def.id}">${def.label}</option>`)
      .join("");

    return (
      '<option value="" disabled selected>Seleccione un indicador...</option>' +
      options
    );
  };

  /**
   * Actualiza el estado de los campos de filtro y búsqueda de la sección activa.
   * @param {string} section - La clave de la sección (ej: 'I').
   * @param {string} reportId - El ID del reporte seleccionado.
   */
  const updateUIState = (section, reportId) => {
    const searchInput = document.getElementById(`search-filter-${section}`);
    const filterBtn = document.getElementById(`compound-filter-btn-${section}`);

    // Determina si se ha seleccionado un reporte (reportId no es null ni "")
    const isReportSelected = !!reportId;
    let hasCompoundFilters = false;

    if (isReportSelected) {
      try {
        // 1. Obtener la definición del reporte
        const definition = ReportDefinitions.getReportDefinition(
          section,
          reportId
        );
        const filters = definition.compoundFilters;

        // 2. Verificar que el array de filtros exista y no esté vacío
        hasCompoundFilters =
          filters && Array.isArray(filters) && filters.length > 0;
      } catch (e) {
        // Si hay un error (ej: definición no encontrada), mantenerlo como false
        hasCompoundFilters = false;
      }
    }

    // ❗ Lógica del botón de Filtro Compuesto ❗
    if (filterBtn) {
      // Se deshabilita si NO se cumplen ambas condiciones:
      // 1. Debe haber un reporte seleccionado (isReportSelected = true)
      // 2. Debe tener filtros definidos (hasCompoundFilters = true)
      filterBtn.disabled = !(isReportSelected && hasCompoundFilters);
    }

    // Lógica del campo de búsqueda (mantener):
    if (searchInput) {
      searchInput.disabled = !isReportSelected;
      if (!isReportSelected) {
        searchInput.value = "";
      }
    }
  };

  const getSearchValue = (section) => {
    const input = document.getElementById(`search-filter-${section}`);
    return input ? input.value : "";
  };

  const setupTabHandling = () => {
    const tabList = document.getElementById("reportTabs");
    if (tabList) {
      tabList.addEventListener("shown.bs.tab", handleTabChange);
    }
  };

  const handleTabChange = (e) => {
    const activeTabId = e.target.getAttribute("data-bs-target");
    const activeSection = activeTabId.replace("#tab-", "");

    // Actualizar estado UI para la sección activa
    const reportSelect = document.getElementById(
      `report-select-${activeSection}`
    );
    if (reportSelect && reportSelect.value) {
      updateUIState(activeSection, reportSelect.value);
    }
  };

  return {
    init,
    updateUIState,
    getSearchValue,
  };
})();
// Al final del archivo, cambia:
export { UIManager }; // En lugar de export default
