// storage.js

/**
 * =================================================================
 * FUNCIONES DE STORAGE (PERSISTENCIA DE DATOS)
 * =================================================================
 */

// Clave para almacenar todos los registros en localStorage
const STORAGE_KEY = "diagnostico_red_salud_caracas_v1";

/**
 * Obtiene todos los registros guardados de localStorage.
 * @returns {Object} Un objeto con los RIFs como claves y los datos del formulario como valores.
 */
export function getStorage() {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    // Si hay datos, los parsea; si no, devuelve un objeto vacío.
    return storedData ? JSON.parse(storedData) : {};
  } catch (e) {
    console.error("Error al obtener datos de localStorage:", e);
    return {};
  }
}

/**
 * Guarda el objeto completo de registros en localStorage.
 * @param {Object} data - El objeto con todos los RIFs y sus datos.
 */
export function saveStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    console.log("Datos guardados exitosamente en localStorage.");
  } catch (e) {
    console.error("Error al guardar datos en localStorage:", e);
    showAlert(
      "Error al guardar los datos. Verifique el espacio de almacenamiento local.",
      "alert-danger"
    );
  }
}

/**
 * Muestra un mensaje de alerta temporal al usuario.
 * Nota: Asume que existe un elemento con ID 'alert-container' en el HTML.
 * @param {string} message - El mensaje a mostrar.
 * @param {string} type - Clase de Bootstrap para el tipo de alerta (ej: 'alert-success', 'alert-danger').
 */
export function showAlert(message, type) {
  const alertContainer = document.getElementById("alert-container");
  if (!alertContainer) {
    console.warn(
      "Elemento 'alert-container' no encontrado. Mostrando alerta en consola:",
      message
    );
    return;
  }

  // Crear el elemento de la alerta de Bootstrap
  const alertDiv = document.createElement("div");
  alertDiv.className = `alert ${type} alert-dismissible fade show`;
  alertDiv.setAttribute("role", "alert");
  alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

  // Agregar la alerta al contenedor
  alertContainer.appendChild(alertDiv);

  // Ocultar la alerta después de 5 segundos
  setTimeout(() => {
    if (alertContainer.contains(alertDiv)) {
      alertDiv.classList.remove("show");
      alertDiv.classList.add("fade");
      // Esperar la animación de fade out antes de remover
      alertDiv.addEventListener("transitionend", () => alertDiv.remove());
    }
  }, 5000);
}
