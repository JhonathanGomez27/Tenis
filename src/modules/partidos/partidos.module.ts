import { Module } from '@nestjs/common';
import { PartidosService } from './partidos.service';
import { PartidosController } from './partidos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partido } from './entities/partido.entity';
import { Torneo } from '../torneos/entities/torneo.entity';
import { Grupo } from '../grupos/entities/grupo.entity';
import { Llave } from '../llaves/entities/llave.entity';
import { Jornada } from '../jornadas/entities/jornada.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Partido, Torneo, Grupo, Llave, Jornada])],
  controllers: [PartidosController],
  providers: [PartidosService],
  exports: [PartidosService]
})
export class PartidosModule {}
