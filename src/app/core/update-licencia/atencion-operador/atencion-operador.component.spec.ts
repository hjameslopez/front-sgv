import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtencionOperadorComponent } from './atencion-operador.component';

describe('AtencionOperadorComponent', () => {
  let component: AtencionOperadorComponent;
  let fixture: ComponentFixture<AtencionOperadorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtencionOperadorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtencionOperadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
