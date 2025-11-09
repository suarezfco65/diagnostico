import { PARROQUIAS_CARACAS, TIPOS_INSTITUCION } from '../../data.js';
const inst_general = {
      "id": "inst_general",
      "label": "Datos Generales de la Institución",
      "fields": [
        { "key": "identificador", "label": "ID / RIF" },
        { "key": "datosInstitucion.nombre", "label": "Nombre Institución" },
        { "key": "datosInstitucion.tipoInstitucion", "label": "Tipo" },
        { "key": "datosInstitucion.parroquia", "label": "Parroquia" },
      ],
      "searchFields": [
        "identificador",
        "datosInstitucion.nombre",
        "datosInstitucion.parroquia",
        "datosInstitucion.tipoInstitucion",
      ],
      "compoundFilters": [
        {
          "key": "datosInstitucion.parroquia",
          "label": "Filtrar por Parroquia",
          "type": "string",
          "options": PARROQUIAS_CARACAS.sort(),
        },
        {
          "key": "datosInstitucion.tipoInstitucion",
          "label": "Tipo de Institución",
          "type": "string",
          "options": TIPOS_INSTITUCION.map((tipo) => tipo.value).sort(),
        }
      ]
    };

export default inst_general;