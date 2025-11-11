import { PARROQUIAS_CARACAS, ENTES_ADSCRITOS } from "../../data.js";
const inst_ente = {
  id: "inst_ente",
  label: "Centros de salud por Ente Adscrito",
  fields: [
    { key: "identificador", label: "ID / RIF" },
    { key: "datosInstitucion.nombre", label: "Nombre" },
    { key: "datosInstitucion.enteAdscrito", label: "Ente Adscrito" },
    { key: "datosInstitucion.parroquia", label: "Parroquia" },
  ],
  searchFields: [
    "identificador",
    "datosInstitucion.nombre",
    "datosInstitucion.enteAdscrito",
    "datosInstitucion.parroquia",
  ],
  compoundFilters: [
    {
      key: "datosInstitucion.parroquia",
      label: "Filtrar por Parroquia",
      type: "string",
      options: PARROQUIAS_CARACAS.sort(), // Usar las parroquias como opciones
    },
    {
      key: "datosInstitucion.enteAdscrito",
      label: "Ente adscrito",
      type: "string",
      options: ENTES_ADSCRITOS.map((ente) => ente.value).sort(),
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
        const { parroquia, enteAdscrito } = datosInstitucion;
        // Inicializar la parroquia si no existe
        if (!acc[parroquia]) {
          acc[parroquia] = { name: parroquia, id: parroquia, data: {} };
        }
        // Contar los tipos
        acc[parroquia].data[enteAdscrito] =
          (acc[parroquia].data[enteAdscrito] || 0) + 1;
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
        text: "Distribuidos por Parroquia y Ente Adscrito",
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

export default inst_ente;
