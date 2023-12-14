import { Injectable } from '@nestjs/common';
import { CreateTorneoDto } from './dto/create-torneo.dto';
import { UpdateTorneoDto } from './dto/update-torneo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Estado, Modalidad, Tipo, Torneo } from './entities/torneo.entity';
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


      if (createTorneoDto.tipo_torneo === Tipo.ESCALERA) {
        const verificarCantidadGrupos = createTorneoDto.cantidad_grupos % 2;
        if (verificarCantidadGrupos != 0) {
          throw new MiExcepcionPersonalizada(`La cantidad de grupos de un torneo ${Tipo.ESCALERA} debe ser par`, 430);
        }
      }

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


    //TODO:Validaciones torneo escalera, preguntar bien todas las validaciones

    if (torneo.tipo_torneo === Tipo.ESCALERA) {
      const validarCantidadInscripciones = torneo.inscripciones.length % 2;
      if (validarCantidadInscripciones != 0) {
        const message = `el numero de participantes genera conflicto para iniciar este torneo, por favor revisar`
        throw new MiExcepcionPersonalizada(message, 409);
      }
    }
    //return torneo
    torneo.estado = Estado.SORTEO
    await this.torneoRepository.save(torneo)
    return {
      message: 'Se han cerrado las inscripciones a este torneo ahora esta en fase de ' + Estado.SORTEO + ' Este es el torneo que se dara inicio',
      torneo: torneo
    }
  }


  async formarGrupos(id: number) {

    //try {
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
      throw new MiExcepcionPersonalizada(message, 403);
    }

    if (torneo.tipo_torneo === Tipo.REGULAR) {
      const inscripciones = torneo.inscripciones;
      const inscripcionesAleatorias = inscripciones.sort(() => Math.random() - 0.5);
      //return inscripcionesAleatorias
      // Calcular cantidad de participantes por grupo y cantidad de grupos
      const participantesPorGrupo = Math.ceil(inscripciones.length / torneo.cantidad_grupos);
      const cantidadGrupos = torneo.cantidad_grupos;
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
    } else if (torneo.tipo_torneo === Tipo.ESCALERA) {

      const inscripciones = torneo.inscripciones;
      const modalidad = torneo.modalidad;
      const jugadoresPorGrupo = torneo.inscripciones.length / torneo.cantidad_grupos

      //return jugadoresPorGrupo

      const grupos = await this.asignacionGruposTorneoEscalera(inscripciones, torneo.cantidad_grupos, jugadoresPorGrupo, modalidad, torneo)

      const gruposResponse = []


      for (const grupo of grupos) {
        const grupoPersistido = await this.grupoRepository.save(grupo);
        gruposResponse.push(grupoPersistido)
      }

      torneo.estado = Estado.PROGRAMACION
      await this.torneoRepository.save(torneo)
      for (const grupo of gruposResponse) {
        grupo['torneo'] = undefined
      }




      return {
        gruposResponse
      }



    }



  }



  async asignacionGruposTorneoEscalera(inscripciones: Array<any>, cantidadGrupos: number, jugadoresPorGrupo: number, modalidad: string, torneo: Torneo) {


    const inscripcionesRankingPares = []
    const inscripcionesRankingImpares = []

    for (const inscripcion of inscripciones) {
      if (modalidad === Modalidad.SINGLES) {
        if (inscripcion.jugador.ranking % 2 == 0) {
          inscripcionesRankingPares.push(inscripcion)
        } else {
          inscripcionesRankingImpares.push(inscripcion)
        }
      } else if (modalidad === Modalidad.DOBLES) {
        if (inscripcion.pareja.ranking % 2 == 0) {
          inscripcionesRankingPares.push(inscripcion)
        } else {
          inscripcionesRankingImpares.push(inscripcion)
        }
      }
    }


    // Crear grupos
    const grupos: any[] = [];

    for (let i = 0; i < cantidadGrupos; i++) {
      const grupo = new Grupo();
      grupo.nombre_grupo = String.fromCharCode(65 + i); // Asigna nombres de grupo A, B, C, ...
      grupo.completado = false;
      grupo.torneo = torneo;
      grupo.participantes = [];
      grupos.push(grupo);

    }



    if (cantidadGrupos == 2) {
      for (let i = 0; i < jugadoresPorGrupo; i++) {

        const inscripcionImpar = inscripcionesRankingImpares.shift();
        const inscripcionPar = inscripcionesRankingPares.shift();

        if (inscripcionImpar) {
          grupos[0].participantes.push(inscripcionImpar);
        }

        if (inscripcionPar) {
          grupos[1].participantes.push(inscripcionPar);
        }


      }

    } //TODO: hacer esto
    else if (cantidadGrupos == 4) {


    } else if (cantidadGrupos == 6) {

    } else if (cantidadGrupos == 8) {

    }
    //invertir la posicion 

    for (const grupo of grupos) {
      grupo.participantes.reverse()
      grupo.participantes.forEach((participante, index) => {
        participante.ranking = index + 1;
      });
    }
    return grupos;
  }








  async programarPartidosFaseGrupos(idTorneo: number) {

    if (!idTorneo) {
      throw new MiExcepcionPersonalizada('No se Proporciono un id de Torneo', 430);
    }
    const torneo = await this.torneoRepository.findOne({
      where: { id: idTorneo },
      relations: ['grupos'],
    });
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
          contador++

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



  async volverAsorteoGruupos(id: number) {
    const torneo = await this.torneoRepository.findOneBy({ id: id })

    torneo.estado = Estado.SORTEO

    await this.torneoRepository.save(torneo)


    return {
      message: 'El Torneo Ha vuelto al estado Sorteo, para poder gestionar grupos o particiopantes en los grupos, se debe tener precaución al momento de realizar dicha gestión'
    }
  }





  async CambiarTorneoAProgramacion(id: number) {

    if (!id) {
      throw new MiExcepcionPersonalizada('No se Proporciono un id de Torneo', 400);
    }

    const torneo = await this.torneoRepository.findOne({
      where: { id: id }
    });




    if (!torneo) {
      throw new MiExcepcionPersonalizada('No se encontro el Torneo', 404);
    }

    if (torneo.estado != Estado.SORTEO) {
      const message = `Este torneo esta en estado ${torneo.estado} por lo cual es imposible realizar esta accion`
      throw new MiExcepcionPersonalizada(message, 409);
    }


    torneo.estado = Estado.PROGRAMACION
    await this.torneoRepository.save(torneo)


    return {
      message: `El Torneo ha avanzado manualmente al estado ${torneo.estado}`
    }




  }


  async editarTorneo(updateTorneoDto: UpdateTorneoDto, id: number){

    if (!id) {
      throw new MiExcepcionPersonalizada('No se Proporciono un id de Torneo', 400);
    }

    const torneo = await this.torneoRepository.findOne({
      where: { id: id }     
    });

    if (!torneo) {
      throw new MiExcepcionPersonalizada('No se encontro el Torneo', 404);
    }


    if (torneo.estado != Estado.INICIAL) {
      const message = `este torneo esta en estado ${torneo.estado} por lo cual es imposible realizar esta accion`
      throw new MiExcepcionPersonalizada(message, 409);
    }


    if (updateTorneoDto.tipo_torneo === Tipo.ESCALERA) {
      const verificarCantidadGrupos = updateTorneoDto.cantidad_grupos % 2;
      if (verificarCantidadGrupos != 0) {
        throw new MiExcepcionPersonalizada(`La cantidad de grupos de un torneo ${Tipo.ESCALERA} debe ser par`, 430);
      }
    }


    const torneoActualizado = await this.torneoRepository.save(updateTorneoDto)

    return{
      torneoActualizado
    }




  }




}


