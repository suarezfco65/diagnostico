import { PARROQUIAS_CARACAS } from "../../data.js";
const infr_servPub_2 = {
  id: "infr_servPub_2",
  label: "Servicios Públicos Electricidad Gas Internet Seguridad",
  fields: [
    { key: "datosInstitucion.nombre", label: "Nombre" },
    { key: "infraestructura.serviciosPublicos.electricidad.estado", label: "Electricidad" },
    { key: "infraestructura.serviciosPublicos.gas.estado", label: "Gas" },
    { key: "infraestructura.serviciosPublicos.internet.estado", label: "Internet" },
    { key: "infraestructura.serviciosPublicos.seguridad.estado", label: "Seguridad" },
    { key: "datosInstitucion.parroquia", label: "Parroquia" },
  ],
  searchFields: ["datosInstitucion.parroquia","datosInstitucion.nombre"],
  compoundFilters: [
    {
      key: "datosInstitucion.parroquia",
      label: "Filtrar por Parroquia",
      type: "string",
      options: PARROQUIAS_CARACAS.sort(), // Usar las parroquias como opciones
    },
  ],
};

export default infr_servPub_2;
