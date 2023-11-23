import { Module } from '@nestjs/common';
import { InscripcionesService } from './inscripciones.service';
import { InscripcionesController } from './inscripciones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inscripcion } from './entities/inscripcione.entity';
import { Jugador } from '../jugadores/entities/jugadore.entity';
import { Pareja } from '../parejas/entities/pareja.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Inscripcion, Jugador, Pareja])],
  controllers: [InscripcionesController],
  providers: [InscripcionesService],
  exports: [InscripcionesService]
})
export class InscripcionesModule {}
