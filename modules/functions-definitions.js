import { SERVICIOS_MEDICOS, OTROS_SERVICIOS_DATA } from "../data.js";

const FUNCTIONS_BY_SECTIONS = {
  tableToJson: () => {
    const tableHead = document.getElementById("report-header");
    const tableBody = document.getElementById("report-rows");
    const data = [];

    // Obtener los encabezados de la tabla
    const headers = Array.from(tableHead.getElementsByTagName("th")).map(
      (th) => th.innerText
    );

    // Obtener las filas del tbody
    const rows = tableBody.getElementsByTagName("tr");

    // Iterar sobre las filas
    for (let i = 0; i < rows.length; i++) {
      const cells = rows[i].getElementsByTagName("td");
      const rowData = {};

      // Construir el objeto de datos usando los encabezados
      for (let j = 0; j < cells.length; j++) {
        rowData[headers[j]] = cells[j].innerText; // Asignar el valor de la celda al encabezado correspondiente
      }

      data.push(rowData);
    }

    return data;
  },
  sumarizeByField: (field, fieldToSumarize = []) => {
    // Selecciona todas las filas de la tabla
    const rows = document.querySelectorAll("#report-rows tr");
    const conteo = {};
    const sumas = {};

    // Obtiene los encabezados de la tabla
    const encabezados = document.querySelectorAll("#report-header th");
    const indices = Array.from(encabezados).map((th) => th.textContent.trim());

    // Encuentra el índice de la columna correspondiente al título dado
    const indiceColumna = indices.indexOf(field);
    if (indiceColumna === -1) {
      console.error(`El título "${field}" no se encontró en los encabezados.`);
      return [];
    }

    // Inicializa el objeto de sumas para cada campo a sumarizar
    fieldToSumarize.forEach((campo) => {
      sumas[campo] = 0;
    });

    // Recorre cada fila y cuenta las ocurrencias del campo especificado
    rows.forEach((row) => {
      const campo = row.cells[indiceColumna].textContent.trim(); // Obtiene el texto de la columna especificada
      // Inicializa el conteo del campo si no existe
      if (!conteo[campo]) {
        conteo[campo] = { cantidad: 0, sumas: {} };
      }
      conteo[campo].cantidad += 1; // Incrementa el contador

      // Suma los valores de los campos especificados
      fieldToSumarize.forEach((campoASumar) => {
        const valor = parseFloat(
          row.cells[indices.indexOf(campoASumar)].textContent.trim()
        );
        if (!isNaN(valor)) {
          conteo[campo].sumas[campoASumar] =
            (conteo[campo].sumas[campoASumar] || 0) + valor; // Suma el valor al total
        }
      });
    });

    // Convierte el objeto en un arreglo con la estructura deseada
    const resultado = Object.keys(conteo).map((campo) => ({
      name: campo,
      cantidad: conteo[campo].cantidad,
      sumas: conteo[campo].sumas,
    }));

    return resultado;
  },
  sumarizeByTwoLevels: (fieldLevel1, fieldLevel2, fieldsToSumarize = []) => {
    // Selecciona todas las filas de la tabla
    const rows = document.querySelectorAll("#report-rows tr");
    const conteoNivel1 = {};
    const conteoNivel2 = {};

    // Obtiene los encabezados de la tabla
    const encabezados = document.querySelectorAll("#report-header th");
    const indices = Array.from(encabezados).map((th) => th.textContent.trim());

    // Encuentra los índices de las columnas correspondientes a los títulos dados
    const indiceNivel1 = indices.indexOf(fieldLevel1);
    const indiceNivel2 = indices.indexOf(fieldLevel2);

    if (indiceNivel1 === -1) {
      console.error(
        `El título "${fieldLevel1}" no se encontró en los encabezados.`
      );
      return [];
    }
    if (indiceNivel2 === -1) {
      console.error(
        `El título "${fieldLevel2}" no se encontró en los encabezados.`
      );
      return [];
    }

    // Inicializa el objeto de sumas para cada campo a sumarizar
    fieldsToSumarize.forEach((campo) => {
      conteoNivel1[campo] = {};
      conteoNivel2[campo] = {};
    });

    // Recorre cada fila y cuenta las ocurrencias de los campos especificados
    rows.forEach((row, i) => {
      const campoNivel1 = row.cells[indiceNivel1].textContent.trim();
      const campoNivel2 = row.cells[indiceNivel2].textContent.trim();

      // Inicializa el conteo del nivel 1 si no existe
      if (!conteoNivel1[campoNivel1]) {
        conteoNivel1[campoNivel1] = { cantidad: 0, sumas: {} };
      }
      conteoNivel1[campoNivel1].cantidad += 1; // Incrementa el contador del nivel 1

      // Inicializa el conteo del nivel 2 si no existe
      if (!conteoNivel2[campoNivel1]) {
        conteoNivel2[campoNivel1] = {};
      }
      if (!conteoNivel2[campoNivel1][campoNivel2]) {
        conteoNivel2[campoNivel1][campoNivel2] = { cantidad: 0, sumas: {} };
      }
      conteoNivel2[campoNivel1][campoNivel2].cantidad += 1; // Incrementa el contador del nivel 2
      // Suma los valores de los campos especificados
      fieldsToSumarize.forEach((campoASumar) => {
        const valor = parseFloat(
          row.cells[indices.indexOf(campoASumar)].textContent.trim()
        );
        if (!isNaN(valor)) {
          // Suma al nivel 1
          conteoNivel1[campoNivel1].sumas[campoASumar] =
            (conteoNivel1[campoNivel1].sumas[campoASumar] || 0) + valor;
          // Suma al nivel 2
          conteoNivel2[campoNivel1][campoNivel2].sumas[campoASumar] =
            (conteoNivel2[campoNivel1][campoNivel2].sumas[campoASumar] || 0) +
            valor;
        }
      });
    });

    // Convierte el objeto de conteo del nivel 1 en un arreglo
    const resultadoNivel1 = Object.keys(conteoNivel1).map((campo) => ({
      name: campo,
      cantidad: conteoNivel1[campo].cantidad,
      sumas: conteoNivel1[campo].sumas,
      detalles: Object.keys(conteoNivel2[campo]).map((subCampo) => ({
        name: subCampo,
        cantidad: conteoNivel2[campo][subCampo].cantidad,
        sumas: conteoNivel2[campo][subCampo].sumas,
      })),
    }));

    return resultadoNivel1.slice(2);
  },
  // 2. FUNCIÓN PARA PROCESAR LOS DATOS (JSON a Jerarquía Sunburst)
  /**
   * Transforma un array de objetos JSON en la estructura jerárquica para Highcharts Sunburst.
   * * @param {Array<Object>} data - El array de objetos JSON (su jsonData).
   * @param {string} centerField - Nombre del campo JSON para el nivel central (Ej: 'Institucion').
   * @param {string} ring1Field - Nombre del campo JSON para el primer anillo (Ej: 'Parroquia').
   * @param {string} ring2Field - Nombre del campo JSON para el segundo anillo/hoja (Ej: 'Tipo de Medicamento').
   * @returns {Array<Object>} Datos listos para la serie del gráfico Sunburst.
   */
  createSunburstDataFromJSON: (data, centerField, ring1Field, ring2Field) => {
    const map = {};
    const sunburstData = [];

    data.forEach((record) => {
      // Obtenemos los valores de los campos dinámicamente
      const centerValue = record[centerField]
        ? record[centerField].trim()
        : "Sin Centro";
      const ring1Value = record[ring1Field]
        ? record[ring1Field].trim()
        : "Sin Anillo 1";
      const ring2Str = record[ring2Field] ? record[ring2Field].trim() : "";

      // 1. Separar los elementos del campo más granular (Medicamentos, que están separados por coma)
      const ring2Items = ring2Str
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== "");

      // 2. Usar una categoría genérica si el campo más granular está vacío
      if (ring2Items.length === 0) {
        ring2Items.push("NO INFORMADO");
      }

      // 3. Crear los nodos jerárquicos
      ring2Items.forEach((ring2Item) => {
        // Definición de la jerarquía basada en los parámetros
        const path = [centerValue, ring1Value, ring2Item];
        let currentPath = "";

        path.forEach((level, index) => {
          const parentPath = currentPath;
          currentPath += (currentPath ? "." : "") + level;

          if (!map[currentPath]) {
            map[currentPath] = {
              id: currentPath,
              parent: parentPath || null,
              name: level,
              value: 0,
            };
            sunburstData.push(map[currentPath]);
          }
          // Contar el registro para el nodo actual
          map[currentPath].value++;
        });
      });
    });
    return sunburstData;
  },

  chartDrillDown: (chartTitle, chartSubtitle, serieName, serieDrilldown) => {
    const dataSerie = FUNCTIONS_BY_SECTIONS.sumarizeByField(serieName).map(
      (v) => ({ name: v.name, y: v.cantidad, drilldown: v.name })
    );
    // Ordena el resultado de mayor a menor por cantidad
    dataSerie.sort((a, b) => b.y - a.y);

    const dataSeriesDrilldown = FUNCTIONS_BY_SECTIONS.sumarizeByTwoLevels(
      serieName,
      serieDrilldown
    ).map((valueLevel1) => ({
      name: valueLevel1.name,
      id: valueLevel1.name,
      data: valueLevel1.detalles.map((valueLevel2) => [
        valueLevel2.name,
        valueLevel2.cantidad,
      ]),
    }));
    dataSeriesDrilldown.forEach((item) => {
      item.data.sort((a, b) => b[1] - a[1]);
    });
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

      series: [{ name: serieName, colorByPoint: true, data: dataSerie }],

      drilldown: {
        breadcrumbs: {
          position: {
            align: "right",
          },
        },
        series: dataSeriesDrilldown,
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
    chartDrilldown: (alcance) => {
      const sumarizeParroquia = FUNCTIONS_BY_SECTIONS.sumarizeByField(
        "Parroquia",
        ["Requerido", "Disponible"]
      );
      sumarizeParroquia.sort((a, b) => b.sumas.Requerido - a.sumas.Requerido);

      const dataRequerido = sumarizeParroquia.map((v) => ({
        name: v.name,
        y: v.sumas.Requerido,
        drilldown: `${v.name}-req`,
      }));
      const dataDisponible = sumarizeParroquia.map((v) => ({
        name: v.name,
        y: v.sumas.Disponible,
        drilldown: `${v.name}-disp`,
      }));
      const dataDeficit = sumarizeParroquia.map((v) => ({
        name: v.name,
        y:
          Math.round(
            ((v.sumas.Requerido - v.sumas.Disponible) * 100 * 100) /
              v.sumas.Requerido
          ) / 100,
        drilldown: `${v.name}-def`,
      }));
      const sumarizeParroquiaInstitucion =
        FUNCTIONS_BY_SECTIONS.sumarizeByTwoLevels("Parroquia", "Institución", [
          "Requerido",
          "Disponible",
        ]);
      sumarizeParroquiaInstitucion.forEach((parroquia) => {
        parroquia.detalles.sort(
          (a, b) => b.sumas.Requerido - a.sumas.Requerido
        );
      });

      const drilldownDisponible = sumarizeParroquiaInstitucion.map((vl1) => ({
        id: `${vl1.name}-disp`,
        name: `Disponible`,
        data: vl1.detalles.map((vl2) => [
          `${vl2.name}</br> (Déficit ${
            Math.round(
              ((vl2.sumas.Requerido - vl2.sumas.Disponible) * 100 * 100) /
                vl2.sumas.Requerido
            ) / 100
          }%)`,
          vl2.sumas.Disponible,
        ]),
        dataLabels: {
          enabled: true, // Habilitar dataLabels para el valor requerido
          format: "{point.y}", // Mostrar el valor de requerido
        },
      }));

      const drilldownRequerido = sumarizeParroquiaInstitucion.map((vl1) => ({
        id: `${vl1.name}-req`,
        name: `Requerido`,
        data: vl1.detalles.map((vl2) => [
          `${vl2.name}</br> (Déficit ${
            Math.round(
              ((vl2.sumas.Requerido - vl2.sumas.Disponible) * 100 * 100) /
                vl2.sumas.Requerido
            ) / 100
          }%)`,
          vl2.sumas.Requerido,
        ]),
        dataLabels: {
          enabled: true, // Habilitar dataLabels para el valor requerido
          format: "{point.y}", // Mostrar el valor de requerido
        },
      }));

      const drilldownDeficit = sumarizeParroquiaInstitucion.map((vl1) => ({
        id: `${vl1.name}-def`,
        name: `Deficit`,
        data: vl1.detalles.map((vl2) => [
          `${vl2.name}</br> (Déficit ${
            Math.round(
              ((vl2.sumas.Requerido - vl2.sumas.Disponible) * 100 * 100) /
                vl2.sumas.Requerido
            ) / 100
          }%)`,
          Math.round(
            ((vl2.sumas.Requerido - vl2.sumas.Disponible) * 100 * 100) /
              vl2.sumas.Requerido
          ) / 100,
        ]),
        type: "line",
        yAxis: 1,
        color: "#f45b5b",
        tooltip: {
          valueSuffix: "%",
        },
        marker: { enabled: true },
      }));

      const highchartsOptions = {
        chart: {
          type: "column",
        },
        title: {
          text: `Personal ${alcance} del Centro Médico por Parroquia`,
        },
        subtitle: {
          text: "(Requerido, Disponible y Deficit %)",
        },
        xAxis: {
          type: "category",
        },
        yAxis: [
          {
            // Eje Y 0: Cantidades absolutas (Requerido/Disponible)
            min: 0,
            title: {
              text: "Cantidad Total de Recursos",
            },
          },
          {
            // Eje Y 1: Porcentaje de Déficit
            title: {
              text: "Déficit Promedio (%)",
              style: { color: "#f45b5b" },
            },
            labels: {
              format: "{value}%",
              style: { color: "#f45b5b" },
            },
            opposite: true,
            min: 0,
            max: 65,
          },
        ],
        tooltip: {
          shared: true,
        },
        plotOptions: {
          column: {
            cursor: "pointer",
            pointPadding: 0.1,
            borderWidth: 0,
          },
          // Mantenemos dataLabels global en 'false' para las columnas si el gráfico se ve abarrotado.
          series: {
            dataLabels: {
              enabled: false,
            },
          },
        },

        // --- SERIES PRINCIPALES (Nivel 1: Parroquias) ---
        series: [
          {
            name: "Requerido Total",
            color: "#434348",
            data: dataRequerido,
          },
          {
            name: "Disponible Total",
            color: "#7cb5ec",
            data: dataDisponible,
          },
          {
            name: "Déficit Promedio (%)",
            type: "line",
            yAxis: 1,
            color: "#f45b5b",
            data: dataDeficit,
            tooltip: {
              valueSuffix: "%",
            },
            marker: { enabled: true },
            // Opcional: Agregar dataLabels aquí si también quieres ver los promedios en la línea principal
          },
        ],

        // --- CONFIGURACIÓN DE DRILLDOWN (Nivel 2: Instituciones) ---
        drilldown: {
          // CORRECCIÓN: Usar el operador spread (...) para combinar los arrays
          series: [
            ...drilldownDisponible,
            ...drilldownRequerido,
            ...drilldownDeficit,
          ],
          breadcrumbs: {
            format: "<< Volver a Parroquias",
          },
        },
      };
      // Crear el gráfico
      Highcharts.chart("modal-chart", highchartsOptions);
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
    chartDensity: (tipo, situacion, color) => {
      // Paso 1: Limpieza de la data
      const rawData = FUNCTIONS_BY_SECTIONS.tableToJson();

      const serviceMap = {};
      const uniqueParroquias = new Set();
      const uniqueServices = new Set();

      rawData.forEach((item) => {
        uniqueParroquias.add(item.Parroquia);
        const services = item[`Servicios ${tipo} ${situacion}`].split(", ");

        services.forEach((service) => {
          uniqueServices.add(service);

          // Inicializar si es necesario
          if (!serviceMap[item.Parroquia]) {
            serviceMap[item.Parroquia] = {};
          }
          if (!serviceMap[item.Parroquia][service]) {
            serviceMap[item.Parroquia][service] = 0;
          }

          // Contar el servicio
          serviceMap[item.Parroquia][service]++;
        });
      });

      const parroquiasArray = Array.from(uniqueParroquias).sort();

      // Nuevo paso: 1.5 - Calcular la frecuencia total de cada servicio
      const serviceTotalCount = {};
      uniqueServices.forEach((service) => {
        let total = 0;
        // Sumar la frecuencia de este servicio en todas las parroquias
        parroquiasArray.forEach((parroquia) => {
          if (serviceMap[parroquia] && serviceMap[parroquia][service]) {
            total += serviceMap[parroquia][service];
          }
        });
        serviceTotalCount[service] = total;
      });

      const servicesArray = Array.from(uniqueServices).sort((a, b) => {
        // Ordenar de mayor a menor (frecuencia b - frecuencia a)
        return serviceTotalCount[a] - serviceTotalCount[b];
      });

      // Paso 2: Creacion de datos para hig charts
      const heatmapData = [];

      parroquiasArray.forEach((parroquia, xIndex) => {
        servicesArray.forEach((service, yIndex) => {
          const frequency = serviceMap[parroquia]
            ? serviceMap[parroquia][service] || 0
            : 0;

          if (frequency > 0) {
            heatmapData.push([xIndex, yIndex, frequency]);
          }
        });
      });

      // 💡 Paso 3: Formatear el nombre de cada especialidad para el Eje Y
      const formattedServicesArray = servicesArray.map((service) => {
        const total = serviceTotalCount[service];
        // Formato final: "Especialidad (Total)"
        return `${service} (${total})`;
      });

      //Paso 4: Configuracion de highcharts

      const highchartsOptions = {
        chart: {
          type: "heatmap",
          // Ajustar el margen si hay muchos servicios
          marginTop: 40,
          marginBottom: 80,
        },
        title: {
          text: `Densidad de Servicios ${tipo} - ${situacion}`,
        },
        /*
      subtitle: {
        text: "La intensidad del color indica cuántas instituciones ofrecen un servicio específico dentro de una parroquia.",
      },
      */
        xAxis: {
          categories: parroquiasArray, // Eje X: Parroquias
          title: null,
          labels: {
            rotation: -45, // Rotar para evitar superposición
            align: "right",
          },
        },
        yAxis: {
          // 💡 Usar el array con el formato "Servicio (Total)"
          categories: formattedServicesArray,
          title: null,
          labels: {
            step: 1,
          },
        },
        colorAxis: {
          min: 0,
          minColor: "#FFFFFF",
          maxColor: Highcharts.getOptions().colors[color], // Usar el color principal de Highcharts (azul)
          stops: [
            [0, "#FFFFFF"],
            [
              0.5,
              Highcharts.color(Highcharts.getOptions().colors[color])
                .setOpacity(0.5)
                .get("rgba"),
            ],
            [1, Highcharts.getOptions().colors[color]],
          ],
        },
        legend: {
          align: "right",
          layout: "vertical",
          margin: 0,
          verticalAlign: "top",
          y: 25,
          symbolHeight: 280,
        },
        tooltip: {
          formatter: function () {
            // Personalizar el tooltip
            const parroquia = this.series.xAxis.categories[this.point.x];
            const servicio = this.series.yAxis.categories[this.point.y];
            return `<b>${parroquia}</b><br/>${servicio}: <b>${this.point.value}</b> instituciones`;
          },
        },
        series: [
          {
            name: "Frecuencia de Servicios",
            borderWidth: 1,
            data: heatmapData, // Los datos generados
            dataLabels: {
              enabled: true,
              color: "#000000",
            },
          },
        ],
      };
      // Paso 4: Crear el gráfico
      Highcharts.chart("modal-chart", highchartsOptions);
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
