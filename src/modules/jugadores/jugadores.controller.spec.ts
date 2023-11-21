import { Test, TestingModule } from '@nestjs/testing';
import { JugadoresController } from './jugadores.controller';
import { JugadoresService } from './jugadores.service';

describe('JugadoresController', () => {
  let controller: JugadoresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JugadoresController],
      providers: [JugadoresService],
    }).compile();

    controller = module.get<JugadoresController>(JugadoresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
