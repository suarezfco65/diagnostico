// section_II.js

import { CARGOS_AUTORIDADES } from "./data.js";

const SectionIIModule = (() => {
  /**
   * Función interna para generar el HTML de la sección de autoridades (Sección II).
   */
  const renderAutoridadesForm = () => {
    const container = document.getElementById("autoridades-container");
    if (!container) return;

    let html = "";

    CARGOS_AUTORIDADES.forEach((cargo) => {
      const key = cargo.key;
      const label = cargo.label;

      html += `
                <div class="card mb-3">
                    <div class="card-header bg-light">
                        <h5 class="mb-0">${label}</h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-4 mb-3">
                                <label for="${key}-nombre" class="form-label">Nombre y Apellido</label>
                                <input type="text" class="form-control" id="${key}-nombre" name="${key}-nombre">
                            </div>
                            <div class="col-md-4 mb-3">
                                <label for="${key}-celular" class="form-label">Celular</label>
                                <input type="tel" class="form-control" id="${key}-celular" name="${key}-celular">
                            </div>
                            <div class="col-md-4 mb-3">
                                <label for="${key}-correo" class="form-label">Correo</label>
                                <input type="email" class="form-control" id="${key}-correo" name="${key}-correo">
                            </div>
                        </div>
                    </div>
                </div>
            `;
    });
    container.innerHTML = html;
  };

  /**
   * 1. Renderiza los elementos dinámicos de la Sección II.
   */
  const render = () => {
    renderAutoridadesForm();
  };

  /**
   * 2. Recolecta todos los datos de la Sección II (Autoridades) en formato JSON.
   * @returns {Object} Un objeto con los datos de todos los cargos y las observaciones.
   */
  const collect = () => {
    let autoridadesData = {};

    CARGOS_AUTORIDADES.forEach((cargo) => {
      const key = cargo.key;
      autoridadesData[key] = {
        nombre: document.getElementById(`${key}-nombre`).value.trim(),
        celular: document.getElementById(`${key}-celular`).value.trim(),
        correo: document.getElementById(`${key}-correo`).value.trim(),
      };
    });

    // Incluir el campo de Observaciones Autoridades
    autoridadesData.observaciones = document
      .getElementById("observaciones-autoridades")
      .value.trim();

    return autoridadesData;
  };

  /**
   * 3. Precarga los datos de la Sección II en los campos del formulario.
   * @param {Object} data - El sub-objeto de datos de 'autoridades' del registro JSON.
   */
  const preload = (data) => {
    if (!data) return;

    CARGOS_AUTORIDADES.forEach((cargo) => {
      const key = cargo.key;
      const cargoData = data[key];

      if (cargoData) {
        document.getElementById(`${key}-nombre`).value = cargoData.nombre || "";
        document.getElementById(`${key}-celular`).value =
          cargoData.celular || "";
        document.getElementById(`${key}-correo`).value = cargoData.correo || "";
      }
    });

    // Llenar las observaciones
    document.getElementById("observaciones-autoridades").value =
      data.observaciones || "";
  };

  // Exponer las funciones públicas
  return {
    render,
    collect,
    preload,
  };
})();

export default SectionIIModule;
