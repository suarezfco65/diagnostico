import { PARROQUIAS_CARACAS, ENTES_ADSCRITOS } from '../../data.js';
const inst_ente = {
      id: "inst_ente",
      label: "Instituciones por Ente Adscrito",
      fields: [
        { key: "identificador", label: "ID / RIF" },
        { key: "datosInstitucion.nombre", label: "Nombre" },
        { key: "datosInstitucion.enteAdscrito", label: "Ente Adscrito" },
        { key: "datosInstitucion.parroquia", label: "Parroquia" },
      ],
      searchFields: [
        "identificador",
        "datosInstitucion.nombre",
        "datosInstitucion.enteAdscrito",
        "datosInstitucion.parroquia",
      ],
      compoundFilters: [
        {
          key: "datosInstitucion.parroquia",
          label: "Filtrar por Parroquia",
          type: "string",
          options: PARROQUIAS_CARACAS.sort(), // Usar las parroquias como opciones
        },
        {
          key: "datosInstitucion.enteAdscrito",
          label: "Ente adscrito",
          type: "string",
          options: ENTES_ADSCRITOS.map((ente) => ente.value).sort(),
        },
      ],
    };

export default inst_ente;
