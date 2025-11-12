import { PARROQUIAS_CARACAS } from "../../data.js";
import FUNCTIONS_BY_SECTIONS from "../functions-definitions.js";
const totalPersonal = FUNCTIONS_BY_SECTIONS.III.totalPersonal;
const pers_obrero = {
  id: "pers_obrero",
  label: "Personal Obrero del centro médico",
  fields: [
    { key: "datosInstitucion.nombre", label: "Institución" },
    { key: "datosInstitucion.parroquia", label: "Parroquia" },
    {
      key: (data) => totalPersonal(data, `obrero`, ``, `requerido`),
      label: "Requerido",
    },
    {
      key: (data) => totalPersonal(data, `obrero`, ``, `disponible`),
      label: "Disponoible",
    },
    {
      key: (data) =>
        (
          ((totalPersonal(data, `obrero`, ``, `requerido`) -
            totalPersonal(data, `obrero`, ``, `disponible`)) *
            100) /
          totalPersonal(data, `obrero`, ``, `requerido`)
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
    FUNCTIONS_BY_SECTIONS.III.chartDrilldown("Obrero");
  },
};
export default pers_obrero;
