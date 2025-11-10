import { PARROQUIAS_CARACAS } from "../../data.js";
const infr_servPub_1 = {
  id: "infr_servPub_1",
  label: "Servicios Públicos A/A Agua Aseo Urbano Combustible",
  fields: [
    { key: "datosInstitucion.nombre", label: "Nombre" },
    { key: "infraestructura.serviciosPublicos.aa.estado", label: "A/A" },
    { key: "infraestructura.serviciosPublicos.agua.estado", label: "Agua" },
    { key: "infraestructura.serviciosPublicos.aseoUrbano.estado", label: "Aseo Urbano" },
    { key: "infraestructura.serviciosPublicos.combustible.estado", label: "Combustible" },
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

export default infr_servPub_1;
