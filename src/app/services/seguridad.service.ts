import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject, interval, Observable, Subscription} from 'rxjs';
import {CookieService} from 'ngx-cookie-service';

import {environment} from 'src/environments/environment';
import {Autenticacion, AuthOut, Usuario} from '../models/seguridad.model';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {JwtHelperService} from '@auth0/angular-jwt';
import decode from 'jwt-decode';

// OK
export function tokenGetter() {
  let valRtn = null;
  const name = environment.VAR_TOKEN + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      valRtn = c.substring(name.length, c.length);
    }
  }
  return valRtn;
}

@Injectable()
export class SeguridadService {

  public VAR_AUTENTICACION = 'rim_autenticacion';
  private _urlService = environment.URL_SVC_SEG;

  private _obsAutenticacionOut: BehaviorSubject<Usuario> = new BehaviorSubject(new Usuario());

  authOut: AuthOut;
  usuario: Usuario;
  subSessionRefresh: Subscription;
  auth: AuthOut;

  constructor(
    private _router: Router,
    private _http: HttpClient,
    private cookieService: CookieService,
    private jwtHelper: JwtHelperService
  ) {
    // this.refreshSessionToken();  SE LLAMA DESDE APP.COMPONENT.
    this.refreshSessionData();

    /* REFRESCO DE TOKEN CONTROLADO "N" VECES => 180000 */
    const periodo = interval(180000);
    this.subSessionRefresh = periodo.subscribe(val => {
      if (this.getToken()) {
        this.refreshSessionToken();
        this.refreshSessionData();
      }
    });

  }

  getObsAutenticacionOut(): Observable<Usuario> {
    return this._obsAutenticacionOut.asObservable();
  }

  autenticacion(input: Autenticacion): Observable<HttpResponse<any>> {
    const url = `${this._urlService}/login`;    
    console.log(url);
    console.log(input);
    return this._http.post(url, input, {observe: 'response'});
  }

  saveData(auth: AuthOut) {
    if (auth) {
      const expireDate = this.createDateLocalAddSeconds(auth.tokenExpire);
      this.cookieService.set(this.VAR_AUTENTICACION, JSON.stringify(auth), expireDate, '/', '', false, 'Lax');
      const token = auth.token;
      if (token && token !== '') {
        const tokenPayload = decode(token);
        this.usuario = new Usuario();
        this.usuario = tokenPayload;
        this._obsAutenticacionOut.next(this.usuario);
      }
    }
  }

  saveToken(tokenAccess: string, tokenExpire: number) {
    const expireDate = this.createDateLocalAddSeconds(tokenExpire);
    this.cookieService.set(environment.VAR_TOKEN, tokenAccess, expireDate, '/', '', false, 'Lax');
  }

  getToken() {
    return this.cookieService.get(environment.VAR_TOKEN);
  }

  public getTokenExpire(tokenAccess: string): number {
    const token = tokenAccess;
    let tokenExpire: number;
    if (token && token !== '') {
      const tokenPayload = decode(token);
      tokenExpire = tokenPayload.exp; // exp = expiry time (seconds)
    }
    return tokenExpire;
  }

  refreshSessionData() {
    const value = this.cookieService.get(this.VAR_AUTENTICACION);
    if (value && value !== '') {
      this.authOut = JSON.parse(value);
      this.saveData(this.authOut);
    }
  }

  refreshSessionToken() {

    const url = `${this._urlService}/token`;
    if (!this.getToken()) {
      return;
    }

    this._http.post(url, null, {observe: 'response'}).subscribe(
      (data: HttpResponse<any>) => {
        // AUTH MAPPING
        this.auth = new AuthOut();
        this.auth.status = data.status;
        this.auth.type = data.headers.get('authorization').split(/\s(.+)/)[0];  // Bearer
        this.auth.token = data.headers.get('authorization').split(/\s(.+)/)[1].trim();  // Token...
        this.auth.tokenExpire = this.getTokenExpire(data.headers.get('authorization').split(/\s(.+)/)[1].trim());
        if (this.auth.token) {
          if (this.auth.status === Number(environment.CODE_200)) {
            // GET USER INFORMATION
            this.getObsAutenticacionOut().subscribe( (dataUser: Usuario) => {
              this.usuario = dataUser;
            });
            // SAVE DATA & TOKEN
            this.saveData(this.auth);  // saveData(authentication_object)
            //console.log('AUtH => ', this.auth);
            this.saveToken(this.auth.token, this.auth.tokenExpire); // saveToken(token, expiry_date: seconds)
          } else {
            console.log('TOKEN EXPIRADO');
          }
        } else {
          console.log('NO HAY TOKEN PARA REFRESH');
        }

      }, (error) => {
        if (error.status) {
          switch (error.status.toString()) {
            case environment.CODE_401: console.log(`(R) No tiene autorización.`); break;
            case environment.CODE_404: console.log(`(R) No se encuentra el servicio de autenticación.`); break;
            case environment.CODE_500: console.log(`(R) Error de servidor.`); break;
          }
        } else {
          console.log(`(R) Service failed`);
        }
      });
  }

  logout() {
    this.cookieService.deleteAll('/');
    return;
  }

  public isAuthenticated(): boolean {
    const token = this.cookieService.get(environment.VAR_TOKEN);
    return !this.jwtHelper.isTokenExpired(token);
  }

  existsRoleAny(anyRoles: any): boolean {
    //debugger;
    const token = this.getToken();
    let jwtRoles: any;
    if (token && token !== '') {
      const tokenPayload = decode(token);
      jwtRoles = tokenPayload.lRoles;
    }

    let valRtn = false;
    if (jwtRoles && anyRoles) {
      for (let i = 0; i < jwtRoles.length; i++) {
        for (let j = 0; j < anyRoles.length; j++) {
          
          if (jwtRoles[i].authority === anyRoles[j]) {
            valRtn = true;
            break;
          }
        }
      }
    }
    return valRtn;
  }

  createDateLocalAddSeconds(valSeconds: number) {
    return new Date(new Date().getTime() + (valSeconds * 1000));
  }

}


