// dashboard-6.js - Dashboard de Evaluación del Personal

import { filteredData, areaNames } from "./main_dashboard.js";

// Categorización del personal
const categoriasPersonal = {
  serviciosMedicos: {
    nombre: "Servicios Médicos",
    color: "#3498db",
    subcategorias: {
      "medicina-general": "Medicina General",
      "medicina-familiar": "Medicina Familiar",
      "medicina-interna": "Medicina Interna",
      cardiologia: "Cardiología",
      traumatologia: "Traumatología",
      pediatria: "Pediatría",
      ginecologia: "Ginecología",
      psicologia: "Psicología",
      odontologia: "Odontología",
    },
  },
  paramedicosAfines: {
    nombre: "Paramedicos y Afines",
    color: "#2ecc71",
    subcategorias: {
      "enfermeras-enfermeros": "Enfermeras/Enfermeros",
      "camareros-camareras": "Camareros/Camareras",
      "radiologos-radiologas": "Radiólogos",
      bioanalistas: "Bioanalistas",
    },
  },
  administrativo: {
    nombre: "Administrativo",
    color: "#f39c12",
    subcategorias: {
      profesionales: "Profesionales",
      tsu: "TSU",
      bachilleres: "Bachilleres",
    },
  },
  obrero: {
    nombre: "Obrero",
    color: "#e74c3c",
    subcategorias: {
      "servicios-generales": "Servicios Generales",
      seguridad: "Seguridad",
    },
  },
};

// Especialidades médicas críticas (alta prioridad)
const especialidadesCriticas = [
  "medicina-general",
  "medicina-interna",
  "pediatria",
  "ginecologia",
  "enfermeras-enfermeros",
  "cardiologia",
];

// --- FUNCIONES DE PROCESAMIENTO ---

