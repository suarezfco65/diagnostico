document.addEventListener("DOMContentLoaded", () => {
  const RIF_INPUT = document.getElementById("rif-input");
  const BUSCAR_BTN = document.getElementById("buscar-btn");
  const FORM = document.getElementById("diagnostico-form");
  const FORM_TITLE = document.getElementById("form-title");
  const SUBMIT_BTN = document.getElementById("submit-btn");
  const ALERT_MESSAGE = document.getElementById("alert-message");

  // Función de utilidad para manejar el almacenamiento (simulando una BD con LocalStorage)
  const STORAGE_KEY = "centrosDeSalud";

  function getStorage() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      console.error("Error al parsear LocalStorage:", e);
      return {};
    }
  }

  function saveStorage(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  // 1. Lógica principal de Búsqueda de RIF
  BUSCAR_BTN.addEventListener("click", () => {
    const RIF = RIF_INPUT.value.trim().toUpperCase();

    if (!RIF) {
      showAlert("Por favor, ingrese un RIF válido.", "alert-warning");
      return;
    }

    const data = getStorage();
    const centro = data[RIF];

    // 2. CASO: Centro de salud REGISTRADO (Modificación)
    if (centro) {
      showAlert(
        `Centro ${RIF} encontrado. Puede modificar los datos.`,
        "alert-info"
      );
      RIF_INPUT.disabled = true; // Bloquea el RIF
      FORM.classList.remove("d-none");
      FORM_TITLE.textContent = `Modificando: ${centro.datosInstitucion.nombre}`;
      SUBMIT_BTN.textContent = "Guardar Modificaciones";

      // Llenar el formulario con los datos existentes
      fillForm(centro);

      // 3. CASO: Centro de salud NO REGISTRADO (Nuevo)
    } else {
      showAlert(
        `RIF ${RIF} no encontrado. Complete el formulario para un nuevo registro.`,
        "alert-success"
      );
      RIF_INPUT.disabled = true; // Bloquea el RIF
      FORM.classList.remove("d-none");
      FORM_TITLE.textContent = `Nuevo Registro: RIF ${RIF}`;
      SUBMIT_BTN.textContent = "Registrar Centro";

      // Limpiar o resetear el formulario para el nuevo registro
      FORM.reset();
    }
  });

  // Función para mostrar alertas temporales
  function showAlert(message, type) {
    ALERT_MESSAGE.textContent = message;
    ALERT_MESSAGE.className = `alert ${type} d-block`;
    setTimeout(() => {
      ALERT_MESSAGE.classList.remove("d-block");
      ALERT_MESSAGE.classList.add("d-none");
    }, 5000);
  }

  // Función para llenar el formulario con datos JSON (Precarga)
  function fillForm(data) {
    // Ejemplo de llenado para la Sección I: Datos de la Institución
    document.getElementById("nombre-institucion").value =
      data.datosInstitucion.nombre || "";
    document.getElementById("parroquia").value =
      data.datosInstitucion.parroquia || "";

    // Ejemplo de llenado para la Sección II: Autoridades
    document.getElementById("director-nombre").value =
      data.autoridades.director.nombre || "";
    document.getElementById("director-celular").value =
      data.autoridades.director.celular || "";
    document.getElementById("director-correo").value =
      data.autoridades.director.correo || "";
    document.getElementById("observaciones-autoridades").value =
      data.autoridades.observaciones || "";

    // El resto de la lógica de llenado para las demás secciones (III, IV, V, VI)
    // requeriría iterar sobre campos de radio/checkbox y select.
  }

  // 4. Lógica de Envío del Formulario (Almacenamiento JSON)
  FORM.addEventListener("submit", (e) => {
    e.preventDefault();
    const RIF = RIF_INPUT.value.trim().toUpperCase();

    // Recopilar todos los datos del formulario en un objeto estructurado
    const formData = {
      rif: RIF,
      fechaRegistro: new Date().toISOString(),
      // I. Datos de la Institución
      datosInstitucion: {
        nombre: document.getElementById("nombre-institucion").value,
        parroquia: document.getElementById("parroquia").value,
        // ...otros campos de la Sección I
      },
      // II. Autoridades
      autoridades: {
        director: {
          nombre: document.getElementById("director-nombre").value,
          celular: document.getElementById("director-celular").value,
          correo: document.getElementById("director-correo").value,
        },
        observaciones: document.getElementById("observaciones-autoridades")
          .value,
        // ...otros campos de la Sección II
      },
      // III. Servicios Médicos (Ejemplo de cómo capturar radios)
      serviciosMedicos: {
        cardiologia: {
          estado:
            document.querySelector('input[name="cardiologia"]:checked')
              ?.value || "NO EXISTE",
          observacion: document.querySelector('input[name="cardiologia-obs"]')
            .value,
        },
        // ...otros servicios
      },
      // IV. Otros Servicios, V. Infraestructura, VI. Proyectos, VII. Observaciones Generales
      // ... (Se debe agregar la lógica de recolección para todas las secciones)
      observacionesGenerales: document.getElementById("observaciones-generales")
        .value,
    };

    // Almacenar el objeto JSON
    const allData = getStorage();
    allData[RIF] = formData;
    saveStorage(allData);

    // Feedback al usuario y reseteo
    showAlert(`Datos del RIF ${RIF} guardados exitosamente.`, "alert-success");

    // Resetear la interfaz para un nuevo ciclo
    FORM.classList.add("d-none");
    FORM.reset();
    RIF_INPUT.value = "";
    RIF_INPUT.disabled = false;
    FORM_TITLE.textContent = "Buscar o Registrar Centro de Salud";
  });
});
