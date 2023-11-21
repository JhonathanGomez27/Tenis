import { Module } from '@nestjs/common';
import { JugadoresService } from './jugadores.service';
import { JugadoresController } from './jugadores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Jugador } from './entities/jugadore.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Jugador])],
  controllers: [JugadoresController],
  providers: [JugadoresService],
  exports: [JugadoresService]
})
export class JugadoresModule {}
