import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {SeguridadService} from './seguridad.service';
import {MatDialog} from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  // SWITCH DE BOTÓN VOLVER
  public _obsVolver: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private route: Router,
              private snackBar: MatSnackBar,
              private seguridadService: SeguridadService,
              public dialog: MatDialog) { }

  triggerVolver(): Observable<boolean> {
    return this._obsVolver.asObservable();
  }

  link(url: string, rol: string) {
    this.anyRole(rol) ?
      this.route.navigate([url]) :
      this.alert('Acceso restringido, no tiene autorización.');
  }

  anyRole(role: string) {
    const roles = Array.of(role);
    return this.seguridadService.existsRoleAny(roles);
  }

  

  alert(message: string, positionVertical?: any, positionHorizontal?: any, actionButton?: string, duration?: number) {
    this.snackBar.open(message, actionButton ? actionButton : 'Ok', {
      verticalPosition: positionVertical ? positionVertical : 'bottom',
      horizontalPosition: positionHorizontal ? positionHorizontal  : 'left',
      duration: duration ? duration : 3000,
    });
  }

}
