// dashboard-4.js - Dashboard de Otros Servicios

// Importar los datos globales necesarios
import { filteredData, areaNames } from "./main_dashboard.js";

// Definición de servicios y categorías
const otrosServicios = {
  imagenologia: {
    nombre: "Imagenología",
    servicios: {
      radiografia: "Radiografía",
      mamografia: "Mamografía",
      ultrasonido: "Ultrasonido",
      tomografia: "Tomografía",
      densiometriaOsea: "Densiometría Ósea",
      ecografiaMEA: "Ecografía MEA",
      ecografiaDopplerAV: "Ecografía Doppler AV",
      otrosImagenologia: "Otros",
    },
  },
  cocina: {
    nombre: "Cocina",
    servicios: {
      servicioAlimentacion: "Servicio Alimentación",
      servicioNutricionista: "Servicio Nutricionista",
      suministroAlimentos: "Suministro Alimentos",
      equipoRefrigeracion: "Equipo Refrigeración",
      equipoCocina: "Equipo Cocina",
      infraestructuraAlmacenamiento: "Almacenamiento",
      otrosComida: "Otros",
    },
  },
  laboratorio: {
    nombre: "Laboratorio",
    categorias: {
      quimicaSanguinea: "Química Sanguínea",
      heces: "Análisis de Heces",
      orina: "Análisis de Orina",
      coagulacion: "Coagulación",
      serologia: "Serología",
      hematologia: "Hematología",
      perfiles: "Perfiles",
      cardiologia: "Cardiología",
      ginecologia: "Ginecología",
    },
  },
  farmacia: {
    nombre: "Farmacia",
    categorias: {
      basicos: "Medicamentos Básicos",
      especializados: "Medicamentos Especializados",
      altoCosto: "Medicamentos Alto Costo",
      otrasMedicinas: "Otras Medicinas",
    },
  },
};

// Colores para estados
const estadoColors = {
  ACTIVO: "#2ecc71",
  "ACTIVO C/PROB": "#f39c12",
  INACTIVO: "#e74c3c",
  "NO EXISTE": "#95a5a6",
};

// --- FUNCIONES DE PROCESAMIENTO ---

