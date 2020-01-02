import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverFiltroStoricoLezioniComponent } from './popover-filtro-storico-lezioni.component';

describe('PopoverFiltroStoricoLezioniComponent', () => {
  let component: PopoverFiltroStoricoLezioniComponent;
  let fixture: ComponentFixture<PopoverFiltroStoricoLezioniComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverFiltroStoricoLezioniComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopoverFiltroStoricoLezioniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
