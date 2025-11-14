// Importar la función getStorage del archivo storage.js
// Asumiendo que ambos archivos están en el mismo directorio.
import { getStorage } from "./storage.js";

// Clave de almacenamiento para los datos del diagnóstico
const STORAGE_KEY = "siscomres_diagnostico_data";

// --- FUNCIONES DE CÁLCULO DE OPERATIVIDAD ---

// Función para calcular porcentaje de operatividad
function calcularPorcentajeOperatividad(operativos, total) {
  if (total === 0) return 0;
  // Redondear a 2 decimales
  return Math.round((operativos / total) * 100);
}

// Función para procesar los datos JSON y calcular promedios
function procesarDatosOperativos(datosJSON) {
  const areas = {
    consultorios: { total: 0, operativos: 0 },
    quirofanos: { total: 0, operativos: 0 },
    hospitalizacion: { total: 0, operativos: 0 },
    laboratorio: { total: 0, operativos: 0 },
    farmacia: { total: 0, operativos: 0 },
    cocina: { total: 0, operativos: 0 },
  };

  // Procesar cada centro de salud
  // Se asume que datosJSON es un Array de objetos de centros de salud.
  datosJSON.forEach((centro) => {
    // Asegurarse de que la estructura exista antes de acceder a ella
    const condiciones = centro?.infraestructura?.condiciones;

    if (condiciones) {
      Object.keys(areas).forEach((area) => {
        if (condiciones[area] && condiciones[area].cantidad !== undefined) {
          areas[area].total += condiciones[area].cantidad;
          // Asume que si no hay 'operativos', es 0
          areas[area].operativos += condiciones[area].operativos || 0;
        }
      });
    }
  });

  // Calcular porcentajes
  const resultados = {};
  Object.keys(areas).forEach((area) => {
    resultados[area] = {
      // Usar la función de cálculo redondeada
      porcentaje: calcularPorcentajeOperatividad(
        areas[area].operativos,
        areas[area].total
      ),
      total: areas[area].total,
      operativos: areas[area].operativos,
    };
  });

  return resultados;
}

// --- GENERACIÓN DINÁMICA DE DATOS PRINCIPALES ---

// 1. Obtener los datos del localStorage
const rawData = getStorage(STORAGE_KEY);

// 2. Procesar los datos crudos para generar el objeto operationalData
const operationalData = procesarDatosOperativos(rawData);

// Verificar si no hay datos y mostrar un mensaje si es necesario
if (
  Object.keys(operationalData).length === 0 ||
  Object.values(operationalData).every((d) => d.total === 0)
) {
  console.warn(
    "No se encontraron datos válidos en localStorage para generar el dashboard."
  );
  // Podrías poner datos de fallback o mostrar un mensaje en el DOM
}

// --- CONFIGURACIÓN Y VISUALIZACIÓN ---

// Nombres legibles para las áreas
const areaNames = {
  consultorios: "Consultorios",
  quirofanos: "Quirófanos",
  hospitalizacion: "Hospitalización",
  laboratorio: "Laboratorio",
  farmacia: "Farmacia",
  cocina: "Cocina",
};

// Colores para cada área
const areaColors = {
  consultorios: "#1a6fc4",
  quirofanos: "#2ecc71",
  hospitalizacion: "#3498db",
  laboratorio: "#9b59b6",
  farmacia: "#e74c3c",
  cocina: "#f39c12",
};

/**
 * Función para crear un gráfico gauge de Highcharts.
 * (El código de esta función es el mismo que el original, no requiere cambios)
 */
function createGauge(containerId, title, value, color) {
  Highcharts.chart(containerId, {
    chart: {
      type: "gauge",
      plotBackgroundColor: null,
      plotBackgroundBorderWidth: 0,
      plotBorderWidth: 0,
      height: "80%",
    },
    title: {
      text: title,
      style: {
        fontSize: "14px",
        fontWeight: "bold",
      },
    },
    pane: {
      startAngle: -90,
      endAngle: 90,
      background: null,
      center: ["50%", "75%"],
      size: "100%",
    },
    yAxis: {
      min: 0,
      max: 100,
      tickPixelInterval: 30,
      tickLength: 5,
      tickWidth: 1,
      minorTickInterval: null,
      labels: {
        distance: 20,
        style: {
          fontSize: "12px",
        },
      },
      plotBands: [
        {
          from: 0,
          to: 40,
          color: "#DF5353", // Rojo
          thickness: "20%",
        },
        {
          from: 40,
          to: 70,
          color: "#DDDF0D", // Amarillo
          thickness: "20%",
        },
        {
          from: 70,
          to: 100,
          color: "#55BF3B", // Verde
          thickness: "20%",
        },
      ],
    },
    series: [
      {
        name: "Operatividad",
        data: [value],
        tooltip: {
          valueSuffix: " %",
        },
        dataLabels: {
          format: "{y}%",
          borderWidth: 0,
          style: {
            fontSize: "16px",
            fontWeight: "bold",
          },
        },
        dial: {
          radius: "80%",
          backgroundColor: color,
          baseWidth: 12,
          baseLength: "0%",
          rearLength: "0%",
        },
      },
    ],
    credits: {
      enabled: false,
    },
  });
}

