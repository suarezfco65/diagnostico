import { PARROQUIAS_CARACAS } from "../../data.js";
import FUNCTIONS_BY_SECTIONS from "../functions-definitions.js";
const obtenerOtrosServiciosEstado =
  FUNCTIONS_BY_SECTIONS.V.obtenerOtrosServiciosEstado;
const oserv_coc_inactivos = {
  id: "oserv_coc_inactivos",
  label: "Servicios de Cocina Inactivos",
  fields: [
    { key: "datosInstitucion.nombre", label: "Institución" },
    { key: "datosInstitucion.parroquia", label: "Parroquia" },
    {
      key: (data) => obtenerOtrosServiciosEstado(data, "cocina", "INACTIVO"),
      label: "Servicios de cocina Inactivos",
    },
  ],
  searchFields: [
    "datosInstitucion.nombre",
    "datosInstitucion.parroquia",
    (data) => obtenerOtrosServiciosEstado(data, "cocina", "INACTIVO"),
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
export default oserv_coc_inactivos;
