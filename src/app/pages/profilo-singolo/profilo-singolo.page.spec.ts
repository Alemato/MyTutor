import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfiloSingoloPage } from './profilo-singolo.page';

describe('ProfiloSingoloPage', () => {
  let component: ProfiloSingoloPage;
  let fixture: ComponentFixture<ProfiloSingoloPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfiloSingoloPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfiloSingoloPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
