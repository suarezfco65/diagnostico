// reports.js
import { PARROQUIAS_CARACAS } from "./data.js";
import Auth from "./auth.js";
import * as Storage from "./storage.js"; // Asumimos que showAlert está en storage.js

// reports.js (Función de Utilidad para Totalizar Personal)

/**
 * Calcula el total de personal basado en la sección y rol especificados.
 * @param {Object} data - El registro completo del centro de salud.
 * @param {string} section - La sección del personal (ej: 'administrativo', 'obrero', etc.). Usa '' para todas las secciones.
 * @param {string} role - El rol del personal (ej: 'cardiologia', 'cirugia', etc.). Usa '' para todos los roles.
 * @param {string} valueType - El tipo de valor a sumar ('disponible' o 'requerido').
 * @returns {number} El total de personal basado en los parámetros dados.
 */
const totalPersonal = (
  data,
  section = "",
  role = "",
  valueType = "disponible"
) => {
  const personal = data.personalInstitucion;
  if (!personal) return 0;

  let total = 0;

  // Iterar sobre las secciones de personal
  for (const sec in personal) {
    // Si se especifica una sección, continuar solo si coincide
    if (section && sec !== section) continue;

    // Iterar sobre las claves de cada sección
    for (const r in personal[sec]) {
      // Si se especifica un rol, continuar solo si coincide
      if (role && r !== role) continue;

      // Asegurarse de que el objeto tiene la clave 'disponible' o 'requerido'
      if (personal[sec][r] && typeof personal[sec][r][valueType] === "number") {
        total += personal[sec][r][valueType];
      }
    }
  }
  return total;
};

