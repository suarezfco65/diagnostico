import { PARROQUIAS_CARACAS } from "../../data.js";
const infr_cond_laboratorio = {
  id: "infr_cond_laboratorio",
  label: "Infraestructura - Condiciones de Laboratorio",
  fields: [
    { key: "identificador", label: "ID / RIF" },
    { key: "datosInstitucion.nombre", label: "Nombre" },
    { key: "infraestructura.condiciones.laboratorio.paredes", label: "Paredes" },
    { key: "infraestructura.condiciones.laboratorio.techos", label: "Techos" },
    { key: "infraestructura.condiciones.laboratorio.pisos", label: "Pisos" },
    { key: "infraestructura.condiciones.laboratorio.aa", label: "A/A" },
    {
      key: "infraestructura.condiciones.laboratorio.observacion",
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

export default infr_cond_laboratorio;
