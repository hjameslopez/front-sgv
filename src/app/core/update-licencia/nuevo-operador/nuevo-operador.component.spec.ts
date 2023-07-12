import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoOperadorComponent } from './nuevo-operador.component';

describe('NuevoOperadorComponent', () => {
  let component: NuevoOperadorComponent;
  let fixture: ComponentFixture<NuevoOperadorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NuevoOperadorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevoOperadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
