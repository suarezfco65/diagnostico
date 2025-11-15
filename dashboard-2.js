// dashboard-2.js (CORREGIDO PARA ACTUALIZAR CON FILTROS Y MANEJO DE HIGHCHARTS)

// Importar los datos globales necesarios (Nombres y Colores)
import { areaNames, conditionColors } from "./main_dashboard.js";

// --- FUNCIONES AUXILIARES DE CÁLCULO ---

/**
 * Función auxiliar para crear estructura de conteo de infraestructura.
 * Se llama dentro de renderDashboard para resetear los contadores.
 */
function crearEstructuraInfraestructura() {
  const areas = Object.keys(areaNames);
  const componentes = ["paredes", "techos", "pisos", "aa"];
  const estructura = {};

  areas.forEach((area) => {
    estructura[area] = {};
    componentes.forEach((componente) => {
      estructura[area][componente] = {
        buenas: 0,
        regulares: 0,
        malas: 0,
      };
    });
  });
  return estructura;
}

/**
 * Calcula el promedio ponderado de condición para una sola área.
 */
function calculateAreaAverage(areaData) {
  let totalPuntos = 0;
  let totalComponentes = 0; // Contar el total de componentes evaluados

  // Ponderación: Buenas=3, Regulares=2, Malas=1
  Object.keys(areaData).forEach((componente) => {
    const contador = areaData[componente];
    const total = contador.buenas + contador.regulares + contador.malas;

    if (total > 0) {
      // En este punto, los valores son porcentajes (0-100)
      totalPuntos +=
        contador.buenas * 3 + contador.regulares * 2 + contador.malas * 1;
      totalComponentes += 300; // Total posible de puntos (100% * 3 puntos)
    }
  });

  // Normalizar el resultado (max 300 / 3 = 100) y obtener el porcentaje (0-100)
  if (totalComponentes === 0) return 0;
  return Math.round((totalPuntos / totalComponentes) * 100);
}

/**
 * Realiza el análisis completo de la infraestructura.
 * @param {object} infrastructureData - La estructura de datos de infraestructura con porcentajes.
 * @returns {object} Un objeto con el análisis.
 */
function analizarInfraestructura(infrastructureData) {
  const analisis = {
    condicionGeneral: 0,
    mejorArea: { nombreLegible: "N/A", porcentaje: 0 },
    areaCritica: { nombreLegible: "N/A", porcentaje: 0 },
    todasLasAreas: [],
  };

  let totalPorcentajeGeneral = 0;
  let areasContadas = 0;

  // 1. Calcular promedio por área y generar el ranking
  Object.keys(infrastructureData).forEach((areaKey) => {
    const promedio = calculateAreaAverage(infrastructureData[areaKey]);

    // Solo se consideran áreas que fueron evaluadas (promedio > 0)
    if (promedio > 0) {
      const areaResumen = {
        nombreLegible: areaNames[areaKey],
        porcentaje: promedio,
        areaKey: areaKey,
      };

      analisis.todasLasAreas.push(areaResumen);
      totalPorcentajeGeneral += promedio;
      areasContadas++;
    }
  });

  // 2. Calcular Condición General (promedio de los promedios de área)
  analisis.condicionGeneral =
    areasContadas > 0 ? Math.round(totalPorcentajeGeneral / areasContadas) : 0;

  // 3. Determinar Mejor Área y Área Crítica
  if (analisis.todasLasAreas.length > 0) {
    // Ordenar por porcentaje (descendente)
    analisis.todasLasAreas.sort((a, b) => b.porcentaje - a.porcentaje);

    analisis.mejorArea = analisis.todasLasAreas[0];
    analisis.areaCritica =
      analisis.todasLasAreas[analisis.todasLasAreas.length - 1];
  }

  return analisis;
}

// --- FUNCIONES DE VISUALIZACIÓN ---

/**
 * Crea el gráfico de barras apiladas.
 * @param {object} infrastructureData - Datos de infraestructura con porcentajes.
 */
