import { PARROQUIAS_CARACAS } from "../../data.js";
const infr_cond_quirofanos = {
  id: "infr_cond_quirofanos",
  label: "Infraestructura - Condiciones de Quirofanos",
  fields: [
    { key: "identificador", label: "ID / RIF" },
    { key: "datosInstitucion.nombre", label: "Nombre" },
    { key: (Data) => Data.infraestructura.condiciones.quirofanos.operativos + " de " +Data.infraestructura.condiciones.quirofanos.cantidad , label: "Operativos" },
    { key: "infraestructura.condiciones.quirofanos.paredes", label: "Paredes" },
    { key: "infraestructura.condiciones.quirofanos.techos", label: "Techos" },
    { key: "infraestructura.condiciones.quirofanos.pisos", label: "Pisos" },
    { key: "infraestructura.condiciones.quirofanos.aa", label: "A/A" },
    {
      key: "infraestructura.condiciones.quirofanos.observacion",
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
};

export default infr_cond_quirofanos;
