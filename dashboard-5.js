// dashboard-5.js - Dashboard de Servicios Médicos

import { filteredData, areaNames } from "./main_dashboard.js";

// Categorización inteligente de servicios médicos
const categoriasServiciosMedicos = {
  medicinaGeneral: {
    nombre: "Medicina General y Familiar",
    servicios: [
      "medicina-general",
      "medicina-familiar",
      "medicina-interna",
      "medicina-preventiva",
      "medicina-ocupacional",
    ],
    color: "#3498db",
    esencial: true,
  },
  especialidadesBasicas: {
    nombre: "Especialidades Básicas",
    servicios: [
      "pediatria",
      "ginecologia",
      "obstetricia",
      "gineco-obstetricia",
      "geriatria",
    ],
    color: "#2ecc71",
    esencial: true,
  },
  especialidadesQuirurgicas: {
    nombre: "Especialidades Quirúrgicas",
    servicios: [
      "traumatologia",
      "cirugia",
      "cardiologia",
      "neumologia",
      "gastroenterologia",
    ],
    color: "#e74c3c",
    esencial: false,
  },
  especialidadesDiagnosticas: {
    nombre: "Especialidades Diagnósticas",
    servicios: [
      "oncologia",
      "nefrologia",
      "odontologia",
      "oftalmologia",
      "dermatologia",
    ],
    color: "#9b59b6",
    esencial: false,
  },
  saludMental: {
    nombre: "Salud Mental",
    servicios: ["psicologia", "psiquiatria"],
    color: "#f39c12",
    esencial: true,
  },
  serviciosPreventivos: {
    nombre: "Servicios Preventivos",
    servicios: ["infectologia", "vacunacion", "inmunizacion"],
    color: "#1abc9c",
    esencial: true,
  },
  serviciosApoyo: {
    nombre: "Servicios de Apoyo",
    servicios: ["podologia", "fisiatria", "uci", "rmn"],
    color: "#34495e",
    esencial: false,
  },
};

// Servicios considerados esenciales (debe tener al menos el 80% de estos)
const serviciosEsenciales = [
  "medicina-general",
  "medicina-familiar",
  "pediatria",
  "ginecologia",
  "obstetricia",
  "psicologia",
  "vacunacion",
  "inmunizacion",
];

// Colores para estados
const estadoColors = {
  ACTIVO: "#2ecc71",
  "ACTIVO C/PROB": "#f39c12",
  INACTIVO: "#e74c3c",
  "NO EXISTE": "#95a5a6",
};

// --- FUNCIONES DE PROCESAMIENTO ---

