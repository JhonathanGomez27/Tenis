import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInscripcioneDto } from './dto/create-inscripcione.dto';
import { UpdateInscripcioneDto } from './dto/update-inscripcione.dto';
import { Inscripcion } from './entities/inscripcione.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pareja } from '../parejas/entities/pareja.entity';
import { Jugador } from '../jugadores/entities/jugadore.entity';
import { Torneo } from '../torneos/entities/torneo.entity';
import { MiExcepcionPersonalizada } from 'src/utils/exception';
import { handleDbError } from 'src/utils/error.message';

@Injectable()
export class InscripcionesService {


  constructor(
    @InjectRepository(Inscripcion) private readonly inscripcionRepository: Repository<Inscripcion>,
    @InjectRepository(Jugador) private readonly jugadorRepository: Repository<Jugador>,
    @InjectRepository(Pareja) private parejaRepository: Repository<Pareja>,
  ) { }


  async inscribirJugadorATorneo(inscripcionDto: CreateInscripcioneDto)/*: Promise<Inscripcion | { message: string }> */ {

    try {

      const jugadorId = inscripcionDto.jugador
      const jugador = await this.jugadorRepository.findOne({
        where: { id: jugadorId }
      });

      if (!jugador) {
        throw new MiExcepcionPersonalizada('No se encontro al jugador', 430);
      }

      // Verifica si el jugador ya está inscrito     
      const jugadorInscrito = await this.inscripcionRepository.findOneBy({ torneo: inscripcionDto.torneo, jugador: jugador });
      if (jugadorInscrito) {
        throw new MiExcepcionPersonalizada('El Jugador ya esta inscrito en este Torneo', 430);
      }

      // Crea la inscripción
      const inscripcion = this.inscripcionRepository.create({
        torneo: inscripcionDto.torneo,
        jugador: jugador,
        pareja: null,
      });

      return await this.inscripcionRepository.save(inscripcion);

    } catch (error) {

      const message = handleDbError(error)
      return { message }

    }
  }

  async inscribirParejaATorneo(inscripcionDto: CreateInscripcioneDto): Promise<Inscripcion | { message: string }> {
    try {



      const parejaId = inscripcionDto.pareja

      const pareja = await this.parejaRepository.findOne({
        where: { id: parejaId }
      });
      if (!pareja) {
        throw new MiExcepcionPersonalizada('No se encontro la Pareja', 430);
      }

      // Verifica si la pareja ya está inscrita
      const parejaInscrita = await this.inscripcionRepository.findOneBy({ torneo: inscripcionDto.torneo, pareja: pareja });

      if (parejaInscrita) {
        throw new MiExcepcionPersonalizada('La Pareja ya esta inscrita en este Torneo', 430);
      }

      // Crea la inscripción
      const inscripcion = this.inscripcionRepository.create({
        torneo: inscripcionDto.torneo,
        pareja: pareja,
        jugador: null, // Asegúrate de que el jugador sea null si estás inscribiendo una pareja
      });



      return await this.inscripcionRepository.save(inscripcion);

    } catch (error) {

      const message = handleDbError(error)
      return { message }

    }
  }





}
