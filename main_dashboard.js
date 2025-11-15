// main_dashboard.js

import { getStorage } from "./storage.js";

const STORAGE_KEY = "siscomres_diagnostico_data";
let dataCentrosDeSalud = [];
let filteredData = []; // Almacena los datos filtrados actualmente
let currentDashboardScript = null; // Almacena el módulo del dashboard activo
let currentDashboardName = "operatividad"; // Dashboard inicial
// Nombres legibles para las áreas
const areaNames = {
  consultorios: "Consultorios",
  quirofanos: "Quirófanos",
  hospitalizacion: "Hospitalización",
  laboratorio: "Laboratorio",
  farmacia: "Farmacia",
  cocina: "Cocina",
};
// Colores para las condiciones
const conditionColors = {
  buenas: "#2ecc71", // Verde
  regulares: "#f39c12", // Amarillo
  malas: "#e74c3c", // Rojo
};

// Mapeo de pestañas a archivos de contenido HTML y JS
const dashboardMap = {
  operatividad: {
    html: "dashboard_content.html",
    js: "./dashboard.js",
    containerId: "operatividad",
  },
  infraestructura: {
    html: "dashboard-2_content.html",
    js: "./dashboard-2.js",
    containerId: "infraestructura",
  },
  // Agregue más dashboards aquí
};

// --- MODAL Y FILTROS COMPARTIDOS ---

function llenarFiltros() {
  const filtros = [
    {
      id: "filtroParroquia",
      key: "parroquia",
      defaultText: "-- Seleccionar Parroquia --",
    },
    {
      id: "filtroTipoInstitucion",
      key: "tipoInstitucion",
      defaultText: "-- Seleccionar Tipo --",
    },
    {
      id: "filtroEnteAdscrito",
      key: "enteAdscrito",
      defaultText: "-- Seleccionar Ente --",
    },
  ];

  filtros.forEach((filtro) => {
    const select = document.getElementById(filtro.id);

    // Obtener valores únicos del dataset completo
    const valoresUnicos = [
      ...new Set(
        dataCentrosDeSalud
          .map((d) => d.datosInstitucion?.[filtro.key])
          .filter((v) => v)
      ),
    ].sort((a, b) => a.localeCompare(b));

    // Limpiar opciones previas
    const currentValue = select.value;
    select.innerHTML = `<option value="">${filtro.defaultText}</option>`;

    valoresUnicos.forEach((valor) => {
      const option = document.createElement("option");
      option.value = valor;
      option.textContent = valor;
      select.appendChild(option);
    });
    // Restaurar valor previo para evitar la pérdida del filtro
    select.value = currentValue;
  });
}

/**
 * FUNCIÓN PRINCIPAL PARA APLICAR EL FILTRADO
 */
window.aplicarFiltros = function () {
  const filtroParr = document.getElementById("filtroParroquia").value;
  const filtroTipo = document.getElementById("filtroTipoInstitucion").value;
  const filtroEnte = document.getElementById("filtroEnteAdscrito").value;
  const filtroCadena = document
    .getElementById("filtroCadenaNombre")
    .value.toLowerCase();

  // 2. Aplicar la lógica de filtrado
  filteredData = dataCentrosDeSalud.filter((centro) => {
    const d = centro.datosInstitucion;

    if (!d) return false;

    const matchParr = !filtroParr || d.parroquia === filtroParr;
    const matchTipo = !filtroTipo || d.tipoInstitucion === filtroTipo;
    const matchEnte = !filtroEnte || d.enteAdscrito === filtroEnte;

    const nombreCentro = d.nombre ? d.nombre.toLowerCase() : "";
    const matchNombre = nombreCentro.includes(filtroCadena);

    return matchParr && matchTipo && matchEnte && matchNombre;
  });

  // 3. Renderizar el dashboard ACTIVO con los datos filtrados
  renderCurrentDashboard();
};

/**
 * FUNCIÓN PARA REINICIAR LOS FILTROS
 */
window.reiniciarFiltros = function () {
  document.getElementById("filtroParroquia").value = "";
  document.getElementById("filtroTipoInstitucion").value = "";
  document.getElementById("filtroEnteAdscrito").value = "";
  document.getElementById("filtroCadenaNombre").value = "";

  window.aplicarFiltros();
};

// --- GESTIÓN DE PESTAÑAS Y CONTENIDO ---

