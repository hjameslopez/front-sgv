// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  URL_SVC_SEG: 'http://172.27.230.29:8080/sim-seguridad',
  URL_SVC_MST: 'http://172.27.230.29:8080/scm-maestros',
  URL_SVC_RIM: 'http://localhost:8080/back-sgv',


//cambios
//  URL_SVC_SEG: 'https://das-calidad-01.migraciones.gob.pe/sim-seguridad',
  //URL_SVC_MST: 'https://das-calidad-01.migraciones.gob.pe/scm-maestros',
//cambios


  //URL_SVC_RIM: 'https://das-calidad-01.migraciones.gob.pe/rim-backend',
  // jwtDomainsTokenized: [
  //   'das-calidad-01.migraciones.gob.pe'
  // ],
  //URL_SVC_SEG: 'http://172.27.50.30:8080',
  //URL_SVC_MST: 'http://172.27.230.29:8080/scm-maestros',
  //URL_SVC_RIM: 'https://apps.migraciones.gob.pe/back-sgv',
  //URL_SVC_RIM: 'http:///das-calidad-01.migraciones.gob.pe/back-sgv',


  jwtDomainsTokenized: [
    'localhost',
    'localhost:4200',
    '172.27.230.29',
    '172.27.230.29:8080',
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

  //CODIGOS INTERPOL
/* ALERTA_RESPUESTA_CODIGO_NEGATIVO: "00",
    ALERTA_RESPUESTA_CODIGO_POSITIVO: "01",
    ALERTA_RESPUESTA_CODIGO_NO_CONSULTADO: "03",
    ALERTA_RESPUESTA_CODIGO_SIN_ACCESO: "04",
    ALERTA_RESPUESTA_CODIGO_EXCEPTION: "02",
    ALERTA_RESPUESTA_CODIGO_CONSOLA: "05",
    ALERTA_RESPUESTA_ERROR_INESPERADO: "06",
    ALERTA_RESPUESTA_OTROS_ERRORES: "07",
    ALERTA_RESPUESTA_TIEMPO_AGOTADO: "08",*/

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

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
//enviroment
