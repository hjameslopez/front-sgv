import {Directive, Input, ElementRef, HostListener, OnInit} from '@angular/core';
import {TabService} from '../services/tab.service';
type IKNOWISNUMBER = any;
type IKNOWISSTRING = any;

@Directive({
  selector: '[appEnter]'
})
export class TabDirective implements OnInit {

  private _index: number;
  get index(): IKNOWISNUMBER {
    return this._index;
  }
  @Input('appEnter')
  set index(i: IKNOWISSTRING) {
    this._index = Number(i);
  }
  @HostListener('keydown', ['$event'])
  onInput(e: any) {
    if (e.which === 13) {
      this.tabService.selectedInput.next(this.index + 1);
      e.preventDefault();
    }
  }
  constructor(private el: ElementRef, private tabService: TabService) {
  }

  ngOnInit() {
    this.tabService.selectedInput
      .subscribe((i) => {
        // console.log(i, this.index);
        if (i === this.index) {
          this.el.nativeElement.focus();
        }
      });
  }

}
