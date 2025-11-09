import { PARROQUIAS_CARACAS } from '../../data.js';
const aut_jefeServiciosMedicos = {
      id: "aut_jefeServiciosMedicos",
      label: "Contacto Jefe de Servicios Médicos",
      fields: [
        { key: "identificador", label: "ID / RIF" },
        { key: "datosInstitucion.nombre", label: "Institución" },
        { key: "autoridades.jefeServiciosMedicos.nombre", label: "Director/a" },
        { key: "autoridades.jefeServiciosMedicos.celular", label: "Celular" },
        { key: "autoridades.jefeServiciosMedicos.correo", label: "Correo" },
      ],
      searchFields: [
        "identificador",
        "datosInstitucion.nombre",
        "autoridades.jefeServiciosMedicos.nombre",
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

export default aut_jefeServiciosMedicos;
