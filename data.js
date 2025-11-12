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
  { value: "OTRO_TIPO", label: "Otro tipo (Especifique)" },
];

// Definición de Entes Adscritos (Checkboxes)
export const ENTES_ADSCRITOS = [
  { value: "MPPS", label: "MPPS" },
  { value: "IVSS", label: "IVSS" },
  { value: "IPASME", label: "IPASME" },
  { value: "UNIVERSIDAD C DE LA S", label: "Universidad C de la S" },
  { value: "GDC", label: "GDC" },
  { value: "ALCALDIA", label: "Alcaldía" },
  { value: "SANIDAD", label: "Sanidad" },
  { value: "OTRO_ENTE", label: "Otro Ente" },
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
 * III. PERSONAL DE LA INSTITUCIÓN
 * =================================================================
 */

// Array con la lista de personal de la institución (Sección III)
export const PERSONAL_INSTITUCION = [
  {
    label: "SERVICIOS MEDICOS",
    key: "servicios-medicos",
    items: [
      { label: "MEDICINA GENERAL", key: "medicina-general" },
      { label: "MEDICINA FAMILIAR", key: "medicina-familiar" },
      { label: "MEDICINA INTERNA", key: "medicina-interna" },
      { label: "MEDICINA PREVENTIVA", key: "medicina-preventiva" },
      { label: "MEDICINA OCUPACIONAL", key: "medicina-ocupacional" },
      { label: "CARDIOLOGIA", key: "cardiologia" },
      { label: "TRAUMATOLOGIA", key: "traumatologia" },
      { label: "NEUMOLOGIA", key: "neumologia" },
      { label: "GASTROENTEROLOGIA", key: "gastroenterologia" },
      { label: "PEDIATRIA", key: "pediatria" },
      { label: "GINECOLOGIA", key: "ginecologia" },
      { label: "OBSTETRICIA", key: "obstetricia" },
      { label: "GINECO-OBSTETRICIA", key: "gineco-obstetricia" },
      { label: "ONCOLOGIA", key: "oncologia" },
      { label: "NEFROLOGIA", key: "nefrologia" },
      { label: "ODONTOLOGIA", key: "odontologia" },
      { label: "OFTALMOLOGIA", key: "oftalmologia" },
      { label: "PSICOLOGIA", key: "psicologia" },
      { label: "PSIQUIATRIA", key: "psiquiatria" },
      { label: "DERMATOLOGIA", key: "dermatologia" },
      { label: "INFECTOLOGIA", key: "infectologia" },
      { label: "VACUNACION", key: "vacunacion" },
      { label: "INMUNIZACION", key: "inmunizacion" },
      { label: "GERIATRIA", key: "geriatria" },
      { label: "PODOLOGIA", key: "podologia" },
      { label: "FISIATRIA", key: "fisiatria" },
      { label: "CIRUGIA", key: "cirugia" },
      { label: "UCI", key: "uci" },
      { label: "RMN", key: "rmn" },
      { label: "OTRO", key: "otroSM1", isOther: true },
      { label: "OTRO", key: "otroSM2", isOther: true },
      { label: "OTRO", key: "otroSM3", isOther: true },
    ],
  },
  {
    label: "PARAMEDICOS Y AFINES",
    key: "paramedicos-y-afines",
    items: [
      { label: "ENFERMERAS/ENFERMEROS", key: "enfermeras-enfermeros" },
      { label: "CAMAREROS/CAMARERAS", key: "camareros-camareras" },
      { label: "RADIOLOGOS/RADIOLOGAS", key: "radiologos-radiologas" },
      { label: "BIOANALISTAS", key: "bioanalistas" },
      { label: "OTRO", key: "otroPA1", isOther: true },
    ],
  },
  {
    label: "ADMINISTRATIVO",
    key: "administrativo",
    items: [
      { label: "PROFESIONALES", key: "profesionales" },
      { label: "TSU", key: "tsu" },
      { label: "BACHILLERES", key: "bachilleres" },
      { label: "OTRO", key: "otroA1", isOther: true },
    ],
  },
  {
    label: "OBRERO",
    key: "obrero",
    items: [
      { label: "SERVICIOS GENERALES", key: "servicios-generales" },
      { label: "SEGURIDAD", key: "seguridad" },
      { label: "OTRO", key: "otroOb1", isOther: true },
    ],
  },
  {
    label: "OTRO",
    key: "otroO",
    items: [
      { label: "OTRO", key: "otroO1", isOther: true },
      { label: "OTRO", key: "otroO2", isOther: true },
      { label: "OTRO", key: "otroO3", isOther: true },
    ],
  },
];

/**
 * =================================================================
 * IV. SERVICIOS DE ESPECIALIDADES MÉDICAS
 * =================================================================
 */

// Array con la lista de servicios médicos (Sección III)
export const SERVICIOS_MEDICOS = [
  { label: "MEDICINA GENERAL", key: "medicina-general" },
  { label: "MEDICINA FAMILIAR", key: "medicina-familiar" },
  { label: "MEDICINA INTERNA", key: "medicina-interna" },
  { label: "PEDIATRÍA", key: "pediatria" },
  { label: "TRAUMATOLOGÍA", key: "traumatologia" },
  { label: "MEDICINA PREVENTIVA", key: "medicina-preventiva" },
  { label: "MEDICINA OCUPACIONAL", key: "medicina-ocupacional" },
  { label: "CARDIOLOGÍA", key: "cardiologia" },
  { label: "ENDOCRINOLOGÍA", key: "endocrinologia" },
  { label: "NEUMONOLOGÍA", key: "neumonologia" },
  { label: "GASTROENTEROLOGÍA", key: "gastroenterologia" },
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
  { label: "HOSPITALIZACIÓN", key: "hospitalizacion" },
  { label: "OXIGENO TERAPIA", key: "oxigenoTerapia" },
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
 * V. OTROS SERVICIOS PRESTADOS
 * =================================================================
 */

// Definición de la estructura para la Sección V: Otros Servicios
export const OTROS_SERVICIOS_DATA = {
  // Servicios con estado (Radio Buttons)
  imagenologia: [
    { label: "RADIOGRAFÍA", key: "radiografia" },
    { label: "MAMOGRAFÍA", key: "mamografia" },
    { label: "ULTRASONIDO", key: "ultrasonido" },
    { label: "TOMOGRAFÍA", key: "tomografia" },
    { label: "DENSIOMETRÍA ÓSEA", key: "densiometriaOsea" },
    { label: "ECOGRAFÍA M-E-A", key: "ecografiaMEA" },
    { label: "ECOGRAFÍA DOPPLER A-V", key: "ecografiaDopplerAV" },
    { label: "OTROS", key: "otrosImagenologia", isOther: true },
  ],
  // Servicios de Laboratorio (Checkboxes)
  laboratorio: [
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
      groupLabel: "HECES",
      key: "heces",
      items: [
        { label: "Coproanálisis", key: "coproanalisis" },
        { label: "Coprocultivo", key: "coprocultivo" },
        { label: "Seriado", key: "seriado" },
        { label: "Adeno/Rotavirus", key: "adenoRotavirus" },
        { label: "Sangre Oculta", key: "sangreOculta" },
        { label: "OTROS", key: "otrosHeces", isOther: true },
      ],
    },
    {
      groupLabel: "ORINA",
      key: "orina",
      items: [
        { label: "Uroanálisis", key: "uroanalisis" },
        { label: "Urocultivo", key: "urocultivo" },
        { label: "Orina 24 horas", key: "orina24Horas" },
        { label: "OTROS", key: "otrosOrina", isOther: true },
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
      groupLabel: "PERFILES",
      key: "perfiles",
      items: [
        { label: "Perfil 20", key: "perfil20" },
        { label: "Cardiaco", key: "cardiaco" },
        { label: "Hepático", key: "hepatico" },
        { label: "Lipídico", key: "lipidico" },
        { label: "Isquémico", key: "isquemico" },
        { label: "Pre-operatorio", key: "preOperatorio" },
        { label: "Reumatoideo", key: "reumatoideo" },
        { label: "Tiroideo", key: "tiroideo" },
        { label: "Obstétrico", key: "obstetrico" },
        { label: "Otros", key: "otrosPerfiles", isOther: true },
      ],
    },
    {
      groupLabel: "CARDIOLOGÍA",
      key: "cardiologia",
      items: [
        { label: "EKG", key: "ekg" },
        { label: "EEG", key: "eeg" },
        { label: "OTROS", key: "otrosCardiologia", isOther: true },
      ],
    },
    {
      groupLabel: "GINECOLOGÍA",
      key: "ginecologia",
      items: [
        { label: "CITOLOGÍA", key: "citologia" },
        { label: "MAMOGRAFÍA", key: "mamografia" },
        { label: "DENSIOMETRÍA ÓSEA", key: "densitometriaOsea" },
        { label: "OTROS", key: "otrosGinecologia", isOther: true },
      ],
    },
    {
      groupLabel: "OTROS",
      key: "laboratorioOtros",
      items: [
        { label: "OTROS", key: "otrosLaboratorio1", isOther: true },
        { label: "OTROS", key: "otrosLaboratorio2", isOther: true },
        { label: "OTROS", key: "otrosLaboratorio3", isOther: true },
        { label: "OTROS", key: "otrosLaboratorio4", isOther: true },
        { label: "OTROS", key: "otrosLaboratorio5", isOther: true },
      ],
    },
  ],
  // Farmacia - Medicinas e Insumos (Tratamientos con estado - Radio Buttons)
  farmacia: [
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
    {
      groupLabel: "OTRAS MEDICINAS E INSUMOS",
      key: "otrasMedicinas",
      items: [
        { label: "TRATAMIENTO N° 1", key: "tratamiento1" },
        { label: "TRATAMIENTO N° 2", key: "tratamiento2", isOther: true },
        { label: "TRATAMIENTO N° 3", key: "tratamiento3", isOther: true },
        { label: "OTRO TRATAMIENTO", key: "otroTratamiento", isOther: true },
      ],
    },
  ],
  // Cocina (Radio Buttons)
  cocina: [
    { label: "SERVICIO ALIMENTACIÓN", key: "servicioAlimentacion" },
    { label: "SERVICIO NUTRICIONISTA", key: "servicioNutricionista" },
    { label: "SUMINISTRO ALIMENTOS", key: "suministroAlimentos" },
    { label: "EQUIPO REFRIGERACIÓN", key: "equipoRefrigeracion" },
    { label: "EQUIPO COCINA", key: "equipoCocina" },
    {
      label: "INFRAESTRUCTURA ALMACENAMIENTO",
      key: "infraestructuraAlmacenamiento",
    },
    { label: "OTROS", key: "otrosComida", isOther: true },
  ],
};

/**
 * =================================================================
 * VI. INFRAESTRUCTURA Y SERVICIOS PÚBLICOS
 * =================================================================
 */

// A. Condiciones de Infraestructura (Sección V)
export const CONDICIONES_INFRAESTRUCTURA = [
  { label: "CONSULTORIOS", key: "consultorios" },
  { label: "QUIROFANOS", key: "quirofanos" },
  { label: "HOSPITALIZACIÓN (CAMAS)", key: "hospitalizacion" },
  { label: "LABORATORIO", key: "laboratorio" },
  { label: "FARMACIA", key: "farmacia" },
  { label: "COCINA", key: "cocina" },
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
    label: "GAS",
    key: "gas",
    type: "radio",
    options: [
      { value: "DISPONIBLE" },
      { value: "DISP C/PROB" },
      { value: "SIN SERVICIO" },
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
    label: "A/A",
    key: "aa",
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
    label: "SERVICIO DE SEGURIDAD",
    key: "servicioSeguridad",
    type: "radio",
    options: [
      { value: "DISPONIBLE" },
      { value: "DISP C/PROB" },
      { value: "SIN SERVICIO" },
    ],
  },
  {
    label: "COMBUSTIBLE",
    key: "combustible",
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
 * VII. PROYECTOS DE MEJORAS
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
