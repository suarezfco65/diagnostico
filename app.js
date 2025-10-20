// Lista de Parroquias de Caracas
const PARROQUIAS_CARACAS = [
    "Altagracia", "Antímano", "Caricuao", "Coche", "El Junquito", 
    "El Paraíso", "El Recreo", "El Valle", "La Pastora", "La Vega", 
    "Macarao", "San Bernardino", "San José", "San Pedro", "Sucre", 
    "23 de Enero", "La Candelaria", "Catedral", "San Agustín", "San Juan", 
    "Santa Rosalía", "Santa Teresa"
];

// Función para generar las opciones del select de Parroquias
function renderParroquiasSelect() {
    const select = document.getElementById('parroquia');
    if (!select) return;

    let htmlOptions = '<option value="" disabled selected>Seleccione una Parroquia</option>';
    PARROQUIAS_CARACAS.forEach(parroquia => {
        htmlOptions += `<option value="${parroquia}">${parroquia}</option>`;
    });

    select.innerHTML = htmlOptions;
}
// Array con la definición de los cargos y las claves que usarán en el JSON
const CARGOS_AUTORIDADES = [
    { label: "Director(a)", key: "director" },
    { label: "Sub-Director(a)", key: "subDirector" },
    { label: "Jefe de Servicios Médicos", key: "jefeServiciosMedicos" },
    { label: "Jefe de Mantenimiento", key: "jefeMantenimiento" },
    { label: "Enlace Institucional", key: "enlaceInstitucional" }
];

