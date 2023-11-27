import { Injectable } from '@nestjs/common';
import { CreateTorneoDto } from './dto/create-torneo.dto';
import { UpdateTorneoDto } from './dto/update-torneo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Estado, Torneo } from './entities/torneo.entity';
import { EntityManager, Repository, Transaction } from 'typeorm';
import { handleDbError } from 'src/utils/error.message';
import { MiExcepcionPersonalizada } from 'src/utils/exception';
import { Grupo } from '../grupos/entities/grupo.entity';
import { Partido } from '../partidos/entities/partido.entity';


@Injectable()
export class TorneosService {

  constructor(
    @InjectRepository(Torneo) private torneoRepository: Repository<Torneo>,
    @InjectRepository(Grupo) private grupoRepository: Repository<Grupo>,
    @InjectRepository(Partido) private partidoRepository: Repository<Partido>
  ) { }



  async create(createTorneoDto: CreateTorneoDto) {
    try {

      const torneo = this.torneoRepository.create(createTorneoDto);
      const torneoGuardado = await this.torneoRepository.save(torneo);

      return {
        torneoGuardado
      }

    } catch (error) {
      const message = handleDbError(error)
      return { message }

    }
  }

  async findAll() {
    const torneos = await this.torneoRepository.find();

    // const torneosResponse = torneos.map(torneo => ({
    // }));


    return torneos;
  }

  async getTorneoById(id: number) {
    const torneo = await this.torneoRepository.findOneBy({ id: id })
    return torneo
  }

  enumToJsonArray(enumObj: any): { nombre: string, descripcion: string }[] {
    const enumKeys = Object.keys(enumObj);
    return enumKeys.map(key => ({ nombre: enumObj[key], descripcion: enumObj[key] }));
  }


  async finalizarInscripciones(id: number) {

    if (!id) {
      throw new MiExcepcionPersonalizada('No se Proporciono un id de Torneo', 430);
    }

    const torneo = await this.torneoRepository.findOne({
      where: { id: id },
      relations: ['inscripciones', 'inscripciones.jugador', 'inscripciones.pareja'],
    });

    if (!torneo) {
      throw new MiExcepcionPersonalizada('No se encontro el Torneo', 430);
    }

    if (torneo.estado != Estado.INICIAL) {

      const message = `Este torneo esta en estado ${torneo.estado} por lo cual es imposible realizar esta accion`
      throw new MiExcepcionPersonalizada(message, 430);

    }




    torneo.estado = Estado.SORTEO

    await this.torneoRepository.save(torneo)

    return {
      message: 'Se han cerrado las inscripciones a este torneo ahora esta en fase de ' + Estado.SORTEO + ' Este es el torneo que se dara inicio',
      torneo: torneo

    }




  }


