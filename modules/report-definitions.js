// modules/report-definitions.js - Definiciones y utilidades de reportes
import * as Data from "../data.js";
import * as Storage from "../storage.js";

// Función de utilidad para totalizar personal
const totalPersonal = (
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
      if (personal[sec][r] && typeof personal[sec][r][valueType] === "number") {
        total += personal[sec][r][valueType];
      }
    }
  }
  return total;
};

// Mantener las definiciones de reportes
const REPORT_DEFINITIONS_BY_SECTION = {
  // Reportes de la Sección I: Datos de la Institución
  I: [
    {
      id: "inst_general",
      label: "Datos Generales de la Institución",
      fields: [
        // ❗ NUEVOS CAMPOS A MOSTRAR ❗
        { key: "identificador", label: "ID / RIF" },
        { key: "datosInstitucion.nombre", label: "Nombre Institución" },
        { key: "datosInstitucion.tipoInstitucion", label: "Tipo" },
        { key: "datosInstitucion.parroquia", label: "Parroquia" },
      ],
      searchFields: [
        "identificador",
        "datosInstitucion.nombre",
        "datosInstitucion.parroquia",
        "datosInstitucion.tipoInstitucion",
      ],
      compoundFilters: [
        {
          key: "datosInstitucion.parroquia",
          label: "Filtrar por Parroquia",
          type: "string",
          options: Data.PARROQUIAS_CARACAS.sort(), // Usar las parroquias como opciones
        },
        {
          key: "datosInstitucion.tipoInstitucion",
          label: "Tipo de Institución",
          type: "string",
          options: Data.TIPOS_INSTITUCION.map((tipo) => tipo.value).sort(),
        },
      ],
    },
    {
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
    },
  ],
  // Reportes de la Sección II: Autoridades
  II: [
    {
      id: "aut_contacto_director",
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
        "autoridades.director.celular",
        "autoridades.director.correo",
      ],
    },
  ],
  // Reportes de la Sección III: Personal
  III: [
    {
      id: "pers_total_disp",
      label: "Total de Personal por Centro",
      fields: [
        { key: "datosInstitucion.nombre", label: "Institución" },
        { key: "datosInstitucion.parroquia", label: "Parroquia" },
        {
          key: (data) => totalPersonal(data, "", "", "disponible"),
          label: "Centro (D)",
        },
        {
          key: (data) => totalPersonal(data, "", "", "requerido"),
          label: "Centro (R)",
        },
        {
          key: (data) =>
            totalPersonal(data, "servicios-medicos", "", "disponible"),
          label: "Servicios Médicos (D)",
        },
        {
          key: (data) =>
            totalPersonal(data, "servicios-medicos", "", "requerido"),
          label: "Servicios Médicos (R)",
        },
      ],
      searchFields: ["datosInstitucion.nombre", "datosInstitucion.parroquia"],
      compoundFilters: [
        {
          key: "personalInstitucion.medico.medicoGral.disponible",
          label: "Médicos Generales Disponibles",
          type: "numeric",
        },
        {
          key: "personalInstitucion.medico.medicoGral.requerido",
          label: "Médicos Generales Requeridos",
          type: "numeric",
        },
      ],
    },
    { id: "pers_deficit", label: "Personal con Déficit (>20%)" },
    { id: "pers_completo", label: "Centros con Personal Completo" },
  ],
  // Reportes de la Sección IV: Servicios Médicos
  IV: [
    { id: "serv_activos", label: "Servicios Médicos Activos" },
    { id: "serv_inactivos", label: "Servicios Médicos Inactivos" },
    { id: "serv_prob", label: "Servicios Activos con Problemas" },
  ],
  // Reportes de la Sección V: Otros Servicios
  V: [
    { id: "otros_img_disp", label: "Disponibilidad de Imagenología" },
    { id: "otros_lab_disp", label: "Disponibilidad de Laboratorio" },
  ],
  // Reportes de la Sección VI: Infraestructura
  VI: [
    { id: "infra_cond_malas", label: "Áreas con Malas Condiciones" },
    { id: "infra_serv_sin", label: "Centros sin Servicios Públicos" },
    {
      id: "infra_servicios",
      label: "Disponibilidad de Servicios Públicos",
      compoundFilters: [
        {
          key: "infraestructura.serviciosPublicos.agua.estado",
          label: "Servicio de Agua Activo",
          type: "boolean",
        },
      ],
    },
  ],
  // Reportes de la Sección VII: Proyectos
  VII: [
    { id: "proy_existentes", label: "Proyectos Registrados por Área" },
    { id: "proy_cero", label: "Centros sin Proyectos" },
  ],
};

const ReportDefinitions = (() => {
  let allInstitutions = [];

  const init = () => {
    loadInstitutions();
  };

  const loadInstitutions = () => {
    allInstitutions = Storage.getStorage() || [];
  };

  const getAllInstitutions = () => {
    return [...allInstitutions];
  };

  const getReportDefinition = (section, reportId) => {
    const sectionDefinitions = REPORT_DEFINITIONS_BY_SECTION[section];
    if (!sectionDefinitions) {
      throw new Error(`Sección ${section} no encontrada`);
    }

    const definition = sectionDefinitions.find((def) => def.id === reportId);
    if (!definition) {
      throw new Error(
        `Reporte ${reportId} no encontrado en sección ${section}`
      );
    }

    return definition;
  };

  const getSectionDefinitions = (section) => {
    return REPORT_DEFINITIONS_BY_SECTION[section] || [];
  };

  const getReportValue = (data, pathOrFunction) => {
    if (typeof pathOrFunction === "function") {
      try {
        return pathOrFunction(data);
      } catch (error) {
        console.error("Error ejecutando función de reporte:", error);
        return "ERROR";
      }
    }

    if (typeof pathOrFunction === "string") {
      return getNestedValue(data, pathOrFunction);
    }

    return "";
  };

  const getNestedValue = (obj, path) => {
    return (
      path.split(".").reduce((acc, part) => {
        return acc && acc[part] !== undefined ? acc[part] : null;
      }, obj) || ""
    );
  };

  return {
    init,
    getAllInstitutions,
    getReportDefinition,
    getSectionDefinitions,
    getReportValue,
    getNestedValue,
  };
})();

// Exportar como objeto nombrado en lugar de default
export { totalPersonal, ReportDefinitions, REPORT_DEFINITIONS_BY_SECTION };
