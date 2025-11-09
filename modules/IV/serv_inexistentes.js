 import { PARROQUIAS_CARACAS } from '../../data.js';
import FUNCTIONS_DEFINITIONS_BY_SECTION from '../functions-definitions.js';
const obtenerServiciosMedicos = FUNCTIONS_DEFINITIONS_BY_SECTION.IV.obtenerServiciosMedicos;
const serv_inexistentes = {
    id: "serv_inexistentes",
    label: "Servicios Médicos Inexistentes",
    fields: [
        { key: "datosInstitucion.nombre", label: "Institución" },
        { key: "datosInstitucion.parroquia", label: "Parroquia" },
        {
          key: (data) => obtenerServiciosMedicos(data, "NO EXISTE"),
          label: "Servicios Inexistentes",
        },
    ],
    searchFields: [
        "datosInstitucion.nombre",
        "datosInstitucion.parroquia",
        (data) => obtenerServiciosMedicos(data, "NO EXISTE"),
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
export default serv_inexistentes;
