import { PARROQUIAS_CARACAS } from "../../data.js";
import FUNCTIONS_BY_SECTIONS from "../functions-definitions.js";
const obtenerServiciosMedicos =
  FUNCTIONS_BY_SECTIONS.IV.obtenerServiciosMedicos;
const serv_activos = {
  id: "serv_activos",
  label: "Servicios Médicos Activos",
  fields: [
    { key: "datosInstitucion.nombre", label: "Institución" },
    { key: "datosInstitucion.parroquia", label: "Parroquia" },
    {
      key: (data) => obtenerServiciosMedicos(data, "ACTIVO"),
      label: "Servicios Médicos Activos",
    },
  ],
  searchFields: [
    "datosInstitucion.nombre",
    "datosInstitucion.parroquia",
    (data) => obtenerServiciosMedicos(data, "ACTIVO"),
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
    FUNCTIONS_BY_SECTIONS.IV.chartDensity("Médicos", "Activos", 2);
  },
};
export default serv_activos;