function procesarOtrosServicios(datosArray) {
  console.log("Procesando otros servicios:", datosArray.length, "centros");

  const estadisticas = {
    porServicio: {},
    laboratorio: {
      totalExamenes: 0,
      examenesDisponibles: 0,
      porCategoria: {},
    },
    farmacia: {
      totalMedicamentos: 0,
      medicamentosDisponibles: 0,
      porCategoria: {},
    },
    centros: [],
    general: {
      serviciosActivos: 0,
      serviciosTotales: 0,
      servicioMasCritico: { nombre: "N/A", inactividad: 0 },
    },
    // Nuevas estructuras para heatmaps
    heatmapImagenologia: [],
    heatmapCocina: [],
  };

  // Inicializar estructura
  Object.keys(otrosServicios).forEach((servicioKey) => {
    if (servicioKey !== "laboratorio" && servicioKey !== "farmacia") {
      estadisticas.porServicio[servicioKey] = {
        nombre: otrosServicios[servicioKey].nombre,
        activo: 0,
        activoConProblemas: 0,
        inactivo: 0,
        noExiste: 0,
        total: 0,
        porServicio: {},
      };

      // Inicializar por servicio específico
      Object.keys(otrosServicios[servicioKey].servicios).forEach(
        (subServicio) => {
          estadisticas.porServicio[servicioKey].porServicio[subServicio] = {
            activo: 0,
            activoConProblemas: 0,
            inactivo: 0,
            noExiste: 0,
            total: 0,
          };
        }
      );
    }
  });

  // Inicializar laboratorio y farmacia
  Object.keys(otrosServicios.laboratorio.categorias).forEach((categoria) => {
    estadisticas.laboratorio.porCategoria[categoria] = {
      total: 0,
      disponibles: 0,
    };
  });

  Object.keys(otrosServicios.farmacia.categorias).forEach((categoria) => {
    estadisticas.farmacia.porCategoria[categoria] = {
      total: 0,
      disponibles: 0,
    };
  });

  // Procesar cada centro
  datosArray.forEach((centro, index) => {
    const servicios = centro?.otrosServicios;
    const centroData = {
      nombre: centro.datosInstitucion?.nombre || `Centro ${index + 1}`,
      servicios: {},
      laboratorio: { examenesTotales: 0, examenesDisponibles: 0 },
      farmacia: { medicamentosTotales: 0, medicamentosDisponibles: 0 },
      estadoGeneral: "OPTIMO",
    };

    if (servicios) {
      // Procesar Imagenología
      if (servicios.imagenologia) {
        centroData.servicios.imagenologia = {};
        Object.keys(otrosServicios.imagenologia.servicios).forEach(
          (servicioKey) => {
            const servicio = servicios.imagenologia[servicioKey];
            if (servicio) {
              const estado = normalizarEstadoImagenologia(servicio.estado);
              centroData.servicios.imagenologia[servicioKey] = estado;

              // Contar estadísticas
              if (estadisticas.porServicio.imagenologia) {
                estadisticas.porServicio.imagenologia.porServicio[servicioKey][
                  estado.toLowerCase()
                ]++;
                estadisticas.porServicio.imagenologia.porServicio[servicioKey]
                  .total++;
                estadisticas.porServicio.imagenologia[estado.toLowerCase()]++;
                estadisticas.porServicio.imagenologia.total++;
                estadisticas.general.serviciosTotales++;

                if (estado === "ACTIVO") {
                  estadisticas.general.serviciosActivos++;
                }
              }
            }
          }
        );
      }

      // Procesar Cocina
      if (servicios.cocina) {
        centroData.servicios.cocina = {};
        Object.keys(otrosServicios.cocina.servicios).forEach((servicioKey) => {
          const servicio = servicios.cocina[servicioKey];
          if (servicio) {
            const estado = normalizarEstadoImagenologia(servicio.estado);
            centroData.servicios.cocina[servicioKey] = estado;

            if (estadisticas.porServicio.cocina) {
              estadisticas.porServicio.cocina.porServicio[servicioKey][
                estado.toLowerCase()
              ]++;
              estadisticas.porServicio.cocina.porServicio[servicioKey].total++;
              estadisticas.porServicio.cocina[estado.toLowerCase()]++;
              estadisticas.porServicio.cocina.total++;
              estadisticas.general.serviciosTotales++;

              if (estado === "ACTIVO") {
                estadisticas.general.serviciosActivos++;
              }
            }
          }
        });
      }

      // Procesar Laboratorio
      if (servicios.laboratorio) {
        centroData.laboratorio = { examenes: {}, total: 0, disponibles: 0 };

        Object.keys(servicios.laboratorio).forEach((categoriaKey) => {
          if (typeof servicios.laboratorio[categoriaKey] === "object") {
            Object.keys(servicios.laboratorio[categoriaKey]).forEach(
              (examenKey) => {
                const examen = servicios.laboratorio[categoriaKey][examenKey];
                if (
                  typeof examen === "object" &&
                  examen.hasOwnProperty("disponible")
                ) {
                  centroData.laboratorio.total++;
                  centroData.laboratorio.examenes[examenKey] =
                    examen.disponible;
                  estadisticas.laboratorio.totalExamenes++;

                  if (examen.disponible) {
                    centroData.laboratorio.disponibles++;
                    estadisticas.laboratorio.examenesDisponibles++;
                  }

                  // Contar por categoría
                  if (estadisticas.laboratorio.porCategoria[categoriaKey]) {
                    estadisticas.laboratorio.porCategoria[categoriaKey].total++;
                    if (examen.disponible) {
                      estadisticas.laboratorio.porCategoria[categoriaKey]
                        .disponibles++;
                    }
                  }
                }
              }
            );
          }
        });
      }

      // Procesar Farmacia
      if (servicios.farmacia) {
        centroData.farmacia = { medicamentos: {}, total: 0, disponibles: 0 };

        Object.keys(servicios.farmacia).forEach((categoriaKey) => {
          if (typeof servicios.farmacia[categoriaKey] === "object") {
            Object.keys(servicios.farmacia[categoriaKey]).forEach(
              (medicamentoKey) => {
                const medicamento =
                  servicios.farmacia[categoriaKey][medicamentoKey];
                if (
                  typeof medicamento === "object" &&
                  medicamento.hasOwnProperty("disponible")
                ) {
                  centroData.farmacia.total++;
                  centroData.farmacia.medicamentos[medicamentoKey] =
                    medicamento.disponible;
                  estadisticas.farmacia.totalMedicamentos++;

                  if (medicamento.disponible) {
                    centroData.farmacia.disponibles++;
                    estadisticas.farmacia.medicamentosDisponibles++;
                  }

                  // Contar por categoría
                  if (estadisticas.farmacia.porCategoria[categoriaKey]) {
                    estadisticas.farmacia.porCategoria[categoriaKey].total++;
                    if (medicamento.disponible) {
                      estadisticas.farmacia.porCategoria[categoriaKey]
                        .disponibles++;
                    }
                  }
                }
              }
            );
          }
        });
      }

      // Determinar estado general del centro
      centroData.estadoGeneral = determinarEstadoGeneral(centroData);
    }

    estadisticas.centros.push(centroData);
  });

  // Calcular servicio más crítico
  calcularServicioMasCritico(estadisticas);

  // Preparar datos para heatmaps
  prepararHeatmaps(estadisticas);

  console.log("Estadísticas de otros servicios:", estadisticas);
  return estadisticas;
}

