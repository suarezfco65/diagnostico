import { PARROQUIAS_CARACAS } from "../../data.js";
import FUNCTIONS_BY_SECTIONS from "../functions-definitions.js";
const obtenerOtrosServiciosDisponibles =
  FUNCTIONS_BY_SECTIONS.V.obtenerOtrosServiciosDisponibles;
const oserv_farm_basicos = {
  id: "oserv_farm_basicos",
  label: "Medicamentos Basicos Disponibles en Farmacia",
  fields: [
    { key: "datosInstitucion.nombre", label: "Institución" },
    { key: "datosInstitucion.parroquia", label: "Parroquia" },
    {
      key: (data) =>
        obtenerOtrosServiciosDisponibles(data, "farmacia", "basicos", true),
      label: "Medicamentos Basicos disponibles",
    },
  ],
  searchFields: [
    "datosInstitucion.nombre",
    "datosInstitucion.parroquia",
    (data) =>
      obtenerOtrosServiciosDisponibles(data, "farmacia", "basicos", true),
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
export default oserv_farm_basicos;
