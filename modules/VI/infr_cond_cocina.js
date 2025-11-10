import { PARROQUIAS_CARACAS } from "../../data.js";
const infr_cond_cocina = {
  id: "infr_cond_cocina",
  label: "Infraestructura - Condiciones de Cocina",
  fields: [
    { key: "identificador", label: "ID / RIF" },
    { key: "datosInstitucion.nombre", label: "Nombre" },
    { key: "infraestructura.condiciones.cocina.paredes", label: "Paredes" },
    { key: "infraestructura.condiciones.cocina.techos", label: "Techos" },
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
};

export default infr_cond_cocina;
