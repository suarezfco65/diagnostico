import { PARROQUIAS_CARACAS } from "../../data.js";
import FUNCTIONS_BY_SECTIONS from "../functions-definitions.js";
const obtenerOtrosServiciosDisponibles =
  FUNCTIONS_BY_SECTIONS.V.obtenerOtrosServiciosDisponibles;
const oserv_farm_altoCosto = {
  id: "oserv_farm_altoCosto",
  label: "Medicamentos Alto Costo Disponibles en Farmacia",
  fields: [
    { key: "datosInstitucion.nombre", label: "Institución" },
    { key: "datosInstitucion.parroquia", label: "Parroquia" },
    {
      key: (data) =>
        obtenerOtrosServiciosDisponibles(data, "farmacia", "altoCosto", true),
      label: "Medicamentos disponibles",
    },
  ],
  searchFields: [
    "datosInstitucion.nombre",
    "datosInstitucion.parroquia",
    (data) =>
      obtenerOtrosServiciosDisponibles(data, "farmacia", "altoCosto", true),
  ],
  compoundFilters: [
    {
      key: "datosInstitucion.parroquia",
      label: "Filtrar por Parroquia",
      type: "string",
      options: PARROQUIAS_CARACAS.sort(), // Usar las parroquias como opciones
    },
  ],
  chart: (institucion) => {
    // 1. DATA FUENTE (Ejemplo en formato JSON)
    const jsonData = FUNCTIONS_BY_SECTIONS.tableToJson();

    // 2. LLAMADA A LA FUNCIÓN CON LA JERARQUÍA DESEADA
    // Jerarquía: Institucion (Centro) -> Parroquia (Anillo 1) -> Tipo de Medicamento (Anillo 2)
    const centerField = "Parroquia";
    const ring1Field = "Medicamentos disponibles";
    const ring2Field = "Institución";

    const sunburstSeriesData = FUNCTIONS_BY_SECTIONS.createSunburstDataFromJSON(
      jsonData,
      centerField,
      ring1Field,
      ring2Field
    );

    // 3. CONFIGURACIÓN DEL GRÁFICO HIGHCHARTS
    const highchartsOptions = {
      // Asegúrate de tener un div con id="container"
      chart: {
        height: "650px",
        style: { fontFamily: "Roboto, sans-serif" },
      },
      title: {
        text: "🌞 Distribución de Disponibilidad de Medicamentos (Sunburst)",
        style: { fontSize: "20px" },
      },
      subtitle: {
        text: `Jerarquía: ${centerField} > ${ring1Field} > ${ring2Field}.`,
      },
      series: [
        {
          type: "sunburst",
          data: sunburstSeriesData,
          allowDrillToNode: true,
          cursor: "pointer",
          tooltip: {
            headerFormat: "",
            pointFormat:
              "<b>{point.name}</b><br>Registros: <b>{point.value}</b>",
          },
          // Configuración de la visualización
          center: ["50%", "50%"],
          dataLabels: {
            formatter: function () {
              // Muestra el nombre solo si el valor del nodo es significativo (> 5, por ejemplo)
              return this.point.value > 5 ? this.point.name : null;
            },
            style: {
              fontSize: "10px",
              textOutline: "1px #FFF",
            },
          },
          levels: [
            {
              level: 1,
              levelIsConstant: false,
              colorByPoint: true,
            },
            {
              level: 2,
              colorVariation: {
                key: "brightness",
                to: 0.2,
              },
            },
            {
              level: 3,
              colorVariation: {
                key: "brightness",
                to: 0.5,
              },
            },
          ],
        },
      ],
    };

    Highcharts.chart("modal-chart", highchartsOptions);
  },
};
export default oserv_farm_altoCosto;
