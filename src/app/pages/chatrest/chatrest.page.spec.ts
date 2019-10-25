import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatrestPage } from './chatrest.page';

describe('ChatrestPage', () => {
  let component: ChatrestPage;
  let fixture: ComponentFixture<ChatrestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatrestPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatrestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
