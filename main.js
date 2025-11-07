// main.js

// =================================================================
// 1. IMPORTS DE MÓDULOS
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
import SectionVIIModule from "./section_VII.js";

// =================================================================
// 2. CONSTANTES Y VARIABLES GLOBALES
// =================================================================

const RIF_INPUT = document.getElementById("identificador");
const SEARCH_BTN = document.getElementById("search-btn");
const FORM = document.getElementById("diagnostico-form");
const FORM_TITLE = document.getElementById("form-title");
const STORAGE_KEY = "siscomres_diagnostico_data";
let CURRENT_KEY = null;

// Mapeo de módulos a claves de datos JSON. Esencial para colectar y precargar.
const MODULE_MAPPING = [
  { module: SectionIModule, dataKey: "datosInstitucion" },
  { module: SectionIIModule, dataKey: "autoridades" },
  { module: SectionIIIModule, dataKey: "personalInstitucion" },
  { module: SectionIVModule, dataKey: "serviciosMedicos" },
  { module: SectionVModule, dataKey: "otrosServicios" },
  { module: SectionVIModule, dataKey: "infraestructura" },
  { module: SectionVIIModule, dataKey: "proyectos" },
];

// =================================================================
// 3. LÓGICA DE AUTENTICACIÓN
// =================================================================

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
    window.location.href = "login.html";
    return false;
  }
  return true;
};

// =================================================================
// 4. MANEJO DEL FORMULARIO
// =================================================================

/**
 * ❗ FUNCIÓN AGREGADA ❗
 * Precarga los datos de un centro encontrado en los campos del formulario.
 * @param {Object} data - El registro completo del centro de salud.
 */
const preloadData = (data) => {
  // Asegura que todos los campos se limpien primero (reutilizando resetInterface)
  resetInterface(false); // No ocultar el formulario ya que vamos a llenarlo.

  // 1. Cargar el campo de ID final (el que se guarda)
  const finalIdInput = document.getElementById("identificador");
  if (finalIdInput) finalIdInput.value = data.identificador;

  // 2. Cargar los datos específicos de cada sección
  MODULE_MAPPING.forEach((item) => {
    // Cada módulo tiene una función 'preload' que espera su sub-objeto de datos (Ej: data.datosInstitucion)
    item.module.preload(data[item.dataKey]);
  });
};

/**
 * Recolecta todos los datos del formulario, delegando en cada módulo de sección.
 */
const collectFormData = () => {
  let formData = {};

  // 1. Recolección delegada por sección
  MODULE_MAPPING.forEach((item) => {
    // Cada módulo debe tener una función 'collect'
    formData[item.dataKey] = item.module.collect();
  });

  // 2. Agregar metadata
  formData.identificador =
    document.getElementById("identificador").value.trim() || "ID_INCOMPLETO";
  formData.version = "2024.2";
  formData.fechaRegistro = new Date().toISOString();

  return formData;
};

/**
 * Maneja el evento de submit del formulario.
 */
const handleFormSubmit = (e) => {
  e.preventDefault();

  const newData = collectFormData();

  // 1. Obtener todos los centros existentes
  let allCenters = Storage.getStorage(STORAGE_KEY) || [];

  // 2. Determinar si es una actualización o un nuevo registro
  if (CURRENT_KEY) {
    // Actualización
    const index = allCenters.findIndex(
      (center) => center.identificador === CURRENT_KEY
    );
    if (index !== -1) {
      allCenters[index] = newData;
      Storage.showAlert(
        "✅ Registro actualizado exitosamente.",
        "alert-success"
      );
    } else {
      // Si por alguna razón el centro no se encuentra, lo añadimos
      allCenters.push(newData);
      Storage.showAlert(
        "✅ Nuevo registro creado exitosamente (El anterior no se encontró para actualizar).",
        "alert-success"
      );
    }
  } else {
    // Nuevo registro
    allCenters.push(newData);
    Storage.showAlert(
      "✅ Nuevo registro creado exitosamente.",
      "alert-success"
    );
  }

  // 3. Guardar en Storage
  Storage.saveStorage(allCenters, STORAGE_KEY);

  // 4. Resetear la interfaz para el siguiente registro
  resetInterface();
};

