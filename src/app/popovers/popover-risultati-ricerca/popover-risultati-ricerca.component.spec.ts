import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverRisultatiRicercaComponent } from './popover-risultati-ricerca.component';

describe('PopoverRisultatiRicercaComponent', () => {
  let component: PopoverRisultatiRicercaComponent;
  let fixture: ComponentFixture<PopoverRisultatiRicercaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverRisultatiRicercaComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopoverRisultatiRicercaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