function procesarEvaluacionPersonal(datosArray) {
  console.log(
    "Procesando evaluación de personal:",
    datosArray.length,
    "centros"
  );

  const estadisticas = {
    porCategoria: {},
    porEspecialidad: {},
    porInstitucion: {},
    general: {
      totalRequerido: 0,
      totalDisponible: 0,
      deficitTotal: 0,
      areaMasCritica: { nombre: "N/A", deficit: 0 },
    },
    centros: [],
  };

  // Inicializar estructuras
  Object.keys(categoriasPersonal).forEach((categoriaKey) => {
    const categoria = categoriasPersonal[categoriaKey];
    estadisticas.porCategoria[categoriaKey] = {
      nombre: categoria.nombre,
      requerido: 0,
      disponible: 0,
      deficit: 0,
      color: categoria.color,
    };

    // Inicializar por especialidad
    Object.keys(categoria.subcategorias).forEach((especialidadKey) => {
      estadisticas.porEspecialidad[especialidadKey] = {
        nombre: categoria.subcategorias[especialidadKey],
        requerido: 0,
        disponible: 0,
        deficit: 0,
        categoria: categoriaKey,
        critica: especialidadesCriticas.includes(especialidadKey),
      };
    });
  });

  // Procesar cada centro
  datosArray.forEach((centro, index) => {
    const personal = centro?.personalInstitucion;
    const datosInstitucion = centro.datosInstitucion;
    const serviciosMedicos = centro?.serviciosMedicos || {};

    const centroData = {
      nombre: datosInstitucion?.nombre || `Centro ${index + 1}`,
      tipoInstitucion: datosInstitucion?.tipoInstitucion || "N/A",
      serviciosActivos: contarServiciosActivos(serviciosMedicos),
      personal: {
        serviciosMedicos: { requerido: 0, disponible: 0 },
        paramedicos: { requerido: 0, disponible: 0 },
        administrativos: { requerido: 0, disponible: 0 },
        obreros: { requerido: 0, disponible: 0 },
        total: { requerido: 0, disponible: 0 },
      },
      metricas: {
        deficitTotal: 0,
        ratioPersonalServicios: 0,
        estadoDotacion: "CRITICO",
      },
    };

    if (personal) {
      // Procesar cada categoría de personal
      Object.keys(personal).forEach((categoriaKey) => {
        if (personal[categoriaKey]) {
          Object.keys(personal[categoriaKey]).forEach((especialidadKey) => {
            const puesto = personal[categoriaKey][especialidadKey];
            if (puesto && typeof puesto === "object") {
              const requerido = parseInt(puesto.requerido) || 0;
              const disponible = parseInt(puesto.disponible) || 0;

              // Actualizar estadísticas generales
              estadisticas.general.totalRequerido += requerido;
              estadisticas.general.totalDisponible += disponible;

              // Actualizar por categoría
              if (estadisticas.porCategoria[categoriaKey]) {
                estadisticas.porCategoria[categoriaKey].requerido += requerido;
                estadisticas.porCategoria[categoriaKey].disponible +=
                  disponible;
              }

              // Actualizar por especialidad
              if (estadisticas.porEspecialidad[especialidadKey]) {
                estadisticas.porEspecialidad[especialidadKey].requerido +=
                  requerido;
                estadisticas.porEspecialidad[especialidadKey].disponible +=
                  disponible;
              }

              // Actualizar datos del centro
              if (categoriaKey === "servicios-medicos") {
                centroData.personal.serviciosMedicos.requerido += requerido;
                centroData.personal.serviciosMedicos.disponible += disponible;
              } else if (categoriaKey === "paramedicos-y-afines") {
                centroData.personal.paramedicos.requerido += requerido;
                centroData.personal.paramedicos.disponible += disponible;
              } else if (categoriaKey === "administrativo") {
                centroData.personal.administrativos.requerido += requerido;
                centroData.personal.administrativos.disponible += disponible;
              } else if (categoriaKey === "obrero") {
                centroData.personal.obreros.requerido += requerido;
                centroData.personal.obreros.disponible += disponible;
              }

              centroData.personal.total.requerido += requerido;
              centroData.personal.total.disponible += disponible;
            }
          });
        }
      });

      // Calcular métricas del centro
      centroData.metricas.deficitTotal =
        centroData.personal.total.requerido > 0
          ? Math.round(
              ((centroData.personal.total.requerido -
                centroData.personal.total.disponible) /
                centroData.personal.total.requerido) *
                100
            )
          : 0;

      centroData.metricas.ratioPersonalServicios =
        centroData.serviciosActivos > 0
          ? Math.round(
              centroData.personal.total.disponible / centroData.serviciosActivos
            )
          : 0;

      centroData.metricas.estadoDotacion = determinarEstadoDotacion(centroData);
    }

    estadisticas.centros.push(centroData);
  });

  // Calcular déficits y área más crítica
  calcularDeficits(estadisticas);
  calcularAreaMasCritica(estadisticas);

  console.log("Estadísticas de evaluación de personal:", estadisticas);
  return estadisticas;
}

function contarServiciosActivos(serviciosMedicos) {
  if (!serviciosMedicos) return 0;

  let serviciosActivos = 0;
  Object.keys(serviciosMedicos).forEach((servicioKey) => {
    const servicio = serviciosMedicos[servicioKey];
    if (servicio && servicio.estado && servicio.estado.includes("ACTIVO")) {
      serviciosActivos++;
    }
  });
  return serviciosActivos;
}

function determinarEstadoDotacion(centroData) {
  const deficit = centroData.metricas.deficitTotal;

  if (deficit <= 15) return "OPTIMO";
  if (deficit <= 35) return "REGULAR";
  if (deficit <= 60) return "CRITICO";
  return "GRAVE";
}

function calcularDeficits(estadisticas) {
  // Calcular déficits por categoría
  Object.keys(estadisticas.porCategoria).forEach((categoriaKey) => {
    const categoria = estadisticas.porCategoria[categoriaKey];
    categoria.deficit =
      categoria.requerido > 0
        ? Math.round(
            ((categoria.requerido - categoria.disponible) /
              categoria.requerido) *
              100
          )
        : 0;
  });

  // Calcular déficits por especialidad
  Object.keys(estadisticas.porEspecialidad).forEach((especialidadKey) => {
    const especialidad = estadisticas.porEspecialidad[especialidadKey];
    especialidad.deficit =
      especialidad.requerido > 0
        ? Math.round(
            ((especialidad.requerido - especialidad.disponible) /
              especialidad.requerido) *
              100
          )
        : 0;
  });

  // Calcular déficit total
  estadisticas.general.deficitTotal =
    estadisticas.general.totalRequerido > 0
      ? Math.round(
          ((estadisticas.general.totalRequerido -
            estadisticas.general.totalDisponible) /
            estadisticas.general.totalRequerido) *
            100
        )
      : 0;
}

