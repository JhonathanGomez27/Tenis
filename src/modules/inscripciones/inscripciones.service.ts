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
    @InjectRepository(Torneo) private torneoRepository: Repository<Torneo>,
  ) { }


  async inscribirJugadorATorneo(inscripcionDto: CreateInscripcioneDto): Promise<Inscripcion | { message: string }> {

    try {

      //TODO: Verificar que el jugador tenga la misma categoria y rama del torne, que el torneo este en fase inicial, que aun hayan cupos(ver como se hace esto) que la modalidad sea singles, tambien validar estas cosas en inscribirParejaATorneo

      const jugadorId = inscripcionDto.jugador
      const jugador = await this.jugadorRepository.findOne({
        where: { id: jugadorId }
      });

      if (!jugador) {
        throw new MiExcepcionPersonalizada('No se encontro al jugador', 430);
      }


      //verificar si el torneo exite
      const torneoId = inscripcionDto.torneo
      const torneo = await this.torneoRepository.findOne({
        where: { id: torneoId }
      });
      if (!torneo) {
        throw new MiExcepcionPersonalizada('No se encontro el Torneo', 430);
      }

      const jugadorInscrito = await this.inscripcionRepository.findOne({
        where: { jugador: { id: jugadorId }, torneo: { id: torneoId } },
      });

      if (jugadorInscrito) {
        throw new MiExcepcionPersonalizada('El Jugador ya esta inscrito en este Torneo', 430);
      }
      // Crea la inscripción
      const inscripcion = this.inscripcionRepository.create({
        torneo: torneo,
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

      const torneoId = inscripcionDto.torneo
      const torneo = await this.torneoRepository.findOne({
        where: { id: torneoId }
      });
      if (!torneo) {
        throw new MiExcepcionPersonalizada('No se encontro el Torneo', 430);
      }

      const parejaInscrita = await this.inscripcionRepository.findOne(
        {
          where: { torneo: { id: torneoId }, pareja: { id: parejaId } }
        });

      if (parejaInscrita) {
        throw new MiExcepcionPersonalizada('La Pareja ya esta inscrita en este Torneo', 430);
      }

      // Crea la inscripción
      const inscripcion = this.inscripcionRepository.create({
        torneo: torneo,
        pareja: pareja,
        jugador: null, 
      });



      return await this.inscripcionRepository.save(inscripcion);

    } catch (error) {

      const message = handleDbError(error)
      return { message }

    }
  }


  async obtenerTodasLasInscripcionesPorTorneo(id: number){

    if(!id){
      throw new MiExcepcionPersonalizada('No se Proporciono un id de Torneo', 430);
    }
    const torneo = await this.torneoRepository.findOneBy({id})
    if (!torneo) {
      throw new MiExcepcionPersonalizada('No se encontro el Torneo', 430);
    }

    const inscripciones = await this.inscripcionRepository.find({ 
      where: {torneo: { id: torneo.id } },
      relations: ['jugador', 'pareja'],
    })
    return inscripciones
  }

 







}
