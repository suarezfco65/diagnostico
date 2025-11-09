// section_V.js

import { OTROS_SERVICIOS_DATA } from "./data.js";

const SectionVModule = (() => {
  /**
   * =================================================================
   * FUNCIONES DE RENDERIZADO INTERNAS (Sección V)
   * =================================================================
   */

  /**
   * Genera el HTML para tablas que usan Radio Buttons (Imagenología y Medicinas).
   */
  const createRadioTableHTML = (groupKey, items, title = "") => {
    let html = title ? `<h5 class="mt-3">${title}</h5>` : "";
    html += `
            <div class="table-responsive mb-4">
                <table class="table table-sm table-bordered align-middle">
                    <thead class="table-light">
                        <tr>
                            <th style="width: 25%;">Servicio</th>
                            <th>Activo</th>
                            <th>Activo c/Prob</th>
                            <th>Inactivo</th>
                            <th>No Existe</th>
                            <th>Observación</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

    items.forEach((item) => {
      // Clave única para el grupo de radio buttons y elementos del formulario
      const key = `${groupKey}-${item.key}`;
      let labelHTML = item.label;

      if (item.isOther) {
        // Campo de texto para especificar el nombre del servicio "Otro"
        labelHTML = `
                    <div class="input-group input-group-sm">
                        <span class="input-group-text">${item.label}</span>
                        <input type="text" class="form-control" id="${key}-nombre-especifico" placeholder="Especifique el servicio" aria-label="${key} name">
                    </div>
                `;
      }

      html += `
                <tr data-service-key="${key}">
                    <td>${labelHTML}</td>
                    
                    <td><input class="form-check-input" type="radio" name="${key}-estado" value="ACTIVO" id="${key}-activo"></td>
                    <td><input class="form-check-input" type="radio" name="${key}-estado" value="ACTIVO C/PROB" id="${key}-activo-prob"></td>
                    <td><input class="form-check-input" type="radio" name="${key}-estado" value="INACTIVO" id="${key}-inactivo"></td>
                    <td><input class="form-check-input" type="radio" name="${key}-estado" value="NO EXISTE" id="${key}-no-existe" checked></td>
                    
                    <td><input type="text" class="form-control form-control-sm" id="${key}-observacion" placeholder="Observaciones"></td>
                </tr>
            `;
    });

    html += `
                    </tbody>
                </table>
            </div>
        `;
    return html;
  };

  /**
   * Genera el HTML para grupos de Checkboxes (Laboratorio y Farmacia).
   */
  const createCheckboxGroupHTML = (groupKey, groupLabel, items) => {
    let html = `
            <div class="mb-4 p-3 border rounded">
                <h5 class="fw-bold text-primary">${groupLabel}</h5>
                <div class="row">
        `;

    items.forEach((item) => {
      const key = `${groupKey}-${item.key}`;
      let labelHTML = item.label;

      if (item.isOther) {
        // Campo de texto para especificar el nombre del estudio "Otro"
        labelHTML = `
                    <div class="input-group input-group-sm">
                        <span class="input-group-text">${item.label}</span>
                        <input type="text" class="form-control" id="${key}-nombre-especifico" placeholder="Especifique el estudio" aria-label="${key} name">
                    </div>
                `;
      }

      html += `
                <div class="col-md-4 mb-2">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="${groupKey}-servicios" value="${item.key}" id="${key}-check">
                        <label class="form-check-label" for="${key}-check">
                            ${labelHTML}
                        </label>
                    </div>
                </div>
            `;
    });

    html += `
                </div>
            </div>
        `;
    return html;
  };

  /**
   * =================================================================
   * FUNCIONES PÚBLICAS
   * =================================================================
   */

  /**
   * 1. Renderiza los elementos dinámicos de la Sección V.
   */
  const render = () => {
    const container = document.getElementById("otros-servicios-container");
    if (!container) return;

    let finalHtml = "<h4>A. IMAGENOLOGÍA</h4>";
    finalHtml += createRadioTableHTML(
      "imagenologia",
      OTROS_SERVICIOS_DATA.imagenologia
    );

    finalHtml += "<h4>B. LABORATORIO</h4>";
    OTROS_SERVICIOS_DATA.laboratorio.forEach((group) => {
      finalHtml += createCheckboxGroupHTML(
        group.key,
        group.groupLabel,
        group.items
      );
    });

    finalHtml += "<h4>C. FARMACIA</h4>";
    OTROS_SERVICIOS_DATA.farmacia.forEach((group) => {
      finalHtml += createCheckboxGroupHTML(
        group.key,
        group.groupLabel,
        group.items
      );
    });

    finalHtml += "<h4>D. COCINA</h4>";
    finalHtml += createRadioTableHTML("cocina", OTROS_SERVICIOS_DATA.cocina);

    container.innerHTML = finalHtml;
  };

  /**
   * Recolecta datos de tablas con Radio Buttons (Imagenología y Medicinas).
   */
  const collectRadioTableData = (groupKey, items) => {
    let data = {};
    items.forEach((item) => {
      const key = `${groupKey}-${item.key}`;
      const estadoElement = document.querySelector(
        `input[name="${key}-estado"]:checked`
      );
      const estado = estadoElement ? estadoElement.value : "NO EXISTE";
      const observacion = document
        .getElementById(`${key}-observacion`)
        .value.trim();

      let itemData = { estado: estado, observacion: observacion };

      if (item.isOther) {
        itemData.nombreEspec = document
          .getElementById(`${key}-nombre-especifico`)
          .value.trim();
      }
      data[item.key] = itemData;
    });
    return data;
  };

  /**
   * Recolecta Chk data (Checkboxes).
   * CONSIDERACIÓN: Procesa el array de grupos, creando la estructura anidada: groupKey -> itemKey.
   */
  const collectChkData = (groups) => {
    let data = {};
    groups.forEach((group) => {
      // ✅ ANIDAMIENTO: Inicializa el objeto para la clave del grupo (e.g., 'hematologia')
      data[group.key] = {};

      group.items.forEach((item) => {
        const key = `${group.key}-${item.key}`;
        const checkbox = document.getElementById(`${key}-check`);

        let itemData = { disponible: checkbox ? checkbox.checked : false };

        if (item.isOther) {
          itemData.nombreEspec = document
            .getElementById(`${key}-nombre-especifico`)
            .value.trim();
        }
        // ✅ ANIDAMIENTO: Asigna el item bajo la clave del grupo
        data[group.key][item.key] = itemData;
      });
    });
    return data;
  };

  /**
   * 2. Recolecta todos los datos de la Sección V.
   * @returns {Object} Objeto con Imagenología, Laboratorio, Medicinas y Observaciones.
   */
  const collect = () => {
    return {
      // IMAGENOLOGÍA
      imagenologia: collectRadioTableData(
        "imagenologia",
        OTROS_SERVICIOS_DATA.imagenologia
      ),

      // LABORATORIO
      // Pasa el array de grupos para que collectChkData anide por 'group.key'
      laboratorio: collectChkData(OTROS_SERVICIOS_DATA.laboratorio),

      // FARMACIA
      // Pasa el array de grupos para que collectChkData anide por 'group.key'
      farmacia: collectChkData(OTROS_SERVICIOS_DATA.farmacia),

      // COCINA
      cocina: collectRadioTableData("cocina", OTROS_SERVICIOS_DATA.cocina),

      observaciones: document
        .getElementById("observaciones-otros-servicios")
        .value.trim(),
    };
  };

  /**
   * Precarga datos de tablas con Radio Buttons (Imagenología y Medicinas).
   */
  const preloadRadioTableData = (groupKey, items, savedData) => {
    if (!savedData) return;

    items.forEach((item) => {
      const key = `${groupKey}-${item.key}`;
      const itemData = savedData[item.key];

      if (itemData) {
        // Llenar el estado (Radio button)
        if (itemData.estado) {
          const radioElement = document.querySelector(
            `input[name="${key}-estado"][value="${itemData.estado}"]`
          );
          if (radioElement) {
            radioElement.checked = true;
          }
        }

        document.getElementById(`${key}-observacion`).value =
          itemData.observacion || "";

        if (item.isOther && itemData.nombreEspec) {
          document.getElementById(`${key}-nombre-especifico`).value =
            itemData.nombreEspec;
        }
      }
    });
  };

  /**
   * Precarga datos  (Checkboxes).
   */
  const preloadChkData = (area, savedData) => {
    if (!savedData) return;

    OTROS_SERVICIOS_DATA[area].forEach((group) => {
      // ✅ ANIDAMIENTO: Busca los datos usando la clave del grupo (e.g., data.laboratorio.hematologia)
      const groupData = savedData[group.key];

      if (groupData) {
        group.items.forEach((item) => {
          const key = `${group.key}-${item.key}`;
          const itemData = groupData[item.key]; // Accede al item dentro del grupo

          if (itemData) {
            const checkbox = document.getElementById(`${key}-check`);
            if (checkbox && itemData.disponible) {
              checkbox.checked = true;
            }

            if (item.isOther && itemData.nombreEspec) {
              document.getElementById(`${key}-nombre-especifico`).value =
                itemData.nombreEspec;
            }
          }
        });
      }
    });
  };

  /**
   * 3. Precarga los datos de la Sección V en los campos del formulario.
   * @param {Object} data - El sub-objeto de datos de 'otrosServicios' del registro JSON.
   */
  const preload = (data) => {
    if (!data) return;

    preloadRadioTableData(
      "imagenologia",
      OTROS_SERVICIOS_DATA.imagenologia,
      data.imagenologia
    );
    preloadChkData("laboratorio", data.laboratorio);
    preloadChkData("farmacia", data.farmacia);
    preloadRadioTableData("cocina", OTROS_SERVICIOS_DATA.cocina, data.cocina);

    document.getElementById("observaciones-otros-servicios").value =
      data.observaciones || "";
  };

  // Exponer las funciones públicas
  return {
    render,
    collect,
    preload,
  };
})();

export default SectionVModule;
