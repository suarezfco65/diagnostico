// test_data_generator.js

import * as Storage from "./storage.js";
import Auth from "./auth.js"; // Importar Auth para cerrar sesión

// -----------------------------------------------------------------
// 1. IMPORTAR CONSTANTES ACTUALIZADAS DE data.js
// -----------------------------------------------------------------
import {
  PARROQUIAS_CARACAS,
  TIPOS_INSTITUCION,
  ENTES_ADSCRITOS,
  CARGOS_AUTORIDADES,
  PERSONAL_INSTITUCION,
  SERVICIOS_MEDICOS,
  OTROS_SERVICIOS_DATA, // ❗ USADO EN LA SECCIÓN V ❗
  CONDICIONES_INFRAESTRUCTURA,
  SERVICIOS_PUBLICOS,
  PROYECTOS_DATA,
} from "./data.js";

// =================================================================
// DATOS DE SIMULACIÓN (Ejemplos)
// =================================================================

const NOMBRES_INSTITUCION = [
  "CDI Los Próceres",
  "Hospital Periférico",
  "Ambulatorio Petare",
  "Clínica El Sol",
  "Modulo de Salud Chacao",
  "Hospital Universitario",
  "CDI El Valle",
  "Ambulatorio Las Mercedes",
  "Clínica San Juan",
  "Modulo de Salud Coche",
];

// Opciones de estado usadas en varias secciones (IV, V, VI)
const ESTADOS_SERVICIO = ["ACTIVO", "ACTIVO C/PROB", "INACTIVO", "NO EXISTE"];

// Opciones de condición de infraestructura (VI)
const CONDICIONES_OPTIONS = ["BUENAS COND", "REGULAR COND", "MALAS COND"];

const NOMBRES_PERSONAS = [
  "Ramirez",
  "Lopez",
  "Perez",
  "Gomez",
  "Blanco",
  "Mora",
];

// =================================================================
// FUNCIONES UTILITARIAS
// =================================================================

