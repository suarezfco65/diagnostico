// dashboard-3.js - Dashboard de Servicios Públicos

// Importar los datos globales necesarios
import { filteredData, areaNames } from "./main_dashboard.js";

// Definición de servicios públicos y sus nombres legibles
const serviciosPublicos = {
  agua: { nombreLegible: "Agua", color: "#3498db" },
  electricidad: { nombreLegible: "Electricidad", color: "#f1c40f" },
  gas: { nombreLegible: "Gas", color: "#e67e22" },
  internet: { nombreLegible: "Internet", color: "#9b59b6" },
  aa: { nombreLegible: "Aire Acondicionado", color: "#1abc9c" },
  aseoUrbano: { nombreLegible: "Aseo Urbano", color: "#34495e" },
  servicioSeguridad: {
    nombreLegible: "Servicio de Seguridad",
    color: "#7f8c8d",
  },
  combustible: { nombreLegible: "Combustible", color: "#c0392b" },
};

// Colores para los estados
const estadoColors = {
  DISPONIBLE: "#2ecc71", // Verde
  "DISP C/PROB": "#f39c12", // Amarillo/Naranja
  "SIN SERVICIO": "#e74c3c", // Rojo
  "DISP TANQUE": "#3498db", // Azul (para agua específicamente)
};

// --- FUNCIONES DE CÁLCULO Y PROCESAMIENTO ---

/**
 * Procesa los datos de servicios públicos y calcula estadísticas
 */
function procesarServiciosPublicos(datosArray) {
  console.log("Procesando servicios públicos:", datosArray.length, "centros");

  // Estructura para almacenar estadísticas
  const estadisticas = {
    porServicio: {},
    general: {
      totalCentros: datosArray.length,
      centrosConProblemas: 0,
      serviciosCriticos: 0,
      serviciosConProblemas: 0,
    },
    centros: [],
  };

  // Inicializar estructura por servicio
  Object.keys(serviciosPublicos).forEach((servicio) => {
    estadisticas.porServicio[servicio] = {
      nombreLegible: serviciosPublicos[servicio].nombreLegible,
      disponible: 0,
      conProblemas: 0,
      sinServicio: 0,
      dispTanque: 0,
      total: 0,
    };
  });

  // Procesar cada centro
  datosArray.forEach((centro, index) => {
    const servicios = centro?.infraestructura?.serviciosPublicos;
    const centroData = {
      nombre: centro.datosInstitucion?.nombre || `Centro ${index + 1}`,
      servicios: {},
      tieneProblemas: false,
    };

    if (servicios && typeof servicios === "object") {
      Object.keys(serviciosPublicos).forEach((servicioKey) => {
        const estado = servicios[servicioKey]?.estado;
        const estadoNormalizado = normalizarEstado(estado);

        centroData.servicios[servicioKey] = {
          estado: estadoNormalizado,
          estadoOriginal: estado,
          observacion: servicios[servicioKey]?.observacion || "",
        };

        // Contar por estado
        if (estadisticas.porServicio[servicioKey]) {
          estadisticas.porServicio[servicioKey].total++;

          switch (estadoNormalizado) {
            case "DISPONIBLE":
              estadisticas.porServicio[servicioKey].disponible++;
              break;
            case "DISP C/PROB":
              estadisticas.porServicio[servicioKey].conProblemas++;
              estadisticas.general.serviciosConProblemas++;
              centroData.tieneProblemas = true;
              break;
            case "SIN SERVICIO":
              estadisticas.porServicio[servicioKey].sinServicio++;
              estadisticas.general.serviciosCriticos++;
              centroData.tieneProblemas = true;
              break;
            case "DISP TANQUE":
              estadisticas.porServicio[servicioKey].dispTanque++;
              break;
          }
        }
      });
    }

    estadisticas.centros.push(centroData);
    if (centroData.tieneProblemas) {
      estadisticas.general.centrosConProblemas++;
    }
  });

  console.log("Estadísticas procesadas:", estadisticas);
  return estadisticas;
}

/**
 * Normaliza los estados de servicios públicos
 */
