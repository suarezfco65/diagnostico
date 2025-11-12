import { PARROQUIAS_CARACAS } from "../../data.js";
import FUNCTIONS_BY_SECTIONS from "../functions-definitions.js";
const obtenerServiciosMedicos =
  FUNCTIONS_BY_SECTIONS.IV.obtenerServiciosMedicos;
const serv_activos = {
  id: "serv_activos",
  label: "Servicios Médicos Activos",
  fields: [
    { key: "datosInstitucion.nombre", label: "Institución" },
    { key: "datosInstitucion.parroquia", label: "Parroquia" },
    {
      key: (data) => obtenerServiciosMedicos(data, "ACTIVO"),
      label: "Servicios Activos",
    },
  ],
  searchFields: [
    "datosInstitucion.nombre",
    "datosInstitucion.parroquia",
    (data) => obtenerServiciosMedicos(data, "ACTIVO"),
  ],
  compoundFilters: [
    {
      key: "datosInstitucion.parroquia",
      label: "Filtrar por Parroquia",
      type: "string",
      options: PARROQUIAS_CARACAS.sort(), // Usar las parroquias como opciones
    },
  ],
  chart: (instituciones) => {
    // Paso 1: Limpieza de la data
    const rawData = FUNCTIONS_BY_SECTIONS.tableToJson();

    const serviceMap = {};
    const uniqueParroquias = new Set();
    const uniqueServices = new Set();

    rawData.forEach((item) => {
      uniqueParroquias.add(item.Parroquia);
      const services = item["Servicios Activos"].split(", ");

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
        text: "Densidad de Oferta de Servicios Médicos por Parroquia",
      },
      subtitle: {
        text: "La intensidad del color indica cuántas instituciones ofrecen un servicio específico dentro de una parroquia.",
      },
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
        maxColor: Highcharts.getOptions().colors[0], // Usar el color principal de Highcharts (azul)
        stops: [
          [0, "#FFFFFF"],
          [
            0.5,
            Highcharts.color(Highcharts.getOptions().colors[0])
              .setOpacity(0.5)
              .get("rgba"),
          ],
          [1, Highcharts.getOptions().colors[0]],
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
    console.log(highchartsOptions);
    // Paso 4: Crear el gráfico
    Highcharts.chart("modal-chart", highchartsOptions);
  },
};
export default serv_activos;
