import { PARROQUIAS_CARACAS } from "../../data.js";
import FUNCTIONS_BY_SECTIONS from "../functions-definitions.js";
const obtenerOtrosServiciosEstado =
  FUNCTIONS_BY_SECTIONS.V.obtenerOtrosServiciosEstado;
const oserv_imag_inexistentes = {
  id: "oserv_imag_inexistentes",
  label: "Servicios de Imagenologias Inexistentes",
  fields: [
    { key: "datosInstitucion.nombre", label: "Institución" },
    { key: "datosInstitucion.parroquia", label: "Parroquia" },
    {
      key: (data) =>
        obtenerOtrosServiciosEstado(data, "imagenologia", "NO EXISTE"),
      label: "Servicios de Imagenologias Inexistentes",
    },
  ],
  searchFields: [
    "datosInstitucion.nombre",
    "datosInstitucion.parroquia",
    (data) => obtenerOtrosServiciosEstado(data, "imagenologia", "NO EXISTE"),
  ],
  compoundFilters: [
    {
      key: "datosInstitucion.parroquia",
      label: "Filtrar por Parroquia",
      type: "string",
      options: PARROQUIAS_CARACAS.sort(), // Usar las parroquias como opciones
    },
  ],
  chart: (instituciones) => {
    FUNCTIONS_BY_SECTIONS.IV.chartDensity(
      "Servicios",
      "de Imagenologias",
      "Inexistentes",
      5
    );
  },
};
export default oserv_imag_inexistentes;
