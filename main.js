// main.js

// =================================================================
// 1. IMPORTS DE MÓDULOS (SIN CAMBIOS)
// =================================================================
import Auth from "./auth.js";
import * as Storage from "./storage.js";

// Roles permitidos para registrar o actualizar centros
const REQUIRED_ROLES_FOR_REGISTRATION = ["BRIGADISTA", "ADMIN"];

import SectionIModule from "./section_I.js";
import SectionIIModule from "./section_II.js";
import SectionIIIModule from "./section_III.js";
import SectionIVModule from "./section_IV.js";
import SectionVModule from "./section_V.js";
import SectionVIModule from "./section_VI.js";

// =================================================================
// 2. CONSTANTES Y VARIABLES GLOBALES
// =================================================================

// --- LÓGICA DE RESTRICCIÓN DE ROL ---
const checkRoleAccess = () => {
  // 1. Forzar autenticación: si no hay sesión, redirige a login.html (login)
  Auth.requireAuth();

  // 2. Si la sesión existe, verificar el rol
  const currentRole = Auth.getCurrentRole();

  if (!currentRole || !REQUIRED_ROLES_FOR_REGISTRATION.includes(currentRole)) {
    // Acceso Denegado
    const alertMessage = `Acceso Denegado. Su rol actual (${
      currentRole || "N/A"
    }) no permite registrar o actualizar centros de salud.`;

    // Muestra una alerta y luego redirige
    alert(alertMessage);

    Auth.logout(); // Limpiar la sesión
    window.location.href = "login.html"; // Redirigir de nuevo al login

    return false;
  }

  // Acceso permitido
  return true;
};

// ... (MODULE_MAPPING sin cambios) ...

const MODULE_MAPPING = [
  { key: "datosInstitucion", module: SectionIModule },
  { key: "autoridades", module: SectionIIModule },
  { key: "serviciosMedicos", module: SectionIIIModule },
  { key: "otrosServicios", module: SectionIVModule },
  { key: "infraestructura", module: SectionVModule },
  { key: "proyectos", module: SectionVIModule },
];

// Elementos DOM principales
const FORM = document.getElementById("diagnostico-form");
const RIF_INPUT = document.getElementById("rif-input");
const SEARCH_BTN = document.getElementById("search-btn");
const FORM_TITLE = document.getElementById("form-title");

let CURRENT_KEY = null; // Almacenará el RIF o la CI, que será la clave de almacenamiento.

// =================================================================
// 3. NUEVAS FUNCIONES DE VALIDACIÓN
// =================================================================

/**
 * Valida el formato del RIF. Ej: J-12345678, E-12345678, G-12345678, P-12345678.
 * @param {string} value - El valor a validar.
 * @returns {boolean} True si el formato es válido.
 */
function isValidRIF(value) {
  // Regex: Empieza con J, E, G o P, seguido de un guión y 6 a 9 dígitos.
  const rifRegex = /^[JEEGPN]-\d{6,9}$/i;
  return rifRegex.test(value.toUpperCase());
}

/**
 * Valida el formato de la Cédula de Identidad. Ej: V-12345678, E-12345678.
 * @param {string} value - El valor a validar.
 * @returns {boolean} True si el formato es válido.
 */
function isValidCI(value) {
  // Regex: Empieza con V o E, seguido de un guión y 6 a 9 dígitos.
  const ciRegex = /^[VE]-\d{6,9}$/i;
  return ciRegex.test(value.toUpperCase());
}

// =================================================================
// 4. LÓGICA DE BÚSQUEDA Y CARGA (MODIFICADA)
// =================================================================

/**
 * Valida el formato del identificador y maneja la búsqueda.
 */
function handleSearch() {
  const rawValue = RIF_INPUT.value.trim().toUpperCase();

  // 1. Obtener el tipo de ID seleccionado
  const selectedIdType = document.querySelector(
    'input[name="id-type"]:checked'
  ).value;

  // 2. Validación
  if (!rawValue) {
    Storage.showAlert("Por favor, ingrese el identificador.", "alert-warning");
    return;
  }

  let key; // La clave final que usaremos para el almacenamiento
  let error = null;

  if (selectedIdType === "RIF") {
    if (isValidRIF(rawValue)) {
      key = rawValue;
    } else {
      error = "Formato de RIF inválido. Use el formato: [J/E/G/P]-XXXXXXXX.";
    }
  } else if (selectedIdType === "CI") {
    if (isValidCI(rawValue)) {
      key = rawValue;
    } else {
      error = "Formato de Cédula inválido. Use el formato: [V/E]-XXXXXXXX.";
    }
  }

  if (error) {
    Storage.showAlert(error, "alert-danger");
    return;
  }

  // Guardamos la clave actual (RIF o CI)
  CURRENT_KEY = key;

  // 3. Obtener y cargar datos
  const allData = Storage.getStorage();
  const savedData = allData[CURRENT_KEY];

  const idTypeLabel = selectedIdType === "RIF" ? "RIF" : "Cédula";

  if (savedData) {
    // ID ENCONTRADO: Precargar el formulario para edición
    FORM_TITLE.textContent = `Modificar Registro | ${idTypeLabel}: ${CURRENT_KEY}`;
    fillForm(savedData);
    Storage.showAlert(
      `Registro del ${idTypeLabel} ${CURRENT_KEY} encontrado y cargado.`,
      "alert-info"
    );
  } else {
    // ID NO ENCONTRADO: Habilitar formulario para nuevo registro
    FORM_TITLE.textContent = `Nuevo Registro | ${idTypeLabel}: ${CURRENT_KEY}`;
    FORM.reset();
    Storage.showAlert(
      `${idTypeLabel} ${CURRENT_KEY} no encontrado. Creando nuevo registro.`,
      "alert-success"
    );
  }

  // Mostrar el formulario e inhabilitar la búsqueda
  FORM.classList.remove("d-none");
  RIF_INPUT.disabled = true;
  SEARCH_BTN.disabled = true;
  document
    .querySelectorAll('input[name="id-type"]')
    .forEach((radio) => (radio.disabled = true));
}

