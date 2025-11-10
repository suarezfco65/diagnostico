import { PARROQUIAS_CARACAS } from "../../data.js";
const infr_cond_hospitalizacion = {
  id: "infr_cond_hospitalizacion",
  label: "Infraestructura - Condiciones de Hospitalizacion",
  fields: [
    { key: "identificador", label: "ID / RIF" },
    { key: "datosInstitucion.nombre", label: "Nombre" },
    { key: (Data) => Data.infraestructura.condiciones.hospitalizacion.operativos + " de " +Data.infraestructura.condiciones.hospitalizacion.cantidad , label: "Habitaciones Operativas" },
    { key: "infraestructura.condiciones.hospitalizacion.paredes", label: "Paredes" },
    { key: "infraestructura.condiciones.hospitalizacion.techos", label: "Techos" },
    { key: "infraestructura.condiciones.hospitalizacion.pisos", label: "Pisos" },
    { key: "infraestructura.condiciones.hospitalizacion.aa", label: "A/A" },
    {
      key: "infraestructura.condiciones.hospitalizacion.observacion",
      label: "Observaciones",
    },
  ],
  searchFields: ["identificador", "datosInstitucion.nombre"],
  compoundFilters: [
    {
      key: "datosInstitucion.parroquia",
      label: "Filtrar por Parroquia",
      type: "string",
      options: PARROQUIAS_CARACAS.sort(), // Usar las parroquias como opciones
    },
  ],
};

export default infr_cond_hospitalizacion;