// Función para generar el HTML de la sección II
function renderAutoridadesForm() {
    const container = document.getElementById('autoridades-container');
    let html = '';

    CARGOS_AUTORIDADES.forEach(cargo => {
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
}

// Array con la lista de servicios médicos del documento PDF y los "Otros"
const SERVICIOS_MEDICOS = [
    { label: "CARDIOLOGÍA", key: "cardiologia" },
    { label: "ENDOCRINOLOGÍA", key: "endocrinologia" },
    { label: "TRAUMATOLOGÍA", key: "traumatologia" },
    { label: "NEUMONOLOGÍA", key: "neumonologia" },
    { label: "GASTROENTEROLOGÍA", key: "gastroenterologia" },
    { label: "PEDIATRÍA", key: "pediatria" },
    { label: "GINECO-OBSTETRICIA", key: "ginecoObstetricia" },
    { label: "ONCOLOGÍA", key: "oncologia" },
    { label: "NEFROLOGÍA", key: "nefrologia" },
    { label: "ODONTOLOGÍA", key: "odontologia" },
    { label: "OFTALMOLOGÍA", key: "oftalmologia" },
    { label: "PSICOLOGÍA", key: "psicologia" },
    { label: "PSIQUIATRÍA", key: "psiquiatria" },
    { label: "DERMATOLOGÍA", key: "dermatologia" },
    { label: "INFECTOLOGÍA", key: "infectologia" },
    { label: "VACUNACIÓN / INMUNIZACIÓN", key: "vacunacionInmunizacion" },
    { label: "REHABILITACIÓN / FISIATRÍA", key: "rehabilitacionFisiatria" },
    { label: "GERIATRÍA", key: "geriatria" },
    { label: "CIRUGÍA", key: "cirugia" },
    // 6 Servicios "Otros" donde el usuario especifica el nombre
    { label: "OTRO SERVICIO", key: "otro1", isOther: true },
    { label: "OTRO SERVICIO", key: "otro2", isOther: true },
    { label: "OTRO SERVICIO", key: "otro3", isOther: true },
    { label: "OTRO SERVICIO", key: "otro4", isOther: true },
    { label: "OTRO SERVICIO", key: "otro5", isOther: true },
    { label: "OTRO SERVICIO", key: "otro6", isOther: true },
];

// Función para generar el HTML de la tabla de servicios médicos
function renderServiciosMedicosForm() {
    const tableBody = document.getElementById('servicios-medicos-body');
    if (!tableBody) return; 

    let html = '';

    SERVICIOS_MEDICOS.forEach(servicio => {
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
}

// Definición de la estructura para la Sección IV: Otros Servicios
const OTROS_SERVICIOS_DATA = {
    // Servicios con estado (Radio Buttons)
    imagenologia: [
        { label: "RADIOGRAFÍA", key: "radiografia" },
        { label: "MAMOGRAFÍA", key: "mamografia" },
        { label: "ULTRASONIDO", key: "ultrasonido" },
        { label: "TOMOGRAFÍA", key: "tomografia" },
        { label: "ECOGRAFÍA M-EA", key: "ecografiaM-EA" },
        { label: "OTROS", key: "otrosImagenologia", isOther: true }
    ],
    // Servicios de Laboratorio (Checkboxes)
    laboratorio: [
        { 
            groupLabel: "HEMATOLOGÍA", key: "hematologia", items: [
                { label: "Hematología Completa", key: "hematologiaCompleta" }, { label: "Grupo Sang./Rh", key: "grupoSangRh" },
                { label: "Leucocitos Fórmula", key: "leucocitosFormula" }, { label: "Plaquetas", key: "plaquetas" },
                { label: "OTROS", key: "otrosHematologia", isOther: true }
            ]
        },
        { 
            groupLabel: "QUÍMICA SANGUÍNEA", key: "quimicaSanguinea", items: [
                { label: "Glicemia", key: "glicemia" }, { label: "BUN", key: "bun" }, 
                { label: "Creatinina", key: "creatinina" }, { label: "Colesterol Total", key: "colesterolTotal" },
                { label: "Triglicéridos", key: "trigliceridos" }, { label: "AST/GOT", key: "astGot" },
                { label: "Electrolitos Séricos", key: "electrolitosSericos" }, { label: "Gases Arteriales", key: "gasesArteriales" },
                { label: "OTROS", key: "otrosQuimica", isOther: true }
            ]
        },
        { 
            groupLabel: "SEROLOGÍA", key: "serologia", items: [
                { label: "HIV", key: "hiv" }, { label: "VDRL/RPR", key: "vdrlRpr" }, 
                { label: "PCR Sanguínea", key: "pcrSanguinea" }, { label: "COVID-19", key: "covid19" },
                { label: "OTROS", key: "otrosSerologia", isOther: true }
            ]
        },
        { 
            groupLabel: "COAGULACIÓN", key: "coagulacion", items: [
                { label: "PT", key: "pt" }, { label: "PTT", key: "ptt" }, { label: "OTROS", key: "otrosCoagulacion", isOther: true }
            ]
        },
        { 
            groupLabel: "OTROS", key: "laboratorioOtros", items: [
                { label: "Orina (Rutina)", key: "orinaRutina" }, { label: "Heces (Coproanálisis)", key: "hecesCoproanalisis" }, 
                { label: "Urocultivo", key: "urocultivo" }, { label: "Adeno/Rotavirus", key: "adenoRotavirus" },
                { label: "OTROS", key: "otrosLabGral", isOther: true }
            ]
        }
    ],
    // Medicinas e Insumos (Tratamientos con estado - Radio Buttons)
    medicinas: [
        {
            groupLabel: "TRATAMIENTOS BÁSICOS", key: "basicos", items: [
                { label: "ANTI-GRIPAL", key: "antiGripal" }, { label: "TRATAMIENTO N° 2", key: "basico2", isOther: true },
                { label: "TRATAMIENTO N° 3", key: "basico3", isOther: true }, { label: "OTRO TRATAMIENTO", key: "otroBasico", isOther: true }
            ]
        },
        {
            groupLabel: "TRATAMIENTOS ESPECIALIZADOS", key: "especializados", items: [
                { label: "HIPERTENSIÓN", key: "hipertension" }, { label: "DIABETES", key: "diabetes" }, 
                { label: "TRATAMIENTO N° 3", key: "especializado3", isOther: true }, { label: "OTRO TRATAMIENTO", key: "otroEspecializado", isOther: true }
            ]
        },
        {
            groupLabel: "ALTO COSTO", key: "altoCosto", items: [
                { label: "ONCOLÓGICO", key: "oncologico" }, { label: "TRATAMIENTO N° 2", key: "altoCosto2", isOther: true }, 
                { label: "TRATAMIENTO N° 3", key: "altoCosto3", isOther: true }, { label: "OTRO TRATAMIENTO", key: "otroAltoCosto", isOther: true }
            ]
        }
    ]
};

// Función para generar la estructura de los radio buttons (Imagenología y Medicinas)
function createRadioTableHTML(groupKey, items, title = '') {
    let html = title ? `<h5>${title}</h5>` : '';
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
    
    items.forEach(item => {
        const key = `${groupKey}-${item.key}`;
        let labelHTML = item.label;

        if (item.isOther) {
            // Permite al usuario escribir el servicio
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
}

// Función para generar la estructura de checkboxes (Laboratorio)
function createCheckboxGroupHTML(groupKey, groupLabel, items) {
    let html = `
        <div class="mb-4 p-3 border rounded">
            <h5 class="fw-bold text-primary">${groupLabel}</h5>
            <div class="row">
    `;

    items.forEach(item => {
        const key = `${groupKey}-${item.key}`;
        let labelHTML = item.label;
        
        if (item.isOther) {
            // Permite al usuario escribir el servicio
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
}

// Función principal para renderizar la Sección IV
function renderOtrosServiciosForm() {
    const container = document.getElementById('otros-servicios-container');
    if (!container) return;

    let finalHtml = '<h4>A. IMAGENOLOGÍA</h4>';
    finalHtml += createRadioTableHTML('imagenologia', OTROS_SERVICIOS_DATA.imagenologia);
    
    finalHtml += '<h4>B. LABORATORIO</h4>';
    OTROS_SERVICIOS_DATA.laboratorio.forEach(group => {
        finalHtml += createCheckboxGroupHTML(group.key, group.groupLabel, group.items);
    });
    
    finalHtml += '<h4>C. MEDICINAS E INSUMOS</h4>';
    finalHtml += createRadioTableHTML('medicinas-basicos', OTROS_SERVICIOS_DATA.medicinas[0].items, "Tratamientos Básicos");
    finalHtml += createRadioTableHTML('medicinas-especializados', OTROS_SERVICIOS_DATA.medicinas[1].items, "Tratamientos Especializados");
    finalHtml += createRadioTableHTML('medicinas-altoCosto', OTROS_SERVICIOS_DATA.medicinas[2].items, "Alto Costo");

    container.innerHTML = finalHtml;
}

// Definición de la estructura para la Sección V: Infraestructura y Servicios Públicos

const CONDICIONES_INFRAESTRUCTURA = [
    { label: "CONSULTORIOS", key: "consultorios" },
    { label: "HOSPITALIZACIÓN", key: "hospitalizacion" },
    { label: "LABORATORIO", key: "laboratorio" },
    { label: "FARMACIA", key: "farmacia" },
    { label: "SERVICIOS GENERALES", key: "serviciosGenerales" },
    { label: "OTROS", key: "otrosInfraestructura", isOther: true },
];

const SERVICIOS_PUBLICOS = [
    { label: "AGUA", key: "agua", type: "radio", options: [
        { value: "DISPONIBLE" }, 
        { value: "DISP TANQUE" }, 
        { value: "SIN SERVICIO" }
    ]},
    { label: "ELECTRICIDAD", key: "electricidad", type: "radio", options: [
        { value: "DISPONIBLE" }, 
        { value: "DISP C/PROB" }, 
        { value: "SIN SERVICIO" }
    ]},
    { label: "PLANTA ELÉCTRICA", key: "plantaElectrica", type: "radio", options: [
        { value: "DISPONIBLE" }, 
        { value: "DISP C/PROB" }, 
        { value: "SIN SERVICIO" }, 
        { value: "NO EXISTE" }
    ]},
    { label: "INTERNET", key: "internet", type: "radio", options: [
        { value: "DISPONIBLE" }, 
        { value: "DISP C/PROB" }, 
        { value: "SIN SERVICIO" }
    ]},
    { label: "ASEO URBANO", key: "aseoUrbano", type: "radio", options: [
        { value: "DISPONIBLE" }, 
        { value: "DISP C/PROB" }, 
        { value: "SIN SERVICIO" }
    ]},
    { label: "SEGURIDAD", key: "seguridad", type: "radio", options: [
        { value: "DISPONIBLE" }, 
        { value: "DISP C/PROB" }, 
        { value: "SIN SERVICIO" }
    ]},
    { label: "OTROS SERVICIOS PÚBLICOS", key: "otrosServiciosPublicos", isOther: true, type: "radio", options: [
        { value: "DISPONIBLE" }, 
        { value: "DISP C/PROB" }, 
        { value: "SIN SERVICIO" }
    ]}
];

// Función para generar la tabla de Condiciones de Infraestructura (Paredes, Pisos, Techos, A/A)
function renderCondicionesInfraestructuraForm() {
    const tableBody = document.getElementById('condiciones-infraestructura-body');
    if (!tableBody) return; 

    const CONDICIONES = ["BUENAS COND", "REGULAR COND", "MALAS COND"];
    const COMPONENTES = ["paredes", "pisos", "techos", "aa"];
    let html = '';

    CONDICIONES_INFRAESTRUCTURA.forEach(area => {
        const key = area.key;
        let labelHTML = area.label;

        if (area.isOther) {
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
        COMPONENTES.forEach(componente => {
            html += '<td>';
            CONDICIONES.forEach(condicion => {
                const inputId = `${key}-${componente}-${condicion.replace(/\s/g, '').toLowerCase()}`;
                const inputName = `${key}-${componente}`;
                
                html += `
                    <div class="form-check form-check-inline me-1">
                        <input class="form-check-input" type="radio" name="${inputName}" id="${inputId}" value="${condicion}">
                        <label class="form-check-label" for="${inputId}">${condicion.split(' ')[0]}</label>
                    </div>
                `;
            });
            html += '</td>';
        });

        html += '</tr>';
    });

    tableBody.innerHTML = html;
}

// Función para generar la tabla de Servicios Públicos
function renderServiciosPublicosForm() {
    const tableBody = document.getElementById('servicios-publicos-body');
    if (!tableBody) return; 
    
    let html = '';

    SERVICIOS_PUBLICOS.forEach(servicio => {
        const key = servicio.key;
        let labelHTML = servicio.label;

        // Si es "Otro", permite al usuario especificar
        if (servicio.isOther) {
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
        servicio.options.forEach(opt => {
            const inputId = `${key}-${opt.value.replace(/\s/g, '').toLowerCase()}`;
            const inputName = `${key}-estado`;
            
            html += `
                <div class="form-check form-check-inline me-3">
                    <input class="form-check-input" type="radio" name="${inputName}" id="${inputId}" value="${opt.value}" ${opt.value === 'SIN SERVICIO' ? 'checked' : ''}>
                    <label class="form-check-label" for="${inputId}">${opt.value}</label>
                </div>
            `;
        });
        html += '</div></td>';
        
        // Columna de Observación
        html += `<td><input type="text" class="form-control form-control-sm" id="${key}-observacion" placeholder="Observaciones"></td>`;

        html += '</tr>';
    });

    tableBody.innerHTML = html;
}

// Definición de la estructura para la Sección VI: Proyectos de Mejoras
const PROYECTOS_DATA = [
    { 
        label: "ÁREA DE SERVICIOS MÉDICOS", 
        key: "serviciosMedicosProy", 
        placeholder: "Ej: Ampliación del área de pediatría." 
    },
    { 
        label: "QUIRÓFANOS", 
        key: "quirofanosProy", 
        placeholder: "Ej: Adquisición de nuevo equipo de anestesia." 
    },
    { 
        label: "HOSPITALIZACIÓN", 
        key: "hospitalizacionProy", 
        placeholder: "Ej: Remodelación de 5 habitaciones." 
    },
    { 
        label: "LABORATORIO", 
        key: "laboratorioProy", 
        placeholder: "Ej: Compra de analizador automatizado." 
    },
    { 
        label: "FARMACIA", 
        key: "farmaciaProy", 
        placeholder: "Ej: Creación de almacén de medicamentos." 
    },
    { 
        label: "SERVICIOS GENERALES", 
        key: "serviciosGeneralesProy", 
        placeholder: "Ej: Instalación de nueva bomba de agua." 
    }
];

// Constante para el límite de proyectos por categoría
const MAX_PROYECTOS = 5;

// Función para renderizar la sección de Proyectos
function renderProyectosForm() {
    const container = document.getElementById('proyectos-container');
    if (!container) return;
    
    let html = '';

    PROYECTOS_DATA.forEach(categoria => {
        const key = categoria.key;

        html += `
            <div class="mb-4 p-3 border rounded" data-category-key="${key}">
                <h5 class="fw-bold text-primary">${categoria.label} (Máx ${MAX_PROYECTOS})</h5>
                
                <div id="${key}-inputs-container">
                    </div>
                
                <button type="button" class="btn btn-sm btn-outline-success mt-2" data-key="${key}" onclick="addProyectoInput('${key}')">
                    + Agregar Proyecto
                </button>
                <button type="button" class="btn btn-sm btn-outline-danger mt-2" data-key="${key}" onclick="removeProyectoInput('${key}')">
                    - Eliminar Último
                </button>
            </div>
        `;
    });
    
    container.innerHTML = html;
    
    // Generar un input inicial para cada categoría al renderizar
    PROYECTOS_DATA.forEach(categoria => {
        addProyectoInput(categoria.key, true); // Genera 1 campo por defecto
    });
}

// Función global para agregar un campo de proyecto
function addProyectoInput(key, isInitial = false) {
    const container = document.getElementById(`${key}-inputs-container`);
    if (!container) return;
    
    const currentCount = container.children.length;
    if (currentCount >= MAX_PROYECTOS) {
        if (!isInitial) alert(`Se ha alcanzado el límite de ${MAX_PROYECTOS} proyectos para esta área.`);
        return;
    }
    
    const index = currentCount + 1;
    const inputId = `${key}-proyecto-${index}`;
    const placeholder = PROYECTOS_DATA.find(c => c.key === key).placeholder;
    
    const newDiv = document.createElement('div');
    newDiv.className = 'input-group input-group-sm mb-2';
    newDiv.innerHTML = `
        <span class="input-group-text text-bg-secondary" style="width: 50px;">#${index}</span>
        <input type="text" class="form-control" id="${inputId}" name="${key}" placeholder="${placeholder}" aria-label="Proyecto ${index}">
    `;
    
    container.appendChild(newDiv);
}

// Función global para eliminar el último campo de proyecto
function removeProyectoInput(key) {
    const container = document.getElementById(`${key}-inputs-container`);
    if (!container) return;
    
    if (container.children.length > 1) {
        container.removeChild(container.lastChild);
    } else {
        alert('Debe haber al menos un campo de proyecto.');
    }
}

document.addEventListener("DOMContentLoaded", () => {
  const RIF_INPUT = document.getElementById("rif-input");
  const BUSCAR_BTN = document.getElementById("buscar-btn");
  const FORM = document.getElementById("diagnostico-form");
  const FORM_TITLE = document.getElementById("form-title");
  const SUBMIT_BTN = document.getElementById("submit-btn");
  const ALERT_MESSAGE = document.getElementById("alert-message");

  // NUEVO: Dibujar el select de parroquias al cargar la página
  renderParroquiasSelect();
  // Dibujar el formulario de autoridades al cargar la página
  renderAutoridadesForm();
  // Llamada para dibujar la tabla de servicios
  renderServiciosMedicosForm();
  // Llamada para dibujar la tabla de Otros servicios
  renderOtrosServiciosForm();
  // Infraestructura
  renderCondicionesInfraestructuraForm();  
  renderServiciosPublicosForm();   
  //Proyectos
  renderProyectosForm();       

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

// Función auxiliar para precargar datos de tablas con Radio Buttons (Imagenología y Medicinas)
    function preloadRadioTableData(groupKey, items, savedData) {
        if (!savedData) return;
        
        items.forEach(item => {
            const key = `${groupKey}-${item.key}`;
            const itemData = savedData[item.key];
            
            if (itemData) {
                // Llenar el estado (Radio button)
                if (itemData.estado) {
                    const radioElement = document.querySelector(`input[name="${key}-estado"][value="${itemData.estado}"]`);
                    if (radioElement) { radioElement.checked = true; }
                }
                
                document.getElementById(`${key}-observacion`).value = itemData.observacion || '';
                
                if (item.isOther && itemData.nombreEspec) {
                    document.getElementById(`${key}-nombre-especifico`).value = itemData.nombreEspec;
                }
            }
        });
    }

    // Función auxiliar para precargar datos de Laboratorio (Checkboxes)
    function preloadLaboratorioData(savedData) {
        if (!savedData) return;

        OTROS_SERVICIOS_DATA.laboratorio.forEach(group => {
            const groupData = savedData[group.key];
            if (groupData) {
                group.items.forEach(item => {
                    const key = `${group.key}-${item.key}`;
                    const itemData = groupData[item.key];
                    
                    if (itemData) {
                        const checkbox = document.getElementById(`${key}-check`);
                        if (checkbox && itemData.disponible) { checkbox.checked = true; }

                        if (item.isOther && itemData.nombreEspec) {
                            document.getElementById(`${key}-nombre-especifico`).value = itemData.nombreEspec;
                        }
                    }
                });
            }
        });
    }

// Función auxiliar para precargar datos de Condiciones de Infraestructura
    function preloadCondicionesInfraestructuraData(savedData) {
        if (!savedData) return;
        const COMPONENTES = ["paredes", "pisos", "techos", "aa"];

        CONDICIONES_INFRAESTRUCTURA.forEach(area => {
            const key = area.key;
            const areaData = savedData[key];
            
            if (areaData) {
                COMPONENTES.forEach(componente => {
                    const savedValue = areaData[componente];
                    if (savedValue) {
                        const inputId = `${key}-${componente}-${savedValue.replace(/\s/g, '').toLowerCase()}`;
                        const radioElement = document.getElementById(inputId);
                        if (radioElement) { radioElement.checked = true; }
                    }
                });
                
                if (area.isOther && areaData.nombreEspec) {
                    document.getElementById(`${key}-nombre-especifico`).value = areaData.nombreEspec;
                }
            }
        });
    }

    // Función auxiliar para precargar datos de Servicios Públicos
    function preloadServiciosPublicosData(savedData) {
        if (!savedData) return;

        SERVICIOS_PUBLICOS.forEach(servicio => {
            const key = servicio.key;
            const servicioData = savedData[key];
            
            if (servicioData) {
                // Llenar el estado (Radio button)
                if (servicioData.estado) {
                    const inputId = `${key}-${servicioData.estado.replace(/\s/g, '').toLowerCase()}`;
                    const radioElement = document.getElementById(inputId);
                    if (radioElement) { radioElement.checked = true; }
                }

                // Llenar la observación
                document.getElementById(`${key}-observacion`).value = servicioData.observacion || '';

                if (servicio.isOther && servicioData.nombreEspec) {
                    document.getElementById(`${key}-nombre-especifico`).value = servicioData.nombreEspec;
                }
            }
        });
    }
// Función auxiliar para precargar datos de Proyectos
    function preloadProyectosData(savedData) {
        if (!savedData) return;
        
        PROYECTOS_DATA.forEach(categoria => {
            const key = categoria.key;
            const proyectosGuardados = savedData[key] || [];
            const container = document.getElementById(`${key}-inputs-container`);

            if (container) {
                // 1. Eliminar todos los inputs existentes (solo queda 1 por defecto al renderizar)
                container.innerHTML = '';
                
                // 2. Si no hay datos guardados, dejar 1 campo vacío
                if (proyectosGuardados.length === 0) {
                    addProyectoInput(key, true);
                    return;
                }

                // 3. Crear los inputs para los proyectos guardados
                proyectosGuardados.forEach((proyecto, index) => {
                    const index_num = index + 1;
                    const inputId = `${key}-proyecto-${index_num}`;
                    const placeholder = PROYECTOS_DATA.find(c => c.key === key).placeholder;
                    
                    const newDiv = document.createElement('div');
                    newDiv.className = 'input-group input-group-sm mb-2';
                    newDiv.innerHTML = `
                        <span class="input-group-text text-bg-secondary" style="width: 50px;">#${index_num}</span>
                        <input type="text" class="form-control" id="${inputId}" name="${key}" placeholder="${placeholder}" value="${proyecto}" aria-label="Proyecto ${index_num}">
                    `;
                    container.appendChild(newDiv);
                });
            }
        });
    }

  function fillForm(data) {
    // Ejemplo de llenado para la Sección I: Datos de la Institución
    document.getElementById("nombre-institucion").value = data.datosInstitucion.nombre || "";
    document.getElementById('parroquia').value = data.datosInstitucion.parroquia || '';
    document.getElementById("direccion").value = data.datosInstitucion.direccion || "";
    document.getElementById("punto-referencia").value = data.datosInstitucion.puntoReferencia || "";
    document.getElementById('longitud').value = data.datosInstitucion.longitud || '';
    document.getElementById('latitud').value = data.datosInstitucion.latitud || '';
    const tipoInst = data.datosInstitucion.tipoInstitucion;
    if (tipoInst) {
        const radioTipo = document.querySelector(`input[name="tipo-institucion"][value="${tipoInst}"]`);
        if (radioTipo) {
            radioTipo.checked = true;
        }
    }
    const entesGuardados = data.datosInstitucion.enteAdscrito || [];
    // Desmarcar todos los checkboxes primero (por si acaso)
    document.querySelectorAll('input[name="ente-adscrito"]').forEach(cb => {
        cb.checked = false;
    });
    // Marcar solo los checkboxes cuyos valores estén en el array de entes guardados
    entesGuardados.forEach(ente => {
        const checkbox = document.querySelector(`input[name="ente-adscrito"][value="${ente}"]`);
        if (checkbox) {
            checkbox.checked = true;
        }
    });    

    // Ejemplo de llenado para la Sección II: Autoridades
    if (data.autoridades) {
        CARGOS_AUTORIDADES.forEach(cargo => {
            const key = cargo.key;
            const cargoData = data.autoridades[key];
            if (cargoData) {
                document.getElementById(`${key}-nombre`).value = cargoData.nombre || '';
                document.getElementById(`${key}-celular`).value = cargoData.celular || '';
                document.getElementById(`${key}-correo`).value = cargoData.correo || '';
            }
        });
        document.getElementById('observaciones-autoridades').value = data.autoridades.observaciones || '';
    }

    // Llenar la Sección III: Servicios Médicos
    if (data.serviciosMedicos) {
        SERVICIOS_MEDICOS.forEach(servicio => {
            const key = servicio.key;
            const servicioData = data.serviciosMedicos[key];
            
            if (servicioData) {
                // Llenar el estado (Radio button)
                if (servicioData.estado) {
                    const radioElement = document.querySelector(`input[name="${key}-estado"][value="${servicioData.estado}"]`);
                    if (radioElement) {
                        radioElement.checked = true;
                    }
                }
                
                // Llenar la observación (¡ESTO SE MANTIENE!)
                document.getElementById(`${key}-observacion`).value = servicioData.observacion || '';
                
                // Si es un servicio "Otro", llenar el nombre especificado
                if (servicio.isOther && servicioData.nombreEspec) {
                    document.getElementById(`${key}-nombre-otro`).value = servicioData.nombreEspec;
                }
            }
        });
        document.getElementById('observaciones-servicios-medicos').value = data.serviciosMedicos.observaciones || '';
    }

    // NUEVO: Llenar la Sección IV: Otros Servicios
    if (data.otrosServicios) {
        preloadRadioTableData('imagenologia', OTROS_SERVICIOS_DATA.imagenologia, data.otrosServicios.imagenologia);
        preloadLaboratorioData(data.otrosServicios.laboratorio);
        preloadRadioTableData('medicinas-basicos', OTROS_SERVICIOS_DATA.medicinas[0].items, data.otrosServicios.medicinasBasicos);
        preloadRadioTableData('medicinas-especializados', OTROS_SERVICIOS_DATA.medicinas[1].items, data.otrosServicios.medicinasEspecializados);
        preloadRadioTableData('medicinas-altoCosto', OTROS_SERVICIOS_DATA.medicinas[2].items, data.otrosServicios.medicinasAltoCosto);
        
        document.getElementById('observaciones-otros-servicios').value = data.otrosServicios.observaciones || '';
    }

    // NUEVO: Llenar la Sección V: Infraestructura
    if (data.infraestructura) {
        preloadCondicionesInfraestructuraData(data.infraestructura.condiciones);
        preloadServiciosPublicosData(data.infraestructura.serviciosPublicos);
        document.getElementById('observaciones-infraestructura').value = data.infraestructura.observaciones || '';
    }
    // NUEVO: Llenar la Sección VI: Proyectos
    if (data.proyectos) {
        preloadProyectosData(data.proyectos);
        // Llenar la Sección VII: Observaciones Generales
        document.getElementById('observaciones-generales').value = data.proyectos.observacionesGenerales || '';
    }

    // El resto de la lógica de llenado para las demás secciones (III, IV, V, VI)
    // requeriría iterar sobre campos de radio/checkbox y select.
  }

  // 4. Lógica de Envío del Formulario (Almacenamiento JSON)
  FORM.addEventListener("submit", (e) => {
    e.preventDefault();
    const RIF = RIF_INPUT.value.trim().toUpperCase();

    // Función auxiliar para recolectar datos de autoridades
    function collectAutoridadesData() {
        let autoridadesData = {};
        CARGOS_AUTORIDADES.forEach(cargo => {
            const key = cargo.key;
            autoridadesData[key] = {
                nombre: document.getElementById(`${key}-nombre`).value,
                celular: document.getElementById(`${key}-celular`).value,
                correo: document.getElementById(`${key}-correo`).value,
            };
        });
        return autoridadesData;
    } 

    // Función auxiliar para recolectar datos de Servicios Médicos
    function collectServiciosMedicosData() {
        let serviciosData = {};
        SERVICIOS_MEDICOS.forEach(servicio => {
            const key = servicio.key;
            
            // 1. Obtener el estado seleccionado (radio button)
            const estadoElement = document.querySelector(`input[name="${key}-estado"]:checked`);
            const estado = estadoElement ? estadoElement.value : 'NO EXISTE'; 
            
            // 2. Obtener la observación
            const observacion = document.getElementById(`${key}-observacion`).value;
            
            let servicioObj = {
                estado: estado,
                observacion: observacion,
                // Si es un servicio "Otro", el nombre es el que el usuario escribió
                nombreEspec: servicio.isOther ? document.getElementById(`${key}-nombre-otro`).value : servicio.label
            };
            
            serviciosData[key] = servicioObj;
        });
        
        return serviciosData;
    }

// Función auxiliar para recolectar datos de tablas con Radio Buttons (Imagenología y Medicinas)
    function collectRadioTableData(groupKey, items) {
        let data = {};
        items.forEach(item => {
            const key = `${groupKey}-${item.key}`;
            const estadoElement = document.querySelector(`input[name="${key}-estado"]:checked`);
            const estado = estadoElement ? estadoElement.value : 'NO EXISTE';
            const observacion = document.getElementById(`${key}-observacion`).value;
            
            let itemData = { estado: estado, observacion: observacion };
            
            if (item.isOther) {
                itemData.nombreEspec = document.getElementById(`${key}-nombre-especifico`).value;
            }
            data[item.key] = itemData;
        });
        return data;
    }

    // Función auxiliar para recolectar datos de Laboratorio (Checkboxes)
    function collectLaboratorioData() {
        let data = {};
        OTROS_SERVICIOS_DATA.laboratorio.forEach(group => {
            data[group.key] = {};
            
            group.items.forEach(item => {
                const key = `${group.key}-${item.key}`;
                const checkbox = document.getElementById(`${key}-check`);
                
                let itemData = { disponible: checkbox ? checkbox.checked : false };

                if (item.isOther) {
                    itemData.nombreEspec = document.getElementById(`${key}-nombre-especifico`).value;
                }
                data[group.key][item.key] = itemData;
            });
        });
        return data;
    }

    // Función auxiliar para recolectar datos de Condiciones de Infraestructura
    function collectCondicionesInfraestructuraData() {
        let data = {};
        const COMPONENTES = ["paredes", "pisos", "techos", "aa"];
        
        CONDICIONES_INFRAESTRUCTURA.forEach(area => {
            const key = area.key;
            let areaData = {};
            
            COMPONENTES.forEach(componente => {
                const selected = document.querySelector(`input[name="${key}-${componente}"]:checked`);
                areaData[componente] = selected ? selected.value : null;
            });
            
            if (area.isOther) {
                areaData.nombreEspec = document.getElementById(`${key}-nombre-especifico`).value;
            }
            data[key] = areaData;
        });
        return data;
    }

    // Función auxiliar para recolectar datos de Servicios Públicos
    function collectServiciosPublicosData() {
        let data = {};
        
        SERVICIOS_PUBLICOS.forEach(servicio => {
            const key = servicio.key;
            const estadoElement = document.querySelector(`input[name="${key}-estado"]:checked`);
            const estado = estadoElement ? estadoElement.value : 'SIN SERVICIO';
            const observacion = document.getElementById(`${key}-observacion`).value;
            
            let servicioData = { estado: estado, observacion: observacion };

            if (servicio.isOther) {
                servicioData.nombreEspec = document.getElementById(`${key}-nombre-especifico`).value;
            }
            data[key] = servicioData;
        });
        return data;
    }

  // Función auxiliar para recolectar datos de Proyectos
    function collectProyectosData() {
        let proyectosData = {};
        
        PROYECTOS_DATA.forEach(categoria => {
            const key = categoria.key;
            // Recolectar todos los inputs de la categoría y mapear sus valores, filtrando los vacíos.
            const inputs = document.querySelectorAll(`#${key}-inputs-container input[name="${key}"]`);
            const proyectos = Array.from(inputs)
                                   .map(input => input.value.trim())
                                   .filter(value => value.length > 0);
            
            proyectosData[key] = proyectos;
        });
        return proyectosData;
    }
    // Recopilar todos los datos del formulario en un objeto estructurado
    const formData = {
      rif: RIF,
      fechaRegistro: new Date().toISOString(),
      // I. Datos de la Institución
      datosInstitucion: {
        nombre: document.getElementById("nombre-institucion").value,
        parroquia: document.getElementById('parroquia').value,
        direccion: document.getElementById("direccion").value,
        puntoReferencia: document.getElementById("punto-referencia").value,
        longitud: document.getElementById('longitud').value,
        latitud: document.getElementById('latitud').value,
        tipoInstitucion: document.querySelector('input[name="tipo-institucion"]:checked')?.value || '',
        enteAdscrito: Array.from(document.querySelectorAll('input[name="ente-adscrito"]:checked')).map(cb => cb.value),
        // ...otros campos de la Sección I
      },
      // II. Autoridades

      autoridades: {
        ...collectAutoridadesData(),
        observaciones: document.getElementById("observaciones-autoridades")
          .value,
        // ...otros campos de la Sección II
      },
      // III. Servicios Médicos (Ejemplo de cómo capturar radios)
      serviciosMedicos: {
        ...collectServiciosMedicosData(),
        // ...otros servicios
      },
      // IV. Otros Servicios Prestados
      otrosServicios: {
          // IMAGENOLOGÍA
          imagenologia: collectRadioTableData('imagenologia', OTROS_SERVICIOS_DATA.imagenologia),
          
          // LABORATORIO
          laboratorio: collectLaboratorioData(),
          
          // MEDICINAS E INSUMOS
          medicinasBasicos: collectRadioTableData('medicinas-basicos', OTROS_SERVICIOS_DATA.medicinas[0].items),
          medicinasEspecializados: collectRadioTableData('medicinas-especializados', OTROS_SERVICIOS_DATA.medicinas[1].items),
          medicinasAltoCosto: collectRadioTableData('medicinas-altoCosto', OTROS_SERVICIOS_DATA.medicinas[2].items),
          
          observaciones: document.getElementById('observaciones-otros-servicios').value
      },
      // V. Datos de Infraestructura y Servicios Públicos
      infraestructura: {
          condiciones: collectCondicionesInfraestructuraData(),
          serviciosPublicos: collectServiciosPublicosData(),
          observaciones: document.getElementById('observaciones-infraestructura').value
      },
      // VI. Proyectos de Mejoras
      proyectos: {
          ...collectProyectosData(),
          // VII. Observaciones Generales
          observacionesGenerales: document.getElementById('observaciones-generales').value
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
