import { PARROQUIAS_CARACAS } from '../../data.js';
const aut_jefeMantenimiento = {
      id: "aut_jefeMantenimiento",
      label: "Contacto Jefe de Mantenimiento",
      fields: [
        { key: "identificador", label: "ID / RIF" },
        { key: "datosInstitucion.nombre", label: "Institución" },
        { key: "autoridades.jefeMantenimiento.nombre", label: "Director/a" },
        { key: "autoridades.jefeMantenimiento.celular", label: "Celular" },
        { key: "autoridades.jefeMantenimiento.correo", label: "Correo" },
      ],
      searchFields: [
        "identificador",
        "datosInstitucion.nombre",
        "autoridades.jefeMantenimiento.nombre",
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

export default aut_jefeMantenimiento;
