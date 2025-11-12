import { PARROQUIAS_CARACAS, ENTES_ADSCRITOS } from "../../data.js";
import FUNCTIONS_BY_SECTIONS from "../functions-definitions.js";
const { chartDrillDown } = FUNCTIONS_BY_SECTIONS;
const inst_ente = {
  id: "inst_ente",
  label: "Centros de salud por Ente Adscrito",
  fields: [
    { key: "identificador", label: "ID / RIF" },
    { key: "datosInstitucion.nombre", label: "Nombre" },
    { key: "datosInstitucion.enteAdscrito", label: "Ente Adscrito" },
    { key: "datosInstitucion.parroquia", label: "Parroquia" },
  ],
  searchFields: [
    "identificador",
    "datosInstitucion.nombre",
    "datosInstitucion.enteAdscrito",
    "datosInstitucion.parroquia",
  ],
  compoundFilters: [
    {
      key: "datosInstitucion.parroquia",
      label: "Filtrar por Parroquia",
      type: "string",
      options: PARROQUIAS_CARACAS.sort(), // Usar las parroquias como opciones
    },
    {
      key: "datosInstitucion.enteAdscrito",
      label: "Ente adscrito",
      type: "string",
      options: ENTES_ADSCRITOS.map((ente) => ente.value).sort(),
    },
  ],
  chart: (instituciones) => {
    chartDrillDown(
      "Cantidad de Centros de salud por Parroquia y Ente Adscrito",
      "Distribuidos por Ente Adscrito y Parroquia",
      "Ente Adscrito",
      "Parroquia"
    );
  },
};

export default inst_ente;
