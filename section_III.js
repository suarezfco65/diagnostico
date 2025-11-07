// section_III.js

import { PERSONAL_INSTITUCION } from "./data.js";

const SectionIIIModule = (() => {
  /**
   * Función interna para crear una fila de personal en la tabla.
   * @param {Object} personal - Objeto que representa el personal.
   * @returns {string} HTML de la fila del personal.
   */
  const createPersonalRow = (personal) => {
    const key = personal.key;
    let labelHTML = personal.label;

    // Si es un personal "Otro", se añade un campo de texto para especificar el nombre
    if (personal.isOther) {
      labelHTML = `
            <div class="input-group input-group-sm">
                <span class="input-group-text">${personal.label}</span>
                <input type="text" class="form-control" id="${key}-nombre-otro" placeholder="Especifique el personal" aria-label="${key} name">
            </div>
        `;
    }

    return `
        <tr data-personal-key="${key}">
            <td>${labelHTML}</td>
            <td><input type="number" class="form-control form-control-sm" id="${key}-requerido" min="0" placeholder="0"></td>
            <td><input type="number" class="form-control form-control-sm" id="${key}-disponible" min="0" placeholder="0"></td>
            <td><input type="text" class="form-control form-control-sm" id="${key}-observacion-personal" placeholder="Observaciones"></td>
        </tr>
    `;
  };

  /**
   * Función interna para generar el HTML de la tabla de personal de la institución (Sección III).
   */
  const renderPersonalInstitucionForm = () => {
    const container = document.getElementById("personal-institucion-container");
    if (!container) return;

    const html = PERSONAL_INSTITUCION.map((area) => {
      const personalRows = area.items
        .map((item) => createPersonalRow(item))
        .join("");

      return `
        <h4>${area.label}</h4>
        <table>
          <thead class="table-light">
            <tr>
              <th style="width: 15%;">PERFIL/ESPECIALIDAD</th>
              <th style="width: 9%;">PERSONAL REQUERIDO</th>
              <th style="width: 9%;">PERSONAL DISPONIBLE</th>
              <th style="width: 29%;">OBSERVACIONES</th>
            </tr>
          </thead>
          <tbody>
            ${personalRows}
          </tbody>
        </table>
      `;
    }).join("");

    container.innerHTML = html;
  };

  /**
   * 1. Renderiza los elementos dinámicos de la Sección III.
   */
  const render = () => {
    renderPersonalInstitucionForm();
  };

  /**
   * 2. Recolecta todos los datos de la Sección III (Personal de la Institución).
   * @returns {Object} Un objeto con los datos de cada personal (requerido, disponible, estado, observación y nombre específico si es "Otro").
   */
  const collect = () => {
    let personalData = {};

    PERSONAL_INSTITUCION.forEach((area) => {
      personalData[area.key] = {};
      area.items.forEach((item) => {
        const key = item.key;

        // 1. Obtener el personal requerido
        const requerido = parseInt(
          document.getElementById(`${key}-requerido`).value,
          10
        );
        // 2. Obtener el personal disponible
        const disponible = parseInt(
          document.getElementById(`${key}-disponible`).value,
          10
        );

        // 3. Obtener la observación individual
        const observacion = document
          .getElementById(`${key}-observacion-personal`)
          .value.trim();

        // 4. Obtener el nombre específico si es "Otro"
        const nombreEspec = item.isOther
          ? document.getElementById(`${key}-nombre-otro`).value.trim()
          : item.label;

        personalData[area.key][key] = {
          requerido: isNaN(requerido) ? 0 : requerido,
          disponible: isNaN(disponible) ? 0 : disponible,
          observacion: observacion,
          nombreEspec: nombreEspec,
        };
      });
    });

    return personalData;
  };

  /**
   * 3. Precarga los datos de la Sección III en los campos del formulario.
   * @param {Object} data - El sub-objeto de datos de 'personalInstitucion' del registro JSON.
   */
  const preload = (data) => {
    if (!data) return;
    console.log("Precargando datos de Sección III:", data);

    PERSONAL_INSTITUCION.forEach((area) => {
      area.items.forEach((item) => {
        const key = item.key;
        const personalData = data[area.key][key];

        if (personalData) {
          // 1. Llenar el personal requerido
          document.getElementById(`${key}-requerido`).value =
            personalData.requerido || 0;

          // 2. Llenar el personal disponible
          document.getElementById(`${key}-disponible`).value =
            personalData.disponible || 0;

          // 3. Llenar la observación
          document.getElementById(`${key}-observacion-personal`).value =
            personalData.observacion || "";

          // 4. Si es un personal "Otro", llenar el nombre especificado
          if (item.isOther) {
            document.getElementById(`${key}-nombre-otro`).value =
              personalData.nombreEspec || ""; // Asegurarse de que se maneje el caso donde no hay nombre
          }
        }
      });
    });
  };

  // Exponer las funciones públicas
  return {
    render,
    collect,
    preload,
  };
})();

export default SectionIIIModule;
