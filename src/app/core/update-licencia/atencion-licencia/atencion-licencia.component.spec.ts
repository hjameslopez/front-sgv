import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtencionLicenciaComponent } from './atencion-licencia.component';

describe('AtencionLicenciaComponent', () => {
  let component: AtencionLicenciaComponent;
  let fixture: ComponentFixture<AtencionLicenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtencionLicenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtencionLicenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
