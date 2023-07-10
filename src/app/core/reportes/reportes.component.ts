import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigService } from 'src/app/services/config.service';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { Subject } from "rxjs";
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import * as FileSaver from 'file-saver';
import { Workbook } from 'exceljs/dist/exceljs'
import { animate, state, style, transition, trigger } from '@angular/animations';
import { VideollamadaRequestDTO } from 'src/app/dto/videollamadaRequestDTO';
import { ResponseColaWebexDto } from 'src/app/dto/responseColaWebex.dto';
import { Licencia } from 'src/app/models/licencia.model';
import { formatDate } from "@angular/common";
import { environment } from "../../../environments/environment";
import { ActivatedRoute, Router } from '@angular/router';
import { WebexService } from 'src/app/services/webex.service';

import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS
} from "@angular/material/core";

import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DatePipe } from '@angular/common';


export const MY_FORMATS = {
  parse: {
    dateInput: "DD/MM/YYYY"
  },
  display: {
    dateInput: "DD/MM/YYYY",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "DD/MM/YYYY",
    monthYearA11yLabel: "MMMM YYYY"
  }
};
@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss'],
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
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    DatePipe
  ]
})
export class ReportesComponent implements OnInit {
  environment;
  form: FormGroup;
  requestVideollamada: VideollamadaRequestDTO;
  responseCola: ResponseColaWebexDto[];
  licencias: Licencia[];

  swVideollamadas = false;
  @ViewChild('paginatorVideollamadas', { static: false }) paginatorVideollamadas: MatPaginator;
  @ViewChild('sortVideollamadas', { static: false }) sortVideollamadas: MatSort;
  dsVideollamadas: MatTableDataSource<ResponseColaWebexDto>;
  dcVideollamadas = [
  "sCodTicket",
  "nEdad",
  "sNombres",
  "sFecCreado",
  "nEstado",
  "sOpeAsignado"
  ];
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

