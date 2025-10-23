// indicator_definitions.js

import Auth from "./auth.js";
import * as Storage from "./storage.js";

// Clave para guardar las definiciones de indicadores
const INDICATOR_STORAGE_KEY = "siscomres_indicator_definitions";

// Estructura conocida de los campos disponibles en los datos de diagnóstico.
// Esto permite llenar el SELECT del Eje X de forma dinámica.
const AVAILABLE_DATA_FIELDS = [
  { label: "Parroquia", key: "datosInstitucion.parroquia", type: "text" },
  {
    label: "Tipo de Institución",
    key: "datosInstitucion.tipoInstitucion",
    type: "text",
  },
  {
    label: "Ente Adscrito",
    key: "datosInstitucion.enteAdscrito",
    type: "array",
  },
  {
    label: "Estatus de Cardiología",
    key: "serviciosMedicos.cardiologia",
    type: "text",
  },
  {
    label: "Estatus de Ginecología",
    key: "serviciosMedicos.ginecologia",
    type: "text",
  },
  {
    label: "Consultorios Operativos (SI/NO)",
    key: "infraestructura.condiciones.consultorios.operativo",
    type: "text",
  },
  {
    label: "Estado Infraestructura Consultorios",
    key: "infraestructura.condiciones.consultorios.estadoInfraestructura",
    type: "text",
  },
  {
    label: "Servicio de Agua",
    key: "infraestructura.serviciosPublicos.agua",
    type: "text",
  },
  // **NOTA:** Debe añadir aquí todos los campos de su estructura JSON que desea analizar.
];

const IndicatorModule = (() => {
  const designerContent = document.getElementById("indicator-designer-content");
  const welcomeMessage = document.getElementById("welcome-message");
  const indicatorForm = document.getElementById("indicator-form");
  const logoutBtn = document.getElementById("logout-btn");
  const ejeXSelect = document.getElementById("ejeX-variable");
  const viewDefinitionsBtn = document.getElementById("view-definitions-btn");
  const definitionsListContainer = document.getElementById(
    "definitions-list-container"
  );
  const definitionsList = document.getElementById("definitions-list");

  // =============================
  // LÓGICA DE AUTENTICACIÓN
  // =============================
  const initAuthInterface = () => {
    const user = Auth.getCurrentUser();
    if (user) {
      welcomeMessage.textContent = `Bienvenido, ${user}`;
      designerContent.classList.remove("d-none");
      // No hay formulario de login aquí, se requiere autenticación forzosa al inicio
    } else {
      // Si el usuario no está logueado, redirigir a login.html para el login
      Auth.requireAuth();
    }
  };

  const handleLogout = () => {
    Auth.logout();
    window.location.href = "login.html"; // Redirigir al login
  };

  // =============================
  // LÓGICA DE GUARDADO
  // =============================

  /**
   * Carga las variables de datos disponibles en el SELECT del Eje X.
   */
  const renderAvailableVariables = () => {
    let html =
      '<option value="" disabled selected>Seleccione una variable...</option>';
    AVAILABLE_DATA_FIELDS.forEach((field) => {
      html += `<option value="${field.key}">${field.label} (${field.key})</option>`;
    });
    ejeXSelect.innerHTML = html;
  };

  /**
   * Obtiene y parsea las definiciones de indicadores guardadas.
   * @returns {Object<string, Object>} Objeto indexado por idIndicador.
   */
  const getIndicatorDefinitions = () => {
    const data = localStorage.getItem(INDICATOR_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  };

  /**
   * Guarda la nueva definición de indicador.
   */
  const handleSaveIndicator = (e) => {
    e.preventDefault();

    const indicatorId = document.getElementById("indicator-id").value.trim();
    const indicatorStatus = document.getElementById("indicator-status").value;

    if (!indicatorId) {
      Storage.showAlert(
        "El ID Único del Indicador es obligatorio.",
        "alert-danger",
        "alert-container-indicator"
      );
      return;
    }

    const definition = {
      idIndicador: indicatorId,
      nombre: document.getElementById("indicator-name").value.trim(),
      tipoGrafico: document.getElementById("chart-type").value,

      // Datos de Procesamiento
      ejeX_variable: document.getElementById("ejeX-variable").value,
      ejeY_agregacion: document.getElementById("ejeY-agregacion").value,

      // Filtros (Asumiendo que es JSON)
      filtros: JSON.parse(
        document.getElementById("filtros-json").value || "{}"
      ),

      // Control de Estado
      estatus: indicatorStatus,
      fechaPublicacion:
        indicatorStatus === "PRODUCCIÓN" ? new Date().toISOString() : "",
      fechaCreacion: new Date().toISOString(),
    };

    const allDefinitions = getIndicatorDefinitions();

    // Guardar o Sobrescribir
    allDefinitions[indicatorId] = definition;
    localStorage.setItem(INDICATOR_STORAGE_KEY, JSON.stringify(allDefinitions));

    Storage.showAlert(
      `Definición del indicador **${definition.nombre}** (${indicatorId}) guardada con éxito. Estatus: **${indicatorStatus}**.`,
      "alert-success",
      "alert-container-indicator"
    );

    // Mostrar la lista actualizada
    renderDefinitionsList();
  };

  /**
   * Muestra la lista de todos los indicadores guardados en una tabla.
   */
  const renderDefinitionsList = () => {
    const definitions = Object.values(getIndicatorDefinitions());

    if (definitions.length === 0) {
      definitionsList.innerHTML = `<div class="alert alert-info">No hay indicadores definidos aún.</div>`;
      return;
    }

    let html = `
            <table class="table table-sm table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Tipo</th>
                        <th>Agrupación</th>
                        <th>Estatus</th>
                        <th>Creación</th>
                    </tr>
                </thead>
                <tbody>
        `;

    definitions.forEach((def) => {
      const statusClass =
        def.estatus === "PRODUCCIÓN" ? "text-success fw-bold" : "text-warning";
      html += `
                <tr>
                    <td>${def.idIndicador}</td>
                    <td>${def.nombre}</td>
                    <td>${def.tipoGrafico}</td>
                    <td>${def.ejeX_variable}</td>
                    <td class="${statusClass}">${def.estatus}</td>
                    <td>${new Date(def.fechaCreacion).toLocaleDateString()}</td>
                </tr>
            `;
    });

    html += `</tbody></table>`;
    definitionsList.innerHTML = html;
  };

  // =============================
  // INICIALIZACIÓN
  // =============================

  const init = () => {
    // 1. Verificar autenticación y mostrar interfaz
    initAuthInterface();

    // 2. Renderizar elementos dinámicos
    renderAvailableVariables();
    renderDefinitionsList();

    // 3. Configurar Listeners
    if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);
    if (indicatorForm)
      indicatorForm.addEventListener("submit", handleSaveIndicator);

    if (viewDefinitionsBtn) {
      viewDefinitionsBtn.addEventListener("click", () => {
        definitionsListContainer.classList.toggle("d-none");
      });
    }
  };

  return {
    init,
  };
})();

document.addEventListener("DOMContentLoaded", IndicatorModule.init);
