// header.js

/**
 * Carga el contenido del header.html y lo inyecta en el placeholder
 * definido en el documento HTML.
 */
export function loadHeader() {
  // Definimos el ID del elemento donde se insertará el cintillo
  const placeholderId = "header-placeholder";
  const placeholder = document.getElementById(placeholderId);

  if (placeholder) {
    fetch("header.html")
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Error al cargar header.html: ${response.statusText}`
          );
        }
        return response.text();
      })
      .then((html) => {
        // Insertar el HTML del cintillo
        placeholder.insertAdjacentHTML("afterbegin", html);
      })
      .catch((error) => {
        console.error("SISCOMRES Header Error:", error);
        // Opcional: Mostrar un mensaje de error visible al usuario
        // placeholder.innerHTML = `<div class="alert alert-danger">Error al cargar el encabezado institucional.</div>`;
      });
  } else {
    console.warn(
      `No se encontró el placeholder con ID: ${placeholderId}. Asegúrese de agregarlo a su archivo HTML.`
    );
  }
}

// Opcional: Ejecutar la carga automáticamente si el script no es un módulo
document.addEventListener("DOMContentLoaded", loadHeader);
