// storage.js

const STORAGE_KEY = "siscomres_diagnostico_data";

/**
 * ❗ FUNCIÓN CORREGIDA ❗
 * Muestra una alerta temporal en la interfaz.
 * @param {string} message - Mensaje a mostrar.
 * @param {string} type - Clase de Bootstrap para el tipo de alerta (ej: 'alert-danger').
 * @param {string} containerId - ID del contenedor donde mostrar la alerta.
 */
export const showAlert = (
  message,
  type = "alert-info",
  containerId = "alert-container"
) => {
  // 1. Buscar el contenedor por el ID proporcionado
  const container = document.getElementById(containerId);

  if (!container) {
    console.error(
      `Elemento '${containerId}' no encontrado. Mostrando alerta en consola: ${message}`
    );
    return;
  }

  // 2. Crear el elemento de alerta
  const alertElement = document.createElement("div");
  alertElement.className = `alert ${type} alert-dismissible fade show`;
  alertElement.setAttribute("role", "alert");
  alertElement.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

  // 3. Insertar la alerta y configurar la desaparición
  container.innerHTML = ""; // Limpiar alertas anteriores
  container.appendChild(alertElement);

  // Configurar la alerta para que desaparezca automáticamente después de 4 segundos
  setTimeout(() => {
    // Se puede usar la clase 'alert' de Bootstrap para cerrarla con animación
    if (window.bootstrap && alertElement.classList.contains("show")) {
      const bsAlert = new bootstrap.Alert(alertElement);
      bsAlert.close();
    } else if (alertElement.parentNode) {
      // Fallback si Bootstrap no está disponible o no se puede cerrar
      alertElement.parentNode.removeChild(alertElement);
    }
  }, 4000);
};

/**
 * Obtiene todos los datos del localStorage.
 * @returns {Array|Object} Datos del diagnóstico.
 */
export const getStorage = (key = STORAGE_KEY) => {
  try {
    const storedData = localStorage.getItem(key);
    // Retorna un Array vacío si no hay datos, o los datos parseados
    return storedData ? JSON.parse(storedData) : [];
  } catch (e) {
    console.error("Error leyendo localStorage:", e);
    return [];
  }
};

/**
 * Guarda todos los datos en el localStorage.
 * @param {Object} data - Objeto JSON con todos los registros.
 * @param {string} key - La clave de almacenamiento.
 */
export const saveStorage = (data, key = STORAGE_KEY) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Error guardando en localStorage:", e);
  }
};

/**
 * Elimina una clave específica del localStorage.
 * @param {string} key - La clave a eliminar (ej: 'siscomres_diagnostico_data').
 */
export const deleteStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error(`Error eliminando la clave ${key} de localStorage:`, e);
  }
};