function getRandomItem(arr) {
  if (!arr || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Genera un número de RIF o Cédula aleatorio con el prefijo correcto.
 * @returns {string} El identificador completo (Ej: "J-12345678").
 */
function generateRandomIdNumber() {
  // Opciones de prefijos para RIF
  const RIF_PREFIXES = ["J", "G", "E"];
  // Opciones de prefijos para Cédula
  const CEDULA_PREFIXES = ["V", "E"];

  // Seleccionar aleatoriamente si será RIF o Cédula (50% de probabilidad)
  const isRif = Math.random() < 0.5;

  let prefix;
  if (isRif) {
    prefix = getRandomItem(RIF_PREFIXES);
  } else {
    prefix = getRandomItem(CEDULA_PREFIXES);
  }

  // Generar 8 dígitos aleatorios
  const number = Math.floor(10000000 + Math.random() * 90000000); // 8 dígitos

  // Formatear: RIF con guion (Ej: J-12345678) o Cédula sin guion (Ej: V12345678)
  return `${prefix}-${number}`;
}

// =================================================================
// FUNCIONES DE GENERACIÓN POR SECCIÓN
// =================================================================

/**
 * Genera datos de simulación para la Sección I (datosInstitucion).
 */
function createSectionIData(nombre) {
  const tipo = getRandomItem(TIPOS_INSTITUCION);
  let tipoInstitucion = tipo.value;
  // Simular el caso OTRO_TIPO (30% de probabilidad)
  if (tipo.value === "OTRO_TIPO" && Math.random() < 0.3) {
    tipoInstitucion = "HOSPITAL DE EMERGENCIAS";
  }

  const ente = getRandomItem(ENTES_ADSCRITOS);
  let enteAdscrito = ente.value;
  // Simular el caso OTRO_ENTE (30% de probabilidad)
  if (ente.value === "OTRO_ENTE" && Math.random() < 0.3) {
    enteAdscrito = "FUERZA ARMADA NACIONAL";
  }

  return {
    nombre: nombre,
    municipio: "Libertador",
    parroquia: getRandomItem(PARROQUIAS_CARACAS),
    direccion: `Av. Principal, Edificio ${Math.floor(Math.random() * 100)}`,
    longitud: ((-66.9 + Math.random() * 0.1) * 100000).toFixed(6),
    latitud: ((10.5 + Math.random() * 0.1) * 100000).toFixed(6),
    puntoReferencia: "Cerca de la plaza",
    tipoInstitucion: tipoInstitucion,
    enteAdscrito: enteAdscrito,
    fotoFachada: `base64_simulada_${nombre.replace(/\s/g, "_")}`,
  };
}

/**
 * Genera datos de simulación para la Sección II (autoridades).
 */
function createSectionIIData() {
  const data = {};

  CARGOS_AUTORIDADES.forEach((cargo) => {
    const key = cargo.key;
    data[key] = {
      nombre: `${getRandomItem(NOMBRES_PERSONAS)} ${getRandomItem(
        NOMBRES_PERSONAS
      )}`,
      celular: `0412-${Math.floor(1000000 + Math.random() * 9000000)}`,
      correo: `${key}${Math.floor(Math.random() * 100)}@salud.gob.ve`,
    };
  });

  data.observaciones = getRandomItem([
    "",
    "Autoridades rotando",
    "Pendiente actualizar correo del director",
  ]);

  return data;
}

/**
 * Genera datos de simulación para la Sección III (personalInstitucion).
 * ESTRUCTURA: {key: {requerido, disponible, observacion, nombreEspec}}
 */
function createSectionIIIData() {
  const data = {};

  PERSONAL_INSTITUCION.forEach((area) => {
    data[area.key] = {};
    area.items.forEach((personal) => {
      const key = personal.key;
      const requerido = Math.floor(Math.random() * 16);
      const disponible = Math.floor(Math.random() * (requerido + 1));
      const observacion = getRandomItem([
        "",
        "Requiere aumento",
        "Personal completo",
      ]);
      let nombreEspec = "";

      // Simular el campo 'Otro' (30% de probabilidad)
      if (personal.isOther && Math.random() < 0.3) {
        nombreEspec = "Fisioterapeutas";
      }

      data[area.key][key] = {
        requerido: requerido,
        disponible: disponible,
        observacion: observacion,
        nombreEspec: nombreEspec,
      };
    });
  });

  return data;
}

/**
 * Genera datos de simulación para la Sección IV (serviciosMedicos).
 * ESTRUCTURA: {key: {estado, observacion, nombreEspec}}
 */
function createSectionIVData() {
  const data = {};

  SERVICIOS_MEDICOS.forEach((servicio) => {
    const key = servicio.key;
    // Usamos ACTIVO/INACTIVO, etc. de ESTADOS_SERVICIO
    const estado = getRandomItem(ESTADOS_SERVICIO.slice(0, 4));
    let observacion = "";
    let nombreEspec = "";

    // Lógica para asignar observaciones según el estado
    if (estado === "ACTIVO") {
      observacion = "Días y Horarios: " + getConsultationDaysAndHours();
    } else {
      observacion = "Inactivo: " + getInactiveReason();
    }

    // Simular el campo 'Otro'
    if (servicio.isOther) {
      nombreEspec = "OFTALMOLOGÍA";
    }

    data[key] = {
      estado: estado,
      observacion: observacion,
      nombreEspec: nombreEspec,
    };
  });

  return data;
}

// Función para obtener días y horarios de consulta al azar
function getConsultationDaysAndHours() {
  const daysOfWeek = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];
  const hours = [
    "9:00 - 12:00",
    "14:00 - 17:00",
    "10:00 - 13:00",
    "15:00 - 18:00",
  ];

  // Seleccionar días al azar
  const selectedDays = getRandomItems(
    daysOfWeek,
    Math.floor(Math.random() * daysOfWeek.length) + 1
  );
  // Seleccionar horarios al azar
  const selectedHours = getRandomItems(
    hours,
    Math.floor(Math.random() * hours.length) + 1
  );

  return selectedDays.join(", ") + " | Horarios: " + selectedHours.join(", ");
}

// Función para obtener una cantidad aleatoria de elementos de un array
function getRandomItems(array, count) {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Función para obtener la razón por la cual un servicio está inactivo
function getInactiveReason() {
  const reasons = [
    "Requiere mantenimiento",
    "Sin insumos",
    "Problemas técnicos",
    "No disponible temporalmente",
  ];
  return getRandomItem(reasons);
}

/**
 * Genera datos de simulación para la Sección V (otrosServicios).
 */
/*
function createSectionVData() {
  const data = {
    observaciones: getRandomItem([
      "",
      "Todos los servicios requieren insumos",
      "Laboratorio inactivo",
    ]),
  };

  // Grupos con Radio Buttons (Imagenologia y Cocina)
  const radioGroups = ["imagenologia", "cocina"];
  radioGroups.forEach((groupName) => {
    data[groupName] = {};

    // ❗ CORRECCIÓN: Usar Array.isArray para evitar TypeError ❗
    const groupsToIterate = OTROS_SERVICIOS_DATA[groupName];

    if (Array.isArray(groupsToIterate)) {
      groupsToIterate.forEach((group) => {
        data[groupName][group.key] = {};

        // ❗ VERIFICACIÓN DE ESTRUCTURA INTERNA ❗
        if (Array.isArray(group.items)) {
          group.items.forEach((item) => {
            const estado = getRandomItem(ESTADOS_SERVICIO.slice(0, 3));
            let nombreEspec = "";

            if (item.isOther && Math.random() < 0.3) {
              nombreEspec =
                groupName === "imagenologia"
                  ? "Tomografía Avanzada"
                  : "Panadería";
            }

            data[groupName][group.key][item.key] = {
              estado: estado,
              observacion: getRandomItem([
                "OK",
                "Requiere mantenimiento",
                "Fuera de servicio",
                "",
              ]),
              nombreEspec: nombreEspec,
            };
          });
        }
      });
    } else {
      console.warn(
        `[Data Test Generator] OTROS_SERVICIOS_DATA.${groupName} no está definido o no es un array.`
      );
    }
  });

  // Grupos con Checkboxes (Laboratorio y Farmacia)
  const checkGroups = ["laboratorio", "farmacia"];
  checkGroups.forEach((groupName) => {
    data[groupName] = {};

    // ❗ CORRECCIÓN: Usar Array.isArray para evitar TypeError ❗
    const groupsToIterate = OTROS_SERVICIOS_DATA[groupName];

    if (Array.isArray(groupsToIterate)) {
      groupsToIterate.forEach((group) => {
        // ❗ VERIFICACIÓN DE ESTRUCTURA INTERNA ❗
        if (Array.isArray(group.items)) {
          group.items.forEach((item) => {
            const disponible = Math.random() > 0.5;
            let nombreEspec = "";

            if (item.isOther && Math.random() < 0.3) {
              nombreEspec =
                groupName === "laboratorio"
                  ? "Hematología Especial"
                  : "Medicamentos Controlados";
            }

            data[groupName][item.key] = {
              disponible: disponible,
              nombreEspec: nombreEspec,
            };
          });
        }
      });
    } else {
      console.warn(
        `[Data Test Generator] OTROS_SERVICIOS_DATA.${groupName} no está definido o no es un array.`
      );
    }
  });

  return data;
}
*/



/**
 * Genera datos de simulación para la Sección V (otrosServicios).
 */
function createSectionVData() {
  const data = {
    observaciones: getRandomItem([
      "",
      "Todos los servicios requieren insumos",
      "Laboratorio inactivo",
    ]),
  };

  // Grupos con Radio Buttons (Imagenologia y Cocina)
  const radioGroups = ["imagenologia", "cocina"];
  radioGroups.forEach((groupName) => {
    data[groupName] = {};

    // ❗ CORRECCIÓN INICIADA AQUÍ ❗
    const itemsToIterate = OTROS_SERVICIOS_DATA[groupName]; // Asume que esto es un array de items (ej: radiografia, mamografia)

    if (Array.isArray(itemsToIterate)) {
      itemsToIterate.forEach((item) => { // Iterar directamente sobre los ítems
        const estado = getRandomItem(ESTADOS_SERVICIO.slice(0, 3));
        let nombreEspec = "";

        if (item.isOther && Math.random() < 0.3) {
          nombreEspec =
            groupName === "imagenologia"
              ? "Tomografía Avanzada"
              : "Panadería";
        }

        // Asignar directamente al objeto del grupo usando la clave del ítem
        data[groupName][item.key] = { // 👈 CORRECCIÓN: Usar item.key directamente. Se elimina group.key
          estado: estado,
          observacion: getRandomItem([
            "OK",
            "Requiere mantenimiento",
            "Fuera de servicio",
            "",
          ]),
          nombreEspec: nombreEspec,
        };
      });
    } else {
      console.warn(
        `[Data Test Generator] OTROS_SERVICIOS_DATA.${groupName} no está definido o no es un array.`
      );
    }
    // ❗ CORRECCIÓN FINALIZADA AQUÍ ❗
  });

  // Grupos con Checkboxes (Laboratorio y Farmacia) - Esta sección parece estar bien estructurada para la salida
  const checkGroups = ["laboratorio", "farmacia"];
  checkGroups.forEach((groupName) => {
    data[groupName] = {};

    // ❗ CORRECCIÓN: Usar Array.isArray para evitar TypeError ❗
    const groupsToIterate = OTROS_SERVICIOS_DATA[groupName];

    if (Array.isArray(groupsToIterate)) {
      groupsToIterate.forEach((group) => {
        // ❗ VERIFICACIÓN DE ESTRUCTURA INTERNA ❗
        if (Array.isArray(group.items)) {
          group.items.forEach((item) => {
            const disponible = Math.random() > 0.5;
            let nombreEspec = "";

            if (item.isOther && Math.random() < 0.3) {
              nombreEspec =
                groupName === "laboratorio"
                  ? "Hematología Especial"
                  : "Medicamentos Controlados";
            }

            data[groupName][item.key] = {
              disponible: disponible,
              nombreEspec: nombreEspec,
            };
          });
        }
      });
    } else {
      console.warn(
        `[Data Test Generator] OTROS_SERVICIOS_DATA.${groupName} no está definido o no es un array.`
      );
    }
  });

  return data;
}



/**
 * Genera datos de simulación para la Sección VI (infraestructura).
 */
function createSectionVIData() {
  const condicionesData = {};
  const serviciosPublicosData = {};

  // 1. Condiciones de Infraestructura
  CONDICIONES_INFRAESTRUCTURA.forEach((area) => {
    const key = area.key;
    let nombreEspec = "";

    if (area.isOther && Math.random() < 0.3) {
      nombreEspec = "Ascensores";
    }

    condicionesData[key] = {
      paredes: getRandomItem(CONDICIONES_OPTIONS),
      pisos: getRandomItem(CONDICIONES_OPTIONS),
      techos: getRandomItem(CONDICIONES_OPTIONS),
      aa: getRandomItem(CONDICIONES_OPTIONS),
      observacion: getRandomItem([
        "OK",
        "Necesita pintura",
        "Fuga de agua en techo",
        "",
      ]),
      nombreEspec: nombreEspec,
    };
  });

  // 2. Servicios Públicos
  SERVICIOS_PUBLICOS.forEach((servicio) => {
    const key = servicio.key;
    const estado = getRandomItem(servicio.options.map((o) => o.value)); // Usar opciones de data.js
    let nombreEspec = "";

    if (servicio.isOther && Math.random() < 0.3) {
      nombreEspec = key === "combustible" ? "Gasolina" : "Otro Servicio";
    }

    serviciosPublicosData[key] = {
      estado: estado,
      observacion: getRandomItem([
        "Fluido constante",
        "Cortes diarios",
        "No tiene",
        "",
      ]),
      nombreEspec: nombreEspec,
    };
  });

  return {
    condiciones: condicionesData,
    serviciosPublicos: serviciosPublicosData,
    observaciones: getRandomItem([
      "",
      "Falla grave de electricidad",
      "Falta de ventilación en general",
    ]),
  };
}

// test_data_generator.js (Función corregida)

/**
 * Genera datos de simulación para la Sección VII (proyectos)
 * ESTRUCTURA: {categoriaKey: [proyectosArray], observacionesGenerales: string}
 */
function createSectionVIIData() {
  const proyectosData = {};

  // Función para simular entre 0 y 3 proyectos por categoría
  const generateProyectosArray = (placeholder) => {
    const count = Math.floor(Math.random() * 4); // 0 a 3 proyectos
    const array = [];
    // Usamos el placeholder como base para simular una descripción de proyecto
    const baseDesc = placeholder.split(":")[0].trim().replace(/\.$/, "");
    for (let i = 0; i < count; i++) {
      array.push(`${baseDesc} (Fase ${i + 1})`);
    }
    return array;
  };

  PROYECTOS_DATA.forEach((categoria) => {
    proyectosData[categoria.key] = generateProyectosArray(
      categoria.placeholder
    );
  });

  // ❗ CORRECCIÓN: Generar un valor aleatorio para las Observaciones Generales. ❗
  // Se elimina la lectura del DOM (`document.getElementById`).
  proyectosData.observacionesGenerales = getRandomItem([
    "Ninguna observación adicional.",
    "Se recomienda hacer seguimiento al proyecto de quirófanos.",
    "El personal brigadista necesita capacitación en el uso del sistema.",
    "El diagnóstico es un reflejo fiel de la situación actual.",
    "", // Opción de observación vacía
  ]);

  return proyectosData;
}

// ... (El resto del archivo permanece igual)
// =================================================================
// FUNCIÓN PRINCIPAL DE GENERACIÓN
// =================================================================

function createCenterData(index) {
  const identificador = generateRandomIdNumber();
  const nombre = getRandomItem(NOMBRES_INSTITUCION);

  return {
    // -------------------------------------------------------------
    // METADATA
    // -------------------------------------------------------------
    identificador: identificador,
    version: "2024.2_Actualizado", // Nueva versión para reflejar la estructura
    fechaRegistro: new Date().toISOString(),

    // -------------------------------------------------------------
    // SECCIONES DE LA FICHA DE DIAGNÓSTICO
    // -------------------------------------------------------------
    datosInstitucion: createSectionIData(nombre), // Sec I
    autoridades: createSectionIIData(), // Sec II
    personalInstitucion: createSectionIIIData(), // Sec III
    serviciosMedicos: createSectionIVData(), // Sec IV
    otrosServicios: createSectionVData(), // Sec V
    infraestructura: createSectionVIData(), // Sec VI
    proyectos: createSectionVIIData(), // Sec VII (Proyectos + Obs. Generales)
  };
}

/**
 * Ejecuta la generación de datos.
 */
function runDataGeneration(count) {
  const startTime = performance.now();
  const centers = [];

  // Borrar todos los datos existentes y cerrar sesión
  Storage.deleteStorage("siscomres_diagnostico_data");
  Auth.logout(); // Limpieza de la sesión de usuario actual

  for (let i = 0; i < count; i++) {
    const centerData = createCenterData(i + 1);
    centers.push(centerData);
  }

  // Guardar los nuevos datos en localStorage
  Storage.saveStorage(centers, "siscomres_diagnostico_data");

  const endTime = performance.now();
  return {
    count: centers.length,
    duration: (endTime - startTime).toFixed(2),
  };
}

// =================================================================
// INICIALIZACIÓN (Manejo de la Interfaz)
// =================================================================

const GeneratorModule = (() => {
  const generateBtn = document.getElementById("generate-btn");
  const statusMessage = document.getElementById("status-message");
  const spinner = document.getElementById("spinner");

  if (!generateBtn) return;

  generateBtn.addEventListener("click", () => {
    spinner.classList.remove("d-none");
    generateBtn.disabled = true;
    statusMessage.innerHTML = `<div class="alert alert-info">Generando ${150} centros... Por favor, espere.</div>`;

    setTimeout(() => {
      try {
        // Verificar que las constantes de data.js se hayan cargado
        if (!PARROQUIAS_CARACAS || !TIPOS_INSTITUCION || !ENTES_ADSCRITOS) {
          throw new Error(
            "Error: Las constantes de datos no se cargaron correctamente desde data.js. Asegure la exportación con 'export const'."
          );
        }

        const result = runDataGeneration(150);

        statusMessage.innerHTML = `
                    <div class="alert alert-success">
                        ✅ Generación Exitosa. Se crearon **${result.count}** registros de centros en ${result.duration} ms.
                    </div>
                `;
      } catch (error) {
        statusMessage.innerHTML = `
                    <div class="alert alert-danger">
                        ❌ Error en la generación: ${error.message}
                    </div>
                `;
        console.error(error);
      } finally {
        spinner.classList.add("d-none");
        generateBtn.disabled = false;
      }
    }, 50);
  });
})();
