import { TestBed } from '@angular/core/testing';

import { DebtsService } from './debts.service';

describe('DebtsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DebtsService = TestBed.get(DebtsService);
    expect(service).toBeTruthy();
  });
});
