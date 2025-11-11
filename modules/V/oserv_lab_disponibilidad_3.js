import { PARROQUIAS_CARACAS } from "../../data.js";
import FUNCTIONS_BY_SECTIONS from "../functions-definitions.js";
const obtenerOtrosServiciosDisponibles =
  FUNCTIONS_BY_SECTIONS.V.obtenerOtrosServiciosDisponibles;

const oserv_lab_disponibilidad_3 = {
  id: "oserv_lab_disponibilidad_3",
  label: "Examenes disponibles para Perfiles, Química Sanguínea, Serología",
  fields: [
    { key: "datosInstitucion.nombre", label: "Institución" },
    { key: "datosInstitucion.parroquia", label: "Parroquia" },
    {
      key: (data) =>
        obtenerOtrosServiciosDisponibles(data, "laboratorio", "perfiles", true),
      label: "Perfiles",
      show: false,
    },
    {
      key: (data) =>
        obtenerOtrosServiciosDisponibles(
          data,
          "laboratorio",
          "quimicaSanguinea",
          true
        ),
      label: "Química Sanguínea",
      show: false,
    },
    {
      key: (data) =>
        obtenerOtrosServiciosDisponibles(
          data,
          "laboratorio",
          "serologia",
          true
        ),
      label: "Serología",
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

export default oserv_lab_disponibilidad_3;
