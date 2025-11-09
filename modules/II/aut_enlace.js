import { PARROQUIAS_CARACAS } from '../../data.js';
const aut_enlace = {
      id: "aut_enlace",
      label: "Contacto Enlace institucional",
      fields: [
        { key: "identificador", label: "ID / RIF" },
        { key: "datosInstitucion.nombre", label: "Institución" },
        { key: "autoridades.enlaceInstitucional.nombre", label: "Director/a" },
        { key: "autoridades.enlaceInstitucional.celular", label: "Celular" },
        { key: "autoridades.enlaceInstitucional.correo", label: "Correo" },
      ],
      searchFields: [
        "identificador",
        "datosInstitucion.nombre",
        "autoridades.enlaceInstitucional.nombre",
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

export default aut_enlace;