function normalizarEstadoImagenologia(estado) {
  if (!estado) return "NO EXISTE";
  const estadoUpper = estado.toUpperCase();
  if (estadoUpper.includes("ACTIVO") && estadoUpper.includes("PROB"))
    return "ACTIVO C/PROB";
  if (estadoUpper.includes("ACTIVO")) return "ACTIVO";
  if (estadoUpper.includes("INACTIVO")) return "INACTIVO";
  if (estadoUpper.includes("NO EXISTE")) return "NO EXISTE";
  return "NO EXISTE";
}

function determinarEstadoGeneral(centroData) {
  let serviciosCriticos = 0;
  let serviciosConProblemas = 0;

  // Verificar servicios de imagenología y cocina
  ["imagenologia", "cocina"].forEach((servicio) => {
    if (centroData.servicios[servicio]) {
      Object.values(centroData.servicios[servicio]).forEach((estado) => {
        if (estado === "INACTIVO" || estado === "NO EXISTE")
          serviciosCriticos++;
        if (estado === "ACTIVO C/PROB") serviciosConProblemas++;
      });
    }
  });

  // Verificar laboratorio y farmacia
  const coberturaLab =
    centroData.laboratorio.total > 0
      ? (centroData.laboratorio.disponibles / centroData.laboratorio.total) *
        100
      : 0;
  const coberturaFarm =
    centroData.farmacia.total > 0
      ? (centroData.farmacia.disponibles / centroData.farmacia.total) * 100
      : 0;

  if (serviciosCriticos > 2 || coberturaLab < 30 || coberturaFarm < 30)
    return "CRITICO";
  if (
    serviciosCriticos > 0 ||
    serviciosConProblemas > 1 ||
    coberturaLab < 60 ||
    coberturaFarm < 60
  )
    return "REGULAR";
  return "OPTIMO";
}

function calcularServicioMasCritico(estadisticas) {
  let maxInactividad = 0;
  let servicioCritico = "N/A";

  Object.keys(estadisticas.porServicio).forEach((servicioKey) => {
    const servicio = estadisticas.porServicio[servicioKey];
    const inactividad = servicio.inactivo + servicio.noExiste;
    const porcentajeInactividad =
      servicio.total > 0 ? (inactividad / servicio.total) * 100 : 0;

    if (porcentajeInactividad > maxInactividad) {
      maxInactividad = porcentajeInactividad;
      servicioCritico = servicio.nombre;
    }
  });

  estadisticas.general.servicioMasCritico = {
    nombre: servicioCritico,
    inactividad: Math.round(maxInactividad),
  };
}

