import { PARROQUIAS_CARACAS } from '../../data.js';
import FUNCTIONS_DEFINITIONS_BY_SECTION from '../functions-definitions.js';
const totalPersonal = FUNCTIONS_DEFINITIONS_BY_SECTION.III.totalPersonal;
const pers_servicios_medicos = {
      id: "pers_servicios_medicos",
      label: "Personal del centro médico (Servicio Médico)",
      fields: [
        { key: "datosInstitucion.nombre", label: "Institución" },
        { key: "datosInstitucion.parroquia", label: "Parroquia" },
        {
          key: (data) => totalPersonal(data, `servicios-medicos`, ``, `disponible`),
          label: "Centro (D)",
        },
        {
          key: (data) => totalPersonal(data, `servicios-medicos`, ``, `requerido`),
          label: "Centro (R)",
        },
        {
          key: (data) => ((totalPersonal(data, `servicios-medicos`, ``, `requerido`) - totalPersonal(data, `servicios-medicos`, ``, `disponible`)) * 100 / totalPersonal(data, `servicios-medicos`, ``, `requerido`)).toFixed(2) + '%',
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
export default pers_servicios_medicos;
