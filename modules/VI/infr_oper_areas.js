import { PARROQUIAS_CARACAS } from "../../data.js";
// import FUNCTIONS_BY_SECTIONS from "../functions-definitions.js";
const operatividad = (data, infraestructura) => {
  const { cantidad, operativos } =
    data.infraestructura.condiciones[infraestructura];
  return `<b>${Math.round(
    (operativos * 100) / cantidad
  )}%</b> (${operativos} de ${cantidad})`;
};
const infr_oper_areas = {
  id: "infr_oper_areas",
  label: "Infraestructura - Operatividad de las areas",
  fields: [
    { key: "datosInstitucion.nombre", label: "Nombre" },
    {
      key: "datosInstitucion.parroquia",
      label: "Parroquia",
    },
    {
      key: (data) => operatividad(data, "consultorios"),
      label: "Consultorios",
    },
    { key: (data) => operatividad(data, "quirofanos"), label: "Quirofanos" },
    {
      key: (data) => operatividad(data, "hospitalizacion"),
      label: "Hospitalización",
    },
    { key: (data) => operatividad(data, "laboratorio"), label: "Laboratorio" },
    { key: (data) => operatividad(data, "farmacia"), label: "Farmacia" },
    { key: (data) => operatividad(data, "cocina"), label: "Cocina" },
  ],
  searchFields: ["identificador", "datosInstitucion.nombre"],
  compoundFilters: [
    {
      key: "datosInstitucion.parroquia",
      label: "Filtrar por Parroquia",
      type: "string",
      options: PARROQUIAS_CARACAS.sort(), // Usar las parroquias como opciones
    },
  ],
  chart: (data) => {
    // Función para calcular los indicadores operativos
    const calculateOperationalIndicators = (data) => {
      const areas = {
        consultorios: { total: 0, operativos: 0 },
        quirofanos: { total: 0, operativos: 0 },
        hospitalizacion: { total: 0, operativos: 0 },
        laboratorio: { total: 0, operativos: 0 },
        farmacia: { total: 0, operativos: 0 },
        cocina: { total: 0, operativos: 0 },
      };

      // Procesar cada registro
      data.forEach((centro) => {
        const condiciones = centro.infraestructura.condiciones;

        // Sumar para cada área
        Object.keys(areas).forEach((area) => {
          if (condiciones[area]) {
            areas[area].total += condiciones[area].cantidad || 0;
            areas[area].operativos += condiciones[area].operativos || 0;
          }
        });
      });

      return areas;
    };

    const areasData = calculateOperationalIndicators(data);

    const categories = Object.keys(areasData).map(
      (area) => area.charAt(0).toUpperCase() + area.slice(1)
    );

    const operativosData = Object.values(areasData).map((area) =>
      area.total > 0 ? (area.operativos / area.total) * 100 : 0
    );

    const noOperativosData = Object.values(areasData).map((area) =>
      area.total > 0 ? ((area.total - area.operativos) / area.total) * 100 : 0
    );

    const highchartsOptions = {
      chart: {
        type: "bar",
      },
      title: {
        text: "Eficiencia Operativa por Área",
      },
      xAxis: {
        categories: categories,
        title: {
          text: "Áreas",
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
        pointFormat:
          '<span style="color:{series.color}">{series.name}</span>: <b>{point.y:.1f}%</b><br/>',
        shared: true,
      },
      plotOptions: {
        bar: {
          stacking: "percent",
          dataLabels: {
            enabled: true,
            format: "{point.y:.1f}%",
            color: "#FFFFFF",
            style: {
              textOutline: "none",
              fontWeight: "bold",
            },
          },
        },
      },
      series: [
        {
          name: "Unidades Operativas",
          data: operativosData,
          color: "#2ecc71",
        },
        {
          name: "Unidades No Operativas",
          data: noOperativosData,
          color: "#e74c3c",
        },
      ],
      credits: {
        enabled: false,
      },
    };

    Highcharts.chart("modal-chart", highchartsOptions);
  },
};

export default infr_oper_areas;