  async formarGrupos(id: number) {

    try {
      if (!id) {
        throw new MiExcepcionPersonalizada('No se Proporciono un id de Torneo', 430);
      }

      const torneo = await this.torneoRepository.findOne({
        where: { id: id },
        relations: ['inscripciones', 'inscripciones.jugador', 'inscripciones.pareja'],
      });

      if (!torneo) {
        throw new MiExcepcionPersonalizada('No se encontro el Torneo', 430);
      }


      if (torneo.estado != Estado.SORTEO) {

        const message = `este torneo esta en estado ${torneo.estado} por lo cual es imposible realizar esta accion`
        throw new MiExcepcionPersonalizada(message, 430);

      }



      const inscripciones = torneo.inscripciones;
      const inscripcionesAleatorias = inscripciones.sort(() => Math.random() - 0.5);
      //return inscripcionesAleatorias
      // Calcular cantidad de participantes por grupo y cantidad de grupos
      const participantesPorGrupo = Math.ceil(inscripciones.length / torneo.cantidad_grupos);
      const cantidadGrupos = torneo.cantidad_grupos;

      // return {
      //   participantesPorGrupo, cantidadGrupos
      // }


      // Inicializar grupos
      const grupos: Grupo[] = [];
      for (let i = 0; i < cantidadGrupos; i++) {
        const grupo = new Grupo();
        grupo.nombre_grupo = String.fromCharCode(65 + i); // Asigna nombres de grupo A, B, C, ...
        grupo.completado = false;
        grupo.torneo = torneo;
        grupo.participantes = [];
        grupos.push(grupo);
      }
      const gruposResponse = []
      let grupoIndex = 0;
      for (const inscripcion of inscripcionesAleatorias) {
        grupos[grupoIndex].participantes.push(inscripcion);
        if (grupos[grupoIndex].participantes.length >= participantesPorGrupo) {
          // Persistir el grupo actual en la base de datos
          const grupoPersistido = await this.grupoRepository.save(grupos[grupoIndex]);
          gruposResponse.push(grupoPersistido)
          grupoIndex++;
        }
      }
      //  persistir el último grupo
      if (grupoIndex < cantidadGrupos) {
        await this.grupoRepository.save(grupos[grupoIndex]);
      }

      torneo.estado = Estado.PROGRAMACION

      await this.torneoRepository.save(torneo)


      for (const grupo of gruposResponse) {
        grupo['torneo'] = undefined
      }
      return gruposResponse

    } catch (error) {
      const message = handleDbError(error)
      return { message }
    }

  }


  async programarPartidosFaseGrupos(idTorneo: number/*, @TransactionManager() manager?: EntityManager*/) {

    if (!idTorneo) {
      throw new MiExcepcionPersonalizada('No se Proporciono un id de Torneo', 430);
    }



    // const torneo = await manager.findOneOrFail(Torneo, idTorneo, { relations: ['grupos'] });

    const torneo = await this.torneoRepository.findOne({
      where: { id: idTorneo },
      relations: ['grupos'],
    });

    //return torneo





    if (!torneo) {
      throw new MiExcepcionPersonalizada('No se encontró el Torneo', 430);
    }

    if (torneo.estado !== Estado.PROGRAMACION) {
      const message = `Este torneo está en estado ${torneo.estado}, por lo cual es imposible realizar esta acción`;
      throw new MiExcepcionPersonalizada(message, 430);
    }


    //const partidos = []
    let contador = 0;
    for (const grupo of torneo.grupos) {
      const participantes = grupo.participantes;

      // Programar partidos para cada participante o pareja contra todos los demás
      for (let i = 0; i < participantes.length; i++) {
        for (let j = i + 1; j < participantes.length; j++) {
          const participante1Id = participantes[i].id;
          const participante2Id = participantes[j].id;

          // Aquí puedes usar los IDs para programar el partido
          const partido = new Partido();
          partido.torneo = torneo;
          partido.fase = 'grupos';
          partido.grupo = grupo;

          // Asignar IDs de participantes al partido
          if (torneo.modalidad === 'singles') {
            partido.jugador1 = participantes[i].jugador;
            partido.jugador2 = participantes[j].jugador;
          } else if (torneo.modalidad === 'dobles') {
            partido.pareja1 = participantes[i].pareja;
            partido.pareja2 = participantes[j].pareja;
          }
          //partidos.push(partido)
          contador ++

          // Puedes ajustar el manejo de fechas y otros campos según tus necesidades
          await this.partidoRepository.save(partido);
        }
      }
    }

   

    // Actualizar el estado del torneo
    torneo.estado = Estado.PROCESO;
    await this.torneoRepository.save(torneo);

    return {
      message: `se han creado un total de  ${contador} partidos, por favor dijita la fecha en la que se realizaran cada uno de ellos`
    }
  }








}
// function TransactionManager(): (target: TorneosService, propertyKey: "programarPartidosFaseGrupos", parameterIndex: 1) => void {
//   throw new Error('Function not implemented.');
// }

