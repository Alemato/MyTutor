import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificaProfiloPage } from './modifica-profilo.page';

describe('ModificaProfiloPage', () => {
  let component: ModificaProfiloPage;
  let fixture: ComponentFixture<ModificaProfiloPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModificaProfiloPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificaProfiloPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
