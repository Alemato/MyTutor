import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RichiestePage } from './richieste.page';

describe('RichiestePage', () => {
  let component: RichiestePage;
  let fixture: ComponentFixture<RichiestePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RichiestePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RichiestePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