// ... (fillForm sin cambios) ...
function fillForm(data) {
  if (!data) return;

  MODULE_MAPPING.forEach((item) => {
    item.module.preload(data[item.key]);
  });
}

// =================================================================
// 5. LÓGICA DE GUARDADO (SUBMIT) (MODIFICADA)
// =================================================================

/**
 * Maneja el evento de submit del formulario (guardar/actualizar datos).
 */
function handleFormSubmit(e) {
  e.preventDefault();

  if (!CURRENT_KEY) {
    Storage.showAlert(
      "Error: No hay identificador activo. Use el botón de búsqueda primero.",
      "alert-danger"
    );
    return;
  }

  const now = new Date();
  const selectedIdType = document.querySelector(
    'input[name="id-type"]:checked'
  ).value;

  // 1. Crear el objeto de datos
  const formData = {
    // Metadata principal
    // Almacenamos la clave principal usada (RIF o CI)
    identificador: CURRENT_KEY,
    tipoIdentificador: selectedIdType,
    fechaRegistro: now.toISOString(),

    // 2. Recolección de datos por módulos
    ...MODULE_MAPPING.reduce((acc, item) => {
      acc[item.key] = item.module.collect();
      return acc;
    }, {}),
  };

  // 3. Almacenar el objeto JSON
  const allData = Storage.getStorage();
  allData[CURRENT_KEY] = formData; // Usamos CURRENT_KEY (RIF o CI) como clave en localStorage
  Storage.saveStorage(allData);

  // 4. Feedback al usuario y reseteo
  const idTypeLabel = selectedIdType === "RIF" ? "RIF" : "Cédula";
  Storage.showAlert(
    `Datos del ${idTypeLabel} ${CURRENT_KEY} guardados/actualizados exitosamente.`,
    "alert-success"
  );
  resetInterface();
}

// =================================================================
// 6. RESET Y MANEJO DE INTERFAZ (MODIFICADA)
// =================================================================

/**
 * Resetea el formulario y la interfaz a su estado inicial.
 */
function resetInterface() {
  FORM.classList.add("d-none");
  FORM.reset();
  RIF_INPUT.value = "";
  RIF_INPUT.disabled = false;
  SEARCH_BTN.disabled = false;

  // Habilitar y resetear los radio buttons
  document.querySelectorAll('input[name="id-type"]').forEach((radio) => {
    radio.disabled = false;
  });
  document.getElementById("id-type-rif").checked = true; // Volver a RIF por defecto

  FORM_TITLE.textContent = "Buscar o Registrar Centro de Salud";
  CURRENT_KEY = null;
}

// =================================================================
// 7. INICIALIZACIÓN (DOMContentLoaded) (MODIFICADA)
// =================================================================

document.addEventListener("DOMContentLoaded", () => {
  // ❗ LLAMAR A LA VERIFICACIÓN DE ROL PRIMERO ❗
  if (!checkRoleAccess()) {
    return; // Detiene la ejecución del resto del script si el acceso es denegado
  }

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

  const newRecordBtn = document.getElementById("new-record-btn");
  if (newRecordBtn) {
    newRecordBtn.addEventListener("click", resetInterface);
  }

  // Listener para cambiar el placeholder del input
  document.querySelectorAll('input[name="id-type"]').forEach((radio) => {
    radio.addEventListener("change", (e) => {
      const isRif = e.target.value === "RIF";
      RIF_INPUT.placeholder = isRif
        ? "Ingrese el RIF del Centro (Ej: J-XXXXXXXXX)"
        : "Ingrese la Cédula del Representante (Ej: V-XXXXXXXXX)";
      RIF_INPUT.value = ""; // Limpiar al cambiar tipo
    });
  });
});
