import { Module } from '@nestjs/common';
import { JornadasService } from './jornadas.service';
import { JornadasController } from './jornadas.controller';

@Module({
  controllers: [JornadasController],
  providers: [JornadasService],
})
export class JornadasModule {}