function prepararHeatmaps(estadisticas) {
  // Heatmap para Imagenología
  estadisticas.heatmapImagenologia = [];
  if (estadisticas.porServicio.imagenologia) {
    Object.keys(estadisticas.porServicio.imagenologia.porServicio).forEach(
      (servicioKey) => {
        const servicio =
          estadisticas.porServicio.imagenologia.porServicio[servicioKey];
        const total = servicio.total || 1;
        const porcentajeActivo = (servicio.activo / total) * 100;

        estadisticas.heatmapImagenologia.push({
          name: otrosServicios.imagenologia.servicios[servicioKey],
          value: Math.round(porcentajeActivo),
          servicio: servicioKey,
        });
      }
    );
  }

  // Heatmap para Cocina
  estadisticas.heatmapCocina = [];
  if (estadisticas.porServicio.cocina) {
    Object.keys(estadisticas.porServicio.cocina.porServicio).forEach(
      (servicioKey) => {
        const servicio =
          estadisticas.porServicio.cocina.porServicio[servicioKey];
        const total = servicio.total || 1;
        const porcentajeActivo = (servicio.activo / total) * 100;

        estadisticas.heatmapCocina.push({
          name: otrosServicios.cocina.servicios[servicioKey],
          value: Math.round(porcentajeActivo),
          servicio: servicioKey,
        });
      }
    );
  }
}

// --- FUNCIONES DE VISUALIZACIÓN ---

function createEstadoServiciosChart(estadisticas) {
  const containerId = "estadoServiciosChart";
  if (!document.getElementById(containerId)) {
    console.warn(
      `Highcharts: Contenedor ${containerId} no encontrado en el DOM.`
    );
    setTimeout(() => {
      if (document.getElementById(containerId)) {
        createEstadoServiciosChart(estadisticas);
      }
    }, 100);
    return;
  }

  const categorias = Object.values(estadisticas.porServicio).map(
    (s) => s.nombre
  );
  const seriesData = {
    ACTIVO: [],
    "ACTIVO C/PROB": [],
    INACTIVO: [],
    "NO EXISTE": [],
  };

  Object.values(estadisticas.porServicio).forEach((servicio) => {
    const total = servicio.total || 1;
    seriesData["ACTIVO"].push(Math.round((servicio.activo / total) * 100));
    seriesData["ACTIVO C/PROB"].push(
      Math.round((servicio.activoConProblemas / total) * 100)
    );
    seriesData["INACTIVO"].push(Math.round((servicio.inactivo / total) * 100));
    seriesData["NO EXISTE"].push(Math.round((servicio.noExiste / total) * 100));
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
      text: "Estado General de Servicios por Área",
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
            fontSize: "10px",
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

function createCoberturaLabChart(estadisticas) {
  const containerId = "coberturaLabChart";
  if (!document.getElementById(containerId)) {
    console.warn(
      `Highcharts: Contenedor ${containerId} no encontrado en el DOM.`
    );
    setTimeout(() => {
      if (document.getElementById(containerId)) {
        createCoberturaLabChart(estadisticas);
      }
    }, 100);
    return;
  }

  const categorias = Object.keys(estadisticas.laboratorio.porCategoria).map(
    (key) => otrosServicios.laboratorio.categorias[key]
  );
  const datos = Object.values(estadisticas.laboratorio.porCategoria).map(
    (categoria) =>
      categoria.total > 0
        ? Math.round((categoria.disponibles / categoria.total) * 100)
        : 0
  );

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
      text: "Cobertura de Exámenes de Laboratorio",
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
        text: "Porcentaje Disponible (%)",
      },
      labels: {
        format: "{value}%",
      },
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.y:.1f}%</b>",
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true,
          format: "{point.y:.0f}%",
        },
      },
    },
    series: [
      {
        name: "Disponibilidad",
        data: datos,
        colorByPoint: true,
      },
    ],
    credits: {
      enabled: false,
    },
  });
}