function procesarServiciosMedicos(datosArray) {
  console.log("Procesando servicios médicos:", datosArray.length, "centros");

  const estadisticas = {
    porCategoria: {},
    porServicio: {},
    porInstitucion: {},
    geografico: {},
    general: {
      totalServicios: 0,
      serviciosActivos: 0,
      serviciosConProblemas: 0,
      serviciosInactivos: 0,
      centrosCompletos: 0,
      servicioMasCritico: { nombre: "N/A", inactividad: 0 },
    },
    centros: [],
  };

  // Inicializar estructuras
  Object.keys(categoriasServiciosMedicos).forEach((categoriaKey) => {
    const categoria = categoriasServiciosMedicos[categoriaKey];
    estadisticas.porCategoria[categoriaKey] = {
      nombre: categoria.nombre,
      activo: 0,
      activoConProblemas: 0,
      inactivo: 0,
      noExiste: 0,
      total: 0,
      color: categoria.color,
      esencial: categoria.esencial,
    };

    // Inicializar por servicio dentro de la categoría
    categoria.servicios.forEach((servicioKey) => {
      estadisticas.porServicio[servicioKey] = {
        nombre: servicioKey.replace(/-/g, " ").toUpperCase(),
        activo: 0,
        activoConProblemas: 0,
        inactivo: 0,
        noExiste: 0,
        total: 0,
        categoria: categoriaKey,
        esencial: serviciosEsenciales.includes(servicioKey),
      };
    });
  });

  // Procesar cada centro
  datosArray.forEach((centro, index) => {
    const servicios = centro?.serviciosMedicos;
    const datosInstitucion = centro.datosInstitucion;
    const centroData = {
      nombre: datosInstitucion?.nombre || `Centro ${index + 1}`,
      tipoInstitucion: datosInstitucion?.tipoInstitucion || "N/A",
      municipio: datosInstitucion?.municipio || "N/A",
      parroquia: datosInstitucion?.parroquia || "N/A",
      servicios: {},
      resumen: {
        total: 0,
        activos: 0,
        conProblemas: 0,
        inactivos: 0,
        noExisten: 0,
        esencialesActivos: 0,
        coberturaTotal: 0,
        nivelComplejidad: "BAJA",
      },
      estadoGeneral: "CRITICO",
    };

    if (servicios) {
      // Procesar cada servicio médico
      Object.keys(servicios).forEach((servicioKey) => {
        if (estadisticas.porServicio[servicioKey]) {
          const servicio = servicios[servicioKey];
          const estado = normalizarEstadoServicioMedico(servicio.estado);

          centroData.servicios[servicioKey] = {
            estado: estado,
            observacion: servicio.observacion || "",
          };

          centroData.resumen.total++;
          estadisticas.porServicio[servicioKey].total++;
          estadisticas.general.totalServicios++;

          // Contar por estado
          switch (estado) {
            case "ACTIVO":
              centroData.resumen.activos++;
              estadisticas.porServicio[servicioKey].activo++;
              estadisticas.general.serviciosActivos++;
              if (serviciosEsenciales.includes(servicioKey)) {
                centroData.resumen.esencialesActivos++;
              }
              break;
            case "ACTIVO C/PROB":
              centroData.resumen.conProblemas++;
              estadisticas.porServicio[servicioKey].activoConProblemas++;
              estadisticas.general.serviciosConProblemas++;
              break;
            case "INACTIVO":
              centroData.resumen.inactivos++;
              estadisticas.porServicio[servicioKey].inactivo++;
              estadisticas.general.serviciosInactivos++;
              break;
            case "NO EXISTE":
              centroData.resumen.noExisten++;
              estadisticas.porServicio[servicioKey].noExiste++;
              break;
          }

          // Contar por categoría
          const categoriaKey = estadisticas.porServicio[servicioKey].categoria;
          if (estadisticas.porCategoria[categoriaKey]) {
            estadisticas.porCategoria[categoriaKey].total++;
            estadisticas.porCategoria[categoriaKey][estado.toLowerCase()]++;
          }
        }
      });

      // Calcular métricas del centro
      centroData.resumen.coberturaTotal =
        centroData.resumen.total > 0
          ? Math.round(
              (centroData.resumen.activos / centroData.resumen.total) * 100
            )
          : 0;

      // Determinar nivel de complejidad - CORREGIDO: pasar estadisticas como parámetro
      centroData.resumen.nivelComplejidad = determinarNivelComplejidad(
        centroData,
        estadisticas
      );

      // Determinar estado general
      centroData.estadoGeneral = determinarEstadoGeneralServicios(centroData);

      // Contar centros completos
      if (centroData.resumen.coberturaTotal >= 90) {
        estadisticas.general.centrosCompletos++;
      }
    }

    // Agregar a estadísticas geográficas
    const claveGeografica = `${centroData.municipio}-${centroData.parroquia}`;
    if (!estadisticas.geografico[claveGeografica]) {
      estadisticas.geografico[claveGeografica] = {
        municipio: centroData.municipio,
        parroquia: centroData.parroquia,
        centros: 0,
        serviciosActivos: 0,
        serviciosTotales: 0,
      };
    }
    estadisticas.geografico[claveGeografica].centros++;
    estadisticas.geografico[claveGeografica].serviciosActivos +=
      centroData.resumen.activos;
    estadisticas.geografico[claveGeografica].serviciosTotales +=
      centroData.resumen.total;

    estadisticas.centros.push(centroData);
  });

  // Calcular servicio más crítico
  calcularServicioMasCriticoMedicos(estadisticas);

  console.log("Estadísticas de servicios médicos:", estadisticas);
  return estadisticas;
}

