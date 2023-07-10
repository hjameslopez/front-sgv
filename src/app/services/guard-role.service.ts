import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { SeguridadService } from './seguridad.service';
import { environment } from 'src/environments/environment';
import decode from 'jwt-decode';

@Injectable()
export class GuardRoleService implements CanActivate {

  constructor(private seguridadService: SeguridadService,
              private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // this will be passed from the route config
    // on the data property
    const anyRoles: string[] = route.data.anyRoles;
    if (
      !this.seguridadService.isAuthenticated() ||
      !this.seguridadService.existsRoleAny( anyRoles)
    ) {
      this.seguridadService.logout();
      this.router.navigate([environment.URL_LOGIN]);
      return false;
    }
    return true;
  }
}
