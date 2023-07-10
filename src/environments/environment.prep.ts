export const environment = {
  production: true,

  URL_SVC_SEG: 'https://das-calidad-01.migraciones.gob.pe/sim-seguridad',
  URL_SVC_MST: 'https://das-calidad-01.migraciones.gob.pe/scm-maestros',
  URL_SVC_RIM: 'https://das-calidad-01.migraciones.gob.pe/back-sgv',
  jwtDomainsTokenized: [
    'das-calidad-01.migraciones.gob.pe'
  ],

  // AUTH SGV
  VAR_MODULO: 'SGV',
  VAR_TOKEN: 'access_token_rim',
  VAR_PERMISO_SGV: 'SGV',


  // ROUTING
  URL_HOME: '/',
  URL_LOGIN: 'login',
  // PAGINATION
  ROWS_PAGE: 10,  // Filas por página
  START_PAGE: 1,  // Página inicial

  // STATUS CODE
  CODE_200: '200',
  CODE_201: '201',  // CREATED
  CODE_400: '400',
  CODE_401: '401',
  CODE_404: '404',
  CODE_500: '500',

  // VALUES
  // VALUES
  NULL: null,
  UNDEFINED: undefined,
  EMPTY: '',
  INT_ZERO: 0,
  INT_ONE: 1,

  // ROLES
  IDROL_SGV:'SGV_GESTION_COLA',

  IDROL_CONSULTA: 'RIM_CONS_PERSONA',
  IDROL_REGISTRAL: 'RIM_CONS_REGISTRAL',
  IDROL_INFO_MIGRATORIA: 'RIM_CONS_INF_MIG',
  IDROL_ALERTAS: 'RIM_CONS_ALERTAS',
  IDROL_ANTECEDENTES: 'RIM_CONS_ANTECEDENTES',
  IDROL_LABORAL: 'RIM_CONS_LABORAL',
  IDROL_SUNEDO: 'RIM_CONS_SUNEDU',
  IDROL_JNE: 'RIM_CONS_JNE',
  IDROL_ESSALUD: 'RIM_CONS_ESSALUD',
  IDROL_TRIBUTARIA: 'RIM_CONS_TRIBUTARIA',
  IDROL_AUDITORIA: 'RIM_AUDITORIA_WEB',
  IDROL_PREREGISTRO: 'RIM_CONS_PREREGISTRO',
  IDROL_INTERPOL: 'RIM_CONS_INTERPOL',

  // ALERTAS
  ALERT_POSITION_VERTICAL: 'bottom',
  ALERT_POSITION_HORIZONTAL: 'left',
  ALERT_DURATION: 3500,

  // ALERTAS DE ANTECEDENTES
  AA_SO: 0, // SIN OBSERVACIONES
  AA_CO: 1, // CON OBSERVACIONES
  AA_ES: 5, // ERROR EN EL SERVICIO
  AA_NC: 6, // NO CONSULTAOD

  // ALERTAS INTERPOL
  INTERPOL_CON_ALERTA: '01', // CON ALERTA INTERPOL

  // TIPOS DE MOVIMIENTO MIGRATORIO
  TIPO_MOV_ENTRADA: 'ENTRADA',
  TIPO_MOV_SALIDA: 'SALIDA',

  // ICONS
  ICON_ENTRADA: 'fa-arrow-alt-circle-down',
  ICON_SALIDA: 'fa-arrow-alt-circle-up',

  // TIPO ARCHIVOS
  FILE_JPG: 'jpg',
  FILE_JPEG: 'jpeg',
  FILE_GIF: 'gif',
  FILE_PNG: 'png',
  FILE_PDF: 'pdf',

};
