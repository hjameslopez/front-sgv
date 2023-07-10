import {Injectable} from '@angular/core';
import {HttpHandler, HttpRequest, HttpInterceptor, HttpErrorResponse} from '@angular/common/http';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/internal/operators';
import {ConfigService} from '../services/config.service';
import {environment} from '../../environments/environment';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private configService: ConfigService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError(error => {
        let errorMessage = '';
        if (error instanceof HttpErrorResponse) {
          if (error.error.codigo && error.error.mensaje) {
            // frontend error
            errorMessage = `Código ${error.error.codigo}: ${error.error.mensaje}`;
          } else {
            // backend error
            switch (error.status) {
              case Number(environment.CODE_401): errorMessage = `Error ${error.status}: Credenciales incorrectas.`; break;
              case Number(environment.CODE_404): errorMessage = `Error ${error.status}: El servicio no se encuentra disponible.`; break;
              case Number(environment.CODE_500): errorMessage = `Error ${error.status}: Error de servidor.`; break;
              default: errorMessage = `Error de comunicación con el servicio`;
            }
          }
        } else {
          // backend error
          errorMessage = `Código(x): ${error.status} ${error.message}`;
        }

        // show error message
        this.configService.alert(errorMessage, 'bottom', 'center');
        return throwError(errorMessage);
      })
    );
  }
}
