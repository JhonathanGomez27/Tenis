import { Module } from '@nestjs/common';
import { JornadasService } from './jornadas.service';
import { JornadasController } from './jornadas.controller';
import { Jornada } from './entities/jornada.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Torneo } from '../torneos/entities/torneo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Jornada, Torneo]),
   
  ],
  controllers: [JornadasController],
  providers: [JornadasService],
  exports: [JornadasService]
})
export class JornadasModule {}
