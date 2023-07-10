export class ResponseEncolarDto {
  colaCall: ColaCall[];
  dReloj: string;
  nroOrden: number;
  sActivarTabCola: string;
  sCodTicket: string;
  sCode: number;
  nIdSimVideCola: number;
  sOpeAsignado: string;
  tiempoEspera: number;
  token: string[];
}

export class ColaCall {
  dFecCreado: string;
  nEstado: number;
  nIdSesion: number;
  nIdSimVideCola: number;
  sCodTicket: string;
  sIdPersona: string;
  sNombres: string;
  sOpeAsignado: string;
  sTipTicket: string;
}
