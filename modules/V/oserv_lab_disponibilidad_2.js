import { PARROQUIAS_CARACAS } from "../../data.js";
import FUNCTIONS_DEFINITIONS_BY_SECTION from "../functions-definitions.js";
const obtenerOtrosServiciosDisponibles =
  FUNCTIONS_DEFINITIONS_BY_SECTION.V.obtenerOtrosServiciosDisponibles;

const oserv_lab_disponibilidad_2 = {
  id: "oserv_lab_disponibilidad_2",
  label: "Examenes disponibles para Heces, Hematología, Orina",
  fields: [
    { key: "datosInstitucion.nombre", label: "Institución" },
    { key: "datosInstitucion.parroquia", label: "Parroquia" },
    {
      key: (data) =>
        obtenerOtrosServiciosDisponibles(data, "laboratorio", "heces", true),
      label: "Heces",
      show: false,
    },
    {
      key: (data) =>
        obtenerOtrosServiciosDisponibles(
          data,
          "laboratorio",
          "hematologia",
          true
        ),
      label: "Hematología",
      show: false,
    },
    {
      key: (data) =>
        obtenerOtrosServiciosDisponibles(data, "laboratorio", "orina", true),
      label: "Orina",
      show: false,
    },
  ],
  searchFields: ["datosInstitucion.nombre", "datosInstitucion.parroquia"],
  compoundFilters: [
    {
      key: "datosInstitucion.parroquia",
      label: "Filtrar por Parroquia",
      type: "string",
      options: PARROQUIAS_CARACAS.sort(), // Usar las parroquias como opciones
    },
  ],
};

export default oserv_lab_disponibilidad_2;
