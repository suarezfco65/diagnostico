import { PARROQUIAS_CARACAS } from '../../data.js';
import FUNCTIONS_DEFINITIONS_BY_SECTION from '../functions-definitions.js';
const totalPersonal = FUNCTIONS_DEFINITIONS_BY_SECTION.III.totalPersonal;
const pers_administrativo = {
    id: "pers_administrativo",
    label: "Personal del centro médico (Administrativo)",
    fields: [
    { key: "datosInstitucion.nombre", label: "Institución" },
    { key: "datosInstitucion.parroquia", label: "Parroquia" },
    {
        key: (data) => totalPersonal(data, `administrativo`, ``, `disponible`),
        label: "Centro (D)",
    },
    {
        key: (data) => totalPersonal(data, `administrativo`, ``, `requerido`),
        label: "Centro (R)",
    },
    {
        key: (data) => ((totalPersonal(data, `administrativo`, ``, `requerido`) - totalPersonal(data, `administrativo`, ``, `disponible`)) * 100 / totalPersonal(data, `administrativo`, ``, `requerido`)).toFixed(2) + '%',
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
export default pers_administrativo;