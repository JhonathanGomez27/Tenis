import { Test, TestingModule } from '@nestjs/testing';
import { LlavesService } from './llaves.service';

describe('LlavesService', () => {
  let service: LlavesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LlavesService],
    }).compile();

    service = module.get<LlavesService>(LlavesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