function createColumnChart(infrastructureData) {
  // *** CORRECCIÓN Highcharts error #13 ***
  const containerId = "columnChartContainer2";
  if (!document.getElementById(containerId)) {
    console.warn(
      `Highcharts: Contenedor ${containerId} no encontrado en el DOM.`
    );
    // Reintentar después de un breve delay
    setTimeout(() => {
      if (document.getElementById(containerId)) {
        createColumnChart(infrastructureData);
      }
    }, 100);
    return;
  }

  const categories = Object.keys(infrastructureData).map(
    (key) => areaNames[key]
  );

  // Extraer datos de porcentajes
  const seriesData = {
    buenas: [],
    regulares: [],
    malas: [],
  };

  Object.keys(infrastructureData).forEach((areaKey) => {
    const areaData = infrastructureData[areaKey];

    // Calcular el promedio del área para cada condición
    let totalBuenas = 0,
      totalRegulares = 0,
      totalMalas = 0;
    let totalTotal = 0;

    Object.keys(areaData).forEach((compKey) => {
      const comp = areaData[compKey];
      const total = comp.buenas + comp.regulares + comp.malas;
      if (total > 0) {
        totalBuenas += comp.buenas;
        totalRegulares += comp.regulares;
        totalMalas += comp.malas;
        totalTotal += 100; // Suma de los 100% de cada componente
      }
    });

    if (totalTotal > 0) {
      seriesData.buenas.push(Math.round((totalBuenas / totalTotal) * 100));
      seriesData.regulares.push(
        Math.round((totalRegulares / totalTotal) * 100)
      );
      seriesData.malas.push(Math.round((totalMalas / totalTotal) * 100));
    } else {
      seriesData.buenas.push(0);
      seriesData.regulares.push(0);
      seriesData.malas.push(0);
    }
  });

  // Destruir gráfico existente si existe
  const existingChart = Highcharts.charts.find(
    (chart) => chart && chart.renderTo.id === containerId
  );
  if (existingChart) {
    existingChart.destroy();
  }

  Highcharts.chart(containerId, {
    chart: {
      type: "bar",
      height: 400,
    },
    title: {
      text: "Condición de Infraestructura por Área",
    },
    xAxis: {
      categories: categories,
      title: {
        text: null,
      },
    },
    yAxis: {
      min: 0,
      max: 100,
      title: {
        text: "Porcentaje de Condición (%)",
      },
    },
    legend: {
      reversed: true,
    },
    plotOptions: {
      series: {
        stacking: "normal",
        dataLabels: {
          enabled: true,
          format: "{point.y:.0f}%",
        },
      },
    },
    series: [
      {
        name: "Malas",
        data: seriesData.malas,
        color: conditionColors.malas,
      },
      {
        name: "Regulares",
        data: seriesData.regulares,
        color: conditionColors.regulares,
      },
      {
        name: "Buenas",
        data: seriesData.buenas,
        color: conditionColors.buenas,
      },
    ],
    credits: {
      enabled: false,
    },
  });
}

/**
 * Crea el gráfico de radar.
 * @param {object} infrastructureData - Datos de infraestructura con porcentajes.
 */
function createRadarChart(infrastructureData) {
  // *** CORRECCIÓN Highcharts error #13 ***
  const containerId = "radarChartContainer";
  if (!document.getElementById(containerId)) {
    console.warn(
      `Highcharts: Contenedor ${containerId} no encontrado en el DOM.`
    );
    // Reintentar después de un breve delay
    setTimeout(() => {
      if (document.getElementById(containerId)) {
        createRadarChart(infrastructureData);
      }
    }, 100);
    return;
  }

  const analisis = analizarInfraestructura(infrastructureData);
  const areas = analisis.todasLasAreas.map((a) => a.nombreLegible);
  const data = analisis.todasLasAreas.map((a) => a.porcentaje);

  // Destruir gráfico existente si existe
  const existingChart = Highcharts.charts.find(
    (chart) => chart && chart.renderTo.id === containerId
  );
  if (existingChart) {
    existingChart.destroy();
  }

  Highcharts.chart(containerId, {
    chart: {
      polar: true,
      type: "line",
      height: 350,
    },
    title: {
      text: "Promedio de Condición de Áreas",
      x: -40,
    },
    pane: {
      size: "80%",
    },
    xAxis: {
      categories: areas,
      tickmarkPlacement: "on",
      lineWidth: 0,
    },
    yAxis: {
      gridLineInterpolation: "polygon",
      lineWidth: 0,
      min: 0,
      max: 100,
      tickInterval: 20,
    },
    tooltip: {
      shared: true,
      pointFormat:
        '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y:.0f}%</b><br/>',
    },
    legend: {
      enabled: false,
    },
    series: [
      {
        name: "Condición",
        data: data,
        pointPlacement: "on",
        color: "#2980b9",
        fillColor: "rgba(41, 128, 185, 0.25)",
      },
    ],
    credits: {
      enabled: false,
    },
  });
}

