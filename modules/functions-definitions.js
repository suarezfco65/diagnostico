import { SERVICIOS_MEDICOS, OTROS_SERVICIOS_DATA } from "../../data.js";
const FUNCTIONS_DEFINITIONS_BY_SECTION = {
  III: {
    totalPersonal: (
      data,
      section = "",
      role = "",
      valueType = "disponible"
    ) => {
      const personal = data.personalInstitucion;
      if (!personal) return 0;
      let total = 0;
      for (const sec in personal) {
        if (section && sec !== section) continue;
        for (const r in personal[sec]) {
          if (role && r !== role) continue;
          if (
            personal[sec][r] &&
            typeof personal[sec][r][valueType] === "number"
          ) {
            total += personal[sec][r][valueType];
          }
        }
      }
      return total;
    },
  },
  IV: {
    obtenerServiciosMedicos: (data, estado) => {
      const { serviciosMedicos } = data;

      const obtenerLabelPorKey = (key) => {
        const encontrado = SERVICIOS_MEDICOS.find((item) => item.key === key);
        return encontrado ? encontrado.label : null; // Devuelve el label o null si no se encuentra
      };

      const serviciosFiltrados = Object.entries(serviciosMedicos)
        .filter(([, servicio]) => servicio.estado === estado)
        .map(
          ([key, servicio]) => servicio.nombreEspec || obtenerLabelPorKey(key)
        );

      // Usar un Set para eliminar duplicados
      const serviciosUnicos = [...new Set(serviciosFiltrados)];

      return serviciosUnicos.join(", ");
    },
  },
  V: {
    obtenerOtrosServiciosEstado: (data, servicio, estado) => {
      const { otrosServicios } = data;
      const dataServicio = otrosServicios[servicio];

      const obtenerLabelPorKey = (key) => {
        const encontrado = OTROS_SERVICIOS_DATA[servicio].find(
          (item) => item.key === key
        );
        return encontrado ? encontrado.label : null; // Devuelve el label o null si no se encuentra
      };

      const serviciosFiltrados = Object.entries(dataServicio)
        .filter(([, servicio]) => servicio.estado === estado)
        .map(
          ([key, servicio]) => servicio.nombreEspec || obtenerLabelPorKey(key)
        );

      // Usar un Set para eliminar duplicados
      const serviciosUnicos = [...new Set(serviciosFiltrados)];

      return serviciosUnicos.join(", ");
    },
    obtenerOtrosServiciosDisponibles: (data, servicio, tipo, disponible) => {
      const { otrosServicios } = data;
      const dataServicio = otrosServicios[servicio][tipo];

      const obtenerLabelPorKey = (key) => {
        const encontrado = OTROS_SERVICIOS_DATA[servicio][tipo].find(
          (item) => item.key === key
        );
        return encontrado ? encontrado.label : null; // Devuelve el label o null si no se encuentra
      };

      const serviciosFiltrados = Object.entries(dataServicio)
        .filter(([, servicio]) => servicio.disponible === disponible)
        .map(
          ([key, servicio]) => servicio.nombreEspec || obtenerLabelPorKey(key)
        );

      // Usar un Set para eliminar duplicados
      const serviciosUnicos = [...new Set(serviciosFiltrados)];

      return serviciosUnicos.join(", ");
    },
  },
};

export default FUNCTIONS_DEFINITIONS_BY_SECTION;
