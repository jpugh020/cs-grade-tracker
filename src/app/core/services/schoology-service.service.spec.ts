import { TestBed } from '@angular/core/testing';

import { SchoologyService } from './schoology-service.service';

describe('SchoologyServiceService', () => {
  let service: SchoologyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SchoologyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
