// section_I.js

import {
  PARROROQUIAS_CARACAS,
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
    PARROROQUIAS_CARACAS.forEach((parroquia) => {
      htmlOptions += `<option value="${parroquia}">${parroquia}</option>`;
    });

    select.innerHTML = htmlOptions;
  };

  /**
   * Función interna para renderizar los radio buttons de Tipo de Institución.
   */
  const renderTipoInstitucion = () => {
    const container = document.getElementById("tipo-institucion-container");
    if (!container) return;

    let html = "";
    TIPOS_INSTITUCION.forEach((tipo) => {
      const id = `tipo-${tipo.value.toLowerCase()}`;
      html += `
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="tipo-institucion" value="${tipo.value}" id="${id}">
                    <label class="form-check-label" for="${id}">${tipo.label}</label>
                </div>
            `;
    });
    container.innerHTML = html;
  };

  /**
   * Función interna para renderizar los checkboxes de Ente Adscrito.
   */
  const renderEnteAdscrito = () => {
    const container = document.getElementById("ente-adscrito-container");
    if (!container) return;

    let html = "";
    ENTES_ADSCRITOS.forEach((ente) => {
      const id = `ente-${ente.value.toLowerCase()}`;
      html += `
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="checkbox" name="ente-adscrito" value="${ente.value}" id="${id}">
                    <label class="form-check-label" for="${id}">${ente.label}</label>
                </div>
            `;
    });
    container.innerHTML = html;
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
    // Capturar los checkboxes de ENTE ADSCRITO
    const entesAdscritos = Array.from(
      document.querySelectorAll('input[name="ente-adscrito"]:checked')
    ).map((cb) => cb.value);

    const fotoFachadaInput = document.getElementById("foto-fachada");
    const fotoFachadaFile =
      fotoFachadaInput.files.length > 0 ? fotoFachadaInput.files[0] : null;

    return {
      nombre: document.getElementById("nombre-institucion").value.trim(),
      parroquia: document.getElementById("parroquia").value,
      direccion: document.getElementById("direccion").value.trim(),
      // El radio button se busca por name, lo cual es correcto.
      tipoInstitucion: document.querySelector(
        'input[name="tipo-institucion"]:checked'
      )
        ? document.querySelector('input[name="tipo-institucion"]:checked').value
        : "",
      enteAdscrito: entesAdscritos,

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
    if (data.tipoInstitucion) {
      const radioTipo = document.querySelector(
        `input[name="tipo-institucion"][value="${data.tipoInstitucion}"]`
      );
      if (radioTipo) radioTipo.checked = true;
    }

    // Checkboxes (Ente Adscrito)
    const entesGuardados = data.enteAdscrito || [];
    // Desmarcar todos primero
    document.querySelectorAll('input[name="ente-adscrito"]').forEach((cb) => {
      cb.checked = false;
    });
    // Marcar solo los guardados
    entesGuardados.forEach((ente) => {
      const checkbox = document.querySelector(
        `input[name="ente-adscrito"][value="${ente}"]`
      );
      if (checkbox) checkbox.checked = true;
    });
  };

  // Exponer las funciones públicas
  return {
    render,
    collect,
    preload,
  };
})();

export default SectionIModule;
