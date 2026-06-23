import { TestBed } from '@angular/core/testing';

import { AcaoService } from './acao.service';

describe('AcaoService', () => {
  let service: AcaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
