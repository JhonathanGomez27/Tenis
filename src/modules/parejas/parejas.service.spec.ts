import { Test, TestingModule } from '@nestjs/testing';
import { ParejasService } from './parejas.service';

describe('ParejasService', () => {
  let service: ParejasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParejasService],
    }).compile();

    service = module.get<ParejasService>(ParejasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