function normalizarEstadoServicioMedico(estado) {
  if (!estado) return "NO EXISTE";
  const estadoUpper = estado.toUpperCase();
  if (estadoUpper.includes("ACTIVO") && estadoUpper.includes("PROB"))
    return "ACTIVO C/PROB";
  if (estadoUpper.includes("ACTIVO")) return "ACTIVO";
  if (estadoUpper.includes("INACTIVO")) return "INACTIVO";
  if (estadoUpper.includes("NO EXISTE")) return "NO EXISTE";
  return "NO EXISTE";
}

// CORREGIDO: Agregar estadisticas como parámetro
function determinarNivelComplejidad(centroData, estadisticas) {
  const serviciosActivos = centroData.resumen.activos;
  const serviciosEspecializados = Object.keys(centroData.servicios).filter(
    (servicioKey) => {
      const servicio = estadisticas.porServicio[servicioKey];
      return servicio && !servicio.esencial;
    }
  ).length;

  if (serviciosActivos >= 20 && serviciosEspecializados >= 8) return "ALTA";
  if (serviciosActivos >= 12 && serviciosEspecializados >= 4) return "MEDIA";
  return "BAJA";
}

function determinarEstadoGeneralServicios(centroData) {
  const cobertura = centroData.resumen.coberturaTotal;
  const esencialesCobertura =
    serviciosEsenciales.length > 0
      ? (centroData.resumen.esencialesActivos / serviciosEsenciales.length) *
        100
      : 0;

  if (cobertura >= 80 && esencialesCobertura >= 90) return "OPTIMO";
  if (cobertura >= 60 && esencialesCobertura >= 70) return "REGULAR";
  if (cobertura >= 40 && esencialesCobertura >= 50) return "CRITICO";
  return "GRAVE";
}

function calcularServicioMasCriticoMedicos(estadisticas) {
  let maxInactividad = 0;
  let servicioCritico = "N/A";

  Object.keys(estadisticas.porServicio).forEach((servicioKey) => {
    const servicio = estadisticas.porServicio[servicioKey];
    const inactividad = servicio.inactivo + servicio.noExiste;
    const porcentajeInactividad =
      servicio.total > 0 ? (inactividad / servicio.total) * 100 : 0;

    if (porcentajeInactividad > maxInactividad && servicio.esencial) {
      maxInactividad = porcentajeInactividad;
      servicioCritico = servicio.nombre;
    }
  });

  estadisticas.general.servicioMasCritico = {
    nombre: servicioCritico,
    inactividad: Math.round(maxInactividad),
  };
}

// --- FUNCIONES DE VISUALIZACIÓN ---

function createEstadoCategoriasChart(estadisticas) {
  const containerId = "estadoCategoriasChart";
  if (!document.getElementById(containerId)) {
    console.warn(
      `Highcharts: Contenedor ${containerId} no encontrado en el DOM.`
    );
    setTimeout(() => {
      if (document.getElementById(containerId)) {
        createEstadoCategoriasChart(estadisticas);
      }
    }, 100);
    return;
  }

  const categorias = Object.values(estadisticas.porCategoria).map(
    (c) => c.nombre
  );
  const seriesData = {
    ACTIVO: [],
    "ACTIVO C/PROB": [],
    INACTIVO: [],
    "NO EXISTE": [],
  };

  Object.values(estadisticas.porCategoria).forEach((categoria) => {
    const total = categoria.total || 1;
    seriesData["ACTIVO"].push(Math.round((categoria.activo / total) * 100));
    seriesData["ACTIVO C/PROB"].push(
      Math.round((categoria.activoConProblemas / total) * 100)
    );
    seriesData["INACTIVO"].push(Math.round((categoria.inactivo / total) * 100));
    seriesData["NO EXISTE"].push(
      Math.round((categoria.noExiste / total) * 100)
    );
  });

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
      text: "Estado de Servicios Médicos por Categoría",
      style: {
        fontSize: "16px",
        fontWeight: "bold",
      },
    },
    xAxis: {
      categories: categorias,
      crosshair: true,
      labels: {
        rotation: -45,
        style: {
          fontSize: "11px",
        },
      },
    },
    yAxis: {
      min: 0,
      max: 100,
      title: {
        text: "Porcentaje (%)",
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
            fontSize: "9px",
            fontWeight: "bold",
          },
        },
      },
    },
    series: [
      {
        name: "Activo",
        data: seriesData["ACTIVO"],
        color: estadoColors["ACTIVO"],
      },
      {
        name: "Activo con Problemas",
        data: seriesData["ACTIVO C/PROB"],
        color: estadoColors["ACTIVO C/PROB"],
      },
      {
        name: "Inactivo",
        data: seriesData["INACTIVO"],
        color: estadoColors["INACTIVO"],
      },
      {
        name: "No Existe",
        data: seriesData["NO EXISTE"],
        color: estadoColors["NO EXISTE"],
      },
    ],
    credits: {
      enabled: false,
    },
  });
}

