import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Subject } from "rxjs";
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from "@angular/router";
import { ConfigService } from "../../services/config.service";
import { MatDialog } from "@angular/material/dialog";
import { environment } from "../../../environments/environment";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { formatDate } from "@angular/common";
import { VideollamadaRequestDTO } from "src/app/dto/videollamadaRequestDTO";
import { WebexService } from "src/app/services/webex.service";
import { ResponseColaWebexDto } from "src/app/dto/responseColaWebex.dto";
import { AtencionVideollamadasComponent } from "./atencion-videollamadas/atencion-videollamadas.component";
import { Licencia } from "src/app/models/licencia.model";


@Component({
  selector: "app-gestion-videollamadas",
  templateUrl: "./gestion-videollamadas.component.html",
  styleUrls: ["./gestion-videollamadas.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed, void", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed, void => collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class GestionVideollamadasComponent implements OnInit, OnDestroy {
  environment;
  form: FormGroup;
  form2: FormGroup;
  selectedRowIndex:any;
  requestVideollamada: VideollamadaRequestDTO;
  responseCola: ResponseColaWebexDto[];
  responseColaSinHorario: ResponseColaWebexDto[];
  semana = true;
  marca:number;


  @ViewChild("paginatorColaEstado2", { static: false })
  paginatorColaEstado2: MatPaginator;
  @ViewChild("sortColaEstado2", { static: false }) sortColaEstado2: MatSort;
  dsColaEstado2: MatTableDataSource<ResponseColaWebexDto>;
  dcColaEstado2 = [
    "sCodTicket2",
    "nEdad2",
    "sNombres2",
    "sFecCreado2"
    
  ];
  lengthColaEstado2: number;



  @ViewChild("paginatorCola", { static: false })
  paginatorCola: MatPaginator;
  @ViewChild("sortCola", { static: false }) sortCola: MatSort;
  dsCola: MatTableDataSource<ResponseColaWebexDto>;
  dcCola = [
    "sCodTicket",
    "nEdad",
    "sNombres",
    "sFecCreado",
    "nEstado",
    "sOpeAsignado"
    
  ];
  lengthCola: number;

  swVideollamadas = false;
  @ViewChild('paginatorVideollamadas', { static: false }) paginatorVideollamadas: MatPaginator;
  @ViewChild('sortVideollamadas', { static: false }) sortVideollamadas: MatSort;
  dsVideollamadas: MatTableDataSource<ResponseColaWebexDto>;
  dcVideollamadas = ["sCodTicket",
  "nEdad",
  "sNombres",
  "sFecCreado",
  "nEstado",
  "sOpeAsignado"];
  lengthVideollamadas: number;


  protected unsubscribe: Subject<void> = new Subject<void>();
  constructor(
    private configService: ConfigService,
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private webexService: WebexService
  ) {
    this.configService._obsVolver.next(true);
  }
  ngOnDestroy(): void {
    this.marca=2;
  }

  CambiarTab(index){
    console.log(index);
    if(index ===0){this.marca=0;this.getColaEstado2(1)}
    if(index ===1){this.marca=1;this.getColaEstados(1)}
  }

  ngOnInit() {
    this.form = new FormGroup({
      'sfechaInicial': new FormControl(''),
      'sfechaFinal': new FormControl(''),
      'sOperador': new FormControl('', [Validators.required]),
      'sFechaInicialVideollamadas': new FormControl(''),
      'sFechaFinalVideollamadas': new FormControl(''),
      
    });
    //marca 0 trae la cola
    this.marca=0;
    this.getColaEstados(1);
    this.getColaEstado2(1);
    
  }

  getDiaString(fechaString) {
    //const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const fecha = new Date(fechaString);
    //const dia = fecha.getDay();
  
    return fecha.getDay();
  }

//Listado del historial 
    getColaEstados(bActivo: number) {
      //console.log("getcolaestados")
      this.semana=true;
      /*
      if(this.marca==1){
        setTimeout(() => {
          this.getColaEstados(1);
          
        }, 20000);
      }
      */
      
      this.webexService.getColaEstados(bActivo).pipe(takeUntil(this.unsubscribe)).subscribe((data) => {
        
          this.responseColaSinHorario = data.lista;
          
          this.responseCola = this.responseColaSinHorario.filter(x => {
            var hora = new Date(x.dFecCreado).getHours();
            return hora >= 7 && hora <= 20; 
            }            
          );
          if(this.responseColaSinHorario.length>0){
            if(this.getDiaString(data.lista[0].dFecCreado)===6){     //si es sábado
              this.semana = false;
              this.responseCola = this.responseColaSinHorario.filter(x => {
                var hora = new Date(x.dFecCreado).getHours();
                return hora >= 8 && hora <= 17; 
                }            
              );
            }
          }
          if(this.responseCola.length>0){
            this.responseCola.forEach(element => {
              if(element.nEstado=="1"){element.nEstado="Lista Negra"}
              if(element.nEstado=="2"){element.nEstado="En Cola"}
              if(element.nEstado=="3"){element.nEstado="Esperando Aceptación"}
              if(element.nEstado=="4"){element.nEstado="Atendiendo Llamada"}//el ciudadano seleccionó llamar
              if(element.nEstado=="5"){element.nEstado="Concluida"}
              if(element.nEstado=="6"){element.nEstado="Perdida"}//{element.nEstado="Perdió Turno"}
              if(element.nEstado=="7"){element.nEstado="Perdida"}//{element.nEstado="Canceló cola"}
              if(element.nEstado=="8"){element.nEstado="Perdida"}//{element.nEstado="Cerró el navegador"}
              element.dFecCreadoAMPM = this.FormatoFecha(element.dFecCreado)
              element.nEdad = this.calcularEdad(element.nEdad).toString()

              if(element.sOpeAsignado=="migraperuconf02@migraciones.gob.pe"){element.sOpeAsignado="Valeria Valderrama"}
            if(element.sOpeAsignado=="migraperuconf03@migraciones.gob.pe"){element.sOpeAsignado="Diana Rojas"}
            if(element.sOpeAsignado=="migraperuconf04@migraciones.gob.pe"){element.sOpeAsignado="Erick Villanueva"}
            if(element.sOpeAsignado=="migraperuconf05@migraciones.gob.pe"){element.sOpeAsignado="Jacqueline Garces"}
            if(element.sOpeAsignado=="migraperuconf06@migraciones.gob.pe"){element.sOpeAsignado="Johanna Gutierrez"}
            if(element.sOpeAsignado=="migraperuconf07@migraciones.gob.pe"){element.sOpeAsignado="Celeste Salvatierra"}
            if(element.sOpeAsignado=="migraperuconf08@migraciones.gob.pe"){element.sOpeAsignado="Keila Mamani"}
            if(element.sOpeAsignado=="migraperuconf09@migraciones.gob.pe"){element.sOpeAsignado="Priscila Mory"}
            if(element.sOpeAsignado=="migraperuconf10@migraciones.gob.pe"){element.sOpeAsignado="Kate Alván"}
            if(element.sOpeAsignado=="migraperuconf11@migraciones.gob.pe"){element.sOpeAsignado="Cristina Gabriel"}
            if(element.sOpeAsignado=="migraperuconf12@migraciones.gob.pe"){element.sOpeAsignado="Gretel Mejía"}
            if(element.sOpeAsignado=="migraperuconf13@migraciones.gob.pe"){element.sOpeAsignado="Benancio Huaroma"}
            if(element.sOpeAsignado=="migraperuconf14@migraciones.gob.pe"){element.sOpeAsignado="Lorena Hurtado"}
            if(element.sOpeAsignado=="migraperuconf15@migraciones.gob.pe"){element.sOpeAsignado="Gisella Carcamo"}
            if(element.sOpeAsignado=="migraperuconf16@migraciones.gob.pe"){element.sOpeAsignado="Lizbeth Cuadros"}
            if(element.sOpeAsignado=="migraperuconf17@migraciones.gob.pe"){element.sOpeAsignado="Norma Barreto"}
            if(element.sOpeAsignado=="migraperuconf18@migraciones.gob.pe"){element.sOpeAsignado="Valeria Castillo"}
            if(element.sOpeAsignado=="migraperuconf19@migraciones.gob.pe"){element.sOpeAsignado="Luis Sanchez"}
            if(element.sOpeAsignado=="migraperuconf20@migraciones.gob.pe"){element.sOpeAsignado="Patricia Canani"}
            if(element.sOpeAsignado=="migraperuconf21@migraciones.gob.pe"){element.sOpeAsignado="Mirtha Benavente"}
            if(element.sOpeAsignado=="migraperuconf22@migraciones.gob.pe"){element.sOpeAsignado="Erick Fernandez"}

              


            });
          }

          this.dsCola = new MatTableDataSource<ResponseColaWebexDto>(
            this.responseCola
          );
          this.dsCola.paginator = this.paginatorCola;
          this.dsCola.sort = this.sortCola;
          if(this.responseCola!=null)
            this.lengthCola = this.responseCola.length;
      });
    }
//Listado de la cola
    getColaEstado2(bActivo: number) {
      /*
      if(this.marca==0){
          setTimeout(() => {
          this.getColaEstado2(1);
          
        }, 15000);
    }
    */
      this.webexService.getColaEstado2(bActivo).pipe(takeUntil(this.unsubscribe)).subscribe((data) => {
        
        if (1 === 1) {

          this.responseColaSinHorario = data.lista;
          this.responseCola = this.responseColaSinHorario.filter(x => {
            var hora = new Date(x.dFecCreado).getHours();
            return hora >= 7 && hora <= 20; 
            }            
          );
          if(this.responseColaSinHorario.length>0){
            if(this.getDiaString(data.lista[0].dFecCreado)===6){     //si es sábado
              this.semana = false;
              this.responseCola = this.responseColaSinHorario.filter(x => {
                var hora = new Date(x.dFecCreado).getHours();
                return hora >= 8 && hora <= 17; 
                }            
              );
            }
          }
          if(this.responseCola.length>0){
            this.responseCola.forEach(element => {
              if(element.nEstado=="1"){element.nEstado="Lista negra"}
              if(element.nEstado=="2"){element.nEstado="En Cola"}
              if(element.nEstado=="3"){element.nEstado="Esperando Aceptación"}
              if(element.nEstado=="4"){element.nEstado="Atendiendo llamada"}
              if(element.nEstado=="5"){element.nEstado="Llamada Culminada"}
              if(element.nEstado=="6"){element.nEstado="Llamada perdida"}//{element.nEstado="Perdió Turno"}
              if(element.nEstado=="7"){element.nEstado="Llamada perdida"}//{element.nEstado="Canceló cola"}
              if(element.nEstado=="8"){element.nEstado="Llamada perdida"}//{element.nEstado="Cerró el navegador"}
              element.dFecCreadoAMPM = this.FormatoFecha(element.dFecCreado)
              element.nEdad = this.calcularEdad(element.nEdad).toString()


            });
          }

          this.dsColaEstado2 = new MatTableDataSource<ResponseColaWebexDto>(
            this.responseCola
          );
          this.dsColaEstado2.paginator = this.paginatorColaEstado2;
          this.dsColaEstado2.sort = this.sortColaEstado2;
          if(this.responseCola!=null)
            this.lengthCola = this.responseCola.length;}
      });
    }
    padValue(value) {
      return (value < 10) ? "0" + value : value;
    }

    FormatoFecha(dateVal) {
      var newDate = new Date(dateVal);
  
      //var sMonth = this.padValue(newDate.getMonth() + 1);
      //var sDay = this.padValue(newDate.getDate());
      //var sYear = newDate.getFullYear();
      var sHour = newDate.getHours();
      var sMinute = this.padValue(newDate.getMinutes());
      var sAMPM = "AM";
  
      var iHourCheck = sHour;
  
      if (iHourCheck > 12) {
          sAMPM = "PM";
          sHour = iHourCheck - 12;
      }else if(iHourCheck==12){
        sAMPM = "PM"
      }
      else if (iHourCheck === 0) {
          sHour = 12;
      }
  
      sHour = this.padValue(sHour);
  
      return /*sMonth + "-" + sDay + "-" + sYear + " " + */sHour + ":" + sMinute + " " + sAMPM;
  }
  

  highlight(row){  
    //console.log(row)
    this.selectedRowIndex=row.nIdSimVideCola;
    this.marca=2;
    const dialogRef = this.dialog.open(AtencionVideollamadasComponent, {
      data: { title: "Atención", usuario: row },
      disableClose: true,
      width:"40em",
      height:"auto"

    });
    dialogRef.afterClosed().subscribe((result) => {
      this.marca=0;
    
      this.getColaEstados(1);
      this.getColaEstado2(1);
      
    });
  }
  calcularEdad(fecNac) {
    var hoy = new Date();
    var cumpleanos = new Date(fecNac);
    var edad = hoy.getFullYear() - cumpleanos.getFullYear();
    var m = hoy.getMonth() - cumpleanos.getMonth();
  
    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
        edad--;
    }
  
    return edad;
  }
  actualizarCola(){
    this.getColaEstado2(1);
  }
  actualizarHistorial(){
    this.getColaEstados(1);
  }
  /*
  getColaTotal() {

    if (!this.form.valid) {
      this.configService.alert('Debe cumplir con todas las validaciones');
      return;
    }
    this.swVideollamadas = true;
    this.requestVideollamada = new VideollamadaRequestDTO();
    //this.requestVideollamada.sOperador = this.form.controls.sTipoAlerta.value;
    this.requestVideollamada.sfechaInicial = this.form.controls.sFechaInicialVideollamadas.value ? formatDate(this.form.controls.sFechaInicialVideollamadas.value, 'dd-MM-yyyy', 'EN') : '';
    this.requestVideollamada.sfechaFinal = this.form.controls.sFechaFinalVideollamadas.value ? formatDate(this.form.controls.sFechaFinalVideollamadas.value, 'dd-MM-yyyy', 'EN') : '';

    this.webexService.busquedaVideollamadas(this.requestVideollamada).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
      if (data.codigo === environment.CODE_200) {
        this.responseCola = data.data;
        this.dsVideollamadas = new MatTableDataSource<ResponseColaWebexDto>(this.responseCola);
        this.dsVideollamadas.paginator = this.paginatorVideollamadas;
        this.dsVideollamadas.sort = this.sortVideollamadas;
        this.lengthVideollamadas = this.responseCola.length;
      } else {
        this.swVideollamadas = false;
        this.configService.alert(`Código ${data.codigo}: ${data.mensaje}`);
      }
    }, errorVideollamadas => {
      console.log('errorVideollamadas: ', errorVideollamadas);
      this.swVideollamadas = false;
    }, () => {
      this.swVideollamadas = false;
    });
  }*/

}
