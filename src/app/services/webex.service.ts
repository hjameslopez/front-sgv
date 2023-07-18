import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Resultado} from '../models/resultado.model';
import { ResponseColaWebexDto } from '../dto/responseColaWebex.dto';
import { Observable } from 'rxjs';
import { ResponseOperador } from '../dto/responseOperador.dto';

@Injectable({
  providedIn: 'root'
})
export class WebexService {

  private _urlService = environment.URL_SVC_RIM;
  url = `${this._urlService}/videollamada`;

  constructor(private http: HttpClient) { }

  getOperador() {
    return this.http.get<Resultado>(`${this.url}/operador`);
  }
  getToken(pid, guest, idSesion) {
    return this.http.get<Resultado>(`${this.url}/token?pid=${pid}&guest=${guest}&nidsesion=${idSesion}`);
  }
  getInit(idSesion) {
    return this.http.get<Resultado>(`${this.url}/mjeInicial?nidsesion=${idSesion}`);
  }
  getEncolar(guest, idSesion) {
    return this.http.get<Resultado>(`${this.url}/encolar?guest=${guest}&nidsesion=${idSesion}`);
  }
  getRefreshCola(pid, codigoTicket) {
    return this.http.get<Resultado>(`${this.url}/refreshtabcola?pid=${pid}&scodticket=${codigoTicket}`);
  }
  getPerderTurno(pid: number) {
    return this.http.get<Resultado>(`${this.url}/perderturno?pid=${pid}`);
  }
  getCancelarTurno(pid: number) {
    return this.http.get<Resultado>(`${this.url}/cancelarturno?pid=${pid}`);
  }

  getColaEstados(bActivo: number) {
    return this.http.get<any>(`${this.url}/videollamadas-cola?bActivo=${bActivo}`);
  }

  getValidaOperador(nIdSimVideCola: number) {
    return this.http.get<any>(`${this.url}/videollamadas-cola-operador?nIdSimVideCola=${nIdSimVideCola}`);
  }

  getColaEstado2(bActivo: number) {
    return this.http.get<any>(`${this.url}/videollamadas-cola-2?bActivo=${bActivo}`);
  }

  buscaListAtencionTicket(nIdSimVideCola:number): Observable<any>{
    return this.http.get(`${this.url}/busca-atencion?nIdSimVideCola=${nIdSimVideCola}`);
  }

  updateAsignarOperador(obj:ResponseColaWebexDto): Observable<any>{
    return this.http.post<ResponseColaWebexDto>(`${this.url}/asigna-operador`,obj);
  }

  updateTerminarLlamada(obj:ResponseColaWebexDto): Observable<any>{
    return this.http.post<ResponseColaWebexDto>(`${this.url}/terminar-llamada`,obj);
  }
  busquedaVideollamadas(params) {
    return this.http.get<Resultado>(`${this.url}/buscar`,{params: params});
  }
  listarLicenciasFiltro() {
    return this.http.get<any>(`${this.url}/licencias`);
  }
  licenciaAsignada() {
    return this.http.get<any>(`${this.url}/licencia-asignada`);
  }
  busquedaFiltros(params) {
    return this.http.get<any>(`${this.url}/videollamadas-cola-filtros`, {params: params});
  }
  getValidaCerrar(nIdSimVideCola: number) {
    return this.http.get<any>(`${this.url}/videollamadas-cerrar?nIdSimVideCola=${nIdSimVideCola}`);
  }
  listarOperadoresFiltro() {
    return this.http.get<any>(`${this.url}/operadores`);
  }
  extraerEstado(codigoTicket: string) {
    return this.http.get<any>(`${this.url}/extraerEstado?scodticket=${codigoTicket}`);
  }
  verificarNuevoOperador(sLogin: string) {
    return this.http.get<any>(`${this.url}/verificaNuevoOperador?sLogin=${sLogin}`);
  }
  registrarOperador(obj:ResponseOperador): Observable<any>{
    return this.http.post<any>(`${this.url}/registrar-operador`,obj);
  }
  listarCbxOperadores() {
    return this.http.get<any>(`${this.url}/cbx-operadores`);
  }
  updateLicencia(obj:ResponseOperador) {
    return this.http.put<any>(`${this.url}/update-licencia`,obj);
  }
  updateOperador(obj:ResponseOperador) {
    return this.http.put<any>(`${this.url}/update-operador`,obj);
  }

  updateLicOpe(obj:any) {
    return this.http.post<any>(`${this.url}/update-lic-ope`,obj);
  }

}