function createHeatmapServiciosMedicos(estadisticas) {
  const containerId = "heatmapServiciosMedicos";
  if (!document.getElementById(containerId)) {
    console.warn(
      `Highcharts: Contenedor ${containerId} no encontrado en el DOM.`
    );
    setTimeout(() => {
      if (document.getElementById(containerId)) {
        createHeatmapServiciosMedicos(estadisticas);
      }
    }, 100);
    return;
  }

  const heatmapData = [];
  Object.keys(estadisticas.porServicio).forEach((servicioKey) => {
    const servicio = estadisticas.porServicio[servicioKey];
    const total = servicio.total || 1;
    const porcentajeActivo = (servicio.activo / total) * 100;

    heatmapData.push({
      name: servicio.nombre,
      value: Math.round(porcentajeActivo),
      category: servicio.categoria,
      esencial: servicio.esencial,
    });
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
      text: "Mapa de Calor - Disponibilidad por Servicio",
      style: {
        fontSize: "16px",
        fontWeight: "bold",
      },
    },
    subtitle: {
      text: "Los bloques más grandes representan servicios con mayor disponibilidad",
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
        "<b>{point.name}</b><br>Disponibilidad: <b>{point.value}%</b><br>Categoría: {point.category}",
    },
    credits: {
      enabled: false,
    },
  });
}

function createBrechasInstitucionesChart(estadisticas) {
  const containerId = "brechasInstitucionesChart";
  if (!document.getElementById(containerId)) {
    console.warn(
      `Highcharts: Contenedor ${containerId} no encontrado en el DOM.`
    );
    setTimeout(() => {
      if (document.getElementById(containerId)) {
        createBrechasInstitucionesChart(estadisticas);
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
        serviciosActivos: 0,
        serviciosTotales: 0,
        cobertura: 0,
      };
    }
    tiposInstitucion[tipo].centros++;
    tiposInstitucion[tipo].serviciosActivos += centro.resumen.activos;
    tiposInstitucion[tipo].serviciosTotales += centro.resumen.total;
  });

  // Calcular cobertura por tipo
  Object.keys(tiposInstitucion).forEach((tipo) => {
    const data = tiposInstitucion[tipo];
    data.cobertura =
      data.serviciosTotales > 0
        ? Math.round((data.serviciosActivos / data.serviciosTotales) * 100)
        : 0;
  });

  const categorias = Object.keys(tiposInstitucion);
  const datosCobertura = Object.values(tiposInstitucion).map(
    (t) => t.cobertura
  );
  const datosCentros = Object.values(tiposInstitucion).map((t) => t.centros);

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
          text: "Cobertura (%)",
        },
        labels: {
          format: "{value}%",
        },
        max: 100,
      },
      {
        title: {
          text: "Número de Centros",
        },
        opposite: true,
      },
    ],
    tooltip: {
      shared: true,
    },
    series: [
      {
        name: "Cobertura de Servicios",
        data: datosCobertura,
        yAxis: 0,
        type: "column",
        color: "#3498db",
        dataLabels: {
          enabled: true,
          format: "{y}%",
        },
      },
      {
        name: "Número de Centros",
        data: datosCentros,
        yAxis: 1,
        type: "spline",
        color: "#e74c3c",
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

// CORREGIDO: Agregar las funciones de visualización faltantes
function createDistribucionGeograficaChart(estadisticas) {
  const containerId = "distribucionGeograficaChart";
  if (!document.getElementById(containerId)) {
    console.warn(
      `Highcharts: Contenedor ${containerId} no encontrado en el DOM.`
    );
    return;
  }

  // Preparar datos para distribución geográfica
  const datosGeograficos = Object.values(estadisticas.geografico)
    .filter((area) => area.centros > 0)
    .map((area) => ({
      name: `${area.municipio} - ${area.parroquia}`,
      y: area.centros,
      cobertura:
        area.serviciosTotales > 0
          ? Math.round((area.serviciosActivos / area.serviciosTotales) * 100)
          : 0,
    }))
    .sort((a, b) => b.y - a.y)
    .slice(0, 10); // Top 10 áreas

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
      text: "Distribución por Municipio/Parroquia (Top 10)",
      style: {
        fontSize: "16px",
        fontWeight: "bold",
      },
    },
    xAxis: {
      categories: datosGeograficos.map((d) => d.name),
      title: {
        text: null,
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: "Número de Centros",
      },
    },
    tooltip: {
      pointFormat:
        "{point.name}: <b>{point.y} centros</b><br>Cobertura: <b>{point.cobertura}%</b>",
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true,
        },
      },
    },
    series: [
      {
        name: "Centros de Salud",
        data: datosGeograficos,
        colorByPoint: true,
      },
    ],
    credits: {
      enabled: false,
    },
  });
}

