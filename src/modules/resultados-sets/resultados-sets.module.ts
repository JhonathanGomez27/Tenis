import { Module } from '@nestjs/common';
import { ResultadosSetsService } from './resultados-sets.service';
import { ResultadosSetsController } from './resultados-sets.controller';
import { Partido } from '../partidos/entities/partido.entity';
import { Torneo } from '../torneos/entities/torneo.entity';
import { Jugador } from '../jugadores/entities/jugadore.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IamModule } from '../iam/iam.module';
import { ResultadosSet } from './entities/resultados-set.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ResultadosSet,Partido, Torneo, Jugador]),    
    IamModule
  ],
  controllers: [ResultadosSetsController],
  providers: [ResultadosSetsService],
  exports: [ResultadosSetsService]
})
export class ResultadosSetsModule {}
