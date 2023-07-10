import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  constructor(public dialog: MatDialogRef<AlertComponent>,
              @Inject(MAT_DIALOG_DATA) public dataDialog) { }

  ngOnInit() {
  }

  confirmar() {
    this.dialog.close(true);
  }

  cancelar() {
    this.dialog.close(false);
  }

  @HostListener('window:keyup.esc') onKeyUp() {
    this.cancelar();
  }

}
