// modules/report-definitions.js - Definiciones y utilidades de reportes
import * as Storage from "../storage.js";

/**
 * Importa módulos JavaScript dinámicamente usando una lista de nombres de archivo
 * y los añade a un array.
 *
 * @param {string[]} fileNames - Array con los nombres de los archivos JS (ej: ['inst_general.js']).
 * @param {Array<any>} targetArray - El array donde se almacenarán los valores exportados.
 * @param {string} folderPath - La ruta de la carpeta (URL relativa) donde se encuentran los archivos.
 * @returns {Promise<void>}
 */
async function importarModulosDesdeNavegador(
  fileNames,
  targetArray,
  folderPath
) {
  const folder = folderPath.endsWith("/") ? folderPath : folderPath + "/";
  for (const fileName of fileNames) {
    const fileNameWithoutExt = fileName.replace(/\.js$/i, "");
    const modulePath = folder + fileName; // Ej: './modulos/inst_general.js'
    try {
      // Importación dinámica. El navegador usa la ruta URL.
      const module = await import(modulePath);
      // Se accede a la exportación por defecto (default) que es el objeto 'inst_general'
      const importedValue = module.default;
      // Ejecutar <variable>.push(<la variable importada>)
      if (importedValue) {
        targetArray.push(importedValue);
        console.log(
          `✅ Éxito: Objeto '${importedValue.id}' agregado al array.`
        );
      } else {
        console.warn(
          `⚠️ Advertencia: El módulo '${fileName}' no tenía una exportación por defecto.`
        );
      }
    } catch (importError) {
      console.error(`❌ Error al importar ${fileName}:`, importError);
    }
  }
}

// Mantener las definiciones de reportes
const REPORT_DEFINITIONS_BY_SECTION = {
  I: [], // Reportes de la Sección I: Datos de la Institución
  II: [], // Reportes de la Sección II: Autoridades],
  III: [], // Reportes de la Sección III: Personal
  IV: [], // Reportes de la Sección IV: Servicios Médicos
  V: [], // Reportes de la Sección V: Otros Servicios
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

  const init = async () => {
    // Importar todos los módulos necesarios de forma dinámica
    const importPromises = [
      importarModulosDesdeNavegador(
        ["inst_general.js", "inst_ente.js"],
        REPORT_DEFINITIONS_BY_SECTION.I,
        "./I"
      ),
      importarModulosDesdeNavegador(
        [
          "aut_director.js",
          "aut_subDirector.js",
          "aut_enlace.js",
          "aut_jefeServiciosMedicos.js",
          "aut_jefeMantenimiento.js",
        ],
        REPORT_DEFINITIONS_BY_SECTION.II,
        "./II"
      ),
      importarModulosDesdeNavegador(
        [
          "pers_todos.js",
          "pers_servicios_medicos.js",
          "pers_paramedicos_y_afines.js",
          "pers_administrativo.js",
          "pers_obrero.js",
        ],
        REPORT_DEFINITIONS_BY_SECTION.III,
        "./III"
      ),
      importarModulosDesdeNavegador(
        [
          "serv_activos.js",
          "serv_activosProblemas.js",
          "serv_inactivos.js",
          "serv_inexistentes.js",
        ],
        REPORT_DEFINITIONS_BY_SECTION.IV,
        "./IV"
      ),
      importarModulosDesdeNavegador(
        [
          "oserv_imag_activos.js",
          "oserv_imag_activosProblemas.js",
          "oserv_imag_inactivos.js",
          "oserv_imag_inexistentes.js",
          "oserv_coc_activos.js",
          "oserv_coc_activosProblemas.js",
          "oserv_coc_inactivos.js",
          "oserv_coc_inexistentes.js",
        ],
        REPORT_DEFINITIONS_BY_SECTION.V,
        "./V"
      ),
      importarModulosDesdeNavegador(
        [],
        REPORT_DEFINITIONS_BY_SECTION.VI,
        "./VI"
      ),
      importarModulosDesdeNavegador(
        [],
        REPORT_DEFINITIONS_BY_SECTION.VII,
        "./VII"
      ),
    ];
    // Esperar a que TODAS las importaciones finalicen.
    await Promise.all(importPromises);
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
export { ReportDefinitions, REPORT_DEFINITIONS_BY_SECTION };
