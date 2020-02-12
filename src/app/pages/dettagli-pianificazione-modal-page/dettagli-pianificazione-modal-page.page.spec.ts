import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DettagliPianificazioneModalPage } from './dettagli-pianificazione-modal-page.page';

describe('DettagliPianificazioneModalPage', () => {
  let component: DettagliPianificazioneModalPage;
  let fixture: ComponentFixture<DettagliPianificazioneModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DettagliPianificazioneModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DettagliPianificazioneModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
