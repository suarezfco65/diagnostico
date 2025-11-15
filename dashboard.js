// Importar la función getStorage del archivo storage.js
import { getStorage } from "./storage.js";

// Importar los datos globales necesarios (Nombres de Área)
import { filteredData, areaNames } from "./main_dashboard.js";

// Clave de almacenamiento para los datos del diagnóstico
const STORAGE_KEY = "siscomres_diagnostico_data";

// ----------------------------------------------------------------------
// --- FUNCIONES DE CÁLCULO DE OPERATIVIDAD ---
// ----------------------------------------------------------------------

// Función para calcular porcentaje de operatividad
function calcularPorcentajeOperatividad(operativos, total) {
  if (total === 0) return 0;
  // Redondear a 2 decimales
  return Math.round((operativos / total) * 100);
}

// Función para procesar los datos JSON y calcular promedios
// Acepta un array de datos (filtrado o completo)
function procesarDatosOperativos(datosArray) {
  console.log("Procesando datos operativos:", datosArray.length, "centros");

  const areas = {
    consultorios: { total: 0, operativos: 0, nombreLegible: "Consultorios" },
    quirofanos: { total: 0, operativos: 0, nombreLegible: "Quirófanos" },
    hospitalizacion: {
      total: 0,
      operativos: 0,
      nombreLegible: "Hospitalización",
    },
    laboratorio: { total: 0, operativos: 0, nombreLegible: "Laboratorio" },
    farmacia: { total: 0, operativos: 0, nombreLegible: "Farmacia" },
    cocina: { total: 0, operativos: 0, nombreLegible: "Cocina" },
  };

  datosArray.forEach((centro, index) => {
    const condiciones = centro?.infraestructura?.condiciones;
    console.log(`Centro ${index + 1}:`, centro.datosInstitucion?.nombre);
    console.log("Condiciones:", condiciones);

    if (condiciones && typeof condiciones === "object") {
      Object.keys(areas).forEach((area) => {
        const datosArea = condiciones[area];

        if (datosArea && typeof datosArea === "object") {
          // Obtener cantidad y operativos directamente de la estructura
          const cantidad = parseInt(datosArea.cantidad) || 0;
          const operativos = parseInt(datosArea.operativos) || 0;

          console.log(
            `  ${area}: cantidad=${cantidad}, operativos=${operativos}`
          );

          if (cantidad > 0) {
            areas[area].total += cantidad;
            areas[area].operativos += operativos;
          }
        } else {
          console.log(`  ${area}: NO HAY DATOS`);
        }
      });
    } else {
      console.log(
        `  Centro ${index + 1}: No tiene condiciones de infraestructura`
      );
    }
  });

  // Calcular porcentajes
  Object.keys(areas).forEach((area) => {
    areas[area].porcentaje = calcularPorcentajeOperatividad(
      areas[area].operativos,
      areas[area].total
    );
    console.log(
      `RESULTADO ${area}: ${areas[area].operativos}/${areas[area].total} = ${areas[area].porcentaje}%`
    );
  });

  return areas;
}

// ----------------------------------------------------------------------
// --- FUNCIONES DE VISUALIZACIÓN ---
// ----------------------------------------------------------------------

