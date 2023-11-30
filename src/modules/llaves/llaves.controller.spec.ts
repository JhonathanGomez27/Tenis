import { Test, TestingModule } from '@nestjs/testing';
import { LlavesController } from './llaves.controller';
import { LlavesService } from './llaves.service';

describe('LlavesController', () => {
  let controller: LlavesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LlavesController],
      providers: [LlavesService],
    }).compile();

    controller = module.get<LlavesController>(LlavesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
