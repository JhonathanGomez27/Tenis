import { Module } from '@nestjs/common';
import { TorneosService } from './torneos.service';
import { TorneosController } from './torneos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Torneo } from './entities/torneo.entity';
import { IamModule } from '../iam/iam.module';
import { Grupo } from '../grupos/entities/grupo.entity';
import { Partido } from '../partidos/entities/partido.entity';
import { Jornada } from '../jornadas/entities/jornada.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Torneo, Grupo, Partido, Jornada]),
    IamModule
  ],
  controllers: [TorneosController],
  providers: [TorneosService],
  exports: [TorneosService]
})
export class TorneosModule {}
