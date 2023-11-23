import { Module } from '@nestjs/common';
import { PartidosService } from './partidos.service';
import { PartidosController } from './partidos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partido } from './entities/partido.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Partido])],
  controllers: [PartidosController],
  providers: [PartidosService],
  exports: [PartidosService]
})
export class PartidosModule {}
