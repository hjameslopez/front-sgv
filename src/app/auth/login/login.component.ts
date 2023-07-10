import {Component, OnInit} from '@angular/core';
import {formatDate} from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import {LoginModalComponent} from './login-modal/login-modal.component';
import {SeguridadService} from '../../services/seguridad.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public currentYear: string;

  constructor(public dialog: MatDialog,
              public seguridadService: SeguridadService) { }

  ngOnInit() {
    // ELIMINA COOKIES AL INGRESAR A LOGIN
    this.seguridadService.logout();
    // CURRENT YEAR
    const date = new Date();
    this.currentYear = formatDate(date, 'yyyy', 'en-US');
  }

  openLogin() {
    // MODAL DE LOGIN
    this.dialog.closeAll();
    
    const dialogRef = this.dialog.open(LoginModalComponent, {
      width: '350px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(data => {
      console.log('DATA => ', data);
    });
  }

}
