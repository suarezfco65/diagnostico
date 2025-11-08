// reports.js
import { PARROQUIAS_CARACAS } from "./data.js";
import Auth from "./auth.js";
import * as Storage from "./storage.js"; // Asumimos que showAlert está en storage.js

// reports.js (Función de Utilidad para Totalizar Personal)

/**
 * Calcula el total de personal basado en la sección y rol especificados.
 * @param {Object} data - El registro completo del centro de salud.
 * @param {string} section - La sección del personal (ej: 'administrativo', 'obrero', etc.). Usa '' para todas las secciones.
 * @param {string} role - El rol del personal (ej: 'cardiologia', 'cirugia', etc.). Usa '' para todos los roles.
 * @param {string} valueType - El tipo de valor a sumar ('disponible' o 'requerido').
 * @returns {number} El total de personal basado en los parámetros dados.
 */
const totalPersonal = (data, section = '', role = '', valueType = 'disponible') => {
    const personal = data.personalInstitucion;
    if (!personal) return 0;
    
    let total = 0;

    // Iterar sobre las secciones de personal
    for (const sec in personal) {
        // Si se especifica una sección, continuar solo si coincide
        if (section && sec !== section) continue;

        // Iterar sobre las claves de cada sección
        for (const r in personal[sec]) {
            // Si se especifica un rol, continuar solo si coincide
            if (role && r !== role) continue;

            // Asegurarse de que el objeto tiene la clave 'disponible' o 'requerido'
            if (personal[sec][r] && typeof personal[sec][r][valueType] === 'number') {
                total += personal[sec][r][valueType];
            }
        }
    }
    return total;
};

// Lista de reportes disponibles organizados por sección
const REPORT_DEFINITIONS_BY_SECTION = {
    // Reportes de la Sección I: Datos de la Institución
    I: [
      { 
        id: "inst_general", 
        label: "Datos Generales de la Institución",
        fields: [ // ❗ NUEVOS CAMPOS A MOSTRAR ❗
          { key: "identificador", label: "ID / RIF" },
          { key: "datosInstitucion.nombre", label: "Nombre Institución" },
          { key: "datosInstitucion.tipoInstitucion", label: "Tipo" },
          { key: "datosInstitucion.parroquia", label: "Parroquia" },
        ]
      },
      { 
        id: "inst_ente", 
        label: "Instituciones por Ente Adscrito",
        fields: [
          { key: "identificador", label: "ID / RIF" },
          { key: "datosInstitucion.nombre", label: "Nombre" },
          { key: "datosInstitucion.enteAdscrito", label: "Ente Adscrito" },
          { key: "datosInstitucion.parroquia", label: "Parroquia" },
        ]
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
        ]
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
            { key: totalPersonal, label: "Centro (D)" }, 
            { 
              key: (data) => totalPersonal(data, '', '', 'requerido'), 
              label: "Centro (R)" 
            }, 
            { 
              key: (data) => totalPersonal(data, 'servicios-medicos', '', 'disponible'), 
              label: "Servicios Médicos (D)" 
            }, 
            { 
              key: (data) => totalPersonal(data, 'servicios-medicos', '', 'requerido'), 
              label: "Servicios Médicos (R)" 
            }, 
        ]
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
    ],
    // Reportes de la Sección VII: Proyectos
    VII: [
        { id: "proy_existentes", label: "Proyectos Registrados por Área" },
        { id: "proy_cero", label: "Centros sin Proyectos" },
    ],
};

// Array de las claves de las secciones para iteración
const SECTIONS = Object.keys(REPORT_DEFINITIONS_BY_SECTION);


