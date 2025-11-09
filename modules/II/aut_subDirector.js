import { PARROQUIAS_CARACAS } from '../../data.js';
const aut_subDirector = {
      id: "aut_subDirector",
      label: "Contacto Subdirector/a",
      fields: [
        { key: "identificador", label: "ID / RIF" },
        { key: "datosInstitucion.nombre", label: "Institución" },
        { key: "autoridades.subDirector.nombre", label: "Director/a" },
        { key: "autoridades.subDirector.celular", label: "Celular" },
        { key: "autoridades.subDirector.correo", label: "Correo" },
      ],
      searchFields: [
        "identificador",
        "datosInstitucion.nombre",
        "autoridades.subDirector.nombre",
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

export default aut_subDirector;
