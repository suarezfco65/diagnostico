// section_I.js

import {
  PARROQUIAS_CARACAS,
  TIPOS_INSTITUCION,
  ENTES_ADSCRITOS,
} from "./data.js";

const SectionIModule = (() => {
  /**
   * Función interna para renderizar el select de Parroquias.
   */
  const renderParroquiasSelect = () => {
    const select = document.getElementById("parroquia");
    if (!select) return;

    let htmlOptions =
      '<option value="" disabled selected>Seleccione una Parroquia</option>';
    PARROQUIAS_CARACAS.forEach((parroquia) => {
      htmlOptions += `<option value="${parroquia}">${parroquia}</option>`;
    });

    select.innerHTML = htmlOptions;
  };

  /**
   * Función interna para renderizar los radio buttons de Tipo de Institución
   * y el campo de texto para "Otro Tipo".
   */
  const renderTipoInstitucion = () => {
      const container = document.getElementById("tipo-institucion-container");
      if (!container) return;

      let html = "";
      TIPOS_INSTITUCION.forEach((tipo) => {
          const id = `tipo-${tipo.value.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
          // Asegúrate de que el radio de "Otros tipos" tenga el value 'OTRO_TIPO'
          html += `
              <div class="form-check form-check-inline">
                  <input class="form-check-input tipo-institucion-radio" type="radio" 
                        name="tipo-institucion" value="${tipo.value}" id="${id}">
                  <label class="form-check-label" for="${id}">${tipo.label}</label>
              </div>
          `;
      });
      
      // Campo de texto para "Otro Tipo" (inicialmente oculto)
      html += `
          <div id="otro-tipo-input-group" class="mt-2" style="display: none;">
              <label for="otro-tipo-institucion" class="form-label visually-hidden">Especifique Otro Tipo</label>
              <input type="text" class="form-control" id="otro-tipo-institucion" 
                    placeholder="Especifique cuál es el Otro Tipo de Institución" disabled>
          </div>
      `;
      container.innerHTML = html;
      
      // ❗ Añadir Listener para mostrar/ocultar el campo ❗
      document.querySelectorAll('.tipo-institucion-radio').forEach(radio => {
          radio.addEventListener('change', handleTipoInstitucionChange);
      });
  };

  /**
   * Nuevo handler para mostrar/ocultar el input de texto del Tipo Institución.
   */
  const handleTipoInstitucionChange = (event) => {
      const otroTipoGroup = document.getElementById("otro-tipo-input-group");
      const otroTipoInput = document.getElementById("otro-tipo-institucion");
      
      if (event.target.value === 'OTRO_TIPO') {
          otroTipoGroup.style.display = 'block';
          otroTipoInput.disabled = false;
          otroTipoInput.required = true;
      } else {
          otroTipoGroup.style.display = 'none';
          otroTipoInput.disabled = true;
          otroTipoInput.required = false;
          otroTipoInput.value = ''; // Limpiar el valor si se deselecciona
      }
  };

  /**
   * Nuevo handler para mostrar/ocultar el input de texto del Ente Adscrito.
   */
  const handleEnteAdscritoChange = (event) => {
      const otroEnteGroup = document.getElementById("otro-ente-input-group");
      const otroEnteInput = document.getElementById("otro-ente-adscrito");
      
      if (event.target.value === 'OTRO_ENTE') { // Usamos 'OTRO_ENTE' como clave de activación
          otroEnteGroup.style.display = 'block';
          otroEnteInput.disabled = false;
          otroEnteInput.required = true;
      } else {
          otroEnteGroup.style.display = 'none';
          otroEnteInput.disabled = true;
          otroEnteInput.required = false;
          otroEnteInput.value = ''; // Limpiar el valor si se deselecciona
      }
  };

  /**
   * Función interna para renderizar los radio buttons de Ente Adscrito.
   * (Añade la opción "Otro Ente" y el campo de texto condicional)
   */
  const renderEnteAdscrito = () => {
      const container = document.getElementById("ente-adscrito-container");
      if (!container) return;

      let html = "";
      // Asumiendo que ENTES_ADSCRITOS es un array de strings de data.js
      ENTES_ADSCRITOS.forEach((ente) => { 
          const id = `ente-${ente.value.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
          html += `
              <div class="form-check form-check-inline">
                  <input class="form-check-input ente-adscrito-radio" type="radio" 
                        name="ente-adscrito" value="${ente.value}" id="${id}" required>
                  <label class="form-check-label" for="${id}">${ente.label}</label>
              </div>
          `;
      });

      // 1. Opciones "Otro Ente"
      const otroEnteValue = 'OTRO_ENTE'; // Valor clave para el radio
      const otroEnteId = 'ente-otro-ente';
      html += `
          <div class="form-check form-check-inline">
              <input class="form-check-input ente-adscrito-radio" type="radio" 
                    name="ente-adscrito" value="${otroEnteValue}" id="${otroEnteId}" required>
              <label class="form-check-label" for="${otroEnteId}">Otro Ente (Especifique)</label>
          </div>
      `;

      // 2. Campo de texto para "Otro Ente" (inicialmente oculto)
      html += `
          <div id="otro-ente-input-group" class="mt-2" style="display: none;">
              <label for="otro-ente-adscrito" class="form-label visually-hidden">Especifique Otro Ente</label>
              <input type="text" class="form-control" id="otro-ente-adscrito" 
                    placeholder="Especifique cuál es el Otro Ente Adscrito" disabled>
          </div>
      `;

      container.innerHTML = html;
      
      // 3. Añadir Listener al grupo de radio buttons
      document.querySelectorAll('.ente-adscrito-radio').forEach(radio => {
          radio.addEventListener('change', handleEnteAdscritoChange);
      });
  };

  /**
   * Función interna para configurar el listener de previsualización de la foto.
   */
  const _setupPhotoPreview = () => {
    const input = document.getElementById("foto-fachada");
    const preview = document.getElementById("foto-fachada-preview");

    if (!input || !preview) return;

    input.addEventListener("change", function (event) {
      const file = event.target.files[0];

      if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
          preview.src = e.target.result;
          preview.classList.remove("d-none"); // Mostrar la imagen
        };

        // Lee el archivo como una URL de datos base64 para el atributo src
        reader.readAsDataURL(file);
      } else {
        preview.src = "#";
        preview.classList.add("d-none"); // Ocultar si no hay archivo
      }
    });
  };

  /**
   * 1. Renderiza los elementos dinámicos de la Sección I.
   */
  const render = () => {
    renderParroquiasSelect();
    renderTipoInstitucion(); // NUEVO
    renderEnteAdscrito(); // NUEVO
    // CONFIGURAR EL LISTENER DE PREVISUALIZACIÓN (NUEVO)
    _setupPhotoPreview();
  };

  /**
   * 2. Recolecta todos los datos de la Sección I.
   * (Esta función no necesita cambios, ya que los IDs de los inputs se mantienen).
   * @returns {Object} Un objeto con todos los campos de la Sección I.
   */
  const collect = () => {
    // Recolectar Tipo de Institución
    const tipoInstitucionRadio = document.querySelector('input[name="tipo-institucion"]:checked');
    let tipoInstitucionValue = tipoInstitucionRadio ? tipoInstitucionRadio.value : null;
    // ❗ Lógica para "Otro Tipo" ❗
    if (tipoInstitucionValue === 'OTRO_TIPO') {
        const otroTipoInput = document.getElementById("otro-tipo-institucion");
        // Guardar el valor del campo de texto
        tipoInstitucionValue = otroTipoInput ? otroTipoInput.value.trim().toUpperCase() : 'OTRO_TIPO'; 
    }

    // Recolectar Ente Adscrito
    const enteAdscritoRadio = document.querySelector('input[name="ente-adscrito"]:checked');
    let enteAdscritoValue = enteAdscritoRadio ? enteAdscritoRadio.value : null;
    // ❗ Lógica para "Otro Ente" ❗
    if (enteAdscritoValue === 'OTRO_ENTE') {
        const otroEnteInput = document.getElementById("otro-ente-adscrito");
        // Guardar el valor del campo de texto en mayúsculas
        enteAdscritoValue = otroEnteInput ? otroEnteInput.value.trim().toUpperCase() : 'OTRO_ENTE'; 
    }

    const fotoFachadaInput = document.getElementById("foto-fachada");
    const fotoFachadaFile =
      fotoFachadaInput.files.length > 0 ? fotoFachadaInput.files[0] : null;

    return {
      nombre: document.getElementById("nombre-institucion").value.trim(),
      parroquia: document.getElementById("parroquia").value,
      direccion: document.getElementById("direccion").value.trim(),
      tipoInstitucion: tipoInstitucionValue,
      enteAdscrito: enteAdscritoValue,

      // Geo-localización
      longitud: document.getElementById("longitud").value.trim(),
      latitud: document.getElementById("latitud").value.trim(),
      puntoReferencia: document.getElementById("punto-referencia").value.trim(),
      // Referencia del archivo (Objeto File o null)
      fotoFachada: fotoFachadaFile,
    };
  };

  /**
   * 3. Precarga los datos de la Sección I en los campos del formulario.
   * (Esta función no necesita cambios, ya que los IDs de los inputs se mantienen).
   * @param {Object} data - El sub-objeto de datos de 'datosInstitucion' del registro JSON.
   */
  const preload = (data) => {
    if (!data) return;

    // Campos de texto y select
    document.getElementById("nombre-institucion").value = data.nombre || "";
    document.getElementById("parroquia").value = data.parroquia || "";
    document.getElementById("direccion").value = data.direccion || "";
    document.getElementById("longitud").value = data.longitud || "";
    document.getElementById("latitud").value = data.latitud || "";
    document.getElementById("punto-referencia").value =
      data.puntoReferencia || "";

    // Limpiar campo de archivo y vista previa
    const fotoFachadaInput = document.getElementById("foto-fachada");
    const preview = document.getElementById("foto-fachada-preview");
    if (fotoFachadaInput) fotoFachadaInput.value = "";
    if (preview) {
      preview.src = "#";
      preview.classList.add("d-none");
    }

    // Radio buttons (Tipo Institución)
    const tipoGuardado = data.tipoInstitucion || null;
    const otroTipoInput = document.getElementById("otro-tipo-institucion");
    const otroTipoGroup = document.getElementById("otro-tipo-input-group");
    // 1. Resetear el campo "Otro Tipo"
    if (otroTipoInput && otroTipoGroup) {
        otroTipoInput.value = '';
        otroTipoGroup.style.display = 'none';
        otroTipoInput.disabled = true;
    }
    // 2. Buscar el radio button que coincide
    let radioTipo = document.querySelector(`input[name="tipo-institucion"][value="${tipoGuardado}"]`);
    // 3. Si el radio no se encuentra (significa que es un valor custom de "Otro Tipo")
    if (!radioTipo && tipoGuardado) {
        // Asumimos que es un valor custom de "Otro Tipo"
        radioTipo = document.querySelector(`input[name="tipo-institucion"][value="OTRO_TIPO"]`);
        if (radioTipo && otroTipoInput && otroTipoGroup) {
            // Marcar el radio "Otro Tipo" y mostrar/llenar el campo de texto
            radioTipo.checked = true;
            otroTipoInput.value = tipoGuardado; // Cargar el valor custom
            otroTipoGroup.style.display = 'block';
            otroTipoInput.disabled = false;
        }
    } else if (radioTipo) {
        // 4. Si el radio se encuentra (es un tipo predefinido)
        radioTipo.checked = true;
    }

    // Radio buttons (Ente Adscrito)
    const enteGuardado = data.enteAdscrito || null;
    const otroEnteInput = document.getElementById("otro-ente-adscrito");
    const otroEnteGroup = document.getElementById("otro-ente-input-group");
    // 1. Resetear el campo "Otro Ente"
    if (otroEnteInput && otroEnteGroup) {
        otroEnteInput.value = '';
        otroEnteGroup.style.display = 'none';
        otroEnteInput.disabled = true;
    }
    // 2. Buscar el radio button que coincide
    let radioEnte = document.querySelector(`input[name="ente-adscrito"][value="${enteGuardado}"]`);
    // 3. Si el radio no se encuentra (significa que es un valor custom de "Otro Ente")
    if (!radioEnte && enteGuardado) {
        // Asumimos que es un valor custom de "Otro Ente"
        radioEnte = document.querySelector(`input[name="ente-adscrito"][value="OTRO_ENTE"]`);
        if (radioEnte && otroEnteInput && otroEnteGroup) {
            // Marcar el radio "Otro Ente" y mostrar/llenar el campo de texto
            radioEnte.checked = true;
            otroEnteInput.value = enteGuardado; // Cargar el valor custom
            otroEnteGroup.style.display = 'block';
            otroEnteInput.disabled = false;
        }
    } else if (radioEnte) {
        // 4. Si el radio se encuentra (es un ente predefinido)
        radioEnte.checked = true;
    }

  };

  // Exponer las funciones públicas
  return {
    render,
    collect,
    preload,
  };
})();

export default SectionIModule;
