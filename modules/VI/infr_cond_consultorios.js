import { PARROQUIAS_CARACAS } from "../../data.js";
const infr_cond_consultorios = {
  id: "infr_cond_consultorios",
  label: "Infraestructura - Condiciones de Consultorios",
  fields: [
    { key: "identificador", label: "ID / RIF" },
    { key: "datosInstitucion.nombre", label: "Nombre" },
    { key: (Data) => Data.infraestructura.condiciones.consultorios.operativos + " de " +Data.infraestructura.condiciones.consultorios.cantidad , label: "Operativos" },
    { key: "infraestructura.condiciones.consultorios.paredes", label: "Paredes" },
    { key: "infraestructura.condiciones.consultorios.techos", label: "Techos" },
    { key: "infraestructura.condiciones.consultorios.pisos", label: "Pisos" },
    { key: "infraestructura.condiciones.consultorios.aa", label: "A/A" },
    {
      key: "infraestructura.condiciones.consultorios.observacion",
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

export default infr_cond_consultorios;
