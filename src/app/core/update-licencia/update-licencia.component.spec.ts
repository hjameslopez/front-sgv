import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateLicenciaComponent } from './update-licencia.component';

describe('UpdateLicenciaComponent', () => {
  let component: UpdateLicenciaComponent;
  let fixture: ComponentFixture<UpdateLicenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateLicenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateLicenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
