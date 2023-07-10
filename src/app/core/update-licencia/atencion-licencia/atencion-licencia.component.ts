import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ResponseLicencia } from 'src/app/dto/responseLicencia.dto';
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

  constructor(
    private webexService: WebexService,
    public dialog: MatDialogRef<AtencionLicenciaComponent>,
    private configService: ConfigService,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {
    this.titulo = this.data.title;
    this.operador = this.data.operador;
    this.obj = this.data.usuario;
    console.log(this.operador);
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
  cerrar() {
    this.dialog.close(false);
  }

}