function createGauge(containerId, value, title) {
  // *** CORRECCIÓN Highcharts error #13 ***
  if (!document.getElementById(containerId)) {
    console.warn(
      `Highcharts: Contenedor ${containerId} no encontrado en el DOM.`
    );
    // Reintentar después de un breve delay
    setTimeout(() => {
      if (document.getElementById(containerId)) {
        createGauge(containerId, value, title);
      }
    }, 100);
    return;
  }

  // Destruir gráfico existente si existe
  const existingChart = Highcharts.charts.find(
    (chart) => chart && chart.renderTo.id === containerId
  );
  if (existingChart) {
    existingChart.destroy();
  }

  // Determinar color basado en el porcentaje
  let color;
  if (value >= 80) {
    color = "#2ecc71"; // Verde
  } else if (value >= 60) {
    color = "#f39c12"; // Amarillo/Naranja
  } else if (value >= 40) {
    color = "#e67e22"; // Naranja
  } else {
    color = "#e74c3c"; // Rojo
  }

  Highcharts.chart(containerId, {
    chart: {
      type: "solidgauge",
      height: 180,
      backgroundColor: "transparent",
    },
    title: {
      text: null,
    },
    pane: {
      startAngle: -90,
      endAngle: 90,
      background: {
        backgroundColor: "#f8f9fa",
        innerRadius: "60%",
        outerRadius: "100%",
        shape: "arc",
        borderWidth: 0,
      },
    },
    tooltip: {
      enabled: false,
    },
    yAxis: {
      min: 0,
      max: 100,
      stops: [
        [0.1, "#e74c3c"], // Rojo
        [0.4, "#e67e22"], // Naranja
        [0.6, "#f39c12"], // Amarillo
        [0.8, "#2ecc71"], // Verde
      ],
      lineWidth: 0,
      minorTickInterval: null,
      tickAmount: 2,
      labels: {
        y: 16,
        format: "{value}%",
      },
      title: {
        text: null,
      },
    },
    plotOptions: {
      solidgauge: {
        dataLabels: {
          y: -20,
          borderWidth: 0,
          useHTML: true,
          format:
            '<div style="text-align:center">' +
            '<span style="font-size:24px;font-weight:bold;color:{point.color}">{y}%</span>' +
            "</div>",
        },
      },
    },
    series: [
      {
        name: title,
        data: [value],
        dataLabels: {
          format:
            '<div style="text-align:center">' +
            '<span style="font-size:24px;font-weight:bold;color:{point.color}">{y}%</span>' +
            "</div>",
        },
      },
    ],
    credits: {
      enabled: false,
    },
  });
}

function createColumnChart(operationalData) {
  // *** CORRECCIÓN Highcharts error #13 ***
  const containerId = "columnChartContainer";
  if (!document.getElementById(containerId)) {
    console.warn(
      `Highcharts: Contenedor ${containerId} no encontrado en el DOM.`
    );
    // Reintentar después de un breve delay
    setTimeout(() => {
      if (document.getElementById(containerId)) {
        createColumnChart(operationalData);
      }
    }, 100);
    return;
  }

  // Convertir los datos de operatividad para el formato de Highcharts
  const categories = Object.values(operationalData).map(
    (item) => item.nombreLegible
  );
  const data = Object.values(operationalData).map((item) => item.porcentaje);

  // Destruir gráfico existente si existe
  const existingChart = Highcharts.charts.find(
    (chart) => chart && chart.renderTo.id === containerId
  );
  if (existingChart) {
    existingChart.destroy();
  }

  Highcharts.chart(containerId, {
    chart: {
      type: "column",
      height: 400,
    },
    title: {
      text: "Comparativa de Operatividad por Área",
      style: {
        fontSize: "16px",
        fontWeight: "bold",
      },
    },
    xAxis: {
      categories: categories,
      crosshair: true,
      title: {
        text: null,
      },
    },
    yAxis: {
      min: 0,
      max: 100,
      title: {
        text: "Porcentaje de Operatividad (%)",
        style: {
          fontSize: "12px",
        },
      },
      labels: {
        format: "{value}%",
      },
    },
    tooltip: {
      headerFormat:
        '<span style="font-size:11px"><b>{point.key}</b></span><table>',
      pointFormat:
        '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y:.1f}%</b></td></tr>' +
        '<tr><td style="padding:0">Unidades operativas: </td>' +
        '<td style="padding:0"><b>{point.operativos} de {point.total}</b></td></tr>',
      footerFormat: "</table>",
      shared: true,
      useHTML: true,
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: "{y:.0f}%",
          style: {
            fontSize: "11px",
            fontWeight: "bold",
          },
        },
      },
    },
    series: [
      {
        name: "Operatividad",
        data: Object.values(operationalData).map((area) => ({
          y: area.porcentaje,
          operativos: area.operativos,
          total: area.total,
          color:
            area.porcentaje >= 80
              ? "#2ecc71"
              : area.porcentaje >= 60
              ? "#f39c12"
              : area.porcentaje >= 40
              ? "#e67e22"
              : "#e74c3c",
        })),
        colorByPoint: true,
      },
    ],
    credits: {
      enabled: false,
    },
  });
}

