// section_V.js

import { CONDICIONES_INFRAESTRUCTURA, SERVICIOS_PUBLICOS } from "./data.js";

const SectionVModule = (() => {
  // Componentes a evaluar en las Condiciones de Infraestructura
  const COMPONENTES = ["paredes", "pisos", "techos", "aa"];
  // Opciones fijas para las condiciones
  const CONDICIONES_OPTIONS = ["BUENAS COND", "REGULAR COND", "MALAS COND"];

  /**
   * =================================================================
   * FUNCIONES DE RENDERIZADO INTERNAS (Sección V)
   * =================================================================
   */

  /**
   * Función para generar la tabla de Condiciones de Infraestructura.
   */
  const renderCondicionesInfraestructuraForm = () => {
    const tableBody = document.getElementById(
      "condiciones-infraestructura-body"
    );
    if (!tableBody) return;

    let html = "";

    CONDICIONES_INFRAESTRUCTURA.forEach((area) => {
      const key = area.key;
      let labelHTML = area.label;

      if (area.isOther) {
        // Campo de texto para especificar el nombre del área "Otro"
        labelHTML = `
                    <div class="input-group input-group-sm">
                        <span class="input-group-text">${area.label}</span>
                        <input type="text" class="form-control" id="${key}-nombre-especifico" placeholder="Especifique el área" aria-label="${key} name">
                    </div>
                `;
      }

      // Inicio de la fila para el área
      html += `<tr data-area-key="${key}"><td>${labelHTML}</td>`;

      // Campos de radio para cada componente (Paredes, Pisos, Techos, A/A)
      COMPONENTES.forEach((componente) => {
        html += "<td>";
        CONDICIONES_OPTIONS.forEach((condicion) => {
          const inputId = `${key}-${componente}-${condicion
            .replace(/\s/g, "")
            .toLowerCase()}`;
          const inputName = `${key}-${componente}`;

          html += `
                        <div class="form-check form-check-inline me-1">
                            <input class="form-check-input" type="radio" name="${inputName}" id="${inputId}" value="${condicion}">
                            <label class="form-check-label" for="${inputId}">${
            condicion.split(" ")[0]
          }</label>
                        </div>
                    `;
        });
        html += "</td>";
      });

      html += "</tr>";
    });

    tableBody.innerHTML = html;
  };

  /**
   * Función para generar la tabla de Servicios Públicos.
   */
  const renderServiciosPublicosForm = () => {
    const tableBody = document.getElementById("servicios-publicos-body");
    if (!tableBody) return;

    let html = "";

    SERVICIOS_PUBLICOS.forEach((servicio) => {
      const key = servicio.key;
      let labelHTML = servicio.label;

      if (servicio.isOther) {
        // Campo de texto para especificar el nombre del servicio "Otro"
        labelHTML = `
                    <div class="input-group input-group-sm">
                        <span class="input-group-text">${servicio.label}</span>
                        <input type="text" class="form-control" id="${key}-nombre-especifico" placeholder="Especifique el servicio" aria-label="${key} name">
                    </div>
                `;
      }

      html += `<tr data-service-key="${key}"><td>${labelHTML}</td>`;

      // Columna de Disponibilidad (Radio Buttons)
      html += '<td><div class="d-flex flex-wrap">';
      servicio.options.forEach((opt) => {
        const inputId = `${key}-${opt.value.replace(/\s/g, "").toLowerCase()}`;
        const inputName = `${key}-estado`;
        // Marcar "SIN SERVICIO" como checked por defecto si existe, excepto para Planta Eléctrica que usa "NO EXISTE"
        const defaultChecked =
          opt.value === "SIN SERVICIO" || opt.value === "NO EXISTE"
            ? "checked"
            : "";

        html += `
                    <div class="form-check form-check-inline me-3">
                        <input class="form-check-input" type="radio" name="${inputName}" id="${inputId}" value="${opt.value}" ${defaultChecked}>
                        <label class="form-check-label" for="${inputId}">${opt.value}</label>
                    </div>
                `;
      });
      html += "</div></td>";

      // Columna de Observación
      html += `<td><input type="text" class="form-control form-control-sm" id="${key}-observacion" placeholder="Observaciones"></td>`;

      html += "</tr>";
    });

    tableBody.innerHTML = html;
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
    renderCondicionesInfraestructuraForm();
    renderServiciosPublicosForm();
  };

  /**
   * Recolecta datos de Condiciones de Infraestructura (A).
   */
  const collectCondicionesInfraestructuraData = () => {
    let data = {};

    CONDICIONES_INFRAESTRUCTURA.forEach((area) => {
      const key = area.key;
      let areaData = {};

      COMPONENTES.forEach((componente) => {
        const selected = document.querySelector(
          `input[name="${key}-${componente}"]:checked`
        );
        areaData[componente] = selected ? selected.value : null;
      });

      if (area.isOther) {
        areaData.nombreEspec = document
          .getElementById(`${key}-nombre-especifico`)
          .value.trim();
      }
      data[key] = areaData;
    });
    return data;
  };

  /**
   * Recolecta datos de Servicios Públicos (B).
   */
  const collectServiciosPublicosData = () => {
    let data = {};

    SERVICIOS_PUBLICOS.forEach((servicio) => {
      const key = servicio.key;
      // Se asume "SIN SERVICIO" o "NO EXISTE" si no se selecciona nada
      const estadoElement = document.querySelector(
        `input[name="${key}-estado"]:checked`
      );
      const estado = estadoElement
        ? estadoElement.value
        : key === "plantaElectrica"
        ? "NO EXISTE"
        : "SIN SERVICIO";
      const observacion = document
        .getElementById(`${key}-observacion`)
        .value.trim();

      let servicioData = { estado: estado, observacion: observacion };

      if (servicio.isOther) {
        servicioData.nombreEspec = document
          .getElementById(`${key}-nombre-especifico`)
          .value.trim();
      }
      data[key] = servicioData;
    });
    return data;
  };

  /**
   * 2. Recolecta todos los datos de la Sección V.
   * @returns {Object} Objeto con condiciones, servicios públicos y observaciones.
   */
  const collect = () => {
    return {
      condiciones: collectCondicionesInfraestructuraData(),
      serviciosPublicos: collectServiciosPublicosData(),
      observaciones: document
        .getElementById("observaciones-infraestructura")
        .value.trim(),
    };
  };

  /**
   * Precarga datos de Condiciones de Infraestructura.
   */
  const preloadCondicionesInfraestructuraData = (savedData) => {
    if (!savedData) return;

    CONDICIONES_INFRAESTRUCTURA.forEach((area) => {
      const key = area.key;
      const areaData = savedData[key];

      if (areaData) {
        COMPONENTES.forEach((componente) => {
          const savedValue = areaData[componente];
          if (savedValue) {
            const inputId = `${key}-${componente}-${savedValue
              .replace(/\s/g, "")
              .toLowerCase()}`;
            const radioElement = document.getElementById(inputId);
            if (radioElement) {
              radioElement.checked = true;
            }
          }
        });

        if (area.isOther && areaData.nombreEspec) {
          document.getElementById(`${key}-nombre-especifico`).value =
            areaData.nombreEspec;
        }
      }
    });
  };

  /**
   * Precarga datos de Servicios Públicos.
   */
  const preloadServiciosPublicosData = (savedData) => {
    if (!savedData) return;

    SERVICIOS_PUBLICOS.forEach((servicio) => {
      const key = servicio.key;
      const servicioData = savedData[key];

      if (servicioData) {
        // Llenar el estado (Radio button)
        if (servicioData.estado) {
          const inputId = `${key}-${servicioData.estado
            .replace(/\s/g, "")
            .toLowerCase()}`;
          const radioElement = document.getElementById(inputId);
          if (radioElement) {
            radioElement.checked = true;
          }
        }

        // Llenar la observación
        document.getElementById(`${key}-observacion`).value =
          servicioData.observacion || "";

        if (servicio.isOther && servicioData.nombreEspec) {
          document.getElementById(`${key}-nombre-especifico`).value =
            servicioData.nombreEspec;
        }
      }
    });
  };

  /**
   * 3. Precarga los datos de la Sección V en los campos del formulario.
   * @param {Object} data - El sub-objeto de datos de 'infraestructura' del registro JSON.
   */
  const preload = (data) => {
    if (!data) return;

    preloadCondicionesInfraestructuraData(data.condiciones);
    preloadServiciosPublicosData(data.serviciosPublicos);
    document.getElementById("observaciones-infraestructura").value =
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