function calcularAreaMasCritica(estadisticas) {
  let maxDeficit = 0;
  let areaCritica = "N/A";

  Object.keys(estadisticas.porEspecialidad).forEach((especialidadKey) => {
    const especialidad = estadisticas.porEspecialidad[especialidadKey];
    if (especialidad.deficit > maxDeficit && especialidad.critica) {
      maxDeficit = especialidad.deficit;
      areaCritica = especialidad.nombre;
    }
  });

  estadisticas.general.areaMasCritica = {
    nombre: areaCritica,
    deficit: maxDeficit,
  };
}

// --- FUNCIONES DE VISUALIZACIÓN ---

function createDistribucionPersonalChart(estadisticas) {
  const containerId = "distribucionPersonalChart";
  if (!document.getElementById(containerId)) {
    console.warn(
      `Highcharts: Contenedor ${containerId} no encontrado en el DOM.`
    );
    setTimeout(() => {
      if (document.getElementById(containerId)) {
        createDistribucionPersonalChart(estadisticas);
      }
    }, 100);
    return;
  }

  const categorias = Object.values(estadisticas.porCategoria).map(
    (c) => c.nombre
  );
  const datosRequerido = Object.values(estadisticas.porCategoria).map(
    (c) => c.requerido
  );
  const datosDisponible = Object.values(estadisticas.porCategoria).map(
    (c) => c.disponible
  );
  const datosDeficit = Object.values(estadisticas.porCategoria).map(
    (c) => c.deficit
  );

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
      text: "Distribución y Déficit de Personal por Categoría",
      style: {
        fontSize: "16px",
        fontWeight: "bold",
      },
    },
    xAxis: {
      categories: categorias,
      crosshair: true,
    },
    yAxis: [
      {
        title: {
          text: "Cantidad de Personal",
        },
        min: 0,
      },
      {
        title: {
          text: "Déficit (%)",
        },
        opposite: true,
        max: 100,
        labels: {
          format: "{value}%",
        },
      },
    ],
    tooltip: {
      shared: true,
    },
    plotOptions: {
      column: {
        grouping: false,
        shadow: false,
        borderWidth: 0,
      },
    },
    series: [
      {
        name: "Personal Requerido",
        data: datosRequerido,
        color: "#95a5a6",
        pointPadding: 0.3,
        pointPlacement: -0.2,
      },
      {
        name: "Personal Disponible",
        data: datosDisponible,
        color: "#2ecc71",
        pointPadding: 0.3,
        pointPlacement: 0.2,
      },
      {
        name: "Déficit",
        data: datosDeficit,
        type: "spline",
        yAxis: 1,
        color: "#e74c3c",
        marker: {
          enabled: true,
          radius: 4,
        },
        dashStyle: "ShortDot",
      },
    ],
    credits: {
      enabled: false,
    },
  });
}

function createHeatmapDeficitPersonal(estadisticas) {
  const containerId = "heatmapDeficitPersonal";
  if (!document.getElementById(containerId)) {
    console.warn(
      `Highcharts: Contenedor ${containerId} no encontrado en el DOM.`
    );
    setTimeout(() => {
      if (document.getElementById(containerId)) {
        createHeatmapDeficitPersonal(estadisticas);
      }
    }, 100);
    return;
  }

  const heatmapData = [];
  Object.keys(estadisticas.porEspecialidad).forEach((especialidadKey) => {
    const especialidad = estadisticas.porEspecialidad[especialidadKey];
    if (especialidad.requerido > 0) {
      heatmapData.push({
        name: especialidad.nombre,
        value: especialidad.deficit,
        categoria: especialidad.categoria,
        critica: especialidad.critica,
      });
    }
  });

  const existingChart = Highcharts.charts.find(
    (chart) => chart && chart.renderTo.id === containerId
  );
  if (existingChart) {
    existingChart.destroy();
  }

  Highcharts.chart(containerId, {
    chart: {
      type: "treemap",
      height: 400,
    },
    title: {
      text: "Mapa de Calor - Déficit de Personal por Especialidad",
      style: {
        fontSize: "16px",
        fontWeight: "bold",
      },
    },
    subtitle: {
      text: "Los bloques más grandes representan especialidades con mayor déficit",
    },
    series: [
      {
        type: "treemap",
        layoutAlgorithm: "squarified",
        data: heatmapData,
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b><br>{point.value}%",
          style: {
            fontSize: "10px",
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
            borderWidth: 2,
          },
        ],
      },
    ],
    colorAxis: {
      minColor: "#fee5d9",
      maxColor: "#a50f15",
      min: 0,
      max: 100,
    },
    tooltip: {
      pointFormat:
        "<b>{point.name}</b><br>Déficit: <b>{point.value}%</b><br>Categoría: {point.categoria}",
    },
    credits: {
      enabled: false,
    },
  });
}