// Función para actualizar las estadísticas textuales debajo de cada gauge
function updateAreaStats(operationalData) {
  const statsElements = {
    consultorios: document.getElementById("statsConsultorios"),
    quirofanos: document.getElementById("statsQuirofanos"),
    hospitalizacion: document.getElementById("statsHospitalizacion"),
    laboratorio: document.getElementById("statsLaboratorio"),
    farmacia: document.getElementById("statsFarmacia"),
    cocina: document.getElementById("statsCocina"),
  };

  Object.keys(statsElements).forEach((area) => {
    const element = statsElements[area];
    const data = operationalData[area];
    if (element && data) {
      element.textContent = `${data.operativos} de ${data.total} unidades`;
    }
  });
}

// Función para generar la tabla de detalles
function generateDetailTable(operationalData) {
  const tableBody = document.getElementById("detailedStatsTable");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  Object.keys(operationalData).forEach((areaKey) => {
    const area = operationalData[areaKey];
    const row = tableBody.insertRow();

    // Determinar clase de estado
    let estadoClass = "text-danger";
    let estadoText = "Crítico";
    if (area.porcentaje >= 80) {
      estadoClass = "text-success";
      estadoText = "Excelente";
    } else if (area.porcentaje >= 60) {
      estadoClass = "text-warning";
      estadoText = "Aceptable";
    } else if (area.porcentaje >= 40) {
      estadoClass = "text-orange";
      estadoText = "Regular";
    }

    row.innerHTML = `
      <td><strong>${area.nombreLegible}</strong></td>
      <td>${area.operativos}</td>
      <td>${area.total}</td>
      <td><span class="fw-bold">${area.porcentaje}%</span></td>
      <td><span class="${estadoClass} fw-bold">${estadoText}</span></td>
    `;
  });
}

// ----------------------------------------------------------------------
// --- FUNCIÓN PRINCIPAL DE RENDERIZADO (Se llama al aplicar filtros) ---
// ----------------------------------------------------------------------

/**
 * Función principal para generar el dashboard completo con los datos proporcionados.
 * Se exporta para ser llamada por main_dashboard.js al cambiar el filtro.
 * @param {Array} dataToRender - El array de centros de salud filtrados.
 */