/**
 * Genera la tabla de detalles con los porcentajes por componente.
 * @param {object} infrastructureData - Datos de infraestructura con porcentajes.
 */
function generateDetailTable(infrastructureData) {
  const tableBody = document.getElementById("componentTableBody");
  // Limpiar contenido previo
  if (!tableBody) {
    console.warn("Tabla componentTableBody no encontrada en el DOM");
    return;
  }
  tableBody.innerHTML = "";

  Object.keys(infrastructureData).forEach((areaKey) => {
    const area = infrastructureData[areaKey];
    const row = tableBody.insertRow();

    // Celda de Área
    row.insertCell().textContent = areaNames[areaKey];

    // Celdas de Componentes
    ["paredes", "techos", "pisos", "aa"].forEach((componenteKey) => {
      const cell = row.insertCell();
      const comp = area[componenteKey];
      const total = comp.buenas + comp.regulares + comp.malas;

      let conditionText = "N/A";
      let conditionClass = "";

      if (total > 0) {
        // Determinar la condición predominante (la de mayor porcentaje)
        const maxPercent = Math.max(comp.buenas, comp.regulares, comp.malas);

        if (maxPercent === comp.buenas && comp.buenas > 0) {
          conditionText = `${comp.buenas}% Buenas`;
          conditionClass = "text-success";
        } else if (maxPercent === comp.malas && comp.malas > 0) {
          conditionText = `${comp.malas}% Malas`;
          conditionClass = "text-danger";
        } else if (maxPercent === comp.regulares && comp.regulares > 0) {
          conditionText = `${comp.regulares}% Regulares`;
          conditionClass = "text-warning";
        } else {
          // Caso de empate o 0, debería ser manejado mejor, por ahora default
          conditionText = "Mixto";
        }

        cell.innerHTML = `<span class="${conditionClass}">${conditionText}</span>`;
      } else {
        cell.innerHTML = "N/A";
      }
    });

    // Celda de Condición General (Promedio del Área)
    const analisis = analizarInfraestructura(infrastructureData);
    const areaData = analisis.todasLasAreas.find((a) => a.areaKey === areaKey);
    const avgCell = row.insertCell();

    if (areaData) {
      const avgPercent = areaData.porcentaje;
      let avgClass = "text-muted";

      if (avgPercent >= 75) avgClass = "text-success";
      else if (avgPercent >= 50) avgClass = "text-warning";
      else avgClass = "text-danger";

      avgCell.innerHTML = `<span class="${avgClass} fw-bold">${avgPercent}%</span>`;
    } else {
      avgCell.innerHTML = "N/A";
    }
  });
}

/**
 * Actualiza las tarjetas de resumen.
 * @param {object} analisisCompleto - El análisis calculado.
 * @param {number} centrosEvaluados - Cantidad de centros en los datos filtrados.
 */
function actualizarDashboard(analisisCompleto, centrosEvaluados) {
  // Buscar elementos por clase/ID para actualizar

  // 1. Condición General
  const conditionValueElement = document.querySelector(".stats-value");
  if (conditionValueElement) {
    conditionValueElement.textContent = `${analisisCompleto.condicionGeneral}%`;
  }

  // Actualizar el badge de condición general
  const badge = document.querySelector(".condition-badge");
  if (badge) {
    const avg = analisisCompleto.condicionGeneral;
    let text = "MALA";
    let className = "bg-danger";

    if (avg >= 75) {
      text = "BUENA";
      className = "bg-success";
    } else if (avg >= 50) {
      text = "REGULAR";
      className = "bg-warning";
    }

    badge.textContent = text;
    badge.className = `badge condition-badge ${className}`;
  }

  // 2. Centros Evaluados
  // Se usa querySelectorAll para obtener el segundo elemento con la clase .stats-value
  const statsValues = document.querySelectorAll(".stats-value");
  if (statsValues.length > 1) {
    statsValues[1].textContent = centrosEvaluados.toString();
  }

  // 3. Mejor Área
  if (statsValues.length > 2) {
    statsValues[2].textContent = `${analisisCompleto.mejorArea.porcentaje}%`;
  }
  const mejorAreaText = document.getElementById("mejorAreaTexto");
  if (mejorAreaText) {
    mejorAreaText.textContent = analisisCompleto.mejorArea.nombreLegible;
  }

  // 4. Área Crítica
  if (statsValues.length > 3) {
    statsValues[3].textContent = `${analisisCompleto.areaCritica.porcentaje}%`;
  }
  const areaCriticaText = document.getElementById("areaCriticaTexto");
  if (areaCriticaText) {
    areaCriticaText.textContent = analisisCompleto.areaCritica.nombreLegible;
  }
}

