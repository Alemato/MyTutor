import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RisultatiRicercaPage } from './risultati-ricerca.page';

describe('RisultatiRicercaPage', () => {
  let component: RisultatiRicercaPage;
  let fixture: ComponentFixture<RisultatiRicercaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RisultatiRicercaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RisultatiRicercaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
