import {ColaCall} from './responseEncolar.dto';

export class ResponseTokenWebexDto {
  colaCall: ColaCall[];
  dReloj: string;
  nIdSimVideCola: number;
  nroOrden: number;
  sActivarTabCola: string;
  sCodTicket: string;
  sCode: number;
  sOpeAsignado: string;
  tiempoEspera: string;
  token: string[];
  nEstado: String;
}
