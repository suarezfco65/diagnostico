// modules/report-definitions.js - Definiciones y utilidades de reportes
import * as Storage from "../storage.js";

// Importaciones estáticas
import inst_general from './I/inst_general.js';
import inst_ente from './I/inst_ente.js';

import aut_director from './II/aut_director.js';
import aut_subDirector from './II/aut_subDirector.js';
import aut_enlace from './II/aut_enlace.js';
import aut_jefeServiciosMedicos from './II/aut_jefeServiciosMedicos.js';
import aut_jefeMantenimiento from './II/aut_jefeMantenimiento.js';

import pers_todos from './III/pers_todos.js';
import pers_servicios_medicos from './III/pers_servicios_medicos.js';
import pers_paramedicos_y_afines from './III/pers_paramedicos_y_afines.js';
import pers_administrativo from './III/pers_administrativo.js';
import pers_obrero from './III/pers_obrero.js';

import serv_activos from './IV/serv_activos.js';
import serv_activosProblemas from './IV/serv_activosProblemas.js';
import serv_inactivos from './IV/serv_inactivos.js';
import serv_inexistentes from './IV/serv_inexistentes.js';

import oserv_imag_activos from './V/oserv_imag_activos.js';
import oserv_imag_activosProblemas from './V/oserv_imag_activosProblemas.js';
import oserv_imag_inactivos from './V/oserv_imag_inactivos.js';
import oserv_imag_inexistentes from './V/oserv_imag_inexistentes.js';
import oserv_farm_basicos from './V/oserv_farm_basicos.js';
import oserv_farm_especializados from './V/oserv_farm_especializados.js';
import oserv_farm_altoCosto from './V/oserv_farm_altoCosto.js';
import oserv_lab_disponibilidad_1 from './V/oserv_lab_disponibilidad_1.js';
import oserv_lab_disponibilidad_2 from './V/oserv_lab_disponibilidad_2.js';
import oserv_lab_disponibilidad_3 from './V/oserv_lab_disponibilidad_3.js';
import oserv_coc_activos from './V/oserv_coc_activos.js';
import oserv_coc_activosProblemas from './V/oserv_coc_activosProblemas.js';
import oserv_coc_inactivos from './V/oserv_coc_inactivos.js';
import oserv_coc_inexistentes from './V/oserv_coc_inexistentes.js';

import infr_cond_cocina from './VI/infr_cond_cocina.js';
import infr_cond_consultorios from './VI/infr_cond_consultorios.js';
import infr_cond_farmacia from './VI/infr_cond_farmacia.js';
import infr_cond_hospitalizacion from './VI/infr_cond_hospitalizacion.js';
import infr_cond_laboratorio from './VI/infr_cond_laboratorio.js';
import infr_cond_quirofanos from './VI/infr_cond_quirofanos.js';
import infr_servPub_1 from './VI/infr_servPub_1.js';
import infr_servPub_2 from './VI/infr_servPub_2.js';

import proy_actuales from './VII/proy_actuales.js';
// Funciones de log para mejorar la legibilidad
function logSuccess(id) {
  console.log(`✅ Éxito: Objeto '${id}' agregado al array.`);
}

function logWarning(message) {
  console.warn(`⚠️ Advertencia: ${message}`);
}

function logError(fileName, modulePath, error) {
  console.error(`❌ Error al importar ${fileName} desde ${modulePath}:`, error);
}

// Mantener las definiciones de reportes
const REPORT_DEFINITIONS_BY_SECTION = {
  I: [inst_general, inst_ente],
  II: [aut_director, aut_subDirector, aut_enlace, aut_jefeServiciosMedicos, aut_jefeMantenimiento],
  III: [pers_todos, pers_servicios_medicos, pers_paramedicos_y_afines, pers_administrativo, pers_obrero],
  IV: [serv_activos, serv_activosProblemas, serv_inactivos, serv_inexistentes],
  V: [
    oserv_imag_activos, oserv_imag_activosProblemas, oserv_imag_inactivos, oserv_imag_inexistentes,
    oserv_farm_basicos, oserv_farm_especializados, oserv_farm_altoCosto,
    oserv_lab_disponibilidad_1, oserv_lab_disponibilidad_2, oserv_lab_disponibilidad_3,
    oserv_coc_activos, oserv_coc_activosProblemas, oserv_coc_inactivos, oserv_coc_inexistentes
  ],
  VI: [
    infr_cond_cocina, infr_cond_consultorios, infr_cond_farmacia, infr_cond_hospitalizacion,
    infr_cond_laboratorio, infr_cond_quirofanos, infr_servPub_1, infr_servPub_2
  ],
  VII: [proy_actuales]
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
export { ReportDefinitions, REPORT_DEFINITIONS_BY_SECTION };