function createBrechasPersonalChart(estadisticas) {
  const containerId = "brechasPersonalChart";
  if (!document.getElementById(containerId)) {
    console.warn(
      `Highcharts: Contenedor ${containerId} no encontrado en el DOM.`
    );
    setTimeout(() => {
      if (document.getElementById(containerId)) {
        createBrechasPersonalChart(estadisticas);
      }
    }, 100);
    return;
  }

  // Agrupar por tipo de institución
  const tiposInstitucion = {};
  estadisticas.centros.forEach((centro) => {
    const tipo = centro.tipoInstitucion;
    if (!tiposInstitucion[tipo]) {
      tiposInstitucion[tipo] = {
        centros: 0,
        deficitTotal: 0,
        personalTotal: 0,
      };
    }
    tiposInstitucion[tipo].centros++;
    tiposInstitucion[tipo].deficitTotal += centro.metricas.deficitTotal;
    tiposInstitucion[tipo].personalTotal += centro.personal.total.disponible;
  });

  // Calcular promedios
  Object.keys(tiposInstitucion).forEach((tipo) => {
    const data = tiposInstitucion[tipo];
    data.deficitPromedio =
      data.centros > 0 ? Math.round(data.deficitTotal / data.centros) : 0;
    data.personalPromedio =
      data.centros > 0 ? Math.round(data.personalTotal / data.centros) : 0;
  });

  const categorias = Object.keys(tiposInstitucion);
  const datosDeficit = Object.values(tiposInstitucion).map(
    (t) => t.deficitPromedio
  );
  const datosPersonal = Object.values(tiposInstitucion).map(
    (t) => t.personalPromedio
  );

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
      text: "Análisis de Brechas por Tipo de Institución",
      style: {
        fontSize: "16px",
        fontWeight: "bold",
      },
    },
    xAxis: {
      categories: categorias,
      crosshair: true,
    },
    yAxis: [
      {
        title: {
          text: "Déficit Promedio (%)",
        },
        labels: {
          format: "{value}%",
        },
        max: 100,
      },
      {
        title: {
          text: "Personal Promedio",
        },
        opposite: true,
      },
    ],
    tooltip: {
      shared: true,
    },
    series: [
      {
        name: "Déficit Promedio",
        data: datosDeficit,
        yAxis: 0,
        type: "column",
        color: "#e74c3c",
        dataLabels: {
          enabled: true,
          format: "{y}%",
        },
      },
      {
        name: "Personal Promedio",
        data: datosPersonal,
        yAxis: 1,
        type: "spline",
        color: "#3498db",
        marker: {
          enabled: true,
        },
      },
    ],
    credits: {
      enabled: false,
    },
  });
}

