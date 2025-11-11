import { PARROQUIAS_CARACAS } from "../../data.js";
import FUNCTIONS_BY_SECTIONS from "../functions-definitions.js";
const obtenerOtrosServiciosDisponibles =
  FUNCTIONS_BY_SECTIONS.V.obtenerOtrosServiciosDisponibles;
const oserv_farm_especializados = {
  id: "oserv_farm_especializados",
  label: "Medicamentos Especializados Disponibles en Farmacia",
  fields: [
    { key: "datosInstitucion.nombre", label: "Institución" },
    { key: "datosInstitucion.parroquia", label: "Parroquia" },
    {
      key: (data) =>
        obtenerOtrosServiciosDisponibles(
          data,
          "farmacia",
          "especializados",
          true
        ),
      label: "Medicamentos Especializados disponibles",
    },
  ],
  searchFields: [
    "datosInstitucion.nombre",
    "datosInstitucion.parroquia",
    (data) =>
      obtenerOtrosServiciosDisponibles(
        data,
        "farmacia",
        "especializados",
        true
      ),
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
export default oserv_farm_especializados;
