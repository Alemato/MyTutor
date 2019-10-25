import { TestBed } from '@angular/core/testing';

import { ChatrestService } from './chatrest.service';

describe('ChatrestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChatrestService = TestBed.get(ChatrestService);
    expect(service).toBeTruthy();
  });
});
