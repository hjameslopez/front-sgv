import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { SeguridadService } from './seguridad.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class GuardAuthService implements CanActivate {

  constructor(public seguridadService: SeguridadService,
              public router: Router) { }

  canActivate(): boolean {
    if (!this.seguridadService.isAuthenticated()) {
      this.seguridadService.logout();
      this.router.navigate([environment.URL_LOGIN]);
      return false;
    }
    return true;
  }
}
