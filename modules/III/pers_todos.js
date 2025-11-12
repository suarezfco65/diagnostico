import { PARROQUIAS_CARACAS } from "../../data.js";
import FUNCTIONS_BY_SECTIONS from "../functions-definitions.js";
const totalPersonal = FUNCTIONS_BY_SECTIONS.III.totalPersonal;
const pers_todos = {
  id: "pers_todos",
  label: "Personal Total del centro médico",
  fields: [
    { key: "datosInstitucion.nombre", label: "Institución" },
    { key: "datosInstitucion.parroquia", label: "Parroquia" },
    {
      key: (data) => totalPersonal(data, ``, ``, `requerido`),
      label: "Requerido",
    },
    {
      key: (data) => totalPersonal(data, ``, ``, `disponible`),
      label: "Disponible",
    },
    {
      key: (data) =>
        (
          ((totalPersonal(data, ``, ``, `requerido`) -
            totalPersonal(data, ``, ``, `disponible`)) *
            100) /
          totalPersonal(data, ``, ``, `requerido`)
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
  chart: (instituciones) => {
    FUNCTIONS_BY_SECTIONS.III.chartDrilldown("Total");
  },
};
export default pers_todos;
