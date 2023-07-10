import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { APP_BASE_HREF } from '@angular/common';

import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { AppRoutes } from './modules/app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppMaterialModule } from './modules/app-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import { SeguridadService, tokenGetter } from './services/seguridad.service';
import { GuardAuthService } from './services/guard-auth.service';
import { GuardRoleService } from './services/guard-role.service';
import { Page404Component } from './shared/page404/page404.component';
import { LoaderService } from './services/loader.service';
import { HomeComponent } from './shared/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { LoaderInterceptor } from './helpers/loader.interceptor';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { TabDirective } from './directives/tab.directive';
import { ValidatorEqualDirective } from './directives/validator-equal.directive';
import { LoginModalComponent } from './auth/login/login-modal/login-modal.component';
import { ConfigService } from './services/config.service';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AuthorityComponent } from './shared/authority/authority.component';
import { TestComponent } from './shared/test/test.component';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { LoadingComponent } from './shared/loading/loading.component';
import { GestionVideollamadasComponent } from './core/gestion-videollamadas/gestion-videollamadas.component';
import { MatTableExporterModule } from 'mat-table-exporter';
import { AlertComponent } from './shared/alert/alert.component';
import { AtencionVideollamadasComponent } from './core/gestion-videollamadas/atencion-videollamadas/atencion-videollamadas.component';
import { ReportesComponent } from './core/reportes/reportes.component';
import { UpdateLicenciaComponent } from './core/update-licencia/update-licencia.component';
import { AtencionLicenciaComponent } from './core/update-licencia/atencion-licencia/atencion-licencia.component';
import { AtencionOperadorComponent } from './core/update-licencia/atencion-operador/atencion-operador.component';
import { NgxTimerModule } from 'ngx-timer';


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true
};

@NgModule({
  declarations: [
    AppComponent,
    Page404Component,
    HomeComponent,
    LoginComponent,
    TabDirective,
    ValidatorEqualDirective,
    LoginModalComponent,
    AuthorityComponent,
    TestComponent,
    LoadingComponent,
    GestionVideollamadasComponent,
    AlertComponent,
    AtencionVideollamadasComponent,
    ReportesComponent,
    UpdateLicenciaComponent,
    AtencionLicenciaComponent,
    AtencionOperadorComponent
  ],
  entryComponents: [
    LoginModalComponent,
    AlertComponent,
    AtencionVideollamadasComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppMaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(AppRoutes),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: environment.jwtDomainsTokenized
      }
    }),
    PdfViewerModule,
    PerfectScrollbarModule,
    MatTableExporterModule,
    MatIconModule,
    NgxTimerModule
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/sgv' },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
    CookieService,
    JwtHelperService,
    SeguridadService,
    GuardAuthService,
    GuardRoleService,
    LoaderService,
    ConfigService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
