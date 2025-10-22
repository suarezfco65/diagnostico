// data.js

/**
 * =================================================================
 * I. DATOS DE LA INSTITUCIÓN
 * =================================================================
 */

// Lista de Parroquias de Caracas (Sección I)
export const PARROQUIAS_CARACAS = [
  "Altagracia",
  "Antímano",
  "Caricuao",
  "Coche",
  "El Junquito",
  "El Paraíso",
  "El Recreo",
  "El Valle",
  "La Pastora",
  "La Vega",
  "Macarao",
  "San Bernardino",
  "San José",
  "San Pedro",
  "Sucre",
  "23 de Enero",
  "La Candelaria",
  "Catedral",
  "San Agustín",
  "San Juan",
  "Santa Rosalía",
  "Santa Teresa",
];

// Definición de Tipos de Institución (Radio Buttons)
export const TIPOS_INSTITUCION = [
  { value: "HOSPITAL I", label: "Hospital I" },
  { value: "HOSPITAL II", label: "Hospital II" },
  { value: "HOSPITAL III", label: "Hospital III" },
  { value: "HOSPITAL IV", label: "Hospital IV" },
  { value: "A.S.I.C.", label: "A.S.I.C." },
  { value: "S.R.I", label: "S.R.I." },
  { value: "C.A.T.", label: "C.A.T." },
  { value: "C.A.I", label: "C.A.I." },
  { value: "C.D.I.", label: "C.D.I." },
  { value: "CLINICA PRIVADA", label: "Clínica Privada" },
  { value: "CLINICA POPULAR", label: "Clínica Popular" },
  { value: "CLINICA CLANDESTINA", label: "Clínica clandestina" },
  { value: "MÓDULO BARRIO ADENTRO", label: "Módulo Barrio Adentro" },
  { value: "VETERINARIA", label: "Veterinaria" },
  { value: "OTROS TIPOS", label: "Otros tipos" },
];

// Definición de Entes Adscritos (Checkboxes)
export const ENTES_ADSCRITOS = [
  { value: "MPPS", label: "MPPS" },
  { value: "IVSS", label: "IVSS" },
  { value: "IPASME", label: "IPASME" },
  { value: "SANIDAD", label: "Sanidad" },
  { value: "UNIVERSIDAD C DE LA S", label: "Universidad C de la S" },
  { value: "GDC", label: "GDC" },
  { value: "ALCALDIA", label: "Alcaldía" },
  { value: "SANIDAD", label: "Sanidad" },
  { value: "OTROS ENTES", label: "Otros Entes" },
];

/**
 * =================================================================
 * II. DATOS DE LAS AUTORIDADES
 * =================================================================
 */

// Array con la definición de los cargos y las claves que usarán en el JSON (Sección II)
export const CARGOS_AUTORIDADES = [
  { label: "Director(a)", key: "director" },
  { label: "Sub-Director(a)", key: "subDirector" },
  { label: "Jefe de Servicios Médicos", key: "jefeServiciosMedicos" },
  { label: "Jefe de Mantenimiento", key: "jefeMantenimiento" },
  { label: "Enlace Institucional", key: "enlaceInstitucional" },
];

/**
 * =================================================================
 * III. SERVICIOS DE ESPECIALIDADES MÉDICAS
 * =================================================================
 */