function createRelacionPersonalServiciosChart(estadisticas) {
  const containerId = "relacionPersonalServiciosChart";
  if (!document.getElementById(containerId)) {
    console.warn(
      `Highcharts: Contenedor ${containerId} no encontrado en el DOM.`
    );
    return;
  }

  const datos = estadisticas.centros.map((centro) => ({
    x: centro.serviciosActivos,
    y: centro.personal.total.disponible,
    name: centro.nombre,
    deficit: centro.metricas.deficitTotal,
    estado: centro.metricas.estadoDotacion,
  }));

  const existingChart = Highcharts.charts.find(
    (chart) => chart && chart.renderTo.id === containerId
  );
  if (existingChart) {
    existingChart.destroy();
  }

  Highcharts.chart(containerId, {
    chart: {
      type: "scatter",
      height: 400,
    },
    title: {
      text: "Relación Personal vs Servicios Activos",
      style: {
        fontSize: "16px",
        fontWeight: "bold",
      },
    },
    xAxis: {
      title: {
        text: "Número de Servicios Activos",
      },
      min: 0,
    },
    yAxis: {
      title: {
        text: "Personal Disponible",
      },
      min: 0,
    },
    tooltip: {
      pointFormat:
        "<b>{point.name}</b><br>Servicios: {point.x}<br>Personal: {point.y}<br>Déficit: {point.deficit}%",
    },
    series: [
      {
        name: "Centros de Salud",
        data: datos,
        color: "rgba(52, 152, 219, 0.7)",
        marker: {
          radius: 6,
        },
      },
    ],
    credits: {
      enabled: false,
    },
  });
}

function createEspecialidadesCriticasChart(estadisticas) {
  const containerId = "especialidadesCriticasChart";
  if (!document.getElementById(containerId)) {
    console.warn(
      `Highcharts: Contenedor ${containerId} no encontrado en el DOM.`
    );
    return;
  }

  // Filtrar especialidades críticas con déficit
  const especialidadesCriticas = Object.values(estadisticas.porEspecialidad)
    .filter((esp) => esp.critica && esp.deficit > 0)
    .sort((a, b) => b.deficit - a.deficit)
    .slice(0, 10);

  const categorias = especialidadesCriticas.map((esp) => esp.nombre);
  const datosDeficit = especialidadesCriticas.map((esp) => esp.deficit);

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
      text: "Especialidades Médicas con Mayor Déficit",
      style: {
        fontSize: "16px",
        fontWeight: "bold",
      },
    },
    xAxis: {
      categories: categorias,
      title: {
        text: null,
      },
    },
    yAxis: {
      min: 0,
      max: 100,
      title: {
        text: "Déficit (%)",
      },
      labels: {
        format: "{value}%",
      },
    },
    tooltip: {
      pointFormat: "Déficit: <b>{point.y}%</b>",
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true,
          format: "{point.y}%",
        },
      },
    },
    series: [
      {
        name: "Déficit",
        data: datosDeficit,
        colorByPoint: true,
      },
    ],
    credits: {
      enabled: false,
    },
  });
}

