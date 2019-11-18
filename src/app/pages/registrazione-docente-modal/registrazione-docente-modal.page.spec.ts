import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrazioneDocenteModalPage } from './registrazione-docente-modal.page';

describe('RegistrazioneDocenteModalPage', () => {
  let component: RegistrazioneDocenteModalPage;
  let fixture: ComponentFixture<RegistrazioneDocenteModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrazioneDocenteModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrazioneDocenteModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
