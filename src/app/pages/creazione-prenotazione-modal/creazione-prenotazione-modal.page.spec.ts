import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreazionePrenotazioneModalPage } from './creazione-prenotazione-modal.page';

describe('CreazionePrenotazioneModalPage', () => {
  let component: CreazionePrenotazioneModalPage;
  let fixture: ComponentFixture<CreazionePrenotazioneModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreazionePrenotazioneModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreazionePrenotazioneModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
