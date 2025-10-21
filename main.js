// main.js

// =================================================================
// 1. IMPORTS DE MÓDULOS
// =================================================================
import * as Storage from "./storage.js";

import SectionIModule from "./section_I.js";
import SectionIIModule from "./section_II.js";
import SectionIIIModule from "./section_III.js";
import SectionIVModule from "./section_IV.js";
import SectionVModule from "./section_V.js";
import SectionVIModule from "./section_VI.js";

// =================================================================
// 2. CONSTANTES Y VARIABLES GLOBALES
// =================================================================

// Mapeo de módulos: Asocia una clave de objeto JSON con el módulo encargado de su gestión.
const MODULE_MAPPING = [
  { key: "datosInstitucion", module: SectionIModule },
  { key: "autoridades", module: SectionIIModule },
  { key: "serviciosMedicos", module: SectionIIIModule },
  { key: "otrosServicios", module: SectionIVModule },
  { key: "infraestructura", module: SectionVModule },
  { key: "proyectos", module: SectionVIModule }, // Incluye Proyectos y Obs. Generales (Sección VI/VII)
];

// Elementos DOM principales
const FORM = document.getElementById("diagnostico-form"); // Asegúrate de que tu form tiene este ID
const RIF_INPUT = document.getElementById("rif-input");
const SEARCH_BTN = document.getElementById("search-btn");
const FORM_CONTAINER = document.getElementById("form-container");
const FORM_TITLE = document.getElementById("form-title");

let CURRENT_RIF = null;

// =================================================================
// 3. LÓGICA DE BÚSQUEDA Y CARGA
// =================================================================

/**
 * Valida el RIF (formato J-12345678, por ejemplo) y maneja la búsqueda.
 */
function handleSearch() {
  const rifValue = RIF_INPUT.value.trim().toUpperCase();

  // Simple validación de RIF (Asegurar que no esté vacío)
  if (!rifValue) {
    Storage.showAlert(
      "Por favor, ingrese el RIF del Centro de Salud.",
      "alert-warning"
    );
    return;
  }

  // Guardamos el RIF actual
  CURRENT_RIF = rifValue;

  // Obtener todos los datos guardados
  const allData = Storage.getStorage();
  const savedData = allData[CURRENT_RIF];

  if (savedData) {
    // RIF ENCONTRADO: Precargar el formulario para edición
    FORM_TITLE.textContent = `Modificar Registro | RIF: ${CURRENT_RIF}`;
    fillForm(savedData);
    Storage.showAlert(
      `Registro del RIF ${CURRENT_RIF} encontrado y cargado.`,
      "alert-info"
    );
  } else {
    // RIF NO ENCONTRADO: Habilitar formulario para nuevo registro
    FORM_TITLE.textContent = `Nuevo Registro | RIF: ${CURRENT_RIF}`;
    FORM.reset(); // Limpiar por si había datos anteriores
    Storage.showAlert(
      `RIF ${CURRENT_RIF} no encontrado. Creando nuevo registro.`,
      "alert-success"
    );
  }

  // Mostrar el formulario
  FORM.classList.remove("d-none");
  RIF_INPUT.disabled = true;
  SEARCH_BTN.disabled = true;
}

/**
 * Delega la precarga de datos a cada módulo de sección.
 * @param {Object} data - Los datos completos del registro JSON.
 */
function fillForm(data) {
  if (!data) return;

  // Precargar RIF y fecha, aunque no son campos del formulario
  // Estos campos no se precargan, solo se usan como metadata

  // 1. Precarga por módulos
  MODULE_MAPPING.forEach((item) => {
    // Se llama a la función preload del módulo, pasándole la sub-sección de datos correspondiente.
    item.module.preload(data[item.key]);
  });
}

// =================================================================
// 4. LÓGICA DE GUARDADO (SUBMIT)
// =================================================================

/**
 * Maneja el evento de submit del formulario (guardar/actualizar datos).
 */
function handleFormSubmit(e) {
  e.preventDefault();

  if (!CURRENT_RIF) {
    Storage.showAlert(
      "Error: No hay RIF activo. Use el botón de búsqueda primero.",
      "alert-danger"
    );
    return;
  }

  const now = new Date();

  // 1. Crear el objeto de datos
  const formData = {
    // Metadata principal
    rif: CURRENT_RIF,
    fechaRegistro: now.toISOString(),

    // 2. Recolección de datos por módulos
    // Se llama a la función collect de cada módulo para obtener su sub-sección de datos.
    ...MODULE_MAPPING.reduce((acc, item) => {
      acc[item.key] = item.module.collect();
      return acc;
    }, {}),
  };

  // 3. Almacenar el objeto JSON
  const allData = Storage.getStorage();
  allData[CURRENT_RIF] = formData;
  Storage.saveStorage(allData);

  // 4. Feedback al usuario y reseteo
  Storage.showAlert(
    `Datos del RIF ${CURRENT_RIF} guardados/actualizados exitosamente.`,
    "alert-success"
  );
  resetInterface();
}

/**
 * Resetea el formulario y la interfaz a su estado inicial.
 */
function resetInterface() {
  FORM.classList.add("d-none");
  FORM.reset();
  RIF_INPUT.value = "";
  RIF_INPUT.disabled = false;
  SEARCH_BTN.disabled = false;
  FORM_TITLE.textContent = "Buscar o Registrar Centro de Salud";
  CURRENT_RIF = null;
}

// =================================================================
// 5. INICIALIZACIÓN (DOMContentLoaded)
// =================================================================

document.addEventListener("DOMContentLoaded", () => {
  // 1. Renderizado inicial de todas las secciones dinámicas
  MODULE_MAPPING.forEach((item) => {
    item.module.render();
  });

  // Ocultar el formulario al inicio
  if (FORM) FORM.classList.add("d-none");

  // 2. Configurar Listeners
  if (SEARCH_BTN) {
    SEARCH_BTN.addEventListener("click", handleSearch);
  }
  if (FORM) {
    FORM.addEventListener("submit", handleFormSubmit);
  }

  // Manejar el botón de "Nuevo Registro" (para resetear el estado y permitir un nuevo RIF)
  const newRecordBtn = document.getElementById("new-record-btn"); // Asume que tienes un botón de "Nuevo Registro"
  if (newRecordBtn) {
    newRecordBtn.addEventListener("click", resetInterface);
  }
});
