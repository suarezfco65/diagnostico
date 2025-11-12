import { PARROQUIAS_CARACAS } from "../../data.js";
import FUNCTIONS_BY_SECTIONS from "../functions-definitions.js";
const obtenerServiciosMedicos =
  FUNCTIONS_BY_SECTIONS.IV.obtenerServiciosMedicos;
const serv_inexistentes = {
  id: "serv_inexistentes",
  label: "Servicios Médicos Inexistentes",
  fields: [
    { key: "datosInstitucion.nombre", label: "Institución" },
    { key: "datosInstitucion.parroquia", label: "Parroquia" },
    {
      key: (data) => obtenerServiciosMedicos(data, "NO EXISTE"),
      label: "Servicios Médicos Inexistentes",
    },
  ],
  searchFields: [
    "datosInstitucion.nombre",
    "datosInstitucion.parroquia",
    (data) => obtenerServiciosMedicos(data, "NO EXISTE"),
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
    FUNCTIONS_BY_SECTIONS.IV.chartDensity("Médicos", "Inexistentes", 5);
  },
};
export default serv_inexistentes;
