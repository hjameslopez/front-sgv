import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {Resultado} from '../models/resultado.model';
import {HttpClient} from '@angular/common/http';
import {Pais} from '../models/pais.model';

@Injectable({
  providedIn: 'root'
})
export class PaisService {

  private _urlService = environment.URL_SVC_MST;
  url = `${this._urlService}/paises`;

  constructor(private http: HttpClient) { }

  listarPaises() {
    return this.http.get<Resultado>(this.url);
  }
  listarCiudadesPorPais(sIdPais: string) {
    return this.http.get<Resultado>(`${this.url}/${sIdPais}/ciudades`);
  }
  consultarPaises() {
    return this.http.get<Resultado>(`${this.url}/search`);
  }
  registrar(paisBean: Pais) {
    return this.http.post<Resultado>(this.url, paisBean);
  }
  actualizar(paisBean: Pais) {
    return this.http.put<Resultado>(`${this.url}/${paisBean.sIdPais}`, paisBean);
  }
  eliminar(idPais: string) {
    return this.http.delete<Resultado>(`${this.url}/${idPais}`);
  }
  obtener(idPais: string) {
    return this.http.get<Resultado>(`${this.url}/${idPais}`);
  }

}
