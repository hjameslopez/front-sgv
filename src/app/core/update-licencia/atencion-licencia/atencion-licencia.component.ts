import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ResponseLicencia } from 'src/app/dto/responseLicencia.dto';
import { ResponseOperador } from 'src/app/dto/responseOperador.dto';
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
  operador2: Operador;
  obj: ResponseLicencia;
  form: FormGroup;
  listaOperadores: Operador[];
  idOpeAntiguo: number;
  idOpeNuevo: number;

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
    console.log(this.operador);
    this.idOpeAntiguo = this.operador.nIdOperador
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
      console.log(this.listaOperadores);
      console.log(this.operador);
      this.listaOperadores.forEach(element => {
        if(!element.sNombre)
        {
          element.sNombre = 'SIN OPERADOR'
        }
      });


      console.log(this.listaOperadores);
      console.log(this.operador);
      if(this.operador){
        let operadorLicencia = new Operador
        operadorLicencia.bActivo = this.operador.bActivo
        operadorLicencia.dFechaHoraAud = this.operador.dFechaHoraAud
        operadorLicencia.nIdLicencia = this.operador.nIdLicencia
        operadorLicencia.nIdOperador = this.operador.nIdOperador
        operadorLicencia.sContraseña = this.operador.sContraseña
        operadorLicencia.sCorreo = this.operador.sCorreo
        operadorLicencia.sLicencia = this.operador.sLicencia
        operadorLicencia.sLogin = this.operador.sLogin
        operadorLicencia.sNombre = this.operador.sNombre
        this.listaOperadores.push(operadorLicencia)

        if(operadorLicencia.nIdOperador == -1)
          this.listaOperadores.shift();

        console.log(this.operador.sNombre)
        if(this.operador.sNombre)
          this.form.controls.sOperador.setValue(operadorLicencia)
        else
          this.form.controls.sOperador.setValue(-1)
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

  actualizaLicencia(){
    console.log(this.operador)
    if(!this.operador2){
      this.operador2 = new Operador
      this.operador2.sLicencia = this.operador.sLicencia
      this.operador2.nIdLicencia = this.operador.nIdLicencia
      //this.operador2.idOpeNuevo = this.form.controls.sOperador.value.nIdOperador
      this.operador2.bActivo = this.form.controls.sOperador.value.bActivo
      this.operador2.dFechaHoraAud = this.form.controls.sOperador.value.dFechaHoraAud
      this.operador2.nIdOperador = this.form.controls.sOperador.value.nIdOperador
      this.operador2.sLogin = this.form.controls.sOperador.value.sLogin
      this.operador2.sNombre = this.form.controls.sOperador.value.sNombre
      //this.operador2.sContraseña = this.form.controls.sPassword.value
      this.operador2.sCorreo = this.operador.sCorreo
    }
    this.operador2.sContraseña = this.form.controls.sPassword.value
    this.operador2.idOpeAntiguo = this.idOpeAntiguo!=null?this.idOpeAntiguo:-1
    this.webexService.updateLicOpe(this.operador2).subscribe(data => {
      if (data.codigo === '222') {
        let resultado = new ResponseOperador
        resultado.sLogin = data.data.sLogin;
        resultado.sNombre = data.data.sNombre;
        resultado.sLicencia = data.data.sLicencia;
        this.dialog.close(resultado);
      }else {
        this.configService.alert('Hubo un error al registrar', 'bottom', 'center');
        this.cerrar()
      }

    }, error => {
      this.configService.alert(error, 'bottom', 'center');
      this.cerrar()
    });

  }

  select(){
    this.operador2 = new Operador
    console.log(this.form.controls.sOperador.value)
    if(this.form.controls.sOperador.value == -1){
      this.operador2.idOpeNuevo = -1
      this.operador2.sLicencia = this.operador.sLicencia
      this.operador2.nIdLicencia = this.operador.nIdLicencia
      this.operador2.bActivo = this.form.controls.sOperador.value.bActivo
      this.operador2.dFechaHoraAud = new Date().toString();
      this.operador2.sContraseña = this.form.controls.sPassword.value
      this.operador2.sLogin = ''
      this.operador2.sNombre = ''
    }
    else {
      this.operador2.sLicencia = this.operador.sLicencia
      this.operador2.nIdLicencia = this.operador.nIdLicencia
      this.operador2.idOpeNuevo = this.form.controls.sOperador.value.nIdOperador
      this.operador2.bActivo = this.form.controls.sOperador.value.bActivo
      this.operador2.dFechaHoraAud = this.form.controls.sOperador.value.dFechaHoraAud
      this.operador2.nIdOperador = this.form.controls.sOperador.value.nIdOperador
      this.operador2.sLogin = this.form.controls.sOperador.value.sLogin
      this.operador2.sNombre = this.form.controls.sOperador.value.sNombre
      this.operador2.sContraseña = this.form.controls.sPassword.value

    }
    console.log(this.operador2)
  }
}
