import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverRicercaLezioniDisponibiliComponent } from './popover-ricerca-lezioni-disponibili.component';

describe('PopoverRicercaLezioniDisponibiliComponent', () => {
  let component: PopoverRicercaLezioniDisponibiliComponent;
  let fixture: ComponentFixture<PopoverRicercaLezioniDisponibiliComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverRicercaLezioniDisponibiliComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopoverRicercaLezioniDisponibiliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
