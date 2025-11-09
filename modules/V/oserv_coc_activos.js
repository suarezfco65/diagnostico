import { PARROQUIAS_CARACAS } from "../../data.js";
import FUNCTIONS_DEFINITIONS_BY_SECTION from "../functions-definitions.js";
const obtenerOtrosServiciosEstado =
  FUNCTIONS_DEFINITIONS_BY_SECTION.V.obtenerOtrosServiciosEstado;
const oserv_coc_activos = {
  id: "oserv_coc_activos",
  label: "Servicios de Cocina Activos",
  fields: [
    { key: "datosInstitucion.nombre", label: "Institución" },
    { key: "datosInstitucion.parroquia", label: "Parroquia" },
    {
      key: (data) => obtenerOtrosServiciosEstado(data, "cocina", "ACTIVO"),
      label: "Servicios Activos",
    },
  ],
  searchFields: [
    "datosInstitucion.nombre",
    "datosInstitucion.parroquia",
    (data) => obtenerOtrosServiciosEstado(data, "cocina", "ACTIVO"),
  ],
  compoundFilters: [
    {
      key: "datosInstitucion.parroquia",
      label: "Filtrar por Parroquia",
      type: "string",
      options: PARROQUIAS_CARACAS.sort(), // Usar las parroquias como opciones
    },
  ],
};
export default oserv_coc_activos;
