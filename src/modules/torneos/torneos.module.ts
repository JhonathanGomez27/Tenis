import { Module } from '@nestjs/common';
import { TorneosService } from './torneos.service';
import { TorneosController } from './torneos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Torneo } from './entities/torneo.entity';
import { IamModule } from '../iam/iam.module';
import { Grupo } from '../grupos/entities/grupo.entity';
import { Partido } from '../partidos/entities/partido.entity';
import { Jornada } from '../jornadas/entities/jornada.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Jugador } from '../jugadores/entities/jugadore.entity';
import { Inscripcion } from '../inscripciones/entities/inscripcione.entity';
import { ResultadosSetsModule } from '../resultados-sets/resultados-sets.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Torneo, Grupo, Partido, Jornada, Usuario, Jugador, Inscripcion]),
    IamModule,
    ResultadosSetsModule
  ],
  controllers: [TorneosController],
  providers: [TorneosService],
  exports: [TorneosService]
})
export class TorneosModule {}
