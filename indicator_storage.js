// indicator_storage.js

import * as Storage from "./storage.js";

// La clave debe coincidir con la usada en indicator_definitions.js
const INDICATOR_STORAGE_KEY = "siscomres_indicator_definitions";

/**
 * Obtiene todas las definiciones de indicadores guardadas.
 * @returns {Array} Lista de todas las definiciones de indicadores.
 */
const getAllDefinitions = () => {
  // La estructura de datos esperada es un objeto con claves RIF,
  // por lo que los indicadores se guardan directamente como un array.
  const definitions = Storage.getStorage(INDICATOR_STORAGE_KEY) || [];
  return definitions;
};

/**
 * Obtiene solo los indicadores que están en estatus 'PRODUCCIÓN'.
 * Estos son los únicos que deben estar disponibles para usarse en un dashboard o reporte.
 * @returns {Array} Lista de indicadores en estatus PRODUCCIÓN.
 */
const getProductionDefinitions = () => {
  const allDefinitions = getAllDefinitions();
  return allDefinitions.filter((def) => def.estatus === "PRODUCCIÓN");
};

/**
 * Renderiza la lista de indicadores disponibles (PRODUCCIÓN) como checkboxes
 * en el modal de edición del dashboard, y marca aquellos que ya están seleccionados.
 *
 * @param {string} containerId - ID del contenedor (ej: 'available-indicators-list').
 * @param {Array<string>} selectedIds - IDs de los indicadores ya seleccionados en el dashboard.
 */
const renderAndCheckIndicators = (containerId, selectedIds = []) => {
  const container = document.getElementById(containerId);
  if (!container) return;

  const productionIndicators = getProductionDefinitions();

  if (productionIndicators.length === 0) {
    container.innerHTML =
      '<p class="text-warning">⚠️ No hay indicadores en estatus **PRODUCCIÓN** disponibles para usar.</p>';
    return;
  }

  let html = "";
  productionIndicators.forEach((indicator) => {
    // Verificar si el indicador actual está en la lista de seleccionados
    const isChecked = selectedIds.includes(indicator.idIndicador)
      ? "checked"
      : "";
    const idHtml = `indicator-checkbox-${indicator.idIndicador}`;

    html += `
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="${indicator.idIndicador}" id="${idHtml}" ${isChecked}>
                <label class="form-check-label" for="${idHtml}">
                    <strong>${indicator.nombre}</strong> <span class="text-muted">(${indicator.idIndicador} - ${indicator.tipoGrafico})</span>
                </label>
            </div>
        `;
  });

  container.innerHTML = html;
};

// ----------------------------------------------------------
// Exportar las funciones para que sean accesibles desde otros módulos
// ----------------------------------------------------------
export {
  getAllDefinitions,
  getProductionDefinitions,
  renderAndCheckIndicators,
};
