import { PARROQUIAS_CARACAS } from "../../data.js";
import FUNCTIONS_DEFINITIONS_BY_SECTION from "../functions-definitions.js";
const obtenerOtrosServiciosEstado =
  FUNCTIONS_DEFINITIONS_BY_SECTION.V.obtenerOtrosServiciosEstado;
const oserv_imag_inexistentes = {
  id: "oserv_imag_inexistentes",
  label: "Servicios de Imagenologias Inexistentes",
  fields: [
    { key: "datosInstitucion.nombre", label: "Institución" },
    { key: "datosInstitucion.parroquia", label: "Parroquia" },
    {
      key: (data) => obtenerOtrosServiciosEstado(data, "imagenologia", "INEXISTENTE"),
      label: "Servicios de Imagenologias Inexistentes",
    },
  ],
  searchFields: [
    "datosInstitucion.nombre",
    "datosInstitucion.parroquia",
    (data) => obtenerOtrosServiciosEstado(data, "imagenologia", "INEXISTENTE"),
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
export default oserv_imag_inexistentes;