function createMedicamentosChart(estadisticas) {
  const containerId = "medicamentosChart";
  if (!document.getElementById(containerId)) {
    console.warn(
      `Highcharts: Contenedor ${containerId} no encontrado en el DOM.`
    );
    setTimeout(() => {
      if (document.getElementById(containerId)) {
        createMedicamentosChart(estadisticas);
      }
    }, 100);
    return;
  }

  const categorias = Object.keys(estadisticas.farmacia.porCategoria).map(
    (key) => otrosServicios.farmacia.categorias[key]
  );

  const datosDisponibles = Object.values(
    estadisticas.farmacia.porCategoria
  ).map((categoria) =>
    categoria.total > 0
      ? Math.round((categoria.disponibles / categoria.total) * 100)
      : 0
  );

  const datosNoDisponibles = Object.values(
    estadisticas.farmacia.porCategoria
  ).map((categoria) =>
    categoria.total > 0
      ? Math.round(
          ((categoria.total - categoria.disponibles) / categoria.total) * 100
        )
      : 0
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
      text: "Disponibilidad de Medicamentos por Categoría",
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
            fontSize: "10px",
            fontWeight: "bold",
          },
        },
      },
    },
    series: [
      {
        name: "Disponible",
        data: datosDisponibles,
        color: "#2ecc71",
      },
      {
        name: "No Disponible",
        data: datosNoDisponibles,
        color: "#e74c3c",
      },
    ],
    credits: {
      enabled: false,
    },
  });
}

function createHeatmapImagenologia(estadisticas) {
  const containerId = "heatmapImagenologia";
  if (!document.getElementById(containerId)) {
    console.warn(
      `Highcharts: Contenedor ${containerId} no encontrado en el DOM.`
    );
    setTimeout(() => {
      if (document.getElementById(containerId)) {
        createHeatmapImagenologia(estadisticas);
      }
    }, 100);
    return;
  }

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
      text: "Mapa de Calor - Servicios de Imagenología",
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
        data: estadisticas.heatmapImagenologia,
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b><br>{point.value}%",
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
        "<b>{point.name}</b><br>Disponibilidad: <b>{point.value}%</b>",
    },
    credits: {
      enabled: false,
    },
  });
}

function createHeatmapCocina(estadisticas) {
  const containerId = "heatmapCocina";
  if (!document.getElementById(containerId)) {
    console.warn(
      `Highcharts: Contenedor ${containerId} no encontrado en el DOM.`
    );
    setTimeout(() => {
      if (document.getElementById(containerId)) {
        createHeatmapCocina(estadisticas);
      }
    }, 100);
    return;
  }

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
      text: "Mapa de Calor - Servicios de Cocina",
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
        data: estadisticas.heatmapCocina,
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b><br>{point.value}%",
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
            borderWidth: 2,
          },
        ],
      },
    ],
    colorAxis: {
      minColor: "#e1f5fe",
      maxColor: "#01579b",
      min: 0,
      max: 100,
    },
    tooltip: {
      pointFormat:
        "<b>{point.name}</b><br>Disponibilidad: <b>{point.value}%</b>",
    },
    credits: {
      enabled: false,
    },
  });
}