function generatePersonalTable(estadisticas) {
  const tableBody = document.getElementById("personalTableBody");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  estadisticas.centros.forEach((centro) => {
    const row = tableBody.insertRow();

    // Nombre del centro
    const cellNombre = row.insertCell();
    cellNombre.textContent = centro.nombre;
    cellNombre.style.fontWeight = "bold";

    // Servicios Médicos
    const cellMedicos = row.insertCell();
    const deficitMedicos =
      centro.personal.serviciosMedicos.requerido > 0
        ? Math.round(
            ((centro.personal.serviciosMedicos.requerido -
              centro.personal.serviciosMedicos.disponible) /
              centro.personal.serviciosMedicos.requerido) *
              100
          )
        : 0;
    cellMedicos.innerHTML = `${centro.personal.serviciosMedicos.disponible}/${centro.personal.serviciosMedicos.requerido}<br><small class="text-danger">${deficitMedicos}% déficit</small>`;

    // Paramedicos
    const cellParamedicos = row.insertCell();
    const deficitParamedicos =
      centro.personal.paramedicos.requerido > 0
        ? Math.round(
            ((centro.personal.paramedicos.requerido -
              centro.personal.paramedicos.disponible) /
              centro.personal.paramedicos.requerido) *
              100
          )
        : 0;
    cellParamedicos.innerHTML = `${centro.personal.paramedicos.disponible}/${centro.personal.paramedicos.requerido}<br><small class="text-danger">${deficitParamedicos}% déficit</small>`;

    // Administrativos
    const cellAdmin = row.insertCell();
    const deficitAdmin =
      centro.personal.administrativos.requerido > 0
        ? Math.round(
            ((centro.personal.administrativos.requerido -
              centro.personal.administrativos.disponible) /
              centro.personal.administrativos.requerido) *
              100
          )
        : 0;
    cellAdmin.innerHTML = `${centro.personal.administrativos.disponible}/${centro.personal.administrativos.requerido}<br><small class="text-danger">${deficitAdmin}% déficit</small>`;

    // Obreros
    const cellObreros = row.insertCell();
    const deficitObreros =
      centro.personal.obreros.requerido > 0
        ? Math.round(
            ((centro.personal.obreros.requerido -
              centro.personal.obreros.disponible) /
              centro.personal.obreros.requerido) *
              100
          )
        : 0;
    cellObreros.innerHTML = `${centro.personal.obreros.disponible}/${centro.personal.obreros.requerido}<br><small class="text-danger">${deficitObreros}% déficit</small>`;

    // Personal Total
    const cellTotal = row.insertCell();
    cellTotal.innerHTML = `<strong>${centro.personal.total.disponible}/${centro.personal.total.requerido}</strong>`;

    // Déficit Total
    const cellDeficit = row.insertCell();
    cellDeficit.innerHTML = `<span class="fw-bold text-danger">${centro.metricas.deficitTotal}%</span>`;

    // Ratio Personal/Servicios
    const cellRatio = row.insertCell();
    cellRatio.innerHTML = `<span class="fw-bold">${centro.metricas.ratioPersonalServicios}</span>`;

    // Estado de Dotación
    const cellEstado = row.insertCell();
    let estadoClass = "text-success";
    if (centro.metricas.estadoDotacion === "REGULAR")
      estadoClass = "text-warning";
    if (centro.metricas.estadoDotacion === "CRITICO")
      estadoClass = "text-danger";
    if (centro.metricas.estadoDotacion === "GRAVE") estadoClass = "text-dark";
    cellEstado.innerHTML = `<span class="${estadoClass} fw-bold">${centro.metricas.estadoDotacion}</span>`;
  });
}

// --- FUNCIÓN PRINCIPAL DE RENDERIZADO ---

export function renderDashboard(dataToUse) {
  console.log("=== RENDER DASHBOARD EVALUACIÓN PERSONAL ===");

  if (!dataToUse || dataToUse.length === 0) {
    const containers = [
      "distribucionPersonalChart",
      "heatmapDeficitPersonal",
      "brechasPersonalChart",
      "relacionPersonalServiciosChart",
      "especialidadesCriticasChart",
    ];
    containers.forEach((containerId) => {
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML =
          "<p class='text-center mt-5'>No hay datos para los filtros seleccionados.</p>";
      }
    });

    const tableBody = document.getElementById("personalTableBody");
    if (tableBody) tableBody.innerHTML = "";
    return;
  }

  const estadisticas = procesarEvaluacionPersonal(dataToUse);

  // Actualizar tarjetas de resumen
  document.getElementById("personal-requerido").textContent =
    estadisticas.general.totalRequerido.toLocaleString();
  document.getElementById("personal-disponible").textContent =
    estadisticas.general.totalDisponible.toLocaleString();
  document.getElementById(
    "deficit-personal"
  ).textContent = `${estadisticas.general.deficitTotal}%`;
  document.getElementById("area-critica-personal").textContent =
    estadisticas.general.areaMasCritica.nombre;
  document.getElementById(
    "badge-critica-personal"
  ).textContent = `${estadisticas.general.areaMasCritica.deficit}%`;

  // Crear todas las visualizaciones
  createDistribucionPersonalChart(estadisticas);
  createHeatmapDeficitPersonal(estadisticas);
  createBrechasPersonalChart(estadisticas);
  createRelacionPersonalServiciosChart(estadisticas);
  createEspecialidadesCriticasChart(estadisticas);
  generatePersonalTable(estadisticas);

  console.log("=== FIN RENDER DASHBOARD EVALUACIÓN PERSONAL ===");
}

export function initialize(dataToUse) {
  console.log("=== INICIALIZANDO DASHBOARD EVALUACIÓN PERSONAL ===");

  setTimeout(() => {
    renderDashboard(dataToUse);
  }, 100);
}
