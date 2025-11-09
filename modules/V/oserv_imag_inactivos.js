import { PARROQUIAS_CARACAS } from "../../data.js";
import FUNCTIONS_DEFINITIONS_BY_SECTION from "../functions-definitions.js";
const obtenerOtrosServiciosEstado =
  FUNCTIONS_DEFINITIONS_BY_SECTION.V.obtenerOtrosServiciosEstado;
const oserv_imag_inactivos = {
  id: "oserv_inactivos",
  label: "Servicios de Imagenologias Inactivos",
  fields: [
    { key: "datosInstitucion.nombre", label: "Institución" },
    { key: "datosInstitucion.parroquia", label: "Parroquia" },
    {
      key: (data) => obtenerOtrosServiciosEstado(data, "cocina", "INACTIVO"),
      label: "Servicios Inactivos",
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
export default oserv_imag_inactivos;