// --- FUNCIÓN PRINCIPAL DE RENDERIZADO (Se llama al aplicar filtros) ---

/**
 * Función principal para generar el dashboard completo con los datos proporcionados.
 * Se exporta para ser llamada por main_dashboard.js al cambiar el filtro.
 * @param {Array} dataToUse - El array de centros de salud filtrados.
 */
export function renderDashboard(dataToUse) {
  // Solo procesar si hay datos
  if (!dataToUse || dataToUse.length === 0) {
    // Limpiar o mostrar mensaje de No Data
    const chartContainer2 = document.getElementById("columnChartContainer2");
    if (chartContainer2)
      chartContainer2.innerHTML =
        "<p class='text-center mt-5'>No hay datos para los filtros seleccionados.</p>";
    const radarContainer = document.getElementById("radarChartContainer");
    if (radarContainer) radarContainer.innerHTML = "";
    const tableBody = document.getElementById("componentTableBody");
    if (tableBody) tableBody.innerHTML = "";

    actualizarDashboard(
      {
        condicionGeneral: 0,
        mejorArea: { nombreLegible: "N/A", porcentaje: 0 },
        areaCritica: { nombreLegible: "N/A", porcentaje: 0 },
        todasLasAreas: [],
      },
      0
    );
    return;
  }

  // 1. RE-EJECUTAR LA LÓGICA DE CONTEO Y CÁLCULO con dataToUse
  const infrastructureData = crearEstructuraInfraestructura();

  // En la parte de procesamiento de datos, cambiar:
  dataToUse.forEach((centro) => {
    Object.keys(infrastructureData).forEach((area) => {
      // 1.1. Verificar que existen los datos en el centro
      if (
        centro.infraestructura &&
        centro.infraestructura.condiciones &&
        centro.infraestructura.condiciones[area]
      ) {
        const datosArea = centro.infraestructura.condiciones[area];
        const cantidad = datosArea.cantidad || 1;

        // 1.2. Iterar sobre componentes y contar condiciones
        Object.keys(infrastructureData[area]).forEach((componente) => {
          const condicion = datosArea[componente];

          if (condicion) {
            switch (condicion) {
              case "BUENAS COND":
                infrastructureData[area][componente].buenas += cantidad;
                break;
              case "MALAS COND":
                infrastructureData[area][componente].malas += cantidad;
                break;
              case "REGULARES COND":
                infrastructureData[area][componente].regulares += cantidad;
                break;
              // Si no coincide con ninguna, simplemente no se cuenta
            }
          }
        });
      }
    });
  });
  // 2. RE-EJECUTAR LA LÓGICA DE CÁLCULO DE PORCENTAJES (In-place)
  Object.keys(infrastructureData).forEach((area) => {
    Object.keys(infrastructureData[area]).forEach((componente) => {
      const contador = infrastructureData[area][componente];
      const total = contador.buenas + contador.regulares + contador.malas;

      if (total > 0) {
        // Almacenar el porcentaje en la misma estructura
        infrastructureData[area][componente].buenas = Math.round(
          (contador.buenas / total) * 100
        );
        infrastructureData[area][componente].regulares = Math.round(
          (contador.regulares / total) * 100
        );
        infrastructureData[area][componente].malas = Math.round(
          (contador.malas / total) * 100
        );
      } else {
        infrastructureData[area][componente].buenas = 0;
        infrastructureData[area][componente].regulares = 0;
        infrastructureData[area][componente].malas = 0;
      }
    });
  });

  // 3. Ejecutar análisis completo con la nueva data contada (con porcentajes)
  const analisisCompleto = analizarInfraestructura(infrastructureData);

  // 4. Renderizar Visualizaciones
  actualizarDashboard(analisisCompleto, dataToUse.length);
  createColumnChart(infrastructureData);
  createRadarChart(infrastructureData);
  generateDetailTable(infrastructureData);
}

// --- FUNCIÓN DE INICIALIZACIÓN ---

/**
 * Función de inicialización para ser llamada por main_dashboard.js.
 * @param {Array} dataToUse - Los datos iniciales a usar.
 */
export function initialize(dataToUse) {
  // Usar setTimeout para asegurar que el DOM esté listo
  setTimeout(() => {
    renderDashboard(dataToUse);
  }, 100);
}
