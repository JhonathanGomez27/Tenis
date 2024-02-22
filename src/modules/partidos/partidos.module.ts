import { Module } from '@nestjs/common';
import { PartidosService } from './partidos.service';
import { PartidosController } from './partidos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partido } from './entities/partido.entity';
import { Torneo } from '../torneos/entities/torneo.entity';
import { Grupo } from '../grupos/entities/grupo.entity';
import { Llave } from '../llaves/entities/llave.entity';
import { Jornada } from '../jornadas/entities/jornada.entity';
import { Inscripcion } from '../inscripciones/entities/inscripcione.entity';
import { Pareja } from '../parejas/entities/pareja.entity';
import { Jugador } from '../jugadores/entities/jugadore.entity';
import { IamModule } from '../iam/iam.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Partido, Torneo, Grupo, Llave, Jornada, Inscripcion, Pareja, Jugador]),    
    IamModule
  ],
  controllers: [PartidosController],
  providers: [PartidosService],
  exports: [PartidosService]
})
export class PartidosModule {}