const ReportsModule = (() => {
  const reportsContent = document.getElementById("reports-content");
  const welcomeMessage = document.getElementById("welcome-message");
  const logoutBtn = document.getElementById("logout-btn");
  const reportSelect = document.getElementById("report-select");
  const parroquiaFilter = document.getElementById("parroquia-filter");
  const generateBtn = document.getElementById("generate-report-btn");
  const reportDataOutput = document.getElementById("report-data-output");

  // =============================
  // LÓGICA DE AUTENTICACIÓN
  // =============================

  const initAuthInterface = () => {
    const user = Auth.getCurrentUser();

    if (user) {
      // Usuario autenticado
      welcomeMessage.textContent = `Bienvenido, ${user}`;
      reportsContent.classList.remove("d-none");
    } else {
      // Usuario no autenticado
      Auth.requireAuth();
    }
  };

  const handleLogout = () => {
    Auth.logout();
    window.location.href = "login.html"; // Redirigir al nuevo login
  };

  // =============================
  // LÓGICA DE REPORTES
  // =============================

  /**
   * Rellena todos los selects de Reportes con los indicadores definidos.
   */
  const renderReportSelect = () => {
    SECTIONS.forEach((sectionKey) => {
      const selectElement = document.getElementById(`report-select-${sectionKey}`);
      if (!selectElement) return;

      const definitions = REPORT_DEFINITIONS_BY_SECTION[sectionKey];

      let htmlOptions =
        '<option value="" disabled selected>Seleccione un indicador...</option>';
      definitions.forEach((def) => {
        htmlOptions += `<option value="${def.id}">${def.label}</option>`;
      });

      selectElement.innerHTML = htmlOptions;
    });
  };

  /**
   * Rellena el select de Parroquias para el filtro en todos los tabs.
   */
  const renderParroquiaFilter = () => {
    const htmlOptions = PARROQUIAS_CARACAS.map(
      (parroquia) => `<option value="${parroquia}">${parroquia}</option>`
    ).join('');
    
    const finalHtml = `<option value="TODAS" selected>Todas las Parroquias</option>${htmlOptions}`;

    // Llenar todos los selects de parroquia (usan el mismo ID + sección)
    SECTIONS.forEach((sectionKey) => {
      const filterElement = document.getElementById(`parroquia-filter-${sectionKey}`);
      if (filterElement) {
        filterElement.innerHTML = finalHtml;
      }
    });

    // Llenar el primer filtro por si el ID original se mantuvo:
    const originalFilter = document.getElementById("parroquia-filter");
    if (originalFilter) {
        originalFilter.innerHTML = finalHtml;
    }
  };

  /**
   * Obtiene un valor de un registro, ya sea mediante una ruta anidada (string)
   * o ejecutando una función de cálculo (function).
   * @param {Object} data - El registro completo del centro de salud.
   * @param {string | Function} pathOrFunction - La ruta de la propiedad o la función a ejecutar.
   * @returns {*} El valor resultante o una cadena vacía.
   */
  const getReportValue = (data, pathOrFunction) => {
      // 1. Caso: El campo es una FUNCIÓN
      if (typeof pathOrFunction === 'function') {
          try {
              // Ejecutar la función, pasándole el objeto de datos completo
              return pathOrFunction(data);
          } catch (e) {
              console.error("Error al ejecutar función de reporte:", e);
              return "ERROR";
          }
      }
      
      // 2. Caso: El campo es una RUTA (string)
      if (typeof pathOrFunction === 'string') {
          const path = pathOrFunction;
          const value = path.split('.').reduce((acc, part) => {
              return acc && acc[part] !== undefined ? acc[part] : null;
          }, data);
          
          // Devolver el valor encontrado, o una cadena vacía si fue null
          return value !== null ? value : "";
      }
      
      return "";
  };

  // reports.js (Función generateReport adaptada)

  /**
   * Genera el reporte seleccionado y lo muestra en la interfaz.
   * @param {string} reportId - ID del indicador a generar.
   * @param {string} sectionKey - Clave de la sección (I, II, III, etc.).
   * @param {string} selectedParroquia - Valor del filtro de parroquia.
   */
  const generateReport = (reportId, sectionKey, selectedParroquia) => {
    // Buscar la definición del reporte en el mapa
    const reportDefinition = REPORT_DEFINITIONS_BY_SECTION[sectionKey]?.find((def) => def.id === reportId);
    
    // ... [El resto de la lógica de validación es similar] ...

    if (!reportId || !reportDefinition) {
      Storage.showAlert("Por favor, seleccione un indicador para generar el reporte.", "alert-warning");
      return;
    }
    
    // Asegurarse de que el output esté limpio y el título actualizado
    document.getElementById("report-title-output").textContent = `[${sectionKey}] ${reportDefinition.label}`;
    document.getElementById("report-data-output").innerHTML = "";
    document.getElementById("initial-message").classList.add("d-none"); // Ocultar el mensaje inicial

    let allInstitutions = Storage.getStorage() || [];
    
    // ❗ LÓGICA DE FILTRADO POR PARROQUIA ❗
    if (selectedParroquia !== "TODAS") {
      allInstitutions = allInstitutions.filter(
        (data) => data.datosInstitucion.parroquia === selectedParroquia
      );
      Storage.showAlert(`Filtro aplicado: **${selectedParroquia}** (${allInstitutions.length} centros)`, "alert-info");
    } else {
        Storage.showAlert(`Reporte generado para **Todas las Parroquias** (${allInstitutions.length} centros)`, "alert-info");
    }
    
    // ... [El resto de la lógica de manejo de datos/tabla sigue aquí] ...
    
    // Por simplicidad, solo se actualiza la tabla de ejemplo de la Sección I
    if (allInstitutions.length === 0) {
      reportDataOutput.innerHTML = `<div class="alert alert-danger" role="alert">No hay datos para esta selección y filtro.</div>`;
      return;
    }
    
    // -----------------------------------------------------------
    // Lógica de Generación de Tabla DÍNÁMICA
    // -----------------------------------------------------------

    // 1. Obtener los campos a mostrar desde la definición del reporte
    const fieldsToDisplay = reportDefinition.fields || [];

    // 2. Construir los encabezados (<thead>)
    let headerHtml = '<tr><th>#</th>'; // # es el índice
    fieldsToDisplay.forEach(field => {
        headerHtml += `<th>${field.label}</th>`;
    });
    headerHtml += '</tr>';

    // 3. Construir el cuerpo de la tabla (<tbody>)
    let bodyHtml = '';
    allInstitutions.forEach((data, index) => {
        let rowHtml = `<tr><td>${index + 1}</td>`;
        
        // Iterar sobre los campos definidos y extraer el valor anidado o ejecutar la función
        fieldsToDisplay.forEach(field => {
            // ❗ LLAMADA A LA FUNCIÓN ACTUALIZADA ❗
            const value = getReportValue(data, field.key); 
            rowHtml += `<td>${value}</td>`;
        });
        
        rowHtml += '</tr>';
        bodyHtml += rowHtml;
    });

    // 4. Construir la tabla completa
    const htmlTable = `
        <p>Total de registros encontrados: <strong>${allInstitutions.length}</strong></p>
        <div class="table-responsive">
            <table class="table table-striped table-hover table-sm">
                <thead class="table-dark">
                    ${headerHtml}
                </thead>
                <tbody>
                    ${bodyHtml}
                </tbody>
            </table>
        </div>
    `;
    
    document.getElementById("report-data-output").innerHTML = htmlTable;
    // -----------------------------------------------------------
  };
  
// reports.js (Función init modificada)
  const init = () => {
    // 1. Inicializar la interfaz de autenticación
    initAuthInterface();

    // 2. Cargar listas de reportes y filtros
    renderReportSelect();
    renderParroquiaFilter();

    // 3. Configurar Listeners (Delegación de eventos para los 7 botones)
    if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);
    
    // Captura eventos de clic en cualquier botón con la clase 'generate-report-btn'
    document.querySelectorAll('.generate-report-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const sectionKey = e.target.getAttribute('data-section');
            const reportSelect = document.getElementById(`report-select-${sectionKey}`);
            
            // ❗ CORRECCIÓN: Usar el ID específico del filtro para esta sección ❗
            const parroquiaFilter = document.getElementById(`parroquia-filter-${sectionKey}`); 

            if (!reportSelect || !parroquiaFilter) {
                // Esto maneja el caso donde uno de los elementos (select o filtro) no se encontró
                Storage.showAlert("Error interno: No se pudo encontrar el selector de reporte o el filtro de parroquia para esta sección.", "alert-danger");
                return; 
            }

            const reportId = reportSelect.value;
            // La lectura del valor ahora está segura porque verificamos que parroquiaFilter no es null
            const selectedParroquia = parroquiaFilter.value; 
            
            // Llamar a la función de generación con los parámetros necesarios
            generateReport(reportId, sectionKey, selectedParroquia);
        });
    });
  };

  return {
    init,
  };
})();

// Iniciar el módulo de reportes
document.addEventListener("DOMContentLoaded", ReportsModule.init);
