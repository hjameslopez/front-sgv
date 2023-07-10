import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {Autenticacion, AuthOut, Modulo, Usuario} from '../../../models/seguridad.model';
import {HttpResponse} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SeguridadService} from '../../../services/seguridad.service';
import {Router} from '@angular/router';
import {ConfigService} from '../../../services/config.service';
import { WebexService } from 'src/app/services/webex.service';
import { Licencia } from 'src/app/models/licencia.model';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent implements OnInit {

  username: string;
  password: string;

  auth: AuthOut;
  usuario: Usuario;

  hide = true;
  color = 'accent';

  loading: boolean;
  isDisabled: boolean;

  objLicencia: Licencia;

  constructor(private configService: ConfigService,
              private seguridadService: SeguridadService,
              private router: Router,
              private webexService: WebexService,
              public dialog: MatDialogRef<LoginModalComponent>,
              @Inject(MAT_DIALOG_DATA) public dataDialog: any) { }

  ngOnInit() {
    this.loading = false;
    this.isDisabled = false;
  }

  doAutenticar() {
    this.isDisabled = true;
    this.loading = true;

    this.auth = new AuthOut();

    let modulo: Modulo;
    modulo = new Modulo();
    modulo.sModulo = environment.VAR_MODULO;
    modulo.sModulosPermiso = [environment.VAR_PERMISO_SGV];  // array -> string

    let input: Autenticacion;
    input = new Autenticacion();
    input.username = this.username;
    input.password = this.password;
    input.modulo = modulo;

    this.seguridadService.autenticacion(input).subscribe(
      (data: HttpResponse<any>) => {
        // AUTH MAPPING
        this.auth.status = data.status;
        this.auth.type = data.headers.get('authorization').split(/\s(.+)/)[0];  // Bearer
        this.auth.token = data.headers.get('authorization').split(/\s(.+)/)[1].trim();  // Token...
        this.auth.tokenExpire = this.seguridadService.getTokenExpire(data.headers.get('authorization').split(/\s(.+)/)[1].trim());
        if (this.auth.token) {
          if (this.auth.status.toString() === environment.CODE_200) {
            // SAVE DATA & TOKEN
            this.seguridadService.saveData(this.auth);  // saveData(authentication_object)
            
            this.seguridadService.saveToken(this.auth.token, this.auth.tokenExpire); // saveToken(token, expiry_date: seconds)
            
            // GET USER INFORMATION
            this.seguridadService.getObsAutenticacionOut().subscribe( (dataUser: Usuario) => {
              this.usuario = dataUser;

            });
            this.objLicenciaSession();

            this.router.navigate([environment.URL_HOME]);
            
            // SHOW USER MESSAGE
            this.configService.alert(`Bienvenido(a) ${this.usuario.sub}`, 'bottom', 'center');
            // CIERRO MODAL LOGIN
            this.cancelar();

          } else {
            this.configService.alert(`Usuario o contraseña incorrecto.`, 'bottom', 'center');
          }
        } else {
          this.configService.alert(`Error al obtener el token.`, 'bottom', 'center');
        }

      }, (error) => {
        this.isDisabled = false;
        this.loading = false;
      }, () => {
        this.isDisabled = false;
        this.loading = false;
      }
    );

  }

  cancelar() {
    this.dialog.close();
  }

  objLicenciaSession(){
    this.webexService.licenciaAsignada().subscribe((data)=>{
      this.objLicencia = data;
      console.log(this.objLicencia.sCorreo);
      sessionStorage.setItem('licencia',this.objLicencia.sCorreo);
    });
  }

  @HostListener('window:keyup.esc') onKeyUp() {
    this.cancelar();
  }

}
