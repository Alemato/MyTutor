import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InserimentoLezioniModalPage } from './inserimento-lezioni-modal.page';

describe('InserimentoLezioniModalPage', () => {
  let component: InserimentoLezioniModalPage;
  let fixture: ComponentFixture<InserimentoLezioniModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InserimentoLezioniModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InserimentoLezioniModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
