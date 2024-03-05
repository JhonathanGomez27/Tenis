import { Module } from '@nestjs/common';
import { LlavesService } from './llaves.service';
import { LlavesController } from './llaves.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Llave } from './entities/llave.entity';
import { Torneo } from '../torneos/entities/torneo.entity';
import { Jugador } from '../jugadores/entities/jugadore.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Llave, Torneo, Jugador])
  ],
  controllers: [LlavesController],
  providers: [LlavesService],
  exports: [LlavesService]
})
export class LlavesModule {}
