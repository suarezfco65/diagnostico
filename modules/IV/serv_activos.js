  import { PARROQUIAS_CARACAS } from '../../data.js';
import FUNCTIONS_DEFINITIONS_BY_SECTION from '../functions-definitions.js';
const obtenerServiciosMedicos = FUNCTIONS_DEFINITIONS_BY_SECTION.IV.obtenerServiciosMedicos;
const serv_activos = {
    id: "serv_activos",
    label: "Servicios Médicos Activos",
    fields: [
        { key: "datosInstitucion.nombre", label: "Institución" },
        { key: "datosInstitucion.parroquia", label: "Parroquia" },
        {
            key: (data) => obtenerServiciosMedicos(data, "ACTIVO"),
            label: "Servicios Activos",
        },
    ],
    searchFields: [
        "datosInstitucion.nombre",
        "datosInstitucion.parroquia",
        (data) => obtenerServiciosMedicos(data, "ACTIVO"),
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
export default serv_activos;
