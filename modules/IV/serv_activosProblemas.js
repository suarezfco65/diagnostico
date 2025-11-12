import { PARROQUIAS_CARACAS } from "../../data.js";
import FUNCTIONS_BY_SECTIONS from "../functions-definitions.js";
const obtenerServiciosMedicos =
  FUNCTIONS_BY_SECTIONS.IV.obtenerServiciosMedicos;
const serv_activosProblemas = {
  id: "serv_activosProblemas",
  label: "Servicios Médicos Activos con Problemas",
  fields: [
    { key: "datosInstitucion.nombre", label: "Institución" },
    { key: "datosInstitucion.parroquia", label: "Parroquia" },
    {
      key: (data) => obtenerServiciosMedicos(data, "ACTIVO C/PROB"),
      label: "Servicios Médicos Activos con Problemas",
    },
  ],
  searchFields: [
    "datosInstitucion.nombre",
    "datosInstitucion.parroquia",
    (data) => obtenerServiciosMedicos(data, "ACTIVO C/PROB"),
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
      "Médicos",
      "Activos con Problemas",
      8
    );
  },
};
export default serv_activosProblemas;
