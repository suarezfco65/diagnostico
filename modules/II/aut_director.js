import { PARROQUIAS_CARACAS } from '../../data.js';
const aut_director = {
      id: "aut_director",
      label: "Contacto Director/a",
      fields: [
        { key: "identificador", label: "ID / RIF" },
        { key: "datosInstitucion.nombre", label: "Institución" },
        { key: "autoridades.director.nombre", label: "Director/a" },
        { key: "autoridades.director.celular", label: "Celular" },
        { key: "autoridades.director.correo", label: "Correo" },
      ],
      searchFields: [
        "identificador",
        "datosInstitucion.nombre",
        "autoridades.director.nombre",
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

export default aut_director;
