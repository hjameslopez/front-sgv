import { Component, Inject, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { WebexService } from 'src/app/services/webex.service';
import { ResponseColaWebexDto } from 'src/app/dto/responseColaWebex.dto';
import { NgxTimerModule, CountupTimerService } from 'ngx-timer';

@Component({
  selector: "app-atencion-videollamadas",
  templateUrl: "./atencion-videollamadas.component.html",
  styleUrls: ["./atencion-videollamadas.component.scss"]
})
export class AtencionVideollamadasComponent implements OnInit {
      
      titulo: any;
      usuario: any;
      obj: ResponseColaWebexDto;
      listaAtencionTicket: ResponseColaWebexDto[] = [];
      botonEstado=false;
      botonCerrar=false;
      botonTerminarLlamada=false;
      timer=false;
      estado:any=0;
      dFecLlamada:any=null;
      licenciaSession = null;
  

  constructor(
    private webexService: WebexService,
    private countupTimerService: CountupTimerService,
    public dialog: MatDialogRef<AtencionVideollamadasComponent>,
    private configService: ConfigService,
    @Inject(MAT_DIALOG_DATA) public data
    )
    { }

  ngOnInit() {
    
    this.titulo = this.data.title;
    this.usuario = this.data.usuario;
    this.obj = this.data.usuario;

    if(sessionStorage.getItem('licencia')!=null){
      this.licenciaSession = sessionStorage.getItem('licencia');
    }
    
    }
  

  //Inicio
  cerrar() {
    //terminar con el temporizador
    this.timer===false;
    this.botonTerminarLlamada=false;
    this.countupTimerService.stopTimer();
    this.dialog.close(false);
  }
  
  jalarLlamada() {
    this.botonEstado=true;
    this.estado=0;
    setTimeout(() => {
      this.cerrar_30Seg();
      
    }, 40000);
      setTimeout(() => {
      //this.cerrarAutomatico();
      this.botonTerminarLlamada=true;
      }, 60000);

      this.obj.sLicenciaAsignar = this.licenciaSession;
      this.webexService.updateAsignarOperador(this.obj).subscribe(
        (response) => {
          this.configService.alert("Enlazando llamada...", 'bottom', 'center');

/*
          this.webexService
            .buscaListAtencionTicket(this.data.sCodTicket)
            .subscribe((response) => {
              this.listaAtencionTicket = response.lista;
              console.log("lista-----------------"+ this.listaAtencionTicket)
              
            });*/
            setTimeout(() => {
              this.validaOperador();

              //Inicia el temporizador desde la validación
              this.timer=true;
              this.countupTimerService.startTimer();
            }, 3000);
        },
        (error) => {
          console.log(error);
    }
    );
    
  }
  validaOperador(){
    this.webexService.getValidaOperador(this.obj.nIdSimVideCola).subscribe(
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
  
  validaCerrarRojo(){
    this.webexService.getValidaCerrar(this.obj.nIdSimVideCola).subscribe(
      (response) => {
       
        if(response.opeOk==333){
          this.configService.alert(response.mensaje, 'bottom', 'center');
        }else{
          this.configService.alert("Cerrar OK", 'bottom', 'center');
          this.cerrar();
        }

      },
      (error) => {
        console.log(error);
      }
    )
  }
  validaCerrar(){
    this.webexService.getValidaCerrar(this.obj.nIdSimVideCola).subscribe(
      (response) => {
        console.log("valida cerrar", response);
        console.log("response ok cerrar", response.opeOk);
        if(response.opeOk==222){
          this.configService.alert(response.mensaje, 'bottom', 'center');
        }else if(response.opeOk==333){
          this.configService.alert(response.mensaje, 'bottom', 'center');
        }else if(response.opeOk==555){
          this.configService.alert(response.mensaje, 'bottom', 'center');
        }
        else{
          this.configService.alert("Cerrar OK", 'bottom', 'center');
          this.cerrar();
        }
      },
      (error) => {
        console.log(error);
      }
    )
  }

  cerrarAutomatico(){
    this.webexService.getValidaCerrar(this.obj.nIdSimVideCola).subscribe(
      (element)=>{
        if(element.opeOk==333){}
        else{
          this.cerrar();
        }
      }
    )
  }

  terminarLLamada() {
    
    this.webexService.getValidaCerrar(this.obj.nIdSimVideCola).subscribe(
      (ele) => {
        if(ele.opeOk==222){
          this.configService.alert(ele.mensaje,'bottom','center');
        }else if(ele.opeOk==333){
          this.configService.alert(ele.mensaje, 'bottom', 'center');
        }else if(ele.opeOk==444){
          this.configService.alert(ele.mensaje, 'bottom', 'center');
        }else{
          this.updateFinLlamada();
        }},
        (error) => {
          console.log(error);
        }
      )
    }

  updateFinLlamada(){
  
    console.log(this.obj)
    this.webexService.updateTerminarLlamada(this.obj).subscribe(
      (response) => {
        
        if(response.lista!=null){
          console.log(response.mensaje);
          
          this.configService.alert(response.mensaje, 'bottom', 'center');
          this.cerrar();
          
        }else{
          console.log(response.mensaje);
          
          this.configService.alert("La llamada NO ha conluido...", 'bottom', 'center');
        }

      },
      (error) => {
        console.log(error);
      }
    );
  }
  cerrar_30Seg(){
    this.webexService.buscaListAtencionTicket(this.obj.nIdSimVideCola).subscribe(

      (response)=>{
        this.estado = response.lista[0].nEstado;
        this.dFecLlamada = response.lista[0].dFecLlamada;
        if(this.estado==5){
          this.configService.alert("La llamada ha sido enlazada...", 'bottom', 'center');
        }else{
          if(this.dFecLlamada==null){
            this.cerrar();
            this.configService.alert("El ciudadano perdió su turno...", 'bottom', 'center');
          }
          else{
            this.configService.alert("Esperar enlace de llamada 30 sec.", 'bottom', 'center');
          }
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }


}
