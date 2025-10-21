// section_III.js

import { SERVICIOS_MEDICOS } from "./data.js";

const SectionIIIModule = (() => {
  /**
   * Función interna para generar el HTML de la tabla de servicios médicos (Sección III).
   */
  const renderServiciosMedicosForm = () => {
    const tableBody = document.getElementById("servicios-medicos-body");
    if (!tableBody) return;

    let html = "";

    SERVICIOS_MEDICOS.forEach((servicio) => {
      const key = servicio.key;
      let labelHTML = servicio.label;

      // Si es un servicio "Otro", se añade un campo de texto para especificar el nombre
      if (servicio.isOther) {
        labelHTML = `
                    <div class="input-group input-group-sm">
                        <span class="input-group-text">${servicio.label}</span>
                        <input type="text" class="form-control" id="${key}-nombre-otro" placeholder="Especifique el servicio" aria-label="${key} name">
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
                    
                    <td><input type="text" class="form-control form-control-sm" id="${key}-observacion" placeholder="Día, Horario y Observaciones"></td>
                </tr>
            `;
    });

    tableBody.innerHTML = html;
  };

  /**
   * 1. Renderiza los elementos dinámicos de la Sección III.
   */
  const render = () => {
    renderServiciosMedicosForm();
  };

  /**
   * 2. Recolecta todos los datos de la Sección III (Servicios Médicos).
   * @returns {Object} Un objeto con los datos de cada servicio (estado, observación y nombre específico si es "Otro").
   */
  const collect = () => {
    let serviciosData = {};

    SERVICIOS_MEDICOS.forEach((servicio) => {
      const key = servicio.key;

      // 1. Obtener el estado seleccionado (radio button)
      const estadoElement = document.querySelector(
        `input[name="${key}-estado"]:checked`
      );
      const estado = estadoElement ? estadoElement.value : "NO EXISTE";

      // 2. Obtener la observación individual
      const observacion = document
        .getElementById(`${key}-observacion`)
        .value.trim();

      let servicioObj = {
        estado: estado,
        observacion: observacion,
        // Si es un servicio "Otro", el nombre es el que el usuario escribió
        nombreEspec: servicio.isOther
          ? document.getElementById(`${key}-nombre-otro`).value.trim()
          : servicio.label,
      };

      serviciosData[key] = servicioObj;
    });

    return serviciosData;
  };

  /**
   * 3. Precarga los datos de la Sección III en los campos del formulario.
   * @param {Object} data - El sub-objeto de datos de 'serviciosMedicos' del registro JSON.
   */
  const preload = (data) => {
    if (!data) return;

    SERVICIOS_MEDICOS.forEach((servicio) => {
      const key = servicio.key;
      const servicioData = data[key];

      if (servicioData) {
        // 1. Llenar el estado (Radio button)
        if (servicioData.estado) {
          const radioElement = document.querySelector(
            `input[name="${key}-estado"][value="${servicioData.estado}"]`
          );
          if (radioElement) {
            radioElement.checked = true;
          }
        }

        // 2. Llenar la observación
        document.getElementById(`${key}-observacion`).value =
          servicioData.observacion || "";

        // 3. Si es un servicio "Otro", llenar el nombre especificado
        if (servicio.isOther && servicioData.nombreEspec) {
          document.getElementById(`${key}-nombre-otro`).value =
            servicioData.nombreEspec;
        }
      }
    });
    // Nota: Se eliminó la precarga de observaciones generales de esta sección.
  };

  // Exponer las funciones públicas
  return {
    render,
    collect,
    preload,
  };
})();

export default SectionIIIModule;