function createEsencialVsEspecializadoChart(estadisticas) {
  const containerId = "esencialVsEspecializadoChart";
  if (!document.getElementById(containerId)) {
    console.warn(
      `Highcharts: Contenedor ${containerId} no encontrado en el DOM.`
    );
    return;
  }

  // Calcular métricas de servicios esenciales vs especializados
  let esencialesActivos = 0;
  let esencialesTotales = 0;
  let especializadosActivos = 0;
  let especializadosTotales = 0;

  Object.values(estadisticas.porServicio).forEach((servicio) => {
    if (servicio.esencial) {
      esencialesTotales += servicio.total;
      esencialesActivos += servicio.activo;
    } else {
      especializadosTotales += servicio.total;
      especializadosActivos += servicio.activo;
    }
  });

  const coberturaEsenciales =
    esencialesTotales > 0
      ? Math.round((esencialesActivos / esencialesTotales) * 100)
      : 0;
  const coberturaEspecializados =
    especializadosTotales > 0
      ? Math.round((especializadosActivos / especializadosTotales) * 100)
      : 0;

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
      text: "Servicios Esenciales vs Especializados",
      style: {
        fontSize: "16px",
        fontWeight: "bold",
      },
    },
    xAxis: {
      categories: ["Servicios Esenciales", "Servicios Especializados"],
      crosshair: true,
    },
    yAxis: {
      min: 0,
      max: 100,
      title: {
        text: "Porcentaje de Cobertura (%)",
      },
      labels: {
        format: "{value}%",
      },
    },
    tooltip: {
      pointFormat: "Cobertura: <b>{point.y:.1f}%</b>",
    },
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true,
          format: "{point.y:.0f}%",
        },
      },
    },
    series: [
      {
        name: "Cobertura",
        data: [coberturaEsenciales, coberturaEspecializados],
        colorByPoint: true,
        colors: ["#2ecc71", "#3498db"],
      },
    ],
    credits: {
      enabled: false,
    },
  });
}

