import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ResponseLicencia } from 'src/app/dto/responseLicencia.dto';
import { ConfigService } from 'src/app/services/config.service';
import { WebexService } from 'src/app/services/webex.service';
import { environment } from 'src/environments/environment';
import { AtencionLicenciaComponent } from './atencion-licencia/atencion-licencia.component';
import { ResponseOperador } from 'src/app/dto/responseOperador.dto';
import { NuevoOperadorComponent } from './nuevo-operador/nuevo-operador.component';

@Component({
  selector: 'app-update-licencia',
  templateUrl: './update-licencia.component.html',
  styleUrls: ['./update-licencia.component.scss'],
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
export class UpdateLicenciaComponent implements OnInit {

  licencias: ResponseLicencia[];
  operadores: ResponseOperador[];
  selectedRowIndex:any;

  @ViewChild("paginatorLicencia", { static: false })
  paginatorLicencia: MatPaginator;
  @ViewChild("sortLicencia", { static: false }) sortLicencia: MatSort;
  dsLicencia: MatTableDataSource<ResponseLicencia>;
  dcLicencia = ["nIdLicencia", "sLicencia", "sNombre", "acciones"];
  lengthLicencia: number;

  @ViewChild("paginatorOperador", { static: false })
  paginatorOperador: MatPaginator;
  @ViewChild("sortOperador", { static: false }) sortOperador: MatSort;
  dsOperador: MatTableDataSource<ResponseOperador>;
  dcOperador = ["nIdOperador", "sLogin", "sNombre", "acciones"];
  lengthOperador: number;

  constructor(
    private configService: ConfigService,
    private webexService: WebexService,
    public dialog: MatDialog
  ) {
    this.configService._obsVolver.next(true);
    this.listarLicencias();
    this.listarOperadores();
  }
  CambiarTab(index){
    //console.log(index);
    if(index ===0){this.listarLicencias()}
    if(index ===1){this.listarOperadores()}
  }

  ngOnInit() {
  }

  listarLicencias() {
    this.webexService.listarLicenciasFiltro().subscribe(data => {
      this.licencias = data;
      console.log(this.licencias);
      this.dsLicencia = new MatTableDataSource<ResponseLicencia>(this.licencias);
      this.dsLicencia.paginator = this.paginatorLicencia;
      this.dsLicencia.sort = this.sortLicencia;
      if(this.licencias!=null)
      this.lengthLicencia = this.licencias.length;
    });
  }
  listarOperadores() {
    this.webexService.listarOperadoresFiltro().subscribe(data => {
      this.operadores = data;
      console.log(this.operadores);
      this.dsOperador = new MatTableDataSource<ResponseOperador>(this.operadores);
      this.dsOperador.paginator = this.paginatorOperador
      this.dsOperador.sort = this.sortOperador
      if(this.operadores!=null)
      this.lengthOperador= this.operadores.length;
    });
  }

  seleccionarLicencia(row){
    console.log(row)
    this.selectedRowIndex=row.nIdSimVideCola;
    const dialogRef = this.dialog.open(AtencionLicenciaComponent, {
      data: { title: "Actualizar Licencia", operador: row },
      disableClose: true,
      width:"40em",
      height:"auto"

    });
    dialogRef.afterClosed().subscribe((result) => {
      this.listarLicencias();
    });

  }
  seleccionarOperador(row){
    console.log(row)
    this.selectedRowIndex=row.nIdSimVideCola;
    const dialogRef = this.dialog.open(AtencionLicenciaComponent, {
      data: { title: "Actualizar", operador: row },
      disableClose: true,
      width:"40em",
      height:"auto"

    });
    dialogRef.afterClosed().subscribe((result) => {
      this.listarLicencias();
    });

  }

  registrarOperador(){
    const dialogRef = this.dialog.open(NuevoOperadorComponent, {
      data: { },
      disableClose: true,
      width:"40em",
      height:"auto"
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result)
      if(result!.sLogin){
        let nuevoObjeto : ResponseOperador;
        nuevoObjeto  = new ResponseOperador();
        nuevoObjeto.sLogin = result.sLogin;
        nuevoObjeto.sNombre = result.sNombre;
        nuevoObjeto.nIdOperador = result.nIdOperador;
        console.log(this.operadores)
        this.operadores.push(nuevoObjeto);
        this.dsOperador = new MatTableDataSource<ResponseOperador>(this.operadores);
        this.dsOperador.paginator = this.paginatorOperador
        this.dsOperador.sort = this.sortOperador
      }

    });
  }

}
