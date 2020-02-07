import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RicercaLezioniPage } from './ricerca-lezioni.page';

describe('RicercaLezioniPage', () => {
  let component: RicercaLezioniPage;
  let fixture: ComponentFixture<RicercaLezioniPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RicercaLezioniPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RicercaLezioniPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
