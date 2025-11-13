import { PARROQUIAS_CARACAS } from "../../data.js";
import FUNCTIONS_BY_SECTIONS from "../functions-definitions.js";
const obtenerOtrosServiciosEstado =
  FUNCTIONS_BY_SECTIONS.V.obtenerOtrosServiciosEstado;
const oserv_coc_inexistentes = {
  id: "oserv_coc_inexistentess",
  label: "Servicios de Cocina Inexistentes",
  fields: [
    { key: "datosInstitucion.nombre", label: "Institución" },
    { key: "datosInstitucion.parroquia", label: "Parroquia" },
    {
      key: (data) => obtenerOtrosServiciosEstado(data, "cocina", "NO EXISTE"),
      label: "Servicios de Cocina Inexistentes",
    },
  ],
  searchFields: [
    "datosInstitucion.nombre",
    "datosInstitucion.parroquia",
    (data) => obtenerOtrosServiciosEstado(data, "cocina", "NO EXISTE"),
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
      "de Cocina",
      "Inexistentes",
      5
    );
  },
};
export default oserv_coc_inexistentes;