  ngOnInit() {
    this.form = new FormGroup({
      'sfechaInicial': new FormControl(''),
      'sfechaFinal': new FormControl(''),
      'sOperador': new FormControl('', [Validators.required]),
      'sFechaInicialVideollamadas': new FormControl(''),
      'sFechaFinalVideollamadas': new FormControl('')
    });
    this.environment = environment;
    this.lengthVideollamadas = environment.INT_ZERO;
    this.listarLicOpe();
  }
  listarLicOpe() {
    this.webexService.listarLicenciasFiltro().subscribe(data => {
      this.licencias = data;
      console.log(this.licencias);
    });
  }
  getColaTotal() {

    if (!this.form.valid) {
      this.configService.alert('Debe cumplir con todas las validaciones');
      return;
    }
    this.swVideollamadas = true;
    this.requestVideollamada = new VideollamadaRequestDTO();
    this.requestVideollamada.sOpeAsignado = String(this.form.controls.sOperador.value);
    this.requestVideollamada.sfechaInicial = this.form.controls.sFechaInicialVideollamadas.value ? formatDate(this.form.controls.sFechaInicialVideollamadas.value, 'yyyy-MM-dd', 'EN') : '';
    this.requestVideollamada.sfechaFinal = this.form.controls.sFechaFinalVideollamadas.value ? formatDate(this.form.controls.sFechaFinalVideollamadas.value, 'yyyy-MM-dd', 'EN') : '';

    this.webexService.busquedaFiltros(this.requestVideollamada).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
      console.log(data)
      if (1 === 1) {
        this.responseCola = data.lista;
        console.log("reportes.....");
        console.log(this.responseCola);
        if(this.responseCola.length>0){
          this.responseCola.forEach(element => {
            if(element.nEstado=="1"){element.nEstado="Lista Negra"}
            if(element.nEstado=="2"){element.nEstado="En Cola"}
            if(element.nEstado=="3"){element.nEstado="Esperando Aceptación"}
            if(element.nEstado=="4"){element.nEstado="Atendiendo Llamada"}
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
            if(element.sOpeAsignado=="migraperuconf22@migraciones.gob.pe"){element.sOpeAsignado="Erick Fernandez"}

          });
        }
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
  }
  FormatoFecha(dateVal) {
    var newDate = new Date(dateVal);

    var sMonth = this.padValue(newDate.getMonth() + 1);
    var sDay = this.padValue(newDate.getDate());
    var sYear = newDate.getFullYear();
    var sHour = newDate.getHours();
    var sMinute = this.padValue(newDate.getMinutes());
    var sAMPM = "AM";

    var iHourCheck = sHour;

    if (iHourCheck > 12) {
        sAMPM = "PM";
        sHour = iHourCheck - 12;
    }
    else if(iHourCheck==12){
      sAMPM = "PM"
    }
    else if (iHourCheck === 0) {
        sHour = 12;
    }

    sHour = this.padValue(sHour);

    return sDay + "-" +  sMonth + "-" + sYear + " " + sHour + ":" + sMinute + " " + sAMPM;
  }
  padValue(value) {
    return (value < 10) ? "0" + value : value;
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
  getReportVideollamadasXLSX(){
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('REPORTES POR OPERADOR');
    worksheet.mergeCells('B1:D2');
    worksheet.mergeCells('B4:C4');
    worksheet.getCell('B6').style = {
      alignment: {
        horizontal: 'center'
      }
    };
    worksheet.getCell('B6').border = {
      top: { style: "thin" },
      left: { style: "thin" }
    };

    worksheet.getCell('C6').style = {
      alignment: {
        horizontal: 'center'
      }
    };
    worksheet.getCell('C6').border = {
      top: { style: "thin" },
      left: { style: "thin" }
    };

    worksheet.getCell('D6').style = {
      alignment: {
        horizontal: 'center'
      }
    };
    worksheet.getCell('D6').border = {
      top: { style: "thin" },
      left: { style: "thin" }
    };

    worksheet.getCell('E6').style = {
      alignment: {
        horizontal: 'center'
      }
    };
    worksheet.getCell('E6').border = {
      top: { style: "thin" },
      left: { style: "thin" }
    };

    worksheet.getCell('F6').style = {
      alignment: {
        horizontal: 'center'
      }
    };
    worksheet.getCell('F6').border = {
      top: { style: "thin" },
      left: { style: "thin" }
    };

    worksheet.getCell('G6').style = {
      alignment: {
        horizontal: 'center'
      }
    };
    worksheet.getCell('G6').border = {
      top: { style: "thin" },
      left: { style: "thin" }
    };

    worksheet.getCell('H6').style = {
      alignment: {
        horizontal: 'center'
      }
    };
    worksheet.getCell('H6').border = {
      top: { style: "thin" },
      left: { style: "thin" }
    };
    worksheet.getColumn('E').style = {
      alignment: {
        horizontal: 'center'
      }
    };

    let sOpeAsignado = String(this.form.controls.sOperador.value);
    let sfechaInicial = this.form.controls.sFechaInicialVideollamadas.value ? formatDate(this.form.controls.sFechaInicialVideollamadas.value, 'yyyy-MM-dd', 'EN') : '';
    let sfechaFinal = this.form.controls.sFechaFinalVideollamadas.value ? formatDate(this.form.controls.sFechaFinalVideollamadas.value, 'yyyy-MM-dd', 'EN') : '';


    
    worksheet.getCell('B1:D2').value = 'REPORTE';
    worksheet.getCell('B4:C4').value = 'LICENCIA';
    worksheet.getCell('D4').value = sOpeAsignado;
    worksheet.getCell('E4').value = 'FECHA INICIAL:';
    worksheet.getCell('F4').value = sfechaInicial;
    worksheet.getCell('G4').value = 'FECHA FINAL:';
    worksheet.getCell('H4').value = sfechaFinal;

    worksheet.getCell('B6').value = 'N°';
    worksheet.getCell('C6').value = 'TICKET';
    worksheet.getCell('D6').value = 'NOMBRES y APELLIDOS';
    worksheet.getCell('E6').value = 'EDAD';
    worksheet.getCell('F6').value = 'FECHA y HORA';
    worksheet.getCell('G6').value = 'ESTADO';
    worksheet.getCell('H6').value = 'OPERADOR';

    worksheet.getColumn('B').width = 4;
    worksheet.getColumn('C').width = 23;
    worksheet.getColumn('D').width = 55;
    worksheet.getColumn('E').width = 22;
    worksheet.getColumn('F').width = 22;
    worksheet.getColumn('G').width = 22;
    worksheet.getColumn('H').width = 35;

    worksheet.getCell('B1:D2').fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "ff4f81bd" }
    };
    worksheet.getCell('B4:C4').fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "ff1f497d" }
    };
    worksheet.getCell('D4').fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "ff1f497d" }
    };
    worksheet.getCell('E4').fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "ff1f497d" }
    };
    worksheet.getCell('F4').fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "ff1f497d" }
    };
    worksheet.getCell('G4').fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "ff1f497d" }
    };
    worksheet.getCell('H4').fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "ff1f497d" }
    };

    worksheet.getCell('B1:D2').font = { bold: true, size:24 };
    worksheet.getCell('B1:D2').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('G4').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('B6').fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "ff1f497d" }
    };
    
    worksheet.getCell('B6').font = { bold: true,
      color: {  argb : 'ffffffff'  }};
    worksheet.getCell('C6').fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "ff1f497d" },
      bgColor:{argb: "ffffffff"}
    };
    worksheet.getCell('C6').font = { bold: true,
      color: {  argb : 'ffffffff'  } };
    worksheet.getCell('D6').fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "ff1f497d" },
      bgColor:{argb: "ffffffff"}
    };
    
    worksheet.getCell('D6').font = { bold: true,
      color: {  argb : 'ffffffff'  } };
    worksheet.getCell('E6').fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "ff1f497d" },
      bgColor:{argb: "ffffffff"}
    };
    worksheet.getCell('E6').font = { bold: true,
      color: {  argb : 'ffffffff'  } };
    worksheet.getCell('F6').fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "ff1f497d" },
      bgColor:{argb: "ffffffff"}
    };
    worksheet.getCell('F6').font = { bold: true,
      color: {  argb : 'ffffffff'  } };
    worksheet.getCell('G6').fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "ff1f497d" },
      bgColor:{argb: "ffffffff"}
    };
    worksheet.getCell('G6').font = { bold: true,
      color: {  argb : 'ffffffff'  } };
    worksheet.getCell('H6').fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "ff1f497d" },
      bgColor:{argb: "ffffffff"}
    };
    worksheet.getCell('H6').font = { bold: true,
      color: {  argb : 'ffffffff'  } };
    worksheet.getCell('H6').border = {
      top: {style:'thin'},
      left: {style:'thin'},
      bottom: {style:'thin'},
      right: {style:'thin'}
    };
    
    let index = 0;
    this.responseCola.forEach(element => {
      index ++;
      const fila = [
        '',
        index, 
        element.sCodTicket != null ? element.sCodTicket : '',
        element.sNombres != null ? element.sNombres : '',
        element.nEdad != null ? element.nEdad : '',
        //element.dFecCreado != null  ? this.FormatoFecha(element.dFecCreado) : '',
        element.dFecCreado != null  ? element.dFecCreadoAMPM : '',
        element.nEstado != null ? element.nEstado : '',
        element.sOpeAsignado != null ? element.sOpeAsignado : ''

      ]
      let row = worksheet.addRow(fila);

      worksheet.getCell('B4:C4').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      worksheet.getCell('D4').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      worksheet.getCell('E4').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      worksheet.getCell('F4').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      worksheet.getCell('G4').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      worksheet.getCell('H4').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }

      worksheet.getCell('B4:C4').font = { bold: true, size:12,
        color: {  argb : 'ffffffff'  } };
      worksheet.getCell('D4').font = { bold: true, size:12,
        color: {  argb : 'ffffffff'  } };
      worksheet.getCell('E4').font = { bold: true, size:12,
        color: {  argb : 'ffffffff'  } };
      worksheet.getCell('F4').font = { bold: true, size:12,
        color: {  argb : 'ffffffff'  } };
      worksheet.getCell('G4').font = { bold: true, size:12,
        color: {  argb : 'ffffffff'  } };
      worksheet.getCell('H4').font = { bold: true, size:12,
        color: {  argb : 'ffffffff'  } };


      row.getCell(2).border = { top: { style: 'medium' }, left: { style: 'medium' }, bottom: { style: 'medium' }, right: { style: 'medium' } }
      for (let i = 2; i <= fila.length; i++) {
        if (i === fila.length || i === fila.length - 1 || i === fila.length - 2 || i === fila.length - 6) {
          row.getCell(i).style = {
            alignment: {
              horizontal: 'center'
            }
          };
        }
        row.getCell(i).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      }

    });
    

    workbook.xlsx.writeBuffer()
      .then((data) => {
        const blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
        FileSaver.saveAs(blob, 'Reporte-Operador.xlsx');

      })
      .catch(err => console.log('Error writing excel export', err));

  }

  

}
