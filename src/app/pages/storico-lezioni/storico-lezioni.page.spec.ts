import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoricoLezioniPage } from './storico-lezioni.page';

describe('StoricoLezioniPage', () => {
  let component: StoricoLezioniPage;
  let fixture: ComponentFixture<StoricoLezioniPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoricoLezioniPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoricoLezioniPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
