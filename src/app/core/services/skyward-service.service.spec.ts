import { TestBed } from '@angular/core/testing';

import { SkywardServiceService } from './skyward-service.service';

describe('SkywardServiceService', () => {
  let service: SkywardServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkywardServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
