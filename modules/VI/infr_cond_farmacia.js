import { PARROQUIAS_CARACAS } from "../../data.js";
const infr_cond_farmacia = {
  id: "infr_cond_farmacia",
  label: "Infraestructura - Condiciones de Farmacia",
  fields: [
    { key: "identificador", label: "ID / RIF" },
    { key: "datosInstitucion.nombre", label: "Nombre" },
    { key: "infraestructura.condiciones.farmacia.paredes", label: "Paredes" },
    { key: "infraestructura.condiciones.farmacia.techos", label: "Techos" },
    { key: "infraestructura.condiciones.farmacia.pisos", label: "Pisos" },
    { key: "infraestructura.condiciones.farmacia.aa", label: "A/A" },
    {
      key: "infraestructura.condiciones.farmacia.observacion",
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

export default infr_cond_farmacia;