function normalizarEstado(estado) {
  if (!estado) return "SIN SERVICIO";

  const estadoUpper = estado.toUpperCase();
  if (estadoUpper.includes("DISPONIBLE")) return "DISPONIBLE";
  if (
    estadoUpper.includes("SIN SERVICIO") ||
    estadoUpper.includes("NO DISPONIBLE")
  )
    return "SIN SERVICIO";
  if (
    estadoUpper.includes("DISP C/PROB") ||
    estadoUpper.includes("CON PROBLEMAS")
  )
    return "DISP C/PROB";
  if (estadoUpper.includes("DISP TANQUE")) return "DISP TANQUE";

  return "DISPONIBLE"; // Por defecto
}

/**
 * Encuentra el servicio más crítico
 */
function encontrarServicioMasCritico(estadisticas) {
  let servicioMasCritico = { nombre: "N/A", porcentaje: 0 };

  Object.keys(estadisticas.porServicio).forEach((servicioKey) => {
    const servicio = estadisticas.porServicio[servicioKey];
    const porcentajeCritico =
      servicio.total > 0
        ? Math.round((servicio.sinServicio / servicio.total) * 100)
        : 0;

    if (porcentajeCritico > servicioMasCritico.porcentaje) {
      servicioMasCritico = {
        nombre: servicio.nombreLegible,
        porcentaje: porcentajeCritico,
      };
    }
  });

  return servicioMasCritico;
}

// --- FUNCIONES DE VISUALIZACIÓN ---

/**
 * Crea el gráfico de columnas apiladas para servicios públicos
 */
function createServiciosColumnChart(estadisticas) {
  const containerId = "serviciosColumnChart";
  if (!document.getElementById(containerId)) {
    console.warn(
      `Highcharts: Contenedor ${containerId} no encontrado en el DOM.`
    );
    setTimeout(() => {
      if (document.getElementById(containerId)) {
        createServiciosColumnChart(estadisticas);
      }
    }, 100);
    return;
  }

  const categorias = Object.values(estadisticas.porServicio).map(
    (s) => s.nombreLegible
  );

  // Preparar datos para el gráfico apilado
  const seriesData = {
    "SIN SERVICIO": [],
    "DISP C/PROB": [],
    "DISP TANQUE": [],
    DISPONIBLE: [],
  };

  Object.values(estadisticas.porServicio).forEach((servicio) => {
    const total = servicio.total || 1;
    seriesData["SIN SERVICIO"].push(
      Math.round((servicio.sinServicio / total) * 100)
    );
    seriesData["DISP C/PROB"].push(
      Math.round((servicio.conProblemas / total) * 100)
    );
    seriesData["DISP TANQUE"].push(
      Math.round((servicio.dispTanque / total) * 100)
    );
    seriesData["DISPONIBLE"].push(
      Math.round((servicio.disponible / total) * 100)
    );
  });

  // Destruir gráfico existente
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
      text: "Estado de Servicios Públicos por Tipo",
      style: {
        fontSize: "16px",
        fontWeight: "bold",
      },
    },
    xAxis: {
      categories: categorias,
      crosshair: true,
    },
    yAxis: {
      min: 0,
      max: 100,
      title: {
        text: "Porcentaje de Centros (%)",
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
        '<td style="padding:0"><b>{point.y:.1f}%</b></td></tr>',
      footerFormat: "</table>",
      shared: true,
      useHTML: true,
    },
    plotOptions: {
      column: {
        stacking: "percent",
        dataLabels: {
          enabled: true,
          format: "{point.y:.0f}%",
          style: {
            fontSize: "10px",
            fontWeight: "bold",
          },
        },
      },
    },
    series: [
      {
        name: "Sin Servicio",
        data: seriesData["SIN SERVICIO"],
        color: estadoColors["SIN SERVICIO"],
      },
      {
        name: "Con Problemas",
        data: seriesData["DISP C/PROB"],
        color: estadoColors["DISP C/PROB"],
      },
      {
        name: "Disp. Tanque",
        data: seriesData["DISP TANQUE"],
        color: estadoColors["DISP TANQUE"],
      },
      {
        name: "Disponible",
        data: seriesData["DISPONIBLE"],
        color: estadoColors["DISPONIBLE"],
      },
    ],
    credits: {
      enabled: false,
    },
  });
}

/**
 * Crea el gráfico de dona para distribución general
 */
