import { PARROQUIAS_CARACAS, TIPOS_INSTITUCION } from "../../data.js";
const inst_general = {
  id: "inst_general",
  label: "Centros de salud por Tipo de Institución",
  fields: [
    { key: "identificador", label: "ID / RIF" },
    { key: "datosInstitucion.nombre", label: "Nombre Institución" },
    { key: "datosInstitucion.tipoInstitucion", label: "Tipo" },
    { key: "datosInstitucion.parroquia", label: "Parroquia" },
  ],
  searchFields: [
    "identificador",
    "datosInstitucion.nombre",
    "datosInstitucion.parroquia",
    "datosInstitucion.tipoInstitucion",
  ],
  compoundFilters: [
    {
      key: "datosInstitucion.parroquia",
      label: "Filtrar por Parroquia",
      type: "string",
      options: PARROQUIAS_CARACAS.sort(),
    },
    {
      key: "datosInstitucion.tipoInstitucion",
      label: "Tipo de Institución",
      type: "string",
      options: TIPOS_INSTITUCION.map((tipo) => tipo.value).sort(),
    },
  ],
  chart: (instituciones) => {
    const seriesData = Object.entries(
      instituciones.reduce((acc, { datosInstitucion }) => {
        const { parroquia } = datosInstitucion;
        acc[parroquia] = (acc[parroquia] || 0) + 1;
        return acc;
      }, {})
    )
      .map(([name, y]) => ({
        name,
        y,
        drilldown: name,
      }))
      .sort((a, b) => b.y - a.y);
    const drilldownData = Object.values(
      instituciones.reduce((acc, { datosInstitucion }) => {
        const { parroquia, tipoInstitucion } = datosInstitucion;
        // Inicializar la parroquia si no existe
        if (!acc[parroquia]) {
          acc[parroquia] = { name: parroquia, id: parroquia, data: {} };
        }
        // Contar los tipos
        acc[parroquia].data[tipoInstitucion] =
          (acc[parroquia].data[tipoInstitucion] || 0) + 1;
        return acc;
      }, {})
    ).map(({ name, id, data }) => ({
      name,
      id,
      data: Object.entries(data).sort(([, a], [, b]) => b - a), // Ordenar por cantidad
    }));
    Highcharts.chart("modal-chart", {
      chart: {
        type: "column",
      },
      title: {
        text: "Cantidad de Centros de salud",
      },
      subtitle: {
        text: "Distribuidos por Parroquia y Tipo de Institución",
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
          "<b>{point.y}</b> centros<br/>",
      },

      series: [{ name: "Parroquias", colorByPoint: true, data: seriesData }],

      drilldown: {
        breadcrumbs: {
          position: {
            align: "right",
          },
        },
        series: drilldownData,
      },
    });
  },
};

export default inst_general;