// Lista de reportes disponibles organizados por sección
const REPORT_DEFINITIONS_BY_SECTION = {
  // Reportes de la Sección I: Datos de la Institución
  I: [
    {
      id: "inst_general",
      label: "Datos Generales de la Institución",
      fields: [
        // ❗ NUEVOS CAMPOS A MOSTRAR ❗
        { key: "identificador", label: "ID / RIF" },
        { key: "datosInstitucion.nombre", label: "Nombre Institución" },
        { key: "datosInstitucion.tipoInstitucion", label: "Tipo" },
        { key: "datosInstitucion.parroquia", label: "Parroquia" },
      ],
      searchFields: [
        "identificador",
        "datosInstitucion.nombre",
        "datosInstitucion.parroquia",
        "datosInstitucion.tipoInstitucion",
      ],
      compoundFilters: [
        {
          key: "datosInstitucion.parroquia",
          label: "Filtrar por Parroquia",
          type: "string",
          options: PARROQUIAS_CARACAS.sort(), // Usar las parroquias como opciones
        },
        {
          key: "datosInstitucion.tipoInstitucion",
          label: "Tipo de Institución",
          type: "string",
          options: ["HOSPITAL I", "HOSPITAL II", "A.S.I.C.", "OTRO_TIPO"],
        },
      ],
    },
    {
      id: "inst_ente",
      label: "Instituciones por Ente Adscrito",
      fields: [
        { key: "identificador", label: "ID / RIF" },
        { key: "datosInstitucion.nombre", label: "Nombre" },
        { key: "datosInstitucion.enteAdscrito", label: "Ente Adscrito" },
        { key: "datosInstitucion.parroquia", label: "Parroquia" },
      ],
      searchFields: [
        "identificador",
        "datosInstitucion.nombre",
        "datosInstitucion.enteAdscrito",
        "datosInstitucion.parroquia",
      ],
    },
  ],
  // Reportes de la Sección II: Autoridades
  II: [
    {
      id: "aut_contacto_director",
      label: "Contacto Director/a",
      fields: [
        { key: "identificador", label: "ID / RIF" },
        { key: "datosInstitucion.nombre", label: "Institución" },
        { key: "autoridades.director.nombre", label: "Director/a" },
        { key: "autoridades.director.celular", label: "Celular" },
        { key: "autoridades.director.correo", label: "Correo" },
      ],
      searchFields: [
        "identificador",
        "datosInstitucion.nombre",
        "autoridades.director.nombre",
        "autoridades.director.celular",
        "autoridades.director.correo",
      ],
    },
  ],
  // Reportes de la Sección III: Personal
  III: [
    {
      id: "pers_total_disp",
      label: "Total de Personal por Centro",
      fields: [
        { key: "datosInstitucion.nombre", label: "Institución" },
        { key: "datosInstitucion.parroquia", label: "Parroquia" },
        { key: totalPersonal, label: "Centro (D)" },
        {
          key: (data) => totalPersonal(data, "", "", "requerido"),
          label: "Centro (R)",
        },
        {
          key: (data) =>
            totalPersonal(data, "servicios-medicos", "", "disponible"),
          label: "Servicios Médicos (D)",
        },
        {
          key: (data) =>
            totalPersonal(data, "servicios-medicos", "", "requerido"),
          label: "Servicios Médicos (R)",
        },
      ],
      searchFields: ["datosInstitucion.nombre", "datosInstitucion.parroquia"],
      compoundFilters: [
        {
          key: "personalInstitucion.medico.medicoGral.disponible",
          label: "Médicos Generales Disponibles",
          type: "numeric",
        },
        {
          key: "personalInstitucion.medico.medicoGral.requerido",
          label: "Médicos Generales Requeridos",
          type: "numeric",
        },
      ],
    },
    { id: "pers_deficit", label: "Personal con Déficit (>20%)" },
    { id: "pers_completo", label: "Centros con Personal Completo" },
  ],
  // Reportes de la Sección IV: Servicios Médicos
  IV: [
    { id: "serv_activos", label: "Servicios Médicos Activos" },
    { id: "serv_inactivos", label: "Servicios Médicos Inactivos" },
    { id: "serv_prob", label: "Servicios Activos con Problemas" },
  ],
  // Reportes de la Sección V: Otros Servicios
  V: [
    { id: "otros_img_disp", label: "Disponibilidad de Imagenología" },
    { id: "otros_lab_disp", label: "Disponibilidad de Laboratorio" },
  ],
  // Reportes de la Sección VI: Infraestructura
  VI: [
    { id: "infra_cond_malas", label: "Áreas con Malas Condiciones" },
    { id: "infra_serv_sin", label: "Centros sin Servicios Públicos" },
    {
      id: "infra_servicios",
      label: "Disponibilidad de Servicios Públicos",
      compoundFilters: [
        {
          key: "infraestructura.serviciosPublicos.agua.estado",
          label: "Servicio de Agua Activo",
          type: "boolean",
        },
      ],
    },
  ],
  // Reportes de la Sección VII: Proyectos
  VII: [
    { id: "proy_existentes", label: "Proyectos Registrados por Área" },
    { id: "proy_cero", label: "Centros sin Proyectos" },
  ],
};

// Array de las claves de las secciones para iteración
const SECTIONS = Object.keys(REPORT_DEFINITIONS_BY_SECTION);

