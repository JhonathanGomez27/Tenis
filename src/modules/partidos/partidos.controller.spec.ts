import { Test, TestingModule } from '@nestjs/testing';
import { PartidosController } from './partidos.controller';
import { PartidosService } from './partidos.service';

describe('PartidosController', () => {
  let controller: PartidosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartidosController],
      providers: [PartidosService],
    }).compile();

    controller = module.get<PartidosController>(PartidosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
