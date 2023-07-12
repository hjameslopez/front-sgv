import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { ResponseOperador } from 'src/app/dto/responseOperador.dto';
import { ConfigService } from 'src/app/services/config.service';
import { WebexService } from 'src/app/services/webex.service';

@Component({
  selector: 'app-nuevo-operador',
  templateUrl: './nuevo-operador.component.html',
  styleUrls: ['./nuevo-operador.component.scss']
})
export class NuevoOperadorComponent implements OnInit {
  titulo = 'Registro Operador';
  form: FormGroup;
  mostrarNombre = false;
  nombreOperador: string;
  responseLogin: string;
  responseNombre: string;
  responseId: number;
  constructor(
    public dialog: MatDialogRef<NuevoOperadorComponent>,
    private webexService: WebexService,
    private configService: ConfigService
  ) { }

  ngOnInit() {

    this.form = new FormGroup({
      'sLogin': new FormControl('', [Validators.required]),
      'sNombre': new FormControl('', [Validators.required])
    });
  }

  cerrar() {
    this.dialog.close(false);
  }

  cerrarData() {
    let resultado = new ResponseOperador
    resultado.sLogin = this.responseLogin;
    resultado.sNombre = this.responseNombre;
    resultado.nIdOperador = this.responseId;
    this.dialog.close(resultado);
  }

  registrar(){
    let operador = new ResponseOperador
    operador.sLogin = this.form.controls.sLogin.value.trim()
    this.webexService.registrarOperador(operador).subscribe(data => {
      if (data.codigo === '200') {
        this.responseId = data.data
        this.configService.alert('Se registró correctamente', 'bottom', 'center');
        this.cerrarData()
      } else {
        this.configService.alert('Hubo un error al registrar', 'bottom', 'center');
        this.cerrar()
      }

    }, error => {
      this.configService.alert(error, 'bottom', 'center');
      this.cerrar()
    });
  }

  validarNuevoOperador(){
    const login = this.form.controls.sLogin.value.trim()
    this.webexService.verificarNuevoOperador(login).subscribe(
      (response) => {
        if(response.cod==111 || response.cod==333 || response.cod==444){
          this.configService.alert(response.mensaje, 'bottom', 'center');
         // this.cerrar();
        }
        else if (response.cod==222){
          this.responseLogin = response.operador.sLogin
          this.responseNombre = response.operador.sNombre
          this.mostrarNombre = true;
          this.form.controls.sNombre.setValue(response.operador.sNombre);
        }

      },
      (error) => {
        this.configService.alert(error, 'bottom', 'center');
      }
    )
  }

}
