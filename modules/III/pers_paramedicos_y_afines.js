import { PARROQUIAS_CARACAS } from "../../data.js";
import FUNCTIONS_DEFINITIONS_BY_SECTION from "../functions-definitions.js";
const totalPersonal = FUNCTIONS_DEFINITIONS_BY_SECTION.III.totalPersonal;
const pers_paramedicos_y_afines = {
  id: "pers_paramedicos-y-afines",
  label: "Personal Paramédicos y Afines del centro médico",
  fields: [
    { key: "datosInstitucion.nombre", label: "Institución" },
    { key: "datosInstitucion.parroquia", label: "Parroquia" },
    {
      key: (data) =>
        totalPersonal(data, `paramedicos-y-afines`, ``, `requerido`),
      label: "Requerido",
    },
    {
      key: (data) =>
        totalPersonal(data, `paramedicos-y-afines`, ``, `disponible`),
      label: "Disponible",
    },
    {
      key: (data) =>
        (
          ((totalPersonal(data, `paramedicos-y-afines`, ``, `requerido`) -
            totalPersonal(data, `paramedicos-y-afines`, ``, `disponible`)) *
            100) /
          totalPersonal(data, `paramedicos-y-afines`, ``, `requerido`)
        ).toFixed(2) + "%",
      label: "Deficit (%)",
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
export default pers_paramedicos_y_afines;