// Array con la lista de servicios médicos (Sección III)
export const SERVICIOS_MEDICOS = [
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

/**
 * =================================================================
 * IV. OTROS SERVICIOS PRESTADOS
 * =================================================================
 */

// Definición de la estructura para la Sección IV: Otros Servicios
export const OTROS_SERVICIOS_DATA = {
  // Servicios con estado (Radio Buttons)
  imagenologia: [
    { label: "RADIOGRAFÍA", key: "radiografia" },
    { label: "MAMOGRAFÍA", key: "mamografia" },
    { label: "ULTRASONIDO", key: "ultrasonido" },
    { label: "TOMOGRAFÍA", key: "tomografia" },
    { label: "ECOGRAFÍA M-EA", key: "ecografiaM-EA" },
    { label: "OTROS", key: "otrosImagenologia", isOther: true },
  ],
  // Servicios de Laboratorio (Checkboxes)
  laboratorio: [
    {
      groupLabel: "HEMATOLOGÍA",
      key: "hematologia",
      items: [
        { label: "Hematología Completa", key: "hematologiaCompleta" },
        { label: "Grupo Sang./Rh", key: "grupoSangRh" },
        { label: "Leucocitos Fórmula", key: "leucocitosFormula" },
        { label: "Plaquetas", key: "plaquetas" },
        { label: "OTROS", key: "otrosHematologia", isOther: true },
      ],
    },
    {
      groupLabel: "QUÍMICA SANGUÍNEA",
      key: "quimicaSanguinea",
      items: [
        { label: "Glicemia", key: "glicemia" },
        { label: "BUN", key: "bun" },
        { label: "Creatinina", key: "creatinina" },
        { label: "Colesterol Total", key: "colesterolTotal" },
        { label: "Triglicéridos", key: "trigliceridos" },
        { label: "AST/GOT", key: "astGot" },
        { label: "Electrolitos Séricos", key: "electrolitosSericos" },
        { label: "Gases Arteriales", key: "gasesArteriales" },
        { label: "OTROS", key: "otrosQuimica", isOther: true },
      ],
    },
    {
      groupLabel: "SEROLOGÍA",
      key: "serologia",
      items: [
        { label: "HIV", key: "hiv" },
        { label: "VDRL/RPR", key: "vdrlRpr" },
        { label: "PCR Sanguínea", key: "pcrSanguinea" },
        { label: "COVID-19", key: "covid19" },
        { label: "OTROS", key: "otrosSerologia", isOther: true },
      ],
    },
    {
      groupLabel: "COAGULACIÓN",
      key: "coagulacion",
      items: [
        { label: "PT", key: "pt" },
        { label: "PTT", key: "ptt" },
        { label: "OTROS", key: "otrosCoagulacion", isOther: true },
      ],
    },
    {
      groupLabel: "OTROS",
      key: "laboratorioOtros",
      items: [
        { label: "Orina (Rutina)", key: "orinaRutina" },
        { label: "Heces (Coproanálisis)", key: "hecesCoproanalisis" },
        { label: "Urocultivo", key: "urocultivo" },
        { label: "Adeno/Rotavirus", key: "adenoRotavirus" },
        { label: "OTROS", key: "otrosLabGral", isOther: true },
      ],
    },
  ],
  // Medicinas e Insumos (Tratamientos con estado - Radio Buttons)
  medicinas: [
    {
      groupLabel: "TRATAMIENTOS BÁSICOS",
      key: "basicos",
      items: [
        { label: "ANTI-GRIPAL", key: "antiGripal" },
        { label: "TRATAMIENTO N° 2", key: "basico2", isOther: true },
        { label: "TRATAMIENTO N° 3", key: "basico3", isOther: true },
        { label: "OTRO TRATAMIENTO", key: "otroBasico", isOther: true },
      ],
    },
    {
      groupLabel: "TRATAMIENTOS ESPECIALIZADOS",
      key: "especializados",
      items: [
        { label: "HIPERTENSIÓN", key: "hipertension" },
        { label: "DIABETES", key: "diabetes" },
        { label: "TRATAMIENTO N° 3", key: "especializado3", isOther: true },
        { label: "OTRO TRATAMIENTO", key: "otroEspecializado", isOther: true },
      ],
    },
    {
      groupLabel: "ALTO COSTO",
      key: "altoCosto",
      items: [
        { label: "ONCOLÓGICO", key: "oncologico" },
        { label: "TRATAMIENTO N° 2", key: "altoCosto2", isOther: true },
        { label: "TRATAMIENTO N° 3", key: "altoCosto3", isOther: true },
        { label: "OTRO TRATAMIENTO", key: "otroAltoCosto", isOther: true },
      ],
    },
  ],
};

/**
 * =================================================================
 * V. INFRAESTRUCTURA Y SERVICIOS PÚBLICOS
 * =================================================================
 */

// A. Condiciones de Infraestructura (Sección V)
export const CONDICIONES_INFRAESTRUCTURA = [
  { label: "CONSULTORIOS", key: "consultorios" },
  { label: "HOSPITALIZACIÓN", key: "hospitalizacion" },
  { label: "LABORATORIO", key: "laboratorio" },
  { label: "FARMACIA", key: "farmacia" },
  { label: "SERVICIOS GENERALES", key: "serviciosGenerales" },
  { label: "OTROS", key: "otrosInfraestructura", isOther: true },
];

// B. Servicios Públicos (Sección V)
export const SERVICIOS_PUBLICOS = [
  {
    label: "AGUA",
    key: "agua",
    type: "radio",
    options: [
      { value: "DISPONIBLE" },
      { value: "DISP TANQUE" },
      { value: "SIN SERVICIO" },
    ],
  },
  {
    label: "ELECTRICIDAD",
    key: "electricidad",
    type: "radio",
    options: [
      { value: "DISPONIBLE" },
      { value: "DISP C/PROB" },
      { value: "SIN SERVICIO" },
    ],
  },
  {
    label: "PLANTA ELÉCTRICA",
    key: "plantaElectrica",
    type: "radio",
    options: [
      { value: "DISPONIBLE" },
      { value: "DISP C/PROB" },
      { value: "SIN SERVICIO" },
      { value: "NO EXISTE" },
    ],
  },
  {
    label: "INTERNET",
    key: "internet",
    type: "radio",
    options: [
      { value: "DISPONIBLE" },
      { value: "DISP C/PROB" },
      { value: "SIN SERVICIO" },
    ],
  },
  {
    label: "ASEO URBANO",
    key: "aseoUrbano",
    type: "radio",
    options: [
      { value: "DISPONIBLE" },
      { value: "DISP C/PROB" },
      { value: "SIN SERVICIO" },
    ],
  },
  {
    label: "SEGURIDAD",
    key: "seguridad",
    type: "radio",
    options: [
      { value: "DISPONIBLE" },
      { value: "DISP C/PROB" },
      { value: "SIN SERVICIO" },
    ],
  },
  {
    label: "OTROS SERVICIOS PÚBLICOS",
    key: "otrosServiciosPublicos",
    isOther: true,
    type: "radio",
    options: [
      { value: "DISPONIBLE" },
      { value: "DISP C/PROB" },
      { value: "SIN SERVICIO" },
    ],
  },
];

/**
 * =================================================================
 * VI. PROYECTOS DE MEJORAS
 * =================================================================
 */

// Definición de la estructura para la Sección VI: Proyectos de Mejoras
export const PROYECTOS_DATA = [
  {
    label: "ÁREA DE SERVICIOS MÉDICOS",
    key: "serviciosMedicosProy",
    placeholder: "Ej: Ampliación del área de pediatría.",
  },
  {
    label: "QUIRÓFANOS",
    key: "quirofanosProy",
    placeholder: "Ej: Adquisición de nuevo equipo de anestesia.",
  },
  {
    label: "HOSPITALIZACIÓN",
    key: "hospitalizacionProy",
    placeholder: "Ej: Remodelación de 5 habitaciones.",
  },
  {
    label: "LABORATORIO",
    key: "laboratorioProy",
    placeholder: "Ej: Compra de analizador automatizado.",
  },
  {
    label: "FARMACIA",
    key: "farmaciaProy",
    placeholder: "Ej: Creación de almacén de medicamentos.",
  },
  {
    label: "SERVICIOS GENERALES",
    key: "serviciosGeneralesProy",
    placeholder: "Ej: Instalación de nueva bomba de agua.",
  },
];

// Constante para el límite de proyectos por categoría (Sección VI)
export const MAX_PROYECTOS = 5;
