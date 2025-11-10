import { PARROQUIAS_CARACAS, OTROS_SERVICIOS_DATA } from "../../data.js";
import FUNCTIONS_DEFINITIONS_BY_SECTION from "../functions-definitions.js";
const obtenerOtrosServiciosDisponibles =
  FUNCTIONS_DEFINITIONS_BY_SECTION.V.obtenerOtrosServiciosDisponibles;

const addFields = () => {
  oserv_lab_disponibilidad.fields = [
    { key: "datosInstitucion.nombre", label: "Institución" },
    { key: "datosInstitucion.parroquia", label: "Parroquia" },
  ];
  OTROS_SERVICIOS_DATA.laboratorio.forEach((examen, index) => {
    const nuevoCampo = {
      key: (data) =>
        // Asegúrate de que obtenerOtrosServiciosDisponibles es accesible
        obtenerOtrosServiciosDisponibles(data, "laboratorio", examen.key, true),
      label: examen.label,
      show: index < 3, // Mostrar solo los primeros 3 por defecto
    };

    oserv_lab_disponibilidad.fields.push(nuevoCampo);
  });
};

const oserv_lab_disponibilidad = {
  id: "oserv_lab_disponibilidad",
  label: "Examenes de Laboratorio Disponibles",
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
    {
      key: (data) =>
        obtenerOtrosServiciosDisponibles(
          data,
          "laboratorio",
          "laboratorioOtros",
          true
        ),
      label: "Laboratorio Otros",
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

export default oserv_lab_disponibilidad;
