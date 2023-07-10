import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {environment} from '../../environments/environment';
import {GuardAuthService} from '../services/guard-auth.service';
import {GuardRoleService} from '../services/guard-role.service';
import {Page404Component} from '../shared/page404/page404.component';
import {HomeComponent} from '../shared/home/home.component';
import {LoginComponent} from '../auth/login/login.component';
import {TestComponent} from '../shared/test/test.component';
import {GestionVideollamadasComponent} from '../core/gestion-videollamadas/gestion-videollamadas.component';
import { ReportesComponent } from '../core/reportes/reportes.component';
import { AtencionVideollamadasComponent } from '../core/gestion-videollamadas/atencion-videollamadas/atencion-videollamadas.component';
import { UpdateLicenciaComponent } from '../core/update-licencia/update-licencia.component';
import { AtencionLicenciaComponent } from '../core/update-licencia/atencion-licencia/atencion-licencia.component';

export const AppRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [GuardAuthService]
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'test',
    component: TestComponent,
  },
  {
    path: 'gestion-videollamadas',
    component: GestionVideollamadasComponent,
    /*canActivate: [GuardAuthService, GuardRoleService],
    data: {
      anyRoles: [
        environment.IDROL_PREREGISTRO
      ]
    },*/
  },
  {
    path: 'atencion-videollamadas',
    component: AtencionVideollamadasComponent
  },
  {
    path: 'reportes',
    component: ReportesComponent
  },
  {
    path: 'update-licencia',
    component: UpdateLicenciaComponent,
    canActivate: [GuardAuthService, GuardRoleService],
    data: {
      anyRoles: [
        environment.IDROL_SGV
      ]
    },
  },
  {
    path: 'atencion-licencia',
    component: AtencionLicenciaComponent,
    canActivate: [GuardAuthService, GuardRoleService],
    data: {
      anyRoles: [
        environment.IDROL_SGV
      ]
    },
  },
  {
    path: '**',
    component: Page404Component
  }
];

@NgModule(
  {
    imports: [RouterModule.forRoot(AppRoutes, { enableTracing: false, useHash: false })],
    exports: [RouterModule]
  }
)
export class AppRoutingModule {}
