import { PARROQUIAS_CARACAS } from "../../data.js";
import FUNCTIONS_BY_SECTIONS from "../functions-definitions.js";
const infr_cond_cocina = {
  id: "infr_cond_cocina",
  label: "Infraestructura - Condiciones de Cocina",
  fields: [
    { key: "identificador", label: "ID / RIF" },
    { key: "datosInstitucion.nombre", label: "Nombre" },
    { key: "datosInstitucion.parroquia", label: "Parroquia" },
    { key: "infraestructura.condiciones.cocina.paredes", label: "Paredes" },
    { key: "infraestructura.condiciones.cocina.techos", label: "Techos" },
    { key: "infraestructura.condiciones.cocina.pisos", label: "Pisos" },
    { key: "infraestructura.condiciones.cocina.aa", label: "A/A" },
    {
      key: "infraestructura.condiciones.cocina.observacion",
      label: "Observaciones",
    },
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
  chart: (instituciones) => {
    const dataInstituciones = FUNCTIONS_BY_SECTIONS.tableToJson();
    // Nombres de las series que queremos graficar (las áreas principales)
    const highchartsOptions = FUNCTIONS_BY_SECTIONS.generateHeatmapConfig(
      dataInstituciones,
      "Cocina"
    );
    Highcharts.chart("modal-chart", highchartsOptions);
  },
};

export default infr_cond_cocina;