function createServiciosDonutChart(estadisticas) {
  const containerId = "serviciosDonutChart";
  if (!document.getElementById(containerId)) {
    console.warn(
      `Highcharts: Contenedor ${containerId} no encontrado en el DOM.`
    );
    setTimeout(() => {
      if (document.getElementById(containerId)) {
        createServiciosDonutChart(estadisticas);
      }
    }, 100);
    return;
  }

  let totalServicios = 0;
  Object.values(estadisticas.porServicio).forEach((servicio) => {
    totalServicios += servicio.total;
  });

  const datosDonut = [
    {
      name: "Disponible",
      y: Object.values(estadisticas.porServicio).reduce(
        (sum, s) => sum + s.disponible,
        0
      ),
      color: estadoColors["DISPONIBLE"],
    },
    {
      name: "Con Problemas",
      y: Object.values(estadisticas.porServicio).reduce(
        (sum, s) => sum + s.conProblemas,
        0
      ),
      color: estadoColors["DISP C/PROB"],
    },
    {
      name: "Sin Servicio",
      y: Object.values(estadisticas.porServicio).reduce(
        (sum, s) => sum + s.sinServicio,
        0
      ),
      color: estadoColors["SIN SERVICIO"],
    },
    {
      name: "Disp. Tanque",
      y: Object.values(estadisticas.porServicio).reduce(
        (sum, s) => sum + s.dispTanque,
        0
      ),
      color: estadoColors["DISP TANQUE"],
    },
  ];

  // Destruir gráfico existente
  const existingChart = Highcharts.charts.find(
    (chart) => chart && chart.renderTo.id === containerId
  );
  if (existingChart) {
    existingChart.destroy();
  }

  Highcharts.chart(containerId, {
    chart: {
      type: "pie",
      height: 400,
    },
    title: {
      text: "Distribución General de Estados",
      style: {
        fontSize: "16px",
        fontWeight: "bold",
      },
    },
    plotOptions: {
      pie: {
        innerSize: "50%",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.percentage:.1f}%",
          distance: -30,
          style: {
            fontWeight: "bold",
            color: "white",
            textOutline: "1px contrast",
          },
        },
      },
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.y}</b> ({point.percentage:.1f}%)",
    },
    series: [
      {
        name: "Servicios",
        data: datosDonut,
      },
    ],
    credits: {
      enabled: false,
    },
  });
}

/**
 * Crea el gráfico Treemap para problemas
 */
function createServiciosTreemapChart(estadisticas) {
  const containerId = "serviciosTreemapChart";
  if (!document.getElementById(containerId)) {
    console.warn(
      `Highcharts: Contenedor ${containerId} no encontrado en el DOM.`
    );
    setTimeout(() => {
      if (document.getElementById(containerId)) {
        createServiciosTreemapChart(estadisticas);
      }
    }, 100);
    return;
  }

  // Preparar datos para Treemap
  const treemapData = [];

  Object.keys(estadisticas.porServicio).forEach((servicioKey) => {
    const servicio = estadisticas.porServicio[servicioKey];
    const problemasTotales = servicio.sinServicio + servicio.conProblemas;

    if (problemasTotales > 0) {
      treemapData.push({
        name: servicio.nombreLegible,
        value: problemasTotales,
        colorValue: problemasTotales, // Para escala de color
        servicio: servicioKey,
      });
    }
  });

  // Destruir gráfico existente
  const existingChart = Highcharts.charts.find(
    (chart) => chart && chart.renderTo.id === containerId
  );
  if (existingChart) {
    existingChart.destroy();
  }

  Highcharts.chart(containerId, {
    chart: {
      type: "treemap",
      height: 500,
    },
    title: {
      text: "Mapa de Problemas de Servicios Públicos",
      style: {
        fontSize: "16px",
        fontWeight: "bold",
      },
    },
    subtitle: {
      text: "Los bloques más grandes representan servicios con mayor cantidad de problemas",
    },
    series: [
      {
        type: "treemap",
        layoutAlgorithm: "squarified",
        data: treemapData,
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b><br>{point.value} problemas",
          style: {
            fontSize: "12px",
            fontWeight: "bold",
            color: "#ffffff",
            textOutline: "1px contrast",
          },
        },
        levels: [
          {
            level: 1,
            dataLabels: {
              enabled: true,
            },
            borderWidth: 3,
          },
        ],
      },
    ],
    colorAxis: {
      minColor: "#fee5d9",
      maxColor: "#a50f15",
    },
    tooltip: {
      pointFormat:
        "<b>{point.name}</b><br>Problemas reportados: {point.value}<br>Total centros: {point.servicioTotal}",
    },
    credits: {
      enabled: false,
    },
  });
}

