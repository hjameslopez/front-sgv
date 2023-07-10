import {Component, OnInit, OnDestroy} from '@angular/core';
import {environment} from '../environments/environment';
import {formatDate, Location} from '@angular/common';
import {Router} from '@angular/router';
import {SeguridadService} from './services/seguridad.service';
import {Usuario} from './models/seguridad.model';
import {Subscription} from 'rxjs';
import {ConfigService} from './services/config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  usuario: Usuario;
  subs: Subscription;
  trigger: Subscription;
  environment;
  public currentYear: string;
  showBackButton: boolean;

  constructor(public router: Router,
              private location: Location,
              private configService: ConfigService,
              private seguridadService: SeguridadService) {
    if (this.location.path() === '/login') {
      // ELIMINA COOKIES SI URL PATH = /login
      this.seguridadService.logout();
    } else {
      // ACTUALIZA EL TOKEN CUANDO SE ACTUALIZA EL BROWSER
      this.seguridadService.refreshSessionToken();
    }

    // OBTIENE DATOS DEL USUARIO AUTENTICADO
    this.subs = this.seguridadService.getObsAutenticacionOut().subscribe(
      (data: Usuario) => {
        this.usuario = data;
      }
    );

    // TRIGGER PARA BOTÓN VOLVER
    this.trigger = this.configService.triggerVolver().subscribe(data => {
      this.showBackButton = data;
    });

  }

  ngOnInit() {
    this.environment = environment;
    // CURRENT YEAR
    const date = new Date();
    this.currentYear = formatDate(date, 'yyyy', 'en-US');
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
    this.trigger.unsubscribe();
  }

  doLogout() {
    this.seguridadService.logout();
    this.router.navigate([environment.URL_LOGIN]);
    sessionStorage.removeItem('licencia');
  }

  isAuthenticated(): boolean {
    if (!this.seguridadService.isAuthenticated()) {
      this.router.navigate([environment.URL_LOGIN]);
      return this.seguridadService.isAuthenticated();
    } else {
      return this.seguridadService.isAuthenticated();
    }
  }

}