export function renderDashboard(dataToRender) {
  console.log("=== RENDER DASHBOARD OPERATIVIDAD ===");
  console.log("Datos recibidos:", dataToRender);
  console.log("Número de centros:", dataToRender.length);

  // 1. PROCESAR DATOS
  const operationalData = procesarDatosOperativos(dataToRender);

  // Calcular el promedio general
  let totalPorcentajes = 0;
  let areasContadas = 0;
  Object.values(operationalData).forEach((area) => {
    // Solo contar áreas que tienen un total > 0 (fueron evaluadas)
    if (area.total > 0) {
      totalPorcentajes += area.porcentaje;
      areasContadas++;
    }
  });

  const averagePercentage =
    areasContadas > 0 ? Math.round(totalPorcentajes / areasContadas) : 0;

  console.log("Promedio general calculado:", averagePercentage);

  // Encontrar el área más operativa y el área crítica
  const areasEvaluadas = Object.values(operationalData).filter(
    (a) => a.total > 0 && a.porcentaje > 0
  );

  let mostOperative =
    areasEvaluadas.length > 0
      ? areasEvaluadas.reduce((prev, current) =>
          prev.porcentaje > current.porcentaje ? prev : current
        )
      : { nombreLegible: "N/A", porcentaje: 0 };

  let criticalArea =
    areasEvaluadas.length > 0
      ? areasEvaluadas.reduce((prev, current) =>
          prev.porcentaje < current.porcentaje ? prev : current
        )
      : { nombreLegible: "N/A", porcentaje: 0 };

  console.log("Área más operativa:", mostOperative);
  console.log("Área crítica:", criticalArea);

  // 2. ACTUALIZAR VISUALIZACIONES (Cards y Gráficos)

  // A. Actualizar Summary Cards
  const summary1 = document.querySelector("#summary-value-1");
  if (summary1) summary1.textContent = `${averagePercentage}%`;

  const summary2 = document.querySelector("#summary-value-2");
  if (summary2) summary2.textContent = dataToRender.length.toString();

  const centrosEvaluadosTexto = document.getElementById(
    "centrosEvaluadosTexto"
  );
  if (centrosEvaluadosTexto)
    centrosEvaluadosTexto.textContent = `Total de instituciones`;

  const summary3 = document.querySelector("#summary-value-3");
  if (summary3) summary3.textContent = `${mostOperative.porcentaje}%`;

  const mostOpText = document.getElementById("mostOpText");
  if (mostOpText) mostOpText.textContent = mostOperative.nombreLegible;

  const summary4 = document.querySelector("#summary-value-4");
  if (summary4) summary4.textContent = `${criticalArea.porcentaje}%`;

  const critAreaText = document.getElementById("critAreaText");
  if (critAreaText) critAreaText.textContent = criticalArea.nombreLegible;

  // B. Actualizar Highlight Card
  const highlightGen = document.getElementById("highlightGen");
  if (highlightGen) highlightGen.textContent = `${averagePercentage}%`;

  const highlightBar = document.getElementById("highlightBar");
  if (highlightBar) highlightBar.style.width = `${averagePercentage}%`;

  const resumenMostOp = document.getElementById("resumenMostOp");
  if (resumenMostOp) resumenMostOp.textContent = mostOperative.nombreLegible;

  const resumenMostOpPerc = document.getElementById("resumenMostOpPerc");
  if (resumenMostOpPerc)
    resumenMostOpPerc.textContent = `${mostOperative.porcentaje}%`;

  const resumenCritArea = document.getElementById("resumenCritArea");
  if (resumenCritArea) resumenCritArea.textContent = criticalArea.nombreLegible;

  const resumenCritAreaPerc = document.getElementById("resumenCritAreaPerc");
  if (resumenCritAreaPerc)
    resumenCritAreaPerc.textContent = `${criticalArea.porcentaje}%`;

  // C. Crear Gauges Individuales para cada área
  Object.keys(operationalData).forEach((area) => {
    const gaugeId = `gauge${area.charAt(0).toUpperCase() + area.slice(1)}`;
    createGauge(
      gaugeId,
      operationalData[area].porcentaje,
      operationalData[area].nombreLegible
    );
  });

  // D. Actualizar estadísticas textuales
  updateAreaStats(operationalData);

  // E. Crear Gráfico de Barras
  createColumnChart(operationalData);

  // F. Generar tabla de detalles
  generateDetailTable(operationalData);

  console.log("=== FIN RENDER DASHBOARD ===");
}

// ----------------------------------------------------------------------
// --- FUNCIÓN DE INICIALIZACIÓN (Se llama una vez al cargar la pestaña) ---
// ----------------------------------------------------------------------

/**
 * Función de inicialización modificada para compatibilidad con main_dashboard.js.
 * @param {Array} dataToUse - Los datos iniciales a usar (será dataCentrosDeSalud completa o filteredData).
 */
export function initialize(dataToUse) {
  console.log("=== INICIALIZANDO DASHBOARD OPERATIVIDAD ===");
  console.log("Datos iniciales:", dataToUse);

  // Usar setTimeout para asegurar que el DOM esté listo
  setTimeout(() => {
    renderDashboard(dataToUse);
  }, 100);
}
