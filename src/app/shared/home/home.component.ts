import {Component, HostListener, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';
import {ConfigService} from '../../services/config.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  environment;
  mobile = false;
  public innerWidth: any;

  constructor(public configService: ConfigService) { }

  ngOnInit() {
    this.environment = environment;
    this.innerWidth = window.innerWidth;
    this.mobile = this.innerWidth <= 480;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this.mobile = this.innerWidth <= 480;
  }

}
