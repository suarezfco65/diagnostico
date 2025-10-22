// storage.js

const STORAGE_KEY = "siscomres_diagnostico_data";

/**
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
  // NOTA: Requiere que tengas el script de Bootstrap 5.3 cargado.
  setTimeout(() => {
    // Se puede usar la clase 'alert' de Bootstrap para cerrarla con animación
    if (alertElement.classList.contains("show")) {
      const bsAlert = new bootstrap.Alert(alertElement);
      bsAlert.close();
    }
  }, 4000);
};

/**
 * Obtiene todos los datos del localStorage.
 * @returns {Object} Datos del diagnóstico.
 */
export const getStorage = () => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    // Si no hay datos, retorna un objeto vacío
    return storedData ? JSON.parse(storedData) : {};
  } catch (e) {
    console.error("Error leyendo localStorage:", e);
    return {};
  }
};

/**
 * Guarda todos los datos en el localStorage.
 * @param {Object} data - Objeto JSON con todos los registros.
 */
export const saveStorage = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Error escribiendo localStorage:", e);
  }
};