function generateOtrosServiciosTable(estadisticas) {
  const tableBody = document.getElementById("otrosServiciosTableBody");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  estadisticas.centros.forEach((centro) => {
    const row = tableBody.insertRow();

    // Nombre del centro
    const cellNombre = row.insertCell();
    cellNombre.textContent = centro.nombre;
    cellNombre.style.fontWeight = "bold";

    // Imagenología
    const cellImagenologia = row.insertCell();
    let estadoImg = "N/A";
    if (centro.servicios.imagenologia) {
      const estados = Object.values(centro.servicios.imagenologia);
      const activos = estados.filter((e) => e === "ACTIVO").length;
      estadoImg = `${activos}/${estados.length}`;
    }
    cellImagenologia.textContent = estadoImg;

    // Cocina
    const cellCocina = row.insertCell();
    let estadoCocina = "N/A";
    if (centro.servicios.cocina) {
      const estados = Object.values(centro.servicios.cocina);
      const activos = estados.filter((e) => e === "ACTIVO").length;
      estadoCocina = `${activos}/${estados.length}`;
    }
    cellCocina.textContent = estadoCocina;

    // Laboratorio
    const cellLab = row.insertCell();
    const coberturaLab =
      centro.laboratorio.total > 0
        ? Math.round(
            (centro.laboratorio.disponibles / centro.laboratorio.total) * 100
          )
        : 0;
    cellLab.innerHTML = `${centro.laboratorio.disponibles}/${centro.laboratorio.total}<br><small>${coberturaLab}%</small>`;

    // Farmacia
    const cellFarmacia = row.insertCell();
    const coberturaFarm =
      centro.farmacia.total > 0
        ? Math.round(
            (centro.farmacia.disponibles / centro.farmacia.total) * 100
          )
        : 0;
    cellFarmacia.innerHTML = `${centro.farmacia.disponibles}/${centro.farmacia.total}<br><small>${coberturaFarm}%</small>`;

    // Exámenes Disponibles
    const cellExamenes = row.insertCell();
    cellExamenes.innerHTML = `<span class="fw-bold">${coberturaLab}%</span>`;

    // Medicamentos Disponibles
    const cellMedicamentos = row.insertCell();
    cellMedicamentos.innerHTML = `<span class="fw-bold">${coberturaFarm}%</span>`;

    // Estado General
    const cellEstado = row.insertCell();
    let estadoClass = "text-success";
    if (centro.estadoGeneral === "REGULAR") estadoClass = "text-warning";
    if (centro.estadoGeneral === "CRITICO") estadoClass = "text-danger";
    cellEstado.innerHTML = `<span class="${estadoClass} fw-bold">${centro.estadoGeneral}</span>`;
  });
}

// --- FUNCIÓN PRINCIPAL DE RENDERIZADO ---

export function renderDashboard(dataToUse) {
  console.log("=== RENDER DASHBOARD OTROS SERVICIOS ===");

  if (!dataToUse || dataToUse.length === 0) {
    const containers = [
      "estadoServiciosChart",
      "coberturaLabChart",
      "medicamentosChart",
      "heatmapImagenologia",
      "heatmapCocina",
    ];
    containers.forEach((containerId) => {
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML =
          "<p class='text-center mt-5'>No hay datos para los filtros seleccionados.</p>";
      }
    });

    const tableBody = document.getElementById("otrosServiciosTableBody");
    if (tableBody) tableBody.innerHTML = "";
    return;
  }

  const estadisticas = procesarOtrosServicios(dataToUse);

  // Actualizar tarjetas de resumen
  document.getElementById("servicios-activos").textContent =
    estadisticas.general.serviciosActivos;

  const coberturaLab =
    estadisticas.laboratorio.totalExamenes > 0
      ? Math.round(
          (estadisticas.laboratorio.examenesDisponibles /
            estadisticas.laboratorio.totalExamenes) *
            100
        )
      : 0;
  document.getElementById("cobertura-lab").textContent = `${coberturaLab}%`;

  const dispFarmacia =
    estadisticas.farmacia.totalMedicamentos > 0
      ? Math.round(
          (estadisticas.farmacia.medicamentosDisponibles /
            estadisticas.farmacia.totalMedicamentos) *
            100
        )
      : 0;
  document.getElementById("disp-farmacia").textContent = `${dispFarmacia}%`;

  document.getElementById("servicio-critico").textContent =
    estadisticas.general.servicioMasCritico.nombre;
  document.getElementById(
    "critico-badge"
  ).textContent = `${estadisticas.general.servicioMasCritico.inactividad}%`;

  // Crear todas las visualizaciones
  createEstadoServiciosChart(estadisticas);
  createCoberturaLabChart(estadisticas);
  createMedicamentosChart(estadisticas);
  createHeatmapImagenologia(estadisticas);
  createHeatmapCocina(estadisticas);
  generateOtrosServiciosTable(estadisticas);

  console.log("=== FIN RENDER DASHBOARD OTROS SERVICIOS ===");
}

export function initialize(dataToUse) {
  console.log("=== INICIALIZANDO DASHBOARD OTROS SERVICIOS ===");

  setTimeout(() => {
    renderDashboard(dataToUse);
  }, 100);
}
