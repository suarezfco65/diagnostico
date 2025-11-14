// modules/table-generator.js - Generación de tablas
import { ReportDefinitions } from "./report-definitions.js"; // Intenta importar el default
import * as Storage from "../storage.js";

const TableGenerator = (() => {
  const EXPORT_BTN = document.getElementById("export-excel-btn"); // Obtener el botón globalmente
  const CHART_BTN = document.getElementById("chart-btn"); // Obtener el botón de gráfico
  const generateTable = (institutions, reportDefinition) => {
    if (institutions.length === 0) {
      showNoDataMessage();
      if (EXPORT_BTN) EXPORT_BTN.classList.add("d-none");
      if (CHART_BTN) CHART_BTN.classList.add("d-none");
      return;
    }

    const tableHTML = buildTableHTML(institutions, reportDefinition);
    document.getElementById("report-data-output").innerHTML = tableHTML;
    document.getElementById("initial-message").classList.add("d-none");

    updateReportTitle(reportDefinition);
    showResultCount(institutions.length);

    var popoverTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="popover"]')
    );
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
      return new bootstrap.Popover(popoverTriggerEl);
    });

    if (reportDefinition.chart) {
      reportDefinition.chart(institutions);
      // ❗ MOSTRAR BOTÓN DE GRÁFICO ❗
      if (CHART_BTN) CHART_BTN.classList.remove("d-none");
    } else {
      // OCULTAR BOTÓN DE GRÁFICO SI NO HAY GRÁFICO
      if (CHART_BTN) CHART_BTN.classList.add("d-none");
    }

    // ❗ MOSTRAR BOTÓN DE EXPORTACIÓN ❗
    if (EXPORT_BTN) EXPORT_BTN.classList.remove("d-none");
  };

  const buildTableHTML = (institutions, reportDefinition) => {
    const headers = buildTableHeaders(reportDefinition.fields);
    const rows = buildTableRows(institutions, reportDefinition.fields);

    return `
            <div class="table-responsive">
                <table class="table table-striped table-hover table-sm">
                    <thead class="table-dark" id="report-header">${headers}</thead>
                    <tbody id="report-rows">${rows}</tbody>
                </table>
            </div>
        `;
  };

  const buildTableHeaders = (fields) => {
    const headerCells = fields
      .map((field) => `<th>${field.label}</th>`)
      .join("");

    return `<tr><th>#</th>${headerCells}</tr>`;
  };

  const buildTableRows = (institutions, fields) => {
    return institutions
      .map((data, index) => {
        const cells = fields
          .map((field) => {
            const value = ReportDefinitions.getReportValue(data, field.key);
            return `<td>${value}</td>`;
          })
          .join("");

        return `<tr><td>${index + 1}</td>${cells}</tr>`;
      })
      .join("");
  };

  const clearResults = () => {
    document.getElementById("report-data-output").innerHTML = "";
    document.getElementById("report-title-output").textContent = "";
    document.getElementById("initial-message").classList.remove("d-none");
    // ❗ OCULTAR BOTÓN AL LIMPIAR ❗
    if (EXPORT_BTN) EXPORT_BTN.classList.add("d-none");
  };

  const showNoDataMessage = () => {
    document.getElementById("report-data-output").innerHTML =
      '<div class="alert alert-danger">No hay datos para esta selección y filtro.</div>';
  };

  const showError = (message) => {
    Storage.showAlert(message, "alert-danger");
  };

  const updateReportTitle = (reportDefinition) => {
    document.getElementById("report-title-output").textContent =
      reportDefinition.label;
  };

  const showResultCount = (count) => {
    // Opcional: mostrar contador de resultados
  };

  /**
   * ❗ NUEVA FUNCIÓN: Configura el listener de exportación a Excel ❗
   */
  const setupExportListener = () => {
    if (EXPORT_BTN) {
      EXPORT_BTN.addEventListener("click", exportToExcel);
    }
  };

  /**
   * Lógica para exportar la tabla a Excel usando jquery-table2excel.
   */
  const exportToExcel = () => {
    // 1. Obtener la tabla generada dentro del contenedor
    const tableElement = document.querySelector("#report-data-output table");
    const reportTitle =
      document.getElementById("report-title-output").textContent.trim() ||
      "Reporte";

    if (tableElement) {
      // 2. Usar la librería de jQuery
      $(tableElement).table2excel({
        exclude: ".noExl", // Clases a excluir (si las tienes)
        name: "Reporte SISCOMRES",
        filename: `${reportTitle.replace(/[^a-z0-9]/gi, "_")}_${new Date()
          .toISOString()
          .slice(0, 10)}.xls`, // Nombre del archivo
        fileext: ".xls",
        exclude_img: true,
        exclude_links: true,
        exclude_inputs: true,
      });
      Storage.showAlert(
        "Reporte exportado a Excel correctamente.",
        "alert-success"
      );
    } else {
      Storage.showAlert(
        "No se encontró la tabla para exportar.",
        "alert-warning"
      );
    }
  };

  return {
    generateTable,
    clearResults,
    showError,
    // ❗ EXPONER LA FUNCIÓN DE CONFIGURACIÓN ❗
    setupExportListener,
  };
})();
// Al final del archivo, cambia:
export { TableGenerator }; // En lugar de export default
