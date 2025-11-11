import { SERVICIOS_MEDICOS, OTROS_SERVICIOS_DATA } from "../data.js";
const FUNCTIONS_BY_SECTIONS = {
  resumirPorCampo: (tituloColumna) => {
    // Selecciona todas las filas de la tabla
    const rows = document.querySelectorAll('#report-rows tr');
    const conteo = {};
    // Obtiene los encabezados de la tabla
    const encabezados = document.querySelectorAll('#report-header th');
    const indices = Array.from(encabezados).map(th => th.textContent.trim());
    // Encuentra el índice de la columna correspondiente al título dado
    const indiceColumna = indices.indexOf(tituloColumna);
    if (indiceColumna === -1) {
        console.error(`El título "${tituloColumna}" no se encontró en los encabezados.`);
        return [];
    }
    // Recorre cada fila y cuenta las ocurrencias del campo especificado
    rows.forEach(row => {
        const campo = row.cells[indiceColumna].textContent.trim(); // Obtiene el texto de la columna especificada
        if (conteo[campo]) {
            conteo[campo] += 1; // Incrementa el contador si ya existe
        } else {
            conteo[campo] = 1; // Inicializa el contador
        }
    });
    // Convierte el objeto en un arreglo con la estructura deseada
    const resultado = Object.keys(conteo).map(campo => ({
        name: campo,
        y: conteo[campo],
        drilldown: campo
    }));
    // Ordena el resultado de mayor a menor por cantidad (campo 'y')
    resultado.sort((a, b) => b.y - a.y);
    return resultado;
  },
generarDrilldownData:(tituloParroquia, tituloTipo) => {
    // Selecciona todas las filas de la tabla
    const rows = document.querySelectorAll('#report-rows tr');
    // Acumulador para las parroquias
    const acc = {};
    // Obtiene los encabezados de la tabla
    const encabezados = document.querySelectorAll('#report-header th');
    const indices = Array.from(encabezados).map(th => th.textContent.trim());
    // Encuentra los índices de las columnas correspondientes a los títulos dados
    const indiceParroquia = indices.indexOf(tituloParroquia);
    const indiceTipo = indices.indexOf(tituloTipo);
    if (indiceParroquia === -1 || indiceTipo === -1) {
        console.error(`Uno de los títulos "${tituloParroquia}" o "${tituloTipo}" no se encontró en los encabezados.`);
        return [];
    }
    // Recorre cada fila y cuenta los tipos dentro de cada parroquia
    rows.forEach(row => {
        const parroquia = row.cells[indiceParroquia].textContent.trim();
        const tipo = row.cells[indiceTipo].textContent.trim();
        // Inicializar la parroquia si no existe
        if (!acc[parroquia]) {
            acc[parroquia] = { name: parroquia, id: parroquia, data: {} };
        }
        // Contar los tipos
        acc[parroquia].data[tipo] = (acc[parroquia].data[tipo] || 0) + 1;
    });
    // Convertir el acumulador en un arreglo y ordenar por cantidad
    const drilldownData = Object.values(acc).map(({ name, id, data }) => ({
        name,
        id,
        data: Object.entries(data).sort(([, a], [, b]) => b - a), // Ordenar por cantidad
    }));
    return drilldownData;
},
  chartDrillDown:(chartTitle, chartSubtitle, serieName, serieDrilldown) => {
    Highcharts.chart("modal-chart", {
      chart: {
        type: "column",
      },
      title: {
        text: chartTitle,
      },
      subtitle: {
        text: chartSubtitle,
      },
      accessibility: {
        announceNewData: {
          enabled: true,
        },
      },
      xAxis: {
        type: "category",
      },
      yAxis: {
        title: {
          text: "Cantidad",
        },
      },
      legend: {
        enabled: false,
      },
      plotOptions: {
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: "{point.y}",
          },
        },
      },

      tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat:
          '<span style="color:{point.color}">{point.name}</span>: ' +
          "<b>{point.y}</b><br/>",
      },

      series: [{ name: serieName, colorByPoint: true, data: FUNCTIONS_BY_SECTIONS.resumirPorCampo(serieName) }],

      drilldown: {
        breadcrumbs: {
          position: {
            align: "right",
          },
        },
        series: FUNCTIONS_BY_SECTIONS.generarDrilldownData(serieName,serieDrilldown),
      },
    });

  },
  III: {
    totalPersonal: (
      data,
      section = "",
      role = "",
      valueType = "disponible"
    ) => {
      const personal = data.personalInstitucion;
      if (!personal) return 0;
      let total = 0;
      for (const sec in personal) {
        if (section && sec !== section) continue;
        for (const r in personal[sec]) {
          if (role && r !== role) continue;
          if (
            personal[sec][r] &&
            typeof personal[sec][r][valueType] === "number"
          ) {
            total += personal[sec][r][valueType];
          }
        }
      }
      return total;
    },
  },
  IV: {
    obtenerServiciosMedicos: (data, estado) => {
      const { serviciosMedicos } = data;

      const obtenerLabelPorKey = (key) => {
        const encontrado = SERVICIOS_MEDICOS.find((item) => item.key === key);
        return encontrado ? encontrado.label : null; // Devuelve el label o null si no se encuentra
      };

      const serviciosFiltrados = Object.entries(serviciosMedicos)
        .filter(([, servicio]) => servicio.estado === estado)
        .map(
          ([key, servicio]) => servicio.nombreEspec || obtenerLabelPorKey(key)
        );

      // Usar un Set para eliminar duplicados
      const serviciosUnicos = [...new Set(serviciosFiltrados)];

      return serviciosUnicos.join(", ");
    },
  },
  V: {
    obtenerOtrosServiciosEstado: (data, servicio, estado) => {
      const { otrosServicios } = data;
      const dataServicio = otrosServicios[servicio];

      const obtenerLabelPorKey = (key) => {
        const encontrado = OTROS_SERVICIOS_DATA[servicio].find(
          (item) => item.key === key
        );
        return encontrado ? encontrado.label : null; // Devuelve el label o null si no se encuentra
      };

      const serviciosFiltrados = Object.entries(dataServicio)
        .filter(([, servicio]) => servicio.estado === estado)
        .map(
          ([key, servicio]) => servicio.nombreEspec || obtenerLabelPorKey(key)
        );

      // Usar un Set para eliminar duplicados
      const serviciosUnicos = [...new Set(serviciosFiltrados)];

      return serviciosUnicos.join(", ");
    },
    obtenerOtrosServiciosDisponibles: (data, servicio, tipo, disponible) => {
      const { otrosServicios } = data;
      const dataServicio = otrosServicios[servicio][tipo];

      const obtenerLabelPorKey = (key) => {
        // Corrección: se agregó la flecha '=>' después de '(t)'
        const grupoEncontrado = OTROS_SERVICIOS_DATA[servicio].find(
          (t) => t.key === tipo
        );

        if (!grupoEncontrado) {
          return null; // Manejar el caso si no se encuentra el grupo
        }

        const encontrado = grupoEncontrado.items.find(
          (item) => item.key === key
        );
        return encontrado ? encontrado.label : null; // Devuelve el label o null si no se encuentra
      };

      const serviciosFiltrados = Object.entries(dataServicio)
        .filter(([, servicio]) => servicio.disponible === disponible)
        .map(
          ([key, servicio]) => servicio.nombreEspec || obtenerLabelPorKey(key)
        );

      // Usar un Set para eliminar duplicados
      const serviciosUnicos = [...new Set(serviciosFiltrados)];

      return serviciosUnicos.join(", ");
    },
  },
};

export default FUNCTIONS_BY_SECTIONS;
