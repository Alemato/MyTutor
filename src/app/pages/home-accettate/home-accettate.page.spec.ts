import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeAccettatePage } from './home-accettate.page';

describe('HomeAccettatePage', () => {
  let component: HomeAccettatePage;
  let fixture: ComponentFixture<HomeAccettatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeAccettatePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeAccettatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
