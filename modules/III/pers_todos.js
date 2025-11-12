import { PARROQUIAS_CARACAS } from "../../data.js";
import FUNCTIONS_BY_SECTIONS from "../functions-definitions.js";
const totalPersonal = FUNCTIONS_BY_SECTIONS.III.totalPersonal;
const pers_todos = {
  id: "pers_todos",
  label: "Personal Total del centro médico",
  fields: [
    { key: "datosInstitucion.nombre", label: "Institución" },
    { key: "datosInstitucion.parroquia", label: "Parroquia" },
    {
      key: (data) => totalPersonal(data, ``, ``, `requerido`),
      label: "Requerido",
    },
    {
      key: (data) => totalPersonal(data, ``, ``, `disponible`),
      label: "Disponible",
    },
    {
      key: (data) =>
        (
          ((totalPersonal(data, ``, ``, `requerido`) -
            totalPersonal(data, ``, ``, `disponible`)) *
            100) /
          totalPersonal(data, ``, ``, `requerido`)
        ).toFixed(2) + "%",
      label: "Deficit (%)",
    },
  ],
  searchFields: ["datosInstitucion.nombre", "datosInstitucion.parroquia"],
  compoundFilters: [
    {
      key: "datosInstitucion.parroquia",
      label: "Filtrar por Parroquia",
      type: "string",
      options: PARROQUIAS_CARACAS.sort(), // Usar las parroquias como opciones
    },
  ],
  chart: (instituciones) => {
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
    const dataDeficit = sumarizeParroquia.map(
      (v) =>
        Math.round(
          ((v.sumas.Requerido - v.sumas.Disponible) * 100 * 100) /
            v.sumas.Requerido
        ) / 100
    );

    const sumarizeParroquiaInstitucion =
      FUNCTIONS_BY_SECTIONS.sumarizeByTwoLevels("Parroquia", "Institución", [
        "Requerido",
        "Disponible",
      ]);
    sumarizeParroquiaInstitucion.forEach((parroquia) => {
      parroquia.detalles.sort((a, b) => b.sumas.Requerido - a.sumas.Requerido);
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
    }));

    const highchartsOptions = {
      chart: {
        type: "column",
      },
      title: {
        text: "Personal total del Centro Médico<br>(Requerido vs. Disponible por Parroquia con (Drilldown))",
      },
      subtitle: {
        text: "Haga clic en una columna para ver el detalle por institución. La línea roja muestra el Déficit (%) de cada institución.",
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
        series: [...drilldownDisponible, ...drilldownRequerido],
        breadcrumbs: {
          format: "<< Volver a Parroquias",
        },
      },
    };
    // Crear el gráfico
    Highcharts.chart("modal-chart", highchartsOptions);
  },
};
export default pers_todos;
