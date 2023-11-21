import { Test, TestingModule } from '@nestjs/testing';
import { TorneosController } from './torneos.controller';
import { TorneosService } from './torneos.service';

describe('TorneosController', () => {
  let controller: TorneosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TorneosController],
      providers: [TorneosService],
    }).compile();

    controller = module.get<TorneosController>(TorneosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
