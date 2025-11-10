import { PARROQUIAS_CARACAS } from "../../data.js";
import FUNCTIONS_DEFINITIONS_BY_SECTION from "../functions-definitions.js";
const obtenerOtrosServiciosDisponibles =
  FUNCTIONS_DEFINITIONS_BY_SECTION.V.obtenerOtrosServiciosDisponibles;

const oserv_lab_disponibilidad_1 = {
  id: "oserv_lab_disponibilidad_1",
  label: "Examenes disponibles para Cardiología, Coagulación, Ginecología",
  fields: [
    { key: "datosInstitucion.nombre", label: "Institución" },
    { key: "datosInstitucion.parroquia", label: "Parroquia" },
    {
      key: (data) =>
        obtenerOtrosServiciosDisponibles(
          data,
          "laboratorio",
          "cardiologia",
          true
        ),
      label: "Cardiología",
      show: true,
    },
    {
      key: (data) =>
        obtenerOtrosServiciosDisponibles(
          data,
          "laboratorio",
          "coagulacion",
          true
        ),
      label: "Coagulación",
      show: true,
    },
    {
      key: (data) =>
        obtenerOtrosServiciosDisponibles(
          data,
          "laboratorio",
          "ginecologia",
          true
        ),
      label: "Ginecología",
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

export default oserv_lab_disponibilidad_1;
