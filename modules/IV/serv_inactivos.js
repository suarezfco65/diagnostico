import { PARROQUIAS_CARACAS } from '../../data.js';
import FUNCTIONS_BY_SECTIONS from '../functions-definitions.js';
const obtenerServiciosMedicos = FUNCTIONS_BY_SECTIONS.IV.obtenerServiciosMedicos;
const serv_inactivos = {
    id: "serv_inactivos",
    label: "Servicios Médicos Inactivos",
    fields: [
        { key: "datosInstitucion.nombre", label: "Institución" },
        { key: "datosInstitucion.parroquia", label: "Parroquia" },
        {
          key: (data) => obtenerServiciosMedicos(data, "INACTIVO"),
          label: "Servicios Inactivos",
        },
    ],
    searchFields: [
        "datosInstitucion.nombre",
        "datosInstitucion.parroquia",
        (data) => obtenerServiciosMedicos(data, "INACTIVO"),
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
export default serv_inactivos;
