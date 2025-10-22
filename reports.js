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
  const loginInterface = document.getElementById("login-interface");
  const reportsContent = document.getElementById("reports-content");
  const welcomeMessage = document.getElementById("welcome-message");
  const loginForm = document.getElementById("login-form");
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
      loginInterface.classList.add("d-none");
      reportsContent.classList.remove("d-none");
    } else {
      // Usuario no autenticado
      reportsContent.classList.add("d-none");
      loginInterface.classList.remove("d-none");
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (Auth.login(username, password)) {
      // Login exitoso: Recargar la interfaz de reportes
      initAuthInterface();
    } else {
      Storage.showAlert(
        "Usuario o contraseña incorrectos.",
        "alert-danger",
        "login-alert-container"
      );
    }
  };

  const handleLogout = () => {
    Auth.logout();
    initAuthInterface(); // Volver a la interfaz de login
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
   * Función principal para generar el reporte seleccionado.
   */
  const generateReport = () => {
    const selectedId = reportSelect.value;
    if (!selectedId) {
      reportDataOutput.innerHTML = `<div class="alert alert-warning">Debe seleccionar un tipo de reporte.</div>`;
      return;
    }

    const allInstitutions = Object.values(Storage.getStorage());

    // El resto de la implementación de reportes requeriría mucha lógica de procesamiento
    // La implementación real deberá usar 'allInstitutions' para filtrar y contar.

    // Ejemplo de generación simple:
    const reportTitle = REPORT_DEFINITIONS.find(
      (r) => r.id === selectedId
    ).label;
    document.getElementById("report-title-output").textContent = reportTitle;

    if (allInstitutions.length === 0) {
      reportDataOutput.innerHTML = `<div class="alert alert-info">No hay instituciones registradas para generar el reporte.</div>`;
      return;
    }

    // --- Lógica de Reporte de Ejemplo (Instituciones Totales) ---
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
    if (loginForm) loginForm.addEventListener("submit", handleLogin);
    if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);
    if (generateBtn) generateBtn.addEventListener("click", generateReport);
  };

  return {
    init,
  };
})();

// Iniciar el módulo de reportes
document.addEventListener("DOMContentLoaded", ReportsModule.init);
