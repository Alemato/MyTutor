import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPianificazioniPage } from './lista-pianificazioni.page';

describe('ListaPianificazioniPage', () => {
  let component: ListaPianificazioniPage;
  let fixture: ComponentFixture<ListaPianificazioniPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaPianificazioniPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaPianificazioniPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
