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

  generateHeatmapConfig:
    /**
     * Genera el objeto de configuración de Highcharts para un Heatmap
     * de las condiciones de las instalaciones.
     * * @param {Array<Object>} institutionsData - La lista de objetos de las instituciones.
     * * @param {string} Infraestructura - Nombre de la infraestructura (Ej. "Cocina").
     * @param {Array<string>} categories - El array de nombres de las columnas/categorias a analizar (ej: ["Paredes", "Techos"]).
     * @returns {Object} La configuración completa del Highcharts.
     */
    (institutionsData, infraestructura) => {
      // 1. Definir los niveles de condición que serán las series (colores de la barra)
      const conditions = ["MALAS COND", "REGULAR COND", "BUENAS COND"];

      // 2. Estructura de datos para agrupar: { 'Parroquia A': { 'MALAS COND': 10, 'REGULAR COND': 5, ... }, ... }
      const groupedData = {};

      // 3. Procesar los datos para contar las condiciones por parroquia
      institutionsData.forEach((institution) => {
        const parroquia = institution.Parroquia || "SIN PARROQUIA"; // Manejar datos faltantes
        if (!groupedData[parroquia]) {
          groupedData[parroquia] = {
            "MALAS COND": 0,
            "REGULAR COND": 0,
            "BUENAS COND": 0,
          };
        }

        // Se evalúan 4 categorías por institución: Paredes, Techos, Pisos, A/A
        ["Paredes", "Techos", "Pisos", "A/A"].forEach((category) => {
          const condition = institution[category];
          if (conditions.includes(condition)) {
            groupedData[parroquia][condition]++;
          }
        });
      });

      // 4. Transformar los datos agrupados al formato de series de Highcharts
      const categories = Object.keys(groupedData); // Las parroquias serán las categorías del Eje Y

      // Ordenar el array de parroquias (categories)
      categories.sort((a, b) => {
        // Acceder a la cuenta de 'BUENAS COND' para la Parroquia 'b' y 'a'
        const countA =
          groupedData[a]["MALAS COND"] /
          (groupedData[a]["MALAS COND"] +
            groupedData[a]["REGULAR COND"] +
            groupedData[a]["BUENAS COND"]);
        const countB =
          groupedData[b]["MALAS COND"] /
          (groupedData[b]["MALAS COND"] +
            groupedData[b]["REGULAR COND"] +
            groupedData[b]["BUENAS COND"]);
        // Devolver la diferencia (countB - countA) para un orden descendente
        return countA - countB;
      });

      // 5. Transformar los datos agrupados al formato de series de Highcharts usando el orden de 'categories'
      const series = conditions.map((condition) => {
        return {
          name: condition,
          data: categories.map(
            (parroquia) => groupedData[parroquia][condition]
          ),
          color:
            condition === "MALAS COND"
              ? "#C04000"
              : condition === "REGULAR COND"
              ? "#FFBF00"
              : "#00A86B", // Rojo, Ámbar, Verde
        };
      });

      // 6. Generar la configuración del Highcharts
      return {
        chart: {
          type: "bar",
        },
        title: {
          text: `Resumen de Condiciones de Infraestructura - ${infraestructura}`,
        },
        subtitle: {
          text: "Agrupadas por Parroquia",
        },
        xAxis: {
          categories: categories,
          title: {
            text: "Parroquias",
          },
        },
        yAxis: {
          min: 0,
          title: {
            text: "Total de Evaluaciones",
          },
        },
        tooltip: {
          // Mostrar la contribución en el total (formato porcentaje)
          pointFormat:
            "{series.name}: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>",
        },
        plotOptions: {
          series: {
            stacking: "percent", // Apilamiento en porcentaje para comparación de proporciones
          },
        },
        series: series,
        credits: {
          enabled: false,
        },
      };
    },

  generateHighchartsDataBarrasAgrupadas:
    /**
     * Genera el objeto de configuración JSON para un gráfico de barras agrupadas de Highcharts.
     *
     * @param {Array<Object>} dataInstituciones - El array de objetos con la información de las instituciones.
     * @param {Array<string>} areasToAnalyze - El array de nombres de las columnas/áreas a analizar (ej: ["Cardiología", "Coagulación"]).
     * @returns {Object} El objeto JSON con la estructura completa para Highcharts.
     */
    (dataInstituciones, areasToAnalyze) => {
      if (
        !dataInstituciones ||
        dataInstituciones.length === 0 ||
        !areasToAnalyze ||
        areasToAnalyze.length === 0
      ) {
        console.error("Los datos o las áreas a analizar no son válidos.");
        return {};
      }

      const frequencyCounts = {};
      const allUniqueServices = new Set();

      // Inicializar los contadores y el Set de servicios únicos
      areasToAnalyze.forEach((area) => {
        frequencyCounts[area] = {};
      });

      // 1. ITERAR Y CONTAR
      dataInstituciones.forEach((institution) => {
        areasToAnalyze.forEach((area) => {
          const servicesString = institution[area];

          if (servicesString) {
            // Normaliza: limpia y divide la cadena de servicios
            const services = servicesString
              .split(",")
              .map((s) => s.trim()) // Elimina espacios extra
              .filter((s) => s.length > 0);

            services.forEach((service) => {
              allUniqueServices.add(service);
              frequencyCounts[area][service] =
                (frequencyCounts[area][service] || 0) + 1;
            });
          }
        });
      });

      // 2. GENERAR ESTRUCTURA DE HIGHCHARTS
      const xAxisCategories = Array.from(allUniqueServices).sort();

      const highchartsSeries = areasToAnalyze.map((area) => {
        const data = xAxisCategories.map((service) => {
          // Obtener el conteo para ese servicio en el área actual (o 0 si no existe)
          return frequencyCounts[area][service] || 0;
        });

        return {
          name: area,
          data: data,
        };
      });

      return {
        chart: {
          type: "column",
        },
        title: {
          text:
            "Frecuencia de Servicios por Área: " + areasToAnalyze.join(", "),
        },
        subtitle: {
          text:
            "Total de instituciones analizadas: " + dataInstituciones.length,
        },
        xAxis: {
          categories: xAxisCategories,
          title: {
            text: "Servicios Médicos Específicos",
          },
        },
        yAxis: {
          title: {
            text: "Número de Instituciones que Ofrecen el Servicio",
          },
          allowDecimals: false,
        },
        tooltip: {
          shared: true,
          useHTML: true,
          headerFormat:
            '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat:
            '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y}</b></td></tr>',
          footerFormat: "</table>",
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0,
          },
        },
        series: highchartsSeries,
      };
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
    chartDensity: (prestacion, tipo, situacion, color) => {
      // -----------------------------------------------------------------
      // FASE I: PREPARACIÓN Y CONTEO DE DATOS (Agrupación y Frecuencias)
      // -----------------------------------------------------------------

      const rawData = FUNCTIONS_BY_SECTIONS.tableToJson();

      const serviceMap = {}; // Contiene { Parroquia: { Servicio: Frecuencia } }
      const uniqueParroquias = new Set();
      const uniqueServices = new Set();

      // 1. Conteo de Frecuencias y Extracción de Nombres Únicos
      rawData.forEach((item) => {
        uniqueParroquias.add(item.Parroquia);
        // El nombre del campo es dinámico, ej: 'Servicios Requerido Total'
        const services = item[`${prestacion} ${tipo} ${situacion}`].split(", ");

        services.forEach((service) => {
          uniqueServices.add(service);

          // Inicializar y contar
          serviceMap[item.Parroquia] = serviceMap[item.Parroquia] || {};
          serviceMap[item.Parroquia][service] =
            (serviceMap[item.Parroquia][service] || 0) + 1;
        });
      });

      const servicesList = Array.from(uniqueServices);
      const parroquiasList = Array.from(uniqueParroquias);

      // 2. Cálculo de Totales por Categoría

      const serviceTotalCount = {}; // Total global de instituciones por Servicio
      const parishTotalCount = {}; // Total de servicios contados (suma de frecuencias) por Parroquia

      parroquiasList.forEach((parroquia) => {
        let totalServices = 0;

        servicesList.forEach((service) => {
          const frequency = serviceMap[parroquia]
            ? serviceMap[parroquia][service] || 0
            : 0;

          // a) Conteo total por Servicio (para ordenar el Eje Y)
          serviceTotalCount[service] =
            (serviceTotalCount[service] || 0) + frequency;

          // b) Conteo total por Parroquia (para ordenar el Eje X)
          totalServices += frequency;
        });

        parishTotalCount[parroquia] = totalServices;
      });

      // -----------------------------------------------------------------
      // FASE II: ORDENAMIENTO Y FORMATO (Creación de Categorías y Data)
      // -----------------------------------------------------------------

      // 3. Ordenamiento y Formato del Eje Y (Servicios)
      const orderedServicesArray = servicesList.sort(
        (a, b) =>
          // Ordenar de MENOR a MAYOR por total de servicio
          serviceTotalCount[a] - serviceTotalCount[b]
      );

      const formattedServicesArray = orderedServicesArray.map(
        (service) => `${service} (${serviceTotalCount[service]})`
      );

      // 4. Ordenamiento y Formato del Eje X (Parroquias)
      const orderedParroquiasArray = parroquiasList.sort(
        (a, b) =>
          // Ordenar de MAYOR a MENOR por total de parroquia
          parishTotalCount[b] - parishTotalCount[a]
      );

      const formattedParroquiasArray = orderedParroquiasArray.map(
        (parroquia) => `${parroquia} (${parishTotalCount[parroquia]})`
      );

      // 5. Creación de Datos del Heatmap (¡CRÍTICO: Usar los arrays ordenados para indexar!)
      const heatmapData = [];

      // Crear un mapa de índice rápido para las parroquias y servicios ordenados
      const parroquiaIndexMap = orderedParroquiasArray.reduce(
        (acc, name, i) => ({ ...acc, [name]: i }),
        {}
      );
      const serviceIndexMap = orderedServicesArray.reduce(
        (acc, name, i) => ({ ...acc, [name]: i }),
        {}
      );

      parroquiasList.forEach((parroquia) => {
        servicesList.forEach((service) => {
          const frequency = serviceMap[parroquia]
            ? serviceMap[parroquia][service] || 0
            : 0;

          if (frequency > 0) {
            // Obtener el índice (X/Y) según el ordenamiento FINAL
            const xIndex = parroquiaIndexMap[parroquia];
            const yIndex = serviceIndexMap[service];

            heatmapData.push([xIndex, yIndex, frequency]);
          }
        });
      });

      // -----------------------------------------------------------------
      // FASE III: CONFIGURACIÓN Y RENDERIZADO DEL GRÁFICO
      // -----------------------------------------------------------------

      const highchartsOptions = {
        chart: {
          type: "heatmap",
          marginTop: 40,
          marginBottom: 80,
        },
        title: {
          text: `Densidad de ${prestacion} ${tipo} - ${situacion}`,
        },
        xAxis: {
          // 💡 USAR EL ARRAY ORDENADO Y FORMATEADO PARA EL EJE X
          categories: formattedParroquiasArray,
          title: null,
          labels: {
            rotation: -45,
            align: "right",
          },
        },
        yAxis: {
          // 💡 USAR EL ARRAY ORDENADO Y FORMATEADO PARA EL EJE Y
          categories: formattedServicesArray,
          title: null,
          labels: {
            step: 1,
          },
        },
        colorAxis: {
          min: 0,
          minColor: "#FFFFFF",
          maxColor: Highcharts.getOptions().colors[color],
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
            // El tooltip usa los nombres formateados automáticamente desde las categorías
            const parroquia = this.series.xAxis.categories[this.point.x];
            const servicio = this.series.yAxis.categories[this.point.y];
            return `<b>${parroquia}</b><br/>${servicio}: <b>${this.point.value}</b> instituciones`;
          },
        },
        series: [
          {
            name: `Frecuencia de ${prestacion}`,
            borderWidth: 1,
            data: heatmapData, // La data usa los índices del ordenamiento
            dataLabels: {
              enabled: true,
              color: "#000000",
            },
          },
        ],
      };

      // 6. Renderizado
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
