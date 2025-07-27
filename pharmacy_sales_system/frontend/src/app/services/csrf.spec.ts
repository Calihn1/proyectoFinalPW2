import { TestBed } from '@angular/core/testing';

import { Csrf } from './csrf';

describe('Csrf', () => {
  let service: Csrf;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Csrf);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
