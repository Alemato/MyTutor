import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPerPrenotarsiPage } from './lista-per-prenotarsi.page';

describe('ListaPerPrenotarsiPage', () => {
  let component: ListaPerPrenotarsiPage;
  let fixture: ComponentFixture<ListaPerPrenotarsiPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaPerPrenotarsiPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaPerPrenotarsiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
