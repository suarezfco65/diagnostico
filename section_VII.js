// section_VII.js

import { PROYECTOS_DATA, MAX_PROYECTOS } from "./data.js";

const SectionVIIModule = (() => {
  /**
   * =================================================================
   * FUNCIONES INTERNAS DE MANIPULACIÓN DEL DOM
   * =================================================================
   */

  /**
   * Agrega un campo de entrada de proyecto a un contenedor específico.
   * @param {string} key - Clave de la categoría de proyecto.
   * @param {string} initialValue - Valor inicial para precarga (opcional).
   * @param {boolean} isInitial - Indica si es la primera entrada (para forzar al menos una).
   */
  const _addProyectoInput = (key, initialValue = "", isInitial = false) => {
    const container = document.getElementById(`${key}-inputs-container`);
    if (!container) return;

    const currentCount = container.children.length;
    if (!isInitial && currentCount >= MAX_PROYECTOS) {
      // Se puede agregar una alerta aquí si se requiere feedback al usuario.
      return;
    }

    const index = currentCount + 1;
    const inputId = `${key}-proyecto-${index}`;
    const categoria = PROYECTOS_DATA.find((c) => c.key === key);
    if (!categoria) return;

    const placeholder = categoria.placeholder;

    const newDiv = document.createElement("div");
    newDiv.className = "input-group input-group-sm mb-2";
    newDiv.innerHTML = `
            <span class="input-group-text text-bg-secondary" style="width: 50px;">#${index}</span>
            <input type="text" class="form-control" id="${inputId}" name="${key}" placeholder="${placeholder}" value="${initialValue}" aria-label="Proyecto ${index}">
        `;

    container.appendChild(newDiv);
  };

  /**
   * Elimina el último campo de entrada de proyecto de un contenedor específico.
   * @param {string} key - Clave de la categoría de proyecto.
   */
  const _removeProyectoInput = (key) => {
    const container = document.getElementById(`${key}-inputs-container`);
    if (!container) return;

    // Mantener al menos un campo visible si es el único con contenido o si ya está vacío.
    if (container.children.length > 1) {
      container.removeChild(container.lastChild);
    } else if (
      container.children.length === 1 &&
      container.lastChild.querySelector("input").value.trim() !== ""
    ) {
      // Si solo queda uno y tiene texto, lo elimina y añade uno nuevo vacío.
      container.removeChild(container.lastChild);
      _addProyectoInput(key, "", true);
    }
    // Si solo queda un campo vacío, no se hace nada para asegurar la estructura inicial.
  };

  /**
   * Función interna para renderizar la sección de Proyectos y configurar listeners.
   */
  const renderProyectosForm = () => {
    const container = document.getElementById("proyectos-container");
    if (!container) return;

    let html = "";

    PROYECTOS_DATA.forEach((categoria) => {
      const key = categoria.key;

      html += `
                <div class="mb-4 p-3 border rounded" data-category-key="${key}">
                    <h5 class="fw-bold text-primary">${categoria.label} (Máx ${MAX_PROYECTOS})</h5>
                    
                    <div id="${key}-inputs-container">
                        </div>
                    
                    <button type="button" class="btn btn-sm btn-outline-success mt-2 add-proyecto-btn" data-key="${key}">
                        + Agregar Proyecto
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-danger mt-2 remove-proyecto-btn" data-key="${key}">
                        - Eliminar Último
                    </button>
                </div>
            `;
    });

    container.innerHTML = html;

    // Configurar Listeners y generar input inicial
    PROYECTOS_DATA.forEach((categoria) => {
      const key = categoria.key;
      _addProyectoInput(key, "", true); // Genera 1 campo por defecto

      // 1. Configurar Listeners para el botón AGREGAR
      document
        .querySelectorAll(`.add-proyecto-btn[data-key="${key}"]`)
        .forEach((button) => {
          button.addEventListener("click", () => _addProyectoInput(key));
        });
      // 2. Configurar Listeners para el botón ELIMINAR
      document
        .querySelectorAll(`.remove-proyecto-btn[data-key="${key}"]`)
        .forEach((button) => {
          button.addEventListener("click", () => _removeProyectoInput(key));
        });
    });
  };

  /**
   * =================================================================
   * FUNCIONES PÚBLICAS
   * =================================================================
   */

  /**
   * 1. Renderiza los elementos dinámicos de la Sección VI.
   */
  const render = () => {
    renderProyectosForm();
  };

  /**
   * 2. Recolecta todos los datos de la Sección VII (Proyectos) y VIII (Observaciones).
   * @returns {Object} Objeto con los arrays de proyectos por categoría y las observaciones generales.
   */
  const collect = () => {
    let proyectosData = {};

    PROYECTOS_DATA.forEach((categoria) => {
      const key = categoria.key;
      // Recolectar todos los inputs de la categoría y mapear sus valores, filtrando los vacíos.
      const inputs = document.querySelectorAll(
        `#${key}-inputs-container input[name="${key}"]`
      );
      const proyectos = Array.from(inputs)
        .map((input) => input.value.trim())
        .filter((value) => value.length > 0);

      proyectosData[key] = proyectos;
    });

    // Incluir la Sección VIII: Observaciones Generales
    proyectosData.observacionesGenerales = document
      .getElementById("observaciones-generales")
      .value.trim();

    return proyectosData;
  };

  /**
   * 3. Precarga los datos de la Sección VII y VIII en los campos del formulario.
   * @param {Object} data - El sub-objeto de datos de 'proyectos' del registro JSON.
   */
  const preload = (data) => {
    if (!data) return;

    PROYECTOS_DATA.forEach((categoria) => {
      const key = categoria.key;
      const proyectosGuardados = data[key] || [];
      const container = document.getElementById(`${key}-inputs-container`);

      if (container) {
        // 1. Limpiar todos los inputs existentes
        container.innerHTML = "";

        // 2. Si hay datos guardados, crear los inputs y llenarlos
        if (proyectosGuardados.length > 0) {
          proyectosGuardados.forEach((proyecto) => {
            _addProyectoInput(key, proyecto);
          });
        } else {
          // 3. Si no hay datos, asegurar que quede 1 campo vacío
          _addProyectoInput(key, "", true);
        }
      }
    });

    // Precargar la Sección VII: Observaciones Generales
    document.getElementById("observaciones-generales").value =
      data.observacionesGenerales || "";
  };

  // Exponer las funciones públicas
  return {
    render,
    collect,
    preload,
  };
})();

export default SectionVIIModule;
