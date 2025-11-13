import { PARROQUIAS_CARACAS } from "../../data.js";
import FUNCTIONS_BY_SECTIONS from "../functions-definitions.js";
const obtenerOtrosServiciosDisponibles =
  FUNCTIONS_BY_SECTIONS.V.obtenerOtrosServiciosDisponibles;
const oserv_farm_altoCosto = {
  id: "oserv_farm_altoCosto",
  label: "Medicamentos Alto Costo Disponibles en Farmacia",
  fields: [
    { key: "datosInstitucion.nombre", label: "Institución" },
    { key: "datosInstitucion.parroquia", label: "Parroquia" },
    {
      key: (data) =>
        obtenerOtrosServiciosDisponibles(data, "farmacia", "altoCosto", true),
      label: "Medicamentos Alto Costo Disponibles",
    },
  ],
  searchFields: [
    "datosInstitucion.nombre",
    "datosInstitucion.parroquia",
    (data) =>
      obtenerOtrosServiciosDisponibles(data, "farmacia", "altoCosto", true),
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
      "Medicamentos",
      "Alto Costo",
      "Disponibles",
      2
    );
  },
};
export default oserv_farm_altoCosto;