/**
 * Genera la tabla de detalles
 */
function generateServiciosTable(estadisticas) {
  const tableBody = document.getElementById("serviciosTableBody");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  estadisticas.centros.forEach((centro) => {
    const row = tableBody.insertRow();

    // Celda del nombre del centro
    const cellNombre = row.insertCell();
    cellNombre.textContent = centro.nombre;
    cellNombre.style.fontWeight = "bold";

    // Celdas para cada servicio
    Object.keys(serviciosPublicos).forEach((servicioKey) => {
      const cell = row.insertCell();
      const servicio = centro.servicios[servicioKey];

      if (servicio) {
        let colorClass = "text-success";
        let icon = "✅";

        switch (servicio.estado) {
          case "SIN SERVICIO":
            colorClass = "text-danger";
            icon = "🔴";
            break;
          case "DISP C/PROB":
            colorClass = "text-warning";
            icon = "🟡";
            break;
          case "DISP TANQUE":
            colorClass = "text-info";
            icon = "💧";
            break;
        }

        cell.innerHTML = `<span class="${colorClass}">${icon} ${servicio.estado}</span>`;
        if (servicio.observacion) {
          cell.title = servicio.observacion;
        }
      } else {
        cell.innerHTML = '<span class="text-muted">N/A</span>';
      }
    });

    // Celda de estado general
    const cellEstado = row.insertCell();
    let estadoGeneral = "Óptimo";
    let estadoClass = "text-success";

    if (centro.tieneProblemas) {
      estadoGeneral = "Con Problemas";
      estadoClass = "text-warning";

      // Verificar si tiene servicios críticos
      const serviciosCriticos = Object.values(centro.servicios).filter(
        (s) => s && s.estado === "SIN SERVICIO"
      ).length;

      if (serviciosCriticos > 0) {
        estadoGeneral = "Crítico";
        estadoClass = "text-danger";
      }
    }

    cellEstado.innerHTML = `<span class="${estadoClass} fw-bold">${estadoGeneral}</span>`;
  });
}

/**
 * Actualiza las tarjetas de resumen
 */
function actualizarResumenServicios(estadisticas) {
  const servicioMasCritico = encontrarServicioMasCritico(estadisticas);

  // Actualizar tarjetas
  document.getElementById("servicios-criticos").textContent =
    estadisticas.general.serviciosCriticos;
  document.getElementById("servicios-problemas").textContent =
    estadisticas.general.serviciosConProblemas;
  document.getElementById(
    "servicio-critico-porcentaje"
  ).textContent = `${servicioMasCritico.porcentaje}%`;
  document.getElementById("servicio-critico-nombre").textContent =
    servicioMasCritico.nombre;
  document.getElementById("centros-afectados").textContent =
    estadisticas.general.centrosConProblemas;
}

// --- FUNCIÓN PRINCIPAL DE RENDERIZADO ---

/**
 * Función principal para generar el dashboard de servicios públicos
 */
export function renderDashboard(dataToUse) {
  console.log("=== RENDER DASHBOARD SERVICIOS PÚBLICOS ===");

  if (!dataToUse || dataToUse.length === 0) {
    // Mostrar mensaje de no datos
    const containers = [
      "serviciosColumnChart",
      "serviciosDonutChart",
      "serviciosTreemapChart",
    ];
    containers.forEach((containerId) => {
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML =
          "<p class='text-center mt-5'>No hay datos para los filtros seleccionados.</p>";
      }
    });

    const tableBody = document.getElementById("serviciosTableBody");
    if (tableBody) tableBody.innerHTML = "";

    return;
  }

  // 1. Procesar datos
  const estadisticas = procesarServiciosPublicos(dataToUse);

  // 2. Actualizar resumen
  actualizarResumenServicios(estadisticas);

  // 3. Crear visualizaciones
  createServiciosColumnChart(estadisticas);
  createServiciosDonutChart(estadisticas);
  createServiciosTreemapChart(estadisticas);
  generateServiciosTable(estadisticas);

  console.log("=== FIN RENDER DASHBOARD SERVICIOS PÚBLICOS ===");
}

// --- FUNCIÓN DE INICIALIZACIÓN ---

export function initialize(dataToUse) {
  console.log("=== INICIALIZANDO DASHBOARD SERVICIOS PÚBLICOS ===");

  setTimeout(() => {
    renderDashboard(dataToUse);
  }, 100);
}
