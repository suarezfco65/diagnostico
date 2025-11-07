// reports.js
import { PARROQUIAS_CARACAS } from "./data.js";
import Auth from "./auth.js";
import * as Storage from "./storage.js"; // Asumimos que showAlert está en storage.js

// Lista de reportes disponibles (Usando la lista que me solicitaste)
const REPORT_DEFINITIONS = [
  { id: "inst_tipo", label: "Instituciones por Tipo" },
  { id: "inst_ente", label: "Instituciones por Ente Adscrito" },
  { id: "esp_activas", label: "Especialidades Médicas Activas" },
  // ... Agregar el resto de reportes aquí
  { id: "infra_consultorios", label: "Infraestructura de Consultorios" },
];

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
   * Rellena el select de tipos de reportes.
   */
  const renderReportSelect = () => {
    let html =
      '<option value="" disabled selected>Seleccione un reporte...</option>';
    REPORT_DEFINITIONS.forEach((def) => {
      html += `<option value="${def.id}">${def.label}</option>`;
    });
    reportSelect.innerHTML = html;
    // Nota: El bucle para las parroquias debe ir en la función renderParroquiaFilter.
  };

  /**
   * Implementación para rellenar el select de filtro por Parroquia.
   */
  const renderParroquiaFilter = () => {
    if (!parroquiaFilter) return; // Salir si el elemento no existe

    let html = '<option value="TODAS" selected>Todas las Parroquias</option>';

    // Verifica que el array se haya importado y tenga elementos
    if (PARROQUIAS_CARACAS && PARROQUIAS_CARACAS.length > 0) {
      PARROQUIAS_CARACAS.forEach((parroquia) => {
        html += `<option value="${parroquia}">${parroquia}</option>`;
      });
    }

    parroquiaFilter.innerHTML = html;
  };

  /**
   * Genera el reporte seleccionado y lo muestra en la interfaz.
   */
  const generateReport = () => {
    const reportId = reportSelect.value;
    const selectedParroquia = parroquiaFilter.value; // ❗ Obtener el filtro ❗
    const reportDefinition = REPORT_DEFINITIONS.find(
      (def) => def.id === reportId
    );

    if (!reportId || !reportDefinition) {
      Storage.showAlert(
        "Por favor, seleccione un indicador para generar el reporte.",
        "alert-warning"
      );
      return;
    }

    reportDataOutput.innerHTML = "";
    document.getElementById("report-title-output").textContent =
      reportDefinition.label;

    let allInstitutions = Storage.getStorage() || [];

    // =========================================================
    // ❗ LÓGICA DE FILTRADO POR PARROQUIA (IMPLEMENTADA) ❗
    // =========================================================
    if (selectedParroquia !== "TODAS") {
      allInstitutions = allInstitutions.filter(
        (data) => data.datosInstitucion.parroquia === selectedParroquia
      );
      Storage.showAlert(
        `Filtro aplicado: **${selectedParroquia}**. Total de centros después de filtrar: ${allInstitutions.length}`,
        "alert-info"
      );
    } else {
      Storage.showAlert(
        `Reporte generado para **Todas las Parroquias**. Total de centros: ${allInstitutions.length}`,
        "alert-info"
      );
    }

    // Si no hay datos después del filtro
    if (allInstitutions.length === 0) {
      reportDataOutput.innerHTML = `
        <div class="alert alert-danger" role="alert">
            No se encontraron centros registrados que cumplan con los criterios de filtro.
        </div>
      `;
      return;
    }

    // -----------------------------------------------------------
    // Lógica de Reporte de Ejemplo (Instituciones Totales)
    // -----------------------------------------------------------
    let htmlTable = `
            <p>Total de instituciones registradas: <strong>${allInstitutions.length}</strong></p>
            <table class="table table-striped">
                <thead><tr><th>#</th><th>Identificador</th><th>Nombre</th><th>Parroquia</th></tr></thead>
                <tbody>
        `;
    allInstitutions.forEach((data, index) => {
      htmlTable += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${data.identificador}</td>
                    <td>${data.datosInstitucion.nombre}</td>
                    <td>${data.datosInstitucion.parroquia}</td>
                </tr>
            `;
    });
    htmlTable += `</tbody></table>`;
    reportDataOutput.innerHTML = htmlTable;
    // -----------------------------------------------------------
  };
  // =============================
  // INICIALIZACIÓN
  // =============================

  const init = () => {
    // 1. Inicializar la interfaz de autenticación al cargar
    initAuthInterface();

    // 2. Cargar lista de reportes
    renderReportSelect();
    renderParroquiaFilter(); // LLAMADA ESENCIAL

    // 3. Configurar Listeners
    if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);
    if (generateBtn) generateBtn.addEventListener("click", generateReport);
  };

  return {
    init,
  };
})();

// Iniciar el módulo de reportes
document.addEventListener("DOMContentLoaded", ReportsModule.init);
