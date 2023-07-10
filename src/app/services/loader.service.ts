import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  isLoading = new Subject<boolean>();
  hide() {
    this.isLoading.next(false);
  }
  show() {
    this.isLoading.next(true);
  }
}
