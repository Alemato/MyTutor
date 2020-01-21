import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaAnnunciPublicatiPage } from './lista-annunci-publicati.page';

describe('ListaAnnunciPublicatiPage', () => {
  let component: ListaAnnunciPublicatiPage;
  let fixture: ComponentFixture<ListaAnnunciPublicatiPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaAnnunciPublicatiPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaAnnunciPublicatiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
