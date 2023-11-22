import { Test, TestingModule } from '@nestjs/testing';
import { ParejasController } from './parejas.controller';
import { ParejasService } from './parejas.service';

describe('ParejasController', () => {
  let controller: ParejasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParejasController],
      providers: [ParejasService],
    }).compile();

    controller = module.get<ParejasController>(ParejasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
