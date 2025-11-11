import { PARROQUIAS_CARACAS, TIPOS_INSTITUCION } from "../../data.js";
import  FUNCTIONS_BY_SECTIONS from "../functions-definitions.js";
const { chartDrillDown } = FUNCTIONS_BY_SECTIONS;

const inst_general = {
  id: "inst_general",
  label: "Centros de salud por Tipo de Institución",
  fields: [
    { key: "identificador", label: "ID / RIF" },
    { key: "datosInstitucion.nombre", label: "Nombre Institución" },
    { key: "datosInstitucion.tipoInstitucion", label: "Tipo Institución" },
    { key: "datosInstitucion.parroquia", label: "Parroquia" },
  ],
  searchFields: [
    "identificador",
    "datosInstitucion.nombre",
    "datosInstitucion.parroquia",
    "datosInstitucion.tipoInstitucion",
  ],
  compoundFilters: [
    {
      key: "datosInstitucion.parroquia",
      label: "Filtrar por Parroquia",
      type: "string",
      options: PARROQUIAS_CARACAS.sort(),
    },
    {
      key: "datosInstitucion.tipoInstitucion",
      label: "Tipo de Institución",
      type: "string",
      options: TIPOS_INSTITUCION.map((tipo) => tipo.value).sort(),
    },
  ],
  chart: (instituciones) => {
    chartDrillDown("Cantidad de Centros de salud", "Distribuidos por Parroquia y Tipo de Institución", "Parroquia", "Tipo Institución");
  },
};

export default inst_general;