async function fetchDashboardContent(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error al cargar el contenido: ${url}`);
  }
  let html = await response.text();

  html = html.replace(
    /<!DOCTYPE[^>]*>|<html[^>]*>|<head>[\s\S]*?<\/head>|<body[^>]*>|<\/body>|<\/html>/gi,
    ""
  );

  html = html.replace(/<div class="dashboard-header">[\s\S]*?<\/div>\s*/i, "");
  html = html.replace(/<div class="card mb-4">[\s\S]*?<\/div>\s*/i, "");

  // Eliminar referencias a los scripts, ya que se cargarán dinámicamente
  html = html.replace(/<script[^>]*src="storage.js"[^>]*><\/script>/gi, "");
  html = html.replace(/<script[^>]*src="auth.js"[^>]*><\/script>/gi, "");
  html = html.replace(/<script[^>]*src="dashboard.js"[^>]*><\/script>/gi, "");
  html = html.replace(/<script[^>]*src="dashboard-2.js"[^>]*><\/script>/gi, "");
  html = html.replace(
    /<script[^>]*src="https:\/\/cdn.jsdelivr.net\/npm\/bootstrap[^>]*><\/script>/gi,
    ""
  );

  html = html.replace(/<style>[\s\S]*?<\/style>/i, "");

  return html;
}

/**
 * Carga el contenido HTML y el script JS para un dashboard específico.
 */
async function loadDashboard(dashboardKey) {
  const config = dashboardMap[dashboardKey];
  const container = document.getElementById(config.containerId);

  // 1. Cargar el HTML (inserta los contenedores, ej. 'gaugeContainer')
  try {
    const contentHTML = await fetchDashboardContent(config.html);
    container.innerHTML = contentHTML;
  } catch (error) {
    console.error(
      `Error al cargar el contenido HTML para ${dashboardKey}:`,
      error
    );
    container.innerHTML = `<div class="alert alert-danger">Error al cargar la visualización de ${config.containerId}.</div>`;
    return;
  }

  // 2. Cargar el script JS como módulo (Dynamic Import)
  try {
    currentDashboardScript = await import(config.js);
    currentDashboardName = dashboardKey;

    // *** CORRECCIÓN CRÍTICA PARA HIGHCHARTS ERROR #13 ***
    // Se usa setTimeout(..., 0) para diferir la llamada. Esto garantiza que el
    // navegador haya terminado de procesar el innerHTML y los elementos
    // como 'gaugeContainer' estén disponibles en el DOM.
    setTimeout(() => {
      renderCurrentDashboard();
    }, 0);
  } catch (error) {
    console.error(
      `Error al cargar o inicializar el script para ${dashboardKey}:`,
      error
    );
  }
}

/**
 * Llama a la función de inicialización del script de dashboard activo,
 * asegurándose de pasar o hacer accesibles los datos filtrados.
 */
function renderCurrentDashboard() {
  if (currentDashboardScript) {
    // La función initialize o renderDashboard debe recibir los datos
    if (currentDashboardScript.renderDashboard) {
      currentDashboardScript.renderDashboard(filteredData);
    } else if (currentDashboardScript.initialize) {
      // Intentar con la función initialize (que a su vez llama a renderDashboard)
      currentDashboardScript.initialize(filteredData);
    } else {
      console.warn(
        `Función de renderizado no encontrada para ${currentDashboardName}.`
      );
    }
  } else {
    // Si el script no está cargado, cargarlo.
    if (currentDashboardName) {
      loadDashboard(currentDashboardName);
    }
  }
}

// ----------------------------------------------------------------------
// --- INICIALIZACIÓN GLOBAL CORREGIDA ---
// ----------------------------------------------------------------------

/**
 * Inicialización global
 * Asegura que los datos se carguen ANTES de intentar renderizar.
 */
function initializeMainDashboard() {
  // 1. Obtener los datos completos
  dataCentrosDeSalud = getStorage(STORAGE_KEY) || [];

  // CLAVE: Inicialmente, filteredData debe ser igual a la dataCentrosDeSalud completa
  filteredData = dataCentrosDeSalud;

  // 2. Llenar los selectores de filtros del modal
  llenarFiltros();

  // 3. Configurar el cambio de pestañas para cargar los contenidos
  const tabTriggers = document.querySelectorAll("#dashboardTabs button");
  tabTriggers.forEach((trigger) => {
    trigger.addEventListener("shown.bs.tab", (event) => {
      const targetId = event.target
        .getAttribute("data-bs-target")
        .replace("#", "");
      loadDashboard(targetId);
    });
  });

  // 4. Cargar el dashboard por defecto (Operatividad)
  loadDashboard(currentDashboardName);
}

// Inicializar el dashboard principal cuando el documento esté completamente cargado
document.addEventListener("DOMContentLoaded", initializeMainDashboard);

// Exportar funciones para que los scripts de dashboards puedan llamarlas
export { filteredData, dataCentrosDeSalud, areaNames, conditionColors };
