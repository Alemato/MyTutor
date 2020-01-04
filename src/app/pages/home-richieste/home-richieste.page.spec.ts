import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeRichiestePage } from './home-richieste.page';

describe('HomeRichiestePage', () => {
  let component: HomeRichiestePage;
  let fixture: ComponentFixture<HomeRichiestePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeRichiestePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeRichiestePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
