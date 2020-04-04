import { TestBed } from '@angular/core/testing';

import { JsExecuteService } from './js-execute.service';

describe('JsExecuteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JsExecuteService = TestBed.get(JsExecuteService);
    expect(service).toBeTruthy();
  });
});