/**
 * Función principal para generar el dashboard completo.
 */
function generateDashboard() {
  const gaugesContainer = document.getElementById("gaugesContainer");
  const detailedStats = document.getElementById("detailedStats");

  // Limpiar contenedores
  gaugesContainer.innerHTML = "";
  detailedStats.innerHTML = "";

  // Crear gauges y estadísticas detalladas
  Object.keys(operationalData).forEach((area) => {
    const data = operationalData[area];
    const areaName = areaNames[area];
    const color = areaColors[area];

    // Solo renderizar si hay unidades totales
    if (data.total > 0) {
      // Crear gauge card
      const gaugeCol = document.createElement("div");
      gaugeCol.className = "col-sm-6 col-lg-4";
      gaugeCol.innerHTML = `
                <div class="card gauge-card h-100">
                    <div class="card-body text-center">
                        <div class="gauge-container" id="gauge-${area}"></div>
                        <h6 class="card-title area-title">${areaName}</h6>
                        <p class="card-text area-stats">${data.operativos} de ${data.total} unidades</p>
                    </div>
                </div>
            `;
      gaugesContainer.appendChild(gaugeCol);

      // Crear estadística detallada
      const statCol = document.createElement("div");
      statCol.className = "col-12";
      statCol.innerHTML = `
                <div class="d-flex justify-content-between align-items-center p-2 border-bottom">
                    <div>
                        <h6 class="mb-1">${areaName}</h6>
                        <small class="text-muted">${data.operativos} de ${data.total} unidades operativas</small>
                    </div>
                    <div class="d-flex align-items-center">
                        <span class="me-2 fw-bold">${data.porcentaje}%</span>
                        <div class="progress" style="width: 100px;">
                            <div class="progress-bar" role="progressbar" style="width: ${data.porcentaje}%; background-color: ${color};"></div>
                        </div>
                    </div>
                </div>
            `;
      detailedStats.appendChild(statCol);

      // Crear el gráfico gauge
      setTimeout(() => {
        createGauge(`gauge-${area}`, "", data.porcentaje, color);
      }, 100);
    }
  });

  // --- ACTUALIZAR SUMMARY CARDS ---

  // Filtra las áreas con datos para calcular el promedio correctamente
  const percentages = Object.values(operationalData)
    .filter((d) => d.total > 0)
    .map((area) => area.porcentaje);

  let averagePercentage = 0;
  if (percentages.length > 0) {
    const totalPercentage = percentages.reduce((sum, p) => sum + p, 0);
    averagePercentage = Math.round(totalPercentage / percentages.length);
  }

  const mostOperative = Object.values(operationalData).reduce(
    (max, area) => (area.porcentaje > max.porcentaje ? area : max),
    { porcentaje: -1 }
  );
  const criticalArea = Object.values(operationalData).reduce(
    (min, area) => (area.porcentaje < min.porcentaje ? area : min),
    { porcentaje: 101 }
  );

  const getAreaNameByPercentage = (percentage) => {
    const [key] = Object.entries(operationalData).find(
      ([, data]) => data.porcentaje === percentage
    ) || [null];
    return areaNames[key] || "N/A";
  };

  // 1. Operatividad General
  const summaryGen = document.querySelector(
    ".summary-card:nth-child(1) .operational-percentage"
  );
  if (summaryGen) {
    summaryGen.textContent = `${averagePercentage}%`;
  }

  const highlightGen = document.querySelector(".highlight-card h4.mb-0");
  const highlightBar = document.querySelector(".highlight-card .progress-bar");

  if (highlightGen) {
    highlightGen.textContent = `${averagePercentage}%`;
  }

  if (highlightBar) {
    highlightBar.style.width = `${averagePercentage}%`;
  }

  // 2. Centros Evaluados
  const centersEvaluated = document.querySelector(
    ".summary-card:nth-child(2) .operational-percentage"
  );
  if (centersEvaluated) {
    centersEvaluated.textContent = rawData.length.toString();
  }

  // 3. Área Más Operativa
  const mostOpPerc = document.querySelector(
    ".summary-card:nth-child(3) .operational-percentage"
  );
  const mostOpText = document.querySelector(
    ".summary-card:nth-child(3) small.text-muted"
  );

  if (mostOpPerc) {
    mostOpPerc.textContent = `${mostOperative.porcentaje}%`;
  }
  if (mostOpText) {
    mostOpText.textContent = getAreaNameByPercentage(mostOperative.porcentaje);
  }

  // 4. Área Crítica
  const critAreaPerc = document.querySelector(
    ".summary-card:nth-child(4) .operational-percentage"
  );
  const critAreaText = document.querySelector(
    ".summary-card:nth-child(4) small.text-muted"
  );

  if (critAreaPerc) {
    critAreaPerc.textContent = `${criticalArea.porcentaje}%`;
  }
  if (critAreaText) {
    critAreaText.textContent = getAreaNameByPercentage(criticalArea.porcentaje);
  }
}

// Inicializar el dashboard cuando el documento esté completamente cargado
document.addEventListener("DOMContentLoaded", generateDashboard);
