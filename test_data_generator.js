// test_data_generator.js

import * as Storage from "./storage.js";
import {
  PARROQUIAS_CARACAS,
  TIPOS_INSTITUCION,
  ENTES_ADSCRITOS,
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

const ESTADOS_SERVICIO = [
  "ACTIVO",
  "ACTIVO C/PROBLEMAS",
  "INACTIVO",
  "NO EXISTE",
];
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

function generateRandomIdNumber() {
  return Math.floor(10000000 + Math.random() * 90000000); // 8 dígitos
}

/**
 * Selecciona un Tipo de Institución al azar, excluyendo explícitamente la opción "OTRO_TIPO".
 * Asume que TIPOS_INSTITUCION es un array de objetos {value, label}.
 */
function getRandomSafeTipoInstitucion() {
    // 1. Filtrar el array para excluir el objeto con value: 'OTRO_TIPO'
    const safeTipos = TIPOS_INSTITUCION.filter(tipo => tipo.value !== 'OTRO_TIPO');

    // 2. Mapear para obtener solo los valores (strings)
    const safeValues = safeTipos.map(tipo => tipo.value);
    
    // 3. Seleccionar uno al azar
    return getRandomItem(safeValues);
}

/**
 * Selecciona un Ente Adscrito al azar, excluyendo explícitamente el valor 'OTRO_ENTE'.
 * Asume que ENTES_ADSCRITOS es un array de strings.
 */
function getRandomSafeEnteAdscrito() {
    // Si ENTES_ADSCRITOS contiene 'OTRO_ENTE', lo filtra.
    const safeEntes = ENTES_ADSCRITOS.filter(ente => ente.value !== 'OTRO_ENTE');
    return getRandomItem(safeEntes);
}

/**
 * Genera un objeto de datos de diagnóstico simulado para un centro.
 * La estructura debe coincidir con el esquema JSON de tu aplicación.
 */
function generateRandomData() {
  // 1. Clave (RIF o CI)
  const isRIF = Math.random() > 0.3; // 70% RIF, 30% CI
  const prefix = isRIF
    ? getRandomItem(["J", "G", "E"])
    : getRandomItem(["V", "E"]);
  const idNumber = generateRandomIdNumber();
  const key = `${prefix}-${idNumber}`;
  const idType = isRIF ? "RIF" : "CI";

  // 2. Sección I: Datos de la Institución
  const randomParroquia = getRandomItem(PARROQUIAS_CARACAS);
  const tipoInstitucion = getRandomSafeTipoInstitucion();
  const enteAdscrito = getRandomSafeEnteAdscrito();

  // 3. Sección II: Autoridades (Simulación)
  const randomName = getRandomItem(NOMBRES_PERSONAS);
  const randomLastName = getRandomItem(NOMBRES_PERSONAS);

  // 4. Sección III: Servicios Médicos (Simulación)
  const serviciosMedicos = {
    cardiologia: getRandomItem(ESTADOS_SERVICIO),
    ginecologia: getRandomItem(ESTADOS_SERVICIO),
    traumatologia: getRandomItem(ESTADOS_SERVICIO),
  };

  // 5. Sección V: Infraestructura (Simulación)
  const infraestructura = {
    condiciones: {
      consultorios: {
        operativo: Math.random() > 0.1 ? "SI" : "NO",
        estadoInfraestructura: getRandomItem(["BUENO", "REGULAR", "MALO"]),
      },
    },
    serviciosPublicos: {
      agua: Math.random() > 0.2 ? "DISPONIBLE" : "SIN SERVICIO",
    },
  };

  // Objeto Final (Coincide con la estructura de guardado de main.js)
  return {
    // Metadata
    identificador: key,
    tipoIdentificador: idType,
    fechaRegistro: new Date().toISOString(),

    // Secciones
    datosInstitucion: {
      nombre: `${getRandomItem(NOMBRES_INSTITUCION)} - ${randomParroquia}`,
      parroquia: randomParroquia,
      direccion: `Calle Principal N° ${idNumber}`,
      tipoInstitucion: tipoInstitucion,
      enteAdscrito: enteAdscrito,
      longitud: (Math.random() * 1.5 - 67).toFixed(6), // Coord. de Caracas
      latitud: (Math.random() * 0.5 + 10).toFixed(6),
      puntoReferencia: `Frente al Banco ${idNumber}`,
      fotoFachada: null,
    },
    autoridades: {
      director: {
        nombre: randomName,
        apellido: randomLastName,
        celular: `412-${Math.floor(1000000 + Math.random() * 9000000)}`,
        correo: `${randomName.toLowerCase()}.${idNumber}@salud.ve`,
      },
    },
    serviciosMedicos: serviciosMedicos,
    otrosServicios: {},
    infraestructura: infraestructura,
    proyectos: {},
  };
}

/**
 * Función principal para limpiar el localStorage y generar los datos de prueba.
 */
function runDataGeneration(count) {
  const allData = {};
  const startTime = performance.now();

  // 1. Limpiar el almacenamiento (Paso crucial)
  Storage.saveStorage({});

  // 2. Generar y almacenar los datos
  for (let i = 0; i < count; i++) {
    const centerData = generateRandomData();
    // Usar el identificador generado como clave de almacenamiento
    allData[centerData.identificador] = centerData;
  }

  Storage.saveStorage(allData);

  const endTime = performance.now();
  const duration = (endTime - startTime).toFixed(2);

  return { count: Object.keys(allData).length, duration };
}

// =================================================================
// INICIALIZACIÓN
// =================================================================

document.addEventListener("DOMContentLoaded", () => {
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
            "Error: Las constantes de datos (PARROQUIAS_CARACAS, TIPOS_INSTITUCION, ENTES_ADSCRITOS) no se cargaron correctamente desde data.js. Asegure la exportación con 'export const'."
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
});