const ReportsModule = (() => {
  const reportsContent = document.getElementById("reports-content");
  const welcomeMessage = document.getElementById("welcome-message");
  const logoutBtn = document.getElementById("logout-btn");
  const reportSelect = document.getElementById("report-select");
  const parroquiaFilter = document.getElementById("parroquia-filter");
  const generateBtn = document.getElementById("generate-report-btn");
  const reportDataOutput = document.getElementById("report-data-output");

  // =============================
  // LÓGICA DE AUTENTICACIÓN
  // =============================

  const initAuthInterface = () => {
    const user = Auth.getCurrentUser();

    if (user) {
      // Usuario autenticado
      welcomeMessage.textContent = `Bienvenido, ${user}`;
      reportsContent.classList.remove("d-none");
    } else {
      // Usuario no autenticado
      Auth.requireAuth();
    }
  };

  const handleLogout = () => {
    Auth.logout();
    window.location.href = "login.html"; // Redirigir al nuevo login
  };

  // =============================
  // LÓGICA DE REPORTES
  // =============================

  /**
   * Rellena todos los selects de Reportes con los indicadores definidos.
   */
  const renderReportSelect = () => {
    SECTIONS.forEach((sectionKey) => {
      const selectElement = document.getElementById(
        `report-select-${sectionKey}`
      );
      if (!selectElement) return;

      const definitions = REPORT_DEFINITIONS_BY_SECTION[sectionKey];

      let htmlOptions =
        '<option value="" disabled selected>Seleccione un indicador...</option>';
      definitions.forEach((def) => {
        htmlOptions += `<option value="${def.id}">${def.label}</option>`;
      });

      selectElement.innerHTML = htmlOptions;
    });
  };

  /**
   * Rellena el select de Parroquias para el filtro en todos los tabs.
   */
  const renderParroquiaFilter = () => {
    const htmlOptions = PARROQUIAS_CARACAS.map(
      (parroquia) => `<option value="${parroquia}">${parroquia}</option>`
    ).join("");

    const finalHtml = `<option value="TODAS" selected>Todas las Parroquias</option>${htmlOptions}`;

    // Llenar todos los selects de parroquia (usan el mismo ID + sección)
    SECTIONS.forEach((sectionKey) => {
      const filterElement = document.getElementById(
        `parroquia-filter-${sectionKey}`
      );
      if (filterElement) {
        filterElement.innerHTML = finalHtml;
      }
    });

    // Llenar el primer filtro por si el ID original se mantuvo:
    const originalFilter = document.getElementById("parroquia-filter");
    if (originalFilter) {
      originalFilter.innerHTML = finalHtml;
    }
  };

  /**
   * Obtiene un valor de un registro, ya sea mediante una ruta anidada (string)
   * o ejecutando una función de cálculo (function).
   * @param {Object} data - El registro completo del centro de salud.
   * @param {string | Function} pathOrFunction - La ruta de la propiedad o la función a ejecutar.
   * @returns {*} El valor resultante o una cadena vacía.
   */
  const getReportValue = (data, pathOrFunction) => {
    // 1. Caso: El campo es una FUNCIÓN
    if (typeof pathOrFunction === "function") {
      try {
        // Ejecutar la función, pasándole el objeto de datos completo
        return pathOrFunction(data);
      } catch (e) {
        console.error("Error al ejecutar función de reporte:", e);
        return "ERROR";
      }
    }

    // 2. Caso: El campo es una RUTA (string)
    if (typeof pathOrFunction === "string") {
      const path = pathOrFunction;
      const value = path.split(".").reduce((acc, part) => {
        return acc && acc[part] !== undefined ? acc[part] : null;
      }, data);

      // Devolver el valor encontrado, o una cadena vacía si fue null
      return value !== null ? value : "";
    }

    return "";
  };

  /**
   * Función que aplica todos los filtros compuestos activos a una lista de instituciones.
   * @param {Array} allInstitutions - Lista completa de instituciones.
   * @param {Object} reportDefinition - Definición del reporte activo.
   * @returns {Array} La lista de instituciones filtrada.
   */
  const applyCompoundFilters = (allInstitutions, reportDefinition) => {
    // No hay filtros activos o no hay filtros definidos para este reporte
    if (
      Object.keys(ACTIVE_COMPOUND_FILTERS).length === 0 ||
      !reportDefinition.compoundFilters
    ) {
      return allInstitutions;
    }

    const filterDefs = reportDefinition.compoundFilters;

    return allInstitutions.filter((data) => {
      // Asumir que la institución pasa hasta que un filtro falle
      for (const key in ACTIVE_COMPOUND_FILTERS) {
        const filterValue = ACTIVE_COMPOUND_FILTERS[key];
        const filterDef = filterDefs.find((f) => f.key === key);

        // Si no hay definición o el valor del filtro está vacío, se salta
        if (!filterDef || !filterValue) continue;

        // Obtener el valor de la institución usando la clave/ruta
        const dataValue = getReportValue(data, key);

        // --- 1. Filtrado por STRING (Select) ---
        if (
          filterDef.type === "string" &&
          filterValue &&
          String(dataValue) !== filterValue
        ) {
          return false; // No pasa
        }

        // --- 2. Filtrado por BOOLEAN (Select) ---
        if (filterDef.type === "boolean" && filterValue) {
          // filterValue es 'true' o 'false' (string). dataValue es booleano o string.
          const expected = filterValue === "true";
          const actual = dataValue === true || dataValue === "true";
          if (actual !== expected) {
            return false; // No pasa
          }
        }

        // --- 3. Filtrado por NUMERIC o DATE (Rango) ---
        if (
          (filterDef.type === "numeric" || filterDef.type === "date") &&
          (filterValue.min || filterValue.max)
        ) {
          // Convertir el valor del dato a número (o fecha, si aplica)
          const numDataValue = Number(dataValue);
          const min = filterValue.min ? Number(filterValue.min) : null;
          const max = filterValue.max ? Number(filterValue.max) : null;

          // Aplicar rango mínimo
          if (min !== null && numDataValue < min) {
            return false; // No pasa
          }
          // Aplicar rango máximo
          if (max !== null && numDataValue > max) {
            return false; // No pasa
          }
        }
      }

      return true; // Pasa todos los filtros
    });
  };

  /**
   * Función central que determina el contexto (sección y valores) y llama a generateReport.
   * @param {string} sectionKey - Clave de la sección activa (I, II, III, etc.).
   */
  const executeReportLogic = (sectionKey) => {
    // 1. Obtener los elementos de la sección
    const reportSelect = document.getElementById(`report-select-${sectionKey}`);
    const searchInput = document.getElementById(`search-filter-${sectionKey}`);

    if (!reportSelect || !searchInput) {
      // En un entorno dinámico, esto es una alerta de desarrollo
      console.error(`Elementos de la sección ${sectionKey} no encontrados.`);
      return;
    }

    const reportId = reportSelect.value;
    const searchString = searchInput.value || "";

    // 2. Si no hay reporte seleccionado, no generar nada.
    if (!reportId || reportId === "") {
      // Opcional: limpiar la zona de resultados
      document.getElementById("report-data-output").innerHTML = "";
      document.getElementById("report-title-output").textContent = "";
      document.getElementById("initial-message").classList.remove("d-none");
      return;
    }

    // 3. Llamar a la función principal de generación
    generateReport(reportId, sectionKey, searchString);
  };

  // reports.js (Función generateReport adaptada)

  /**
   * Genera el reporte seleccionado y lo muestra en la interfaz.
   * @param {string} reportId - ID del indicador a generar.
   * @param {string} sectionKey - Clave de la sección (I, II, III, etc.).
   * @param {string} searchString - Nuevo: Texto ingresado en el filtro de búsqueda.
   */
  const generateReport = (reportId, sectionKey, searchString) => {
    // Buscar la definición del reporte en el mapa
    const reportDefinition = REPORT_DEFINITIONS_BY_SECTION[sectionKey]?.find(
      (def) => def.id === reportId
    );

    // ... [El resto de la lógica de validación es similar] ...

    if (!reportId || !reportDefinition) {
      Storage.showAlert(
        "Por favor, seleccione un indicador para generar el reporte.",
        "alert-warning"
      );
      return;
    }

    // Asegurarse de que el output esté limpio y el título actualizado
    document.getElementById(
      "report-title-output"
    ).textContent = `[${sectionKey}] ${reportDefinition.label}`;
    document.getElementById("report-data-output").innerHTML = "";
    document.getElementById("initial-message").classList.add("d-none"); // Ocultar el mensaje inicial

    let allInstitutions = Storage.getStorage() || [];

    // -----------------------------------------------------------
    // ❗ 1. APLICACIÓN DE FILTROS COMPUESTOS ❗
    // -----------------------------------------------------------
    allInstitutions = applyCompoundFilters(allInstitutions, reportDefinition);

    // -----------------------------------------------------------
    // 2. LÓGICA DE FILTRADO POR BÚSQUEDA GENERAL (existente)
    // -----------------------------------------------------------
    // Obtener los campos de búsqueda definidos para este reporte
    const searchFields = reportDefinition.searchFields || [];
    const normalizedSearch = searchString.trim().toLowerCase();

    if (normalizedSearch.length > 0 && searchFields.length > 0) {
      allInstitutions = allInstitutions.filter((data) => {
        // Verificar si alguno de los searchFields contiene el texto de búsqueda
        return searchFields.some((fieldKey) => {
          // Usar la función de utilidad para obtener el valor del campo
          const value = getReportValue(data, fieldKey);
          if (value !== null && value !== undefined) {
            // Convertir a string y verificar la coincidencia
            return String(value).toLowerCase().includes(normalizedSearch);
          }
          return false;
        });
      });
      Storage.showAlert(
        `Filtro aplicado: **"${searchString}"** (${allInstitutions.length} centros)`,
        "alert-info"
      );
    } else {
      Storage.showAlert(
        `Total de centros antes de la búsqueda: ${allInstitutions.length}`,
        "alert-info"
      );
    }

    // Variable global para guardar los filtros activos
    let ACTIVE_COMPOUND_FILTERS = {};
    let ACTIVE_SECTION_FOR_MODAL = null;

    /**
     * Genera el HTML para los inputs del filtro compuesto basado en la definición del reporte.
     * @param {Array} filters - Array de definiciones de filtros (compoundFilters).
     */
    const renderCompoundFilterInputs = (filters) => {
      let html = "";

      filters.forEach((filter, index) => {
        const filterId = `comp-filter-${filter.key.replace(/\./g, "-")}`;

        // Contenedor base para cada filtro
        html += `
                <div class="mb-3 p-3 border rounded">
                    <label for="${filterId}" class="form-label fw-bold">${filter.label}:</label>
            `;

        // --- 1. STRING (Menú desplegable) ---
        if (filter.type === "string" && filter.options) {
          html += `<select class="form-select comp-filter-input" data-filter-key="${filter.key}" data-filter-type="${filter.type}" id="${filterId}">`;
          html += `<option value="">-- Sin Filtro --</option>`;
          filter.options.forEach((option) => {
            const selected =
              ACTIVE_COMPOUND_FILTERS[filter.key] === option ? "selected" : "";
            html += `<option value="${option}" ${selected}>${option}</option>`;
          });
          html += `</select>`;
        }

        // --- 2. NUMERIC o DATE (Rango) ---
        else if (filter.type === "numeric" || filter.type === "date") {
          const currentMin = ACTIVE_COMPOUND_FILTERS[filter.key]
            ? ACTIVE_COMPOUND_FILTERS[filter.key].min
            : "";
          const currentMax = ACTIVE_COMPOUND_FILTERS[filter.key]
            ? ACTIVE_COMPOUND_FILTERS[filter.key].max
            : "";
          const type = filter.type === "date" ? "date" : "number"; // Usar input type date o number

          html += `
                    <div class="row">
                        <div class="col-6">
                            <label for="${filterId}-min" class="form-label">Mínimo:</label>
                            <input type="${type}" class="form-control comp-filter-input-range" data-filter-key="${filter.key}" data-filter-type="${filter.type}" data-range-part="min" id="${filterId}-min" value="${currentMin}" placeholder="Mínimo">
                        </div>
                        <div class="col-6">
                            <label for="${filterId}-max" class="form-label">Máximo:</label>
                            <input type="${type}" class="form-control comp-filter-input-range" data-filter-key="${filter.key}" data-filter-type="${filter.type}" data-range-part="max" id="${filterId}-max" value="${currentMax}" placeholder="Máximo">
                        </div>
                    </div>
                `;
        }

        // --- 3. BOOLEAN (True/False/Ambos) ---
        else if (filter.type === "boolean") {
          const currentValue = ACTIVE_COMPOUND_FILTERS[filter.key] || "";
          html += `<select class="form-select comp-filter-input" data-filter-key="${filter.key}" data-filter-type="${filter.type}" id="${filterId}">`;
          html += `<option value="">-- Ambos (Sin Filtro) --</option>`;
          html += `<option value="true" ${
            currentValue === "true" ? "selected" : ""
          }>Sí / Activo</option>`;
          html += `<option value="false" ${
            currentValue === "false" ? "selected" : ""
          }>No / Inactivo</option>`;
          html += `</select>`;
        }

        html += `</div>`; // Cierre del mb-3 p-3
      });

      document.getElementById("compound-filter-inputs-container").innerHTML =
        html;
    };

    // ❗ Nueva Función: Recolectar filtros del modal ❗
    const collectCompoundFilters = () => {
      const newFilters = {};
      const form = document.getElementById("compound-filter-form");

      // 1. Recolectar filtros de tipo STRING y BOOLEAN (selects)
      form.querySelectorAll(".comp-filter-input").forEach((select) => {
        if (select.value) {
          newFilters[select.dataset.filterKey] = select.value;
        }
      });

      // 2. Recolectar filtros de tipo NUMERIC y DATE (rangos)
      form.querySelectorAll(".comp-filter-input-range").forEach((input) => {
        const key = input.dataset.filterKey;
        const part = input.dataset.rangePart; // 'min' o 'max'
        const value = input.value.trim();

        if (value) {
          if (!newFilters[key]) {
            newFilters[key] = { min: "", max: "" };
          }
          newFilters[key][part] = value;
        }
      });

      ACTIVE_COMPOUND_FILTERS = newFilters;
      return newFilters;
    };

    // Por simplicidad, solo se actualiza la tabla de ejemplo de la Sección I
    if (allInstitutions.length === 0) {
      reportDataOutput.innerHTML = `<div class="alert alert-danger" role="alert">No hay datos para esta selección y filtro.</div>`;
      return;
    }

    // -----------------------------------------------------------
    // Lógica de Generación de Tabla DÍNÁMICA
    // -----------------------------------------------------------

    // 1. Obtener los campos a mostrar desde la definición del reporte
    const fieldsToDisplay = reportDefinition.fields || [];

    // 2. Construir los encabezados (<thead>)
    let headerHtml = "<tr><th>#</th>"; // # es el índice
    fieldsToDisplay.forEach((field) => {
      headerHtml += `<th>${field.label}</th>`;
    });
    headerHtml += "</tr>";

    // 3. Construir el cuerpo de la tabla (<tbody>)
    let bodyHtml = "";
    allInstitutions.forEach((data, index) => {
      let rowHtml = `<tr><td>${index + 1}</td>`;

      // Iterar sobre los campos definidos y extraer el valor anidado o ejecutar la función
      fieldsToDisplay.forEach((field) => {
        // ❗ LLAMADA A LA FUNCIÓN ACTUALIZADA ❗
        const value = getReportValue(data, field.key);
        rowHtml += `<td>${value}</td>`;
      });

      rowHtml += "</tr>";
      bodyHtml += rowHtml;
    });

    // 4. Construir la tabla completa
    const htmlTable = `
        <p>Total de registros encontrados: <strong>${allInstitutions.length}</strong></p>
        <div class="table-responsive">
            <table class="table table-striped table-hover table-sm">
                <thead class="table-dark">
                    ${headerHtml}
                </thead>
                <tbody>
                    ${bodyHtml}
                </tbody>
            </table>
        </div>
    `;
    // -----------------------------------------------------------
    // ❗ 3. GENERACIÓN DE LEYENDA (Al final de la generación del reporte) ❗
    // -----------------------------------------------------------
    generateFilterLegend(reportDefinition);

    document.getElementById("report-data-output").innerHTML = htmlTable;
    // -----------------------------------------------------------
  };

  // reports.js (Dentro del módulo ReportsModule)

  /**
   * Genera la leyenda HTML de los filtros compuestos actualmente activos.
   * @param {Object} reportDefinition - Definición del reporte activo para obtener labels.
   */
  const generateFilterLegend = (reportDefinition) => {
    const activeFilters = ACTIVE_COMPOUND_FILTERS;
    const filterDefs = reportDefinition.compoundFilters || [];
    const legendContainer = document.getElementById("compound-filter-legend");
    if (!legendContainer) return;

    let legendHtml = "";
    let filterCount = 0;

    for (const key in activeFilters) {
      const value = activeFilters[key];
      const def = filterDefs.find((f) => f.key === key);

      // El filtro debe estar definido y tener un valor real
      if (!def || !value) continue;

      let displayValue = "";

      // --- Tipo STRING (Select) ---
      if (def.type === "string" && value) {
        displayValue = `**${value}**`;
        filterCount++;
      }
      // --- Tipo BOOLEAN (Select) ---
      else if (def.type === "boolean" && value) {
        // value será 'true' o 'false' (string)
        displayValue = value === "true" ? "Sí / Activo" : "No / Inactivo";
        displayValue = `**${displayValue}**`;
        filterCount++;
      }
      // --- Tipo NUMERIC/DATE (Rango) ---
      else if (
        (def.type === "numeric" || def.type === "date") &&
        (value.min || value.max)
      ) {
        const min = value.min || "Mínimo";
        const max = value.max || "Máximo";
        displayValue = `desde **${min}** hasta **${max}**`;
        filterCount++;
      } else {
        // Caso de rangos vacíos o valores no reconocidos
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
  // reports.js (Función init modificada)

  const init = () => {
    // 1. Inicializar la interfaz de autenticación
    initAuthInterface();

    // 2. Cargar listas de reportes
    renderReportSelect();

    // 3. Configurar Listeners y Estados Iniciales
    if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);

    // Configurar el modal (Fuera del loop de SECTIONS)
    const modalElement = document.getElementById("compoundFilterModal");
    const applyFiltersBtn = document.getElementById(
      "apply-compound-filters-btn"
    );
    const clearFiltersBtn = document.getElementById(
      "clear-compound-filters-btn"
    );
    const modalTitleSpan = document.getElementById("filter-modal-report-title");

    // Listener para cuando el modal se muestra (antes de que se muestre totalmente)
    if (modalElement) {
      modalElement.addEventListener("show.bs.modal", (e) => {
        const sectionKey = e.relatedTarget.dataset.section;
        ACTIVE_SECTION_FOR_MODAL = sectionKey;

        const reportSelect = document.getElementById(
          `report-select-${sectionKey}`
        );
        const reportId = reportSelect.value;

        const reportDefinition = REPORT_DEFINITIONS_BY_SECTION[sectionKey].find(
          (r) => r.id === reportId
        );

        if (
          !reportDefinition ||
          !reportDefinition.compoundFilters ||
          reportDefinition.compoundFilters.length === 0
        ) {
          // Si no hay filtros definidos, mostrar un mensaje
          document.getElementById(
            "compound-filter-inputs-container"
          ).innerHTML =
            '<p class="alert alert-warning">No hay filtros compuestos definidos para este reporte.</p>';
          modalTitleSpan.textContent = "Error";
          // Prevenir mostrar el modal si es posible, o deshabilitar Apply
          applyFiltersBtn.disabled = true;
          return;
        }

        // Renderizar los inputs
        modalTitleSpan.textContent = reportDefinition.label;
        renderCompoundFilterInputs(reportDefinition.compoundFilters);
        applyFiltersBtn.disabled = false;
      });
    }

    // Listener del botón Aplicar
    if (applyFiltersBtn) {
      applyFiltersBtn.addEventListener("click", () => {
        collectCompoundFilters(); // Recolecta los filtros del modal y actualiza la global
        // Cerrar el modal (Bootstrap JS manejará el cierre al hacer clic)
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide();

        // Re-ejecutar la lógica de reporte con los nuevos filtros
        executeReportLogic(ACTIVE_SECTION_FOR_MODAL);
      });
    }

    // Listener del botón Limpiar
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener("click", () => {
        ACTIVE_COMPOUND_FILTERS = {}; // Limpiar la variable global
        // Re-ejecutar la lógica de reporte sin filtros compuestos
        executeReportLogic(ACTIVE_SECTION_FOR_MODAL);
        // El modal se cierra por el data-bs-dismiss="modal"
      });
    }

    // Iterar sobre todas las secciones (I a VII)
    SECTIONS.forEach((sectionKey) => {
      const reportSelect = document.getElementById(
        `report-select-${sectionKey}`
      );
      const searchInput = document.getElementById(
        `search-filter-${sectionKey}`
      );
      const filterBtn = document.getElementById(
        `compound-filter-btn-${sectionKey}`
      );

      if (reportSelect) {
        reportSelect.addEventListener("change", (e) => {
          const isReportSelected = e.target.value !== "";

          // ❗ SOLUCIÓN: LIMPIAR EL CAMPO DE BÚSQUEDA AL CAMBIAR EL REPORTE ❗
          if (isReportSelected) {
            searchInput.value = ""; // 👈 Reiniciar la búsqueda
          }

          // Activar/Desactivar el campo de búsqueda
          searchInput.disabled = !isReportSelected;

          // ❗ Limpiar los filtros compuestos al cambiar el reporte ❗
          ACTIVE_COMPOUND_FILTERS = {};

          // Activar/Desactivar el botón de filtro compuesto
          filterBtn.disabled = e.target.value === "";

          // Ejecutar la lógica de reporte
          executeReportLogic(sectionKey);

          if (isReportSelected) {
            searchInput.focus(); // Dar foco al campo después de generar
          }
        });
      }
      if (filterBtn) {
        // Desactivar el botón de filtro compuesto inicialmente
        filterBtn.disabled = true;
      }

      if (searchInput) {
        // ❗ 2. FILTRADO DINÁMICO EN TIEMPO REAL (input event) ❗
        searchInput.addEventListener("input", () => {
          // Ejecutar la lógica de reporte al escribir (filtrado)
          executeReportLogic(sectionKey);
        });

        // ❗ 3. DESACTIVACIÓN INICIAL DEL CAMPO DE BÚSQUEDA ❗
        searchInput.disabled = true;
      }
    });

    // 4. Configurar listener para el cambio de tab (para activar/desactivar elementos)
    // Esto asegura que al cambiar de tab, el estado se refleja correctamente
    const tabList = document.getElementById("reportTabs");
    if (tabList) {
      tabList.addEventListener("shown.bs.tab", (e) => {
        const activeTabId = e.target.getAttribute("data-bs-target"); // Ej: #tab-I
        const activeSectionKey = activeTabId.replace("#tab-", ""); // Ej: I

        // Re-evaluar el estado del filtro de búsqueda en el tab activo
        const activeReportSelect = document.getElementById(
          `report-select-${activeSectionKey}`
        );
        const activeSearchInput = document.getElementById(
          `search-filter-${activeSectionKey}`
        );

        if (activeSearchInput) {
          // Desactivar si no hay reporte seleccionado
          activeSearchInput.disabled = activeReportSelect.value === "";
        }

        // Opcional: Generar el reporte del tab activo si ya tenía uno seleccionado
        if (activeReportSelect.value !== "") {
          executeReportLogic(activeSectionKey);
        }
      });
    }
  };

  return {
    init,
  };
})();

// Iniciar el módulo de reportes
document.addEventListener("DOMContentLoaded", ReportsModule.init);
