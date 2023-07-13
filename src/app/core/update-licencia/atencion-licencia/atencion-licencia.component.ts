import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ResponseLicencia } from 'src/app/dto/responseLicencia.dto';
import { Operador } from 'src/app/models/operador.model';
import { ConfigService } from 'src/app/services/config.service';
import { WebexService } from 'src/app/services/webex.service';

@Component({
  selector: 'app-atencion-licencia',
  templateUrl: './atencion-licencia.component.html',
  styleUrls: ['./atencion-licencia.component.scss']
})
export class AtencionLicenciaComponent implements OnInit {
  titulo: any;
  operador: any;
  obj: ResponseLicencia;
  form: FormGroup;
  listaOperadores: Operador[];
  seleccion: string;

  constructor(
    private webexService: WebexService,
    public dialog: MatDialogRef<AtencionLicenciaComponent>,
    private configService: ConfigService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.listarCbxOperadores();
  }

  ngOnInit() {
    this.titulo = this.data.title;
    this.operador = this.data.operador;
    this.obj = this.data.usuario;
    this.form = new FormGroup({
      'sLicencia': new FormControl('', [Validators.required]),
      'sPassword': new FormControl(''),
      'sOperador': new FormControl('', [Validators.required])
    });
    this.cargarOperador()
/*
    this.form = new FormGroup({
      'sIdDocumento': new FormControl('DNI', [Validators.required]),  // string
      'sNumeroDocumento': new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(15), Validators.pattern('^[A-Z0-9]*$')]),  // string
      'sIdPaisNacimiento': new FormControl('PER', [Validators.required]), // string
    });
*/
  }/*
  validarIdLogin(){
    this.webexService.getValidaIdLogin(sIdLogin).subscribe(

    );
  }
  validaOperador(){
    this.webexService.getValidaOperador(this.obj.sCodTicket).subscribe(
      (response) => {
        console.log("valida operador",response);
        if(response.opeOk==333){
          this.configService.alert("La llamada ha sido asignada a otro operador...", 'bottom', 'center');
          this.cerrar();
        }else if(response.opeOk==0){
          this.configService.alert("ERROR en la licencia de Webex...", 'bottom', 'center');
          this.cerrar();
        }
        else{
          this.configService.alert("Esperando aceptación del usuario...", 'bottom', 'center');
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
*/
  listarCbxOperadores() {
    this.webexService.listarCbxOperadores().subscribe(data => {
      this.listaOperadores = data;
      console.log(this.operador);
      if(this.operador){
        let operadorLicencia = new Operador
        operadorLicencia.bActivo = this.operador.bActivo
        operadorLicencia.dFechaHoraAud = this.operador.dFechaHoraAud
        operadorLicencia.nIdLicencia = this.operador.nIdLicencia
        operadorLicencia.sContraseña = this.operador.sContraseña
        operadorLicencia.sCorreo = this.operador.sCorreo
        operadorLicencia.sLicencia = this.operador.sLicencia
        operadorLicencia.sLogin = this.operador.sLogin
        operadorLicencia.sNombre = this.operador.sNombre
        this.listaOperadores.push(operadorLicencia)
        console.log(this.listaOperadores)
        console.log(operadorLicencia.sLogin)
        this.seleccion = operadorLicencia.sLogin;
        this.form.controls.sOperador.setValue(this.seleccion)
      }
    });
  }

  cerrar() {
    this.dialog.close(false);
  }

  cargarOperador(){
    this.form.controls.sLicencia.setValue(this.operador.sLicencia)
    this.form.controls.sPassword.setValue(this.operador.sContraseña)
  }
}