// =================================================================
// 5. LÓGICA DE BÚSQUEDA
// =================================================================

/**
 * Maneja la búsqueda de un centro por RIF/Cédula.
 */
const handleSearch = () => {
  const idType = document.querySelector('input[name="id-type"]:checked')?.value;
  const idValue = RIF_INPUT.value.trim();

  if (!idType || !idValue) {
    Storage.showAlert(
      "Debe seleccionar un tipo de ID (RIF o Cédula) e ingresar el número de identificación.",
      "alert-warning"
    );
    return;
  }

  // 1. Estandarizar el valor de búsqueda
  let searchValue = idValue.toUpperCase();

  // Limpieza inicial: Remover cualquier carácter no deseado que el usuario pueda haber tecleado
  // Permitimos J, G, V, E, X, - y dígitos
  searchValue = searchValue.replace(/[^JGVEX0-9-]/g, "");

  // 2. Normalización del formato RIF para la búsqueda.
  if (idType === "RIF") {
    if (!searchValue.includes("-") && searchValue.length > 1) {
      const prefix = searchValue.charAt(0);
      const numberPart = searchValue.substring(1);
      // Verificar que el prefijo sea uno de los conocidos para RIF/Cédula
      if (["J", "G", "E", "X", "V", "E"].includes(prefix)) {
        searchValue = `${prefix}-${numberPart}`;
      }
    }
  }

  const allCenters = Storage.getStorage(STORAGE_KEY) || [];

  // 3. Buscar el centro en el campo 'identificador'
  const foundCenter = allCenters.find(
    (center) => center.identificador === searchValue
  );

  if (foundCenter) {
    // Lógica para Centro Encontrado
    Storage.showAlert(
      `✅ Centro de salud encontrado: ${foundCenter.datosInstitucion.nombre}.`,
      "alert-success"
    );
    preloadData(foundCenter); // ❗ LLAMADA A LA FUNCIÓN CORREGIDA ❗
    FORM.classList.remove("d-none");
    FORM_TITLE.textContent = `Actualizar Diagnóstico de ${foundCenter.datosInstitucion.nombre}`;
    CURRENT_KEY = searchValue;
  } else {
    // Lógica para Nuevo Registro
    Storage.showAlert(
      `⚠️ Centro de salud **no encontrado** con ID ${searchValue}. Se iniciará un nuevo registro.`,
      "alert-info"
    );
    resetInterface();
    document.getElementById("identificador").value = searchValue;
    FORM.classList.remove("d-none");
    FORM_TITLE.textContent = "Nuevo Registro de Centro de Salud";
    CURRENT_KEY = null;
  }
};

// =================================================================
// 6. MANEJO DE LA INTERFAZ (RESET Y PLACEHOLDERS)
// =================================================================

/**
 * Resetea toda la interfaz del formulario.
 * @param {boolean} hideForm - Si es true, oculta el formulario completo.
 */
const resetInterface = (hideForm = true) => {
  FORM.reset();

  // Lógica de reseteo delegada a cada módulo si es necesario (ej: manejar inputs dinámicos)
  MODULE_MAPPING.forEach((item) => {
    // Si el módulo tiene una función 'reset' específica (opcional)
    if (typeof item.module.reset === "function") {
      item.module.reset();
    }
  });

  // Resetear el input de búsqueda
  RIF_INPUT.value = "";

  // ❗ CORRECCIÓN: Se añade el chequeo de nulidad al elemento "identificador" ❗
  const finalIdInput = document.getElementById("identificador");
  if (finalIdInput) {
    // Verificar si el elemento existe antes de intentar asignar .value
    finalIdInput.value = "";
  }

  if (hideForm) {
    FORM.classList.add("d-none");
  }

  FORM_TITLE.textContent = "Buscar o Registrar Centro de Salud";
  CURRENT_KEY = null;
};
// =================================================================
// 7. INICIALIZACIÓN (DOMContentLoaded)
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
        : "Ingrese la Cédula (Ej: VXXXXXXXX)";
    });
  });
});
