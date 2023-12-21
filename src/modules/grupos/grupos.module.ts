import { Module } from '@nestjs/common';
import { GruposService } from './grupos.service';
import { GruposController } from './grupos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grupo } from './entities/grupo.entity';
import { Torneo } from '../torneos/entities/torneo.entity';
import { Inscripcion } from '../inscripciones/entities/inscripcione.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Grupo, Torneo, Inscripcion])],
  controllers: [GruposController],
  providers: [GruposService],
  exports: [GruposService]
})
export class GruposModule {}
