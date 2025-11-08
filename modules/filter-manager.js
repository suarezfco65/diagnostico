// modules/filter-manager.js - Gestión de filtros
import { ReportDefinitions } from "./report-definitions.js";

export const FilterManager = (() => {
  let activeCompoundFilters = {};
  let currentSection = null;

  const applyAllFilters = (institutions, reportDefinition, searchString) => {
    let filtered = [...institutions];

    // Aplicar filtros compuestos
    filtered = applyCompoundFiltersLogic(filtered, reportDefinition);

    // Aplicar búsqueda textual
    filtered = applyTextSearch(filtered, reportDefinition, searchString);

    return filtered;
  };

  const applyCompoundFiltersLogic = (institutions, reportDefinition) => {
    if (
      Object.keys(activeCompoundFilters).length === 0 ||
      !reportDefinition.compoundFilters
    ) {
      return institutions;
    }

    return institutions.filter((data) =>
      passesCompoundFilters(data, reportDefinition.compoundFilters)
    );
  };

  const applyTextSearch = (institutions, reportDefinition, searchString) => {
    const normalizedSearch = searchString.trim().toLowerCase();

    if (!normalizedSearch || !reportDefinition.searchFields) {
      return institutions;
    }

    return institutions.filter((data) =>
      reportDefinition.searchFields.some((field) => {
        const value = ReportDefinitions.getReportValue(data, field);
        return String(value).toLowerCase().includes(normalizedSearch);
      })
    );
  };

  const passesCompoundFilters = (data, filterDefinitions) => {
    return Object.entries(activeCompoundFilters).every(([key, filterValue]) => {
      const filterDef = filterDefinitions.find((f) => f.key === key);
      if (!filterDef || !filterValue) return true;

      const dataValue = ReportDefinitions.getReportValue(data, key);
      return evaluateFilterCondition(dataValue, filterValue, filterDef.type);
    });
  };

  const evaluateFilterCondition = (dataValue, filterValue, filterType) => {
    switch (filterType) {
      case "string":
        return String(dataValue) === filterValue;
      case "boolean":
        const expectedBoolean = filterValue === "true";
        const actualBoolean = dataValue === true || dataValue === "true";
        return actualBoolean === expectedBoolean;
      case "numeric":
      case "date":
        return evaluateRangeFilter(dataValue, filterValue);
      default:
        return true;
    }
  };

  const evaluateRangeFilter = (dataValue, range) => {
    const numValue = Number(dataValue);
    const min = range.min ? Number(range.min) : null;
    const max = range.max ? Number(range.max) : null;

    if (min !== null && isNaN(min)) return true;
    if (max !== null && isNaN(max)) return true;
    if (isNaN(numValue)) return false;

    return (!min || numValue >= min) && (!max || numValue <= max);
  };

  const openCompoundFilterModal = (section, reportId) => {
    currentSection = section;
    const reportDefinition = ReportDefinitions.getReportDefinition(
      section,
      reportId
    );
    renderCompoundFilterInputs(reportDefinition.compoundFilters);
  };

  const renderCompoundFilterInputs = (filters) => {
    if (!filters || filters.length === 0) {
      document.getElementById("compound-filter-inputs-container").innerHTML =
        '<p class="alert alert-warning">No hay filtros compuestos definidos para este reporte.</p>';
      return;
    }

    let html = "";
    filters.forEach((filter, index) => {
      const filterId = `comp-filter-${filter.key.replace(/\./g, "-")}`;
      const currentValue = activeCompoundFilters[filter.key];

      html += `
                <div class="mb-3 p-3 border rounded">
                    <label for="${filterId}" class="form-label fw-bold">${filter.label}:</label>
            `;

      if (filter.type === "string" && filter.options) {
        html += `<select class="form-select comp-filter-input" data-filter-key="${filter.key}" data-filter-type="${filter.type}" id="${filterId}">`;
        html += `<option value="">-- Sin Filtro --</option>`;
        filter.options.forEach((option) => {
          const selected = currentValue === option ? "selected" : "";
          html += `<option value="${option}" ${selected}>${option}</option>`;
        });
        html += `</select>`;
      } else if (filter.type === "boolean") {
        html += `<select class="form-select comp-filter-input" data-filter-key="${filter.key}" data-filter-type="${filter.type}" id="${filterId}">`;
        html += `<option value="">-- Ambos (Sin Filtro) --</option>`;
        html += `<option value="true" ${
          currentValue === "true" ? "selected" : ""
        }>Sí / Activo</option>`;
        html += `<option value="false" ${
          currentValue === "false" ? "selected" : ""
        }>No / Inactivo</option>`;
        html += `</select>`;
      } else if (filter.type === "numeric" || filter.type === "date") {
        const inputType = filter.type === "date" ? "date" : "number";
        const currentMin = currentValue ? currentValue.min : "";
        const currentMax = currentValue ? currentValue.max : "";

        html += `
                    <div class="row">
                        <div class="col-6">
                            <label for="${filterId}-min" class="form-label">Mínimo:</label>
                            <input type="${inputType}" class="form-control comp-filter-input-range" 
                                   data-filter-key="${filter.key}" data-filter-type="${filter.type}" 
                                   data-range-part="min" id="${filterId}-min" 
                                   value="${currentMin}" placeholder="Mínimo">
                        </div>
                        <div class="col-6">
                            <label for="${filterId}-max" class="form-label">Máximo:</label>
                            <input type="${inputType}" class="form-control comp-filter-input-range" 
                                   data-filter-key="${filter.key}" data-filter-type="${filter.type}" 
                                   data-range-part="max" id="${filterId}-max" 
                                   value="${currentMax}" placeholder="Máximo">
                        </div>
                    </div>
                `;
      }

      html += `</div>`;
    });

    document.getElementById("compound-filter-inputs-container").innerHTML =
      html;
  };

  const collectFiltersFromModal = () => {
    const newFilters = {};
    const form = document.getElementById("compound-filter-form");

    // Recolectar filtros de tipo STRING y BOOLEAN (selects)
    form.querySelectorAll(".comp-filter-input").forEach((select) => {
      if (select.value) {
        newFilters[select.dataset.filterKey] = select.value;
      }
    });

    // Recolectar filtros de tipo NUMERIC y DATE (rangos)
    form.querySelectorAll(".comp-filter-input-range").forEach((input) => {
      const key = input.dataset.filterKey;
      const part = input.dataset.rangePart;
      const value = input.value.trim();

      if (value) {
        if (!newFilters[key]) {
          newFilters[key] = { min: "", max: "" };
        }
        newFilters[key][part] = value;
      }
    });

    return newFilters;
  };

  const applyCompoundFiltersFromModal = () => {
    activeCompoundFilters = collectFiltersFromModal();
  };

  const clearCompoundFilters = () => {
    activeCompoundFilters = {};
  };

  const updateFilterLegend = (reportDefinition) => {
    const legendContainer = document.getElementById("compound-filter-legend");
    if (!legendContainer) return;

    const filterDefs = reportDefinition.compoundFilters || [];
    let legendHtml = "";
    let filterCount = 0;

    for (const key in activeCompoundFilters) {
      const value = activeCompoundFilters[key];
      const def = filterDefs.find((f) => f.key === key);

      if (!def || !value) continue;

      let displayValue = "";

      if (def.type === "string" && value) {
        displayValue = `**${value}**`;
        filterCount++;
      } else if (def.type === "boolean" && value) {
        displayValue = value === "true" ? "Sí / Activo" : "No / Inactivo";
        displayValue = `**${displayValue}**`;
        filterCount++;
      } else if (
        (def.type === "numeric" || def.type === "date") &&
        (value.min || value.max)
      ) {
        const min = value.min || "Mínimo";
        const max = value.max || "Máximo";
        displayValue = `desde **${min}** hasta **${max}**`;
        filterCount++;
      } else {
        continue;
      }

      legendHtml += `<span class="badge bg-primary me-2 mb-1">${def.label}: ${displayValue}</span>`;
    }

    if (filterCount > 0) {
      legendContainer.innerHTML = `
                <div class="alert alert-primary p-2">
                    <p class="mb-1 fw-bold">Filtros Compuestos Aplicados (${filterCount}):</p>
                    <div>${legendHtml}</div>
                </div>
            `;
    } else {
      legendContainer.innerHTML = "";
    }
  };

  const getActiveCompoundFilters = () => {
    return { ...activeCompoundFilters };
  };

  return {
    applyAllFilters,
    openCompoundFilterModal,
    applyCompoundFiltersFromModal,
    clearCompoundFilters,
    updateFilterLegend,
    getActiveCompoundFilters,
  };
})();