function generateServiciosMedicosTable(estadisticas) {
  const tableBody = document.getElementById("serviciosMedicosTableBody");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  estadisticas.centros.forEach((centro) => {
    const row = tableBody.insertRow();

    // Nombre del centro
    const cellNombre = row.insertCell();
    cellNombre.textContent = centro.nombre;
    cellNombre.style.fontWeight = "bold";

    // Tipo de Institución
    const cellTipo = row.insertCell();
    cellTipo.textContent = centro.tipoInstitucion;

    // Servicios Activos
    const cellActivos = row.insertCell();
    cellActivos.innerHTML = `<span class="text-success fw-bold">${centro.resumen.activos}</span>`;

    // Servicios con Problemas
    const cellProblemas = row.insertCell();
    cellProblemas.innerHTML = `<span class="text-warning fw-bold">${centro.resumen.conProblemas}</span>`;

    // Servicios Inactivos
    const cellInactivos = row.insertCell();
    cellInactivos.innerHTML = `<span class="text-danger fw-bold">${
      centro.resumen.inactivos + centro.resumen.noExisten
    }</span>`;

    // Cobertura Total
    const cellCobertura = row.insertCell();
    cellCobertura.innerHTML = `<span class="fw-bold">${centro.resumen.coberturaTotal}%</span>`;

    // Servicios Esenciales
    const cellEsenciales = row.insertCell();
    const esencialesPorcentaje =
      serviciosEsenciales.length > 0
        ? Math.round(
            (centro.resumen.esencialesActivos / serviciosEsenciales.length) *
              100
          )
        : 0;
    cellEsenciales.innerHTML = `${centro.resumen.esencialesActivos}/${serviciosEsenciales.length}<br><small>${esencialesPorcentaje}%</small>`;

    // Nivel de Complejidad
    const cellComplejidad = row.insertCell();
    let complejidadClass = "text-danger";
    if (centro.resumen.nivelComplejidad === "MEDIA")
      complejidadClass = "text-warning";
    if (centro.resumen.nivelComplejidad === "ALTA")
      complejidadClass = "text-success";
    cellComplejidad.innerHTML = `<span class="${complejidadClass} fw-bold">${centro.resumen.nivelComplejidad}</span>`;

    // Estado General
    const cellEstado = row.insertCell();
    let estadoClass = "text-success";
    if (centro.estadoGeneral === "REGULAR") estadoClass = "text-warning";
    if (centro.estadoGeneral === "CRITICO") estadoClass = "text-danger";
    if (centro.estadoGeneral === "GRAVE") estadoClass = "text-dark";
    cellEstado.innerHTML = `<span class="${estadoClass} fw-bold">${centro.estadoGeneral}</span>`;
  });
}

// --- FUNCIÓN PRINCIPAL DE RENDERIZADO ---

export function renderDashboard(dataToUse) {
  console.log("=== RENDER DASHBOARD SERVICIOS MÉDICOS ===");

  if (!dataToUse || dataToUse.length === 0) {
    const containers = [
      "estadoCategoriasChart",
      "heatmapServiciosMedicos",
      "brechasInstitucionesChart",
      "distribucionGeograficaChart",
      "esencialVsEspecializadoChart",
    ];
    containers.forEach((containerId) => {
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML =
          "<p class='text-center mt-5'>No hay datos para los filtros seleccionados.</p>";
      }
    });

    const tableBody = document.getElementById("serviciosMedicosTableBody");
    if (tableBody) tableBody.innerHTML = "";
    return;
  }

  const estadisticas = procesarServiciosMedicos(dataToUse);

  // Actualizar tarjetas de resumen
  document.getElementById("servicios-medicos-activos").textContent =
    estadisticas.general.serviciosActivos;

  const tasaActivacion =
    estadisticas.general.totalServicios > 0
      ? Math.round(
          (estadisticas.general.serviciosActivos /
            estadisticas.general.totalServicios) *
            100
        )
      : 0;
  document.getElementById("tasa-activacion").textContent = `${tasaActivacion}%`;

  document.getElementById("servicio-critico-med").textContent =
    estadisticas.general.servicioMasCritico.nombre;
  document.getElementById(
    "critico-badge-med"
  ).textContent = `${estadisticas.general.servicioMasCritico.inactividad}%`;

  document.getElementById("centros-completos").textContent =
    estadisticas.general.centrosCompletos;

  // Crear todas las visualizaciones
  createEstadoCategoriasChart(estadisticas);
  createHeatmapServiciosMedicos(estadisticas);
  createBrechasInstitucionesChart(estadisticas);
  createDistribucionGeograficaChart(estadisticas);
  createEsencialVsEspecializadoChart(estadisticas);
  generateServiciosMedicosTable(estadisticas);

  console.log("=== FIN RENDER DASHBOARD SERVICIOS MÉDICOS ===");
}

export function initialize(dataToUse) {
  console.log("=== INICIALIZANDO DASHBOARD SERVICIOS MÉDICOS ===");

  setTimeout(() => {
    renderDashboard(dataToUse);
  }, 100);
}
