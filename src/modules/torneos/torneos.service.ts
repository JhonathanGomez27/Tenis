import { Injectable } from '@nestjs/common';
import { CreateTorneoDto } from './dto/create-torneo.dto';
import { UpdateTorneoDto } from './dto/update-torneo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Estado,
  Fases,
  Modalidad,
  Tipo,
  Torneo,
} from './entities/torneo.entity';
import { Not, Repository } from 'typeorm';
import { handleDbError } from 'src/utils/error.message';
import { MiExcepcionPersonalizada } from 'src/utils/exception';
import { Grupo } from '../grupos/entities/grupo.entity';
import { Partido } from '../partidos/entities/partido.entity';
import {
  Jornada,
  Retadores,
  TipoJornada,
} from '../jornadas/entities/jornada.entity';
import { any, number } from 'joi';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Jugador, rama } from '../jugadores/entities/jugadore.entity';
import { Inscripcion } from '../inscripciones/entities/inscripcione.entity';
import { ResultadosSet } from '../resultados-sets/entities/resultados-set.entity';
import { ResultadosSetsService } from '../resultados-sets/resultados-sets.service';

@Injectable()
export class TorneosService {
  constructor(
    @InjectRepository(Torneo) private torneoRepository: Repository<Torneo>,
    @InjectRepository(Grupo) private grupoRepository: Repository<Grupo>,
    @InjectRepository(Partido) private partidoRepository: Repository<Partido>,
    @InjectRepository(Jornada) private jornadaRepository: Repository<Jornada>,
    @InjectRepository(Usuario) private usuarioRepository: Repository<Usuario>,
    @InjectRepository(Jugador) private jugadorRepository: Repository<Jugador>,
    @InjectRepository(Inscripcion)
    private inscripcionRepository: Repository<Inscripcion>,
    private readonly resultadosSetsService: ResultadosSetsService, // Inyecta el servicio
  ) {}

  async create(createTorneoDto: CreateTorneoDto) {
    try {
      if (createTorneoDto.tipo_torneo === Tipo.ESCALERA) {
        const verificarCantidadGrupos = createTorneoDto.cantidad_grupos % 2;
        if (verificarCantidadGrupos != 0) {
          throw new MiExcepcionPersonalizada(
            `La cantidad de grupos de un torneo ${Tipo.ESCALERA} debe ser par`,
            430,
          );
        }
      }

      const torneo = this.torneoRepository.create(createTorneoDto);
      const torneoGuardado = await this.torneoRepository.save(torneo);

      return {
        torneoGuardado,
      };
    } catch (error) {
      const message = handleDbError(error);
      return { message };
    }
  }

  async findAll() {
    const torneos = await this.torneoRepository.find();

    // const torneosResponse = torneos.map(torneo => ({
    // }));

    return torneos;
  }

  async getTorneoById(id: number) {
    const torneo = await this.torneoRepository.findOneBy({ id: id });
    return torneo;
  }

  async getTorneoByPlayerId(id: number) {
    const jugador = await this.jugadorRepository.find({
      where: { userid: { id } },
    });

    const id_jugador = jugador[0].id;

    const inscripciones = await this.inscripcionRepository.find({
      where: { jugador: { id: id_jugador } },
      relations: ['torneo'],
    });

    const torneos = inscripciones.map((inscripcion) => inscripcion.torneo);
    return torneos;
  }

  enumToJsonArray(enumObj: any): { nombre: string; descripcion: string }[] {
    const enumKeys = Object.keys(enumObj);
    return enumKeys.map((key) => ({
      nombre: enumObj[key],
      descripcion: enumObj[key],
    }));
  }

  async finalizarInscripciones(id: number) {
    if (!id) {
      throw new MiExcepcionPersonalizada(
        'No se Proporciono un id de Torneo',
        430,
      );
    }

    const torneo = await this.torneoRepository.findOne({
      where: { id: id },
      relations: [
        'inscripciones',
        'inscripciones.jugador',
        'inscripciones.pareja',
      ],
    });

    if (!torneo) {
      throw new MiExcepcionPersonalizada('No se encontro el Torneo', 430);
    }

    if (torneo.estado != Estado.INICIAL) {
      const message = `Este torneo esta en estado ${torneo.estado} por lo cual es imposible realizar esta accion`;
      throw new MiExcepcionPersonalizada(message, 430);
    }

    //minimo 4 participantes

    if (torneo.inscripciones.length < 4) {
      const message = `El torneo debe cumplir un minimo de  participantes inscritos, aun no se ha cumplido esa cuota, por favor revisar`;
      throw new MiExcepcionPersonalizada(message, 409);
    }

    //TODO:Validaciones torneo escalera, preguntar bien todas las validaciones

    if (torneo.tipo_torneo === Tipo.ESCALERA) {
      const validarCantidadInscripciones = torneo.inscripciones.length % 2;
      if (validarCantidadInscripciones != 0) {
        const message = `el numero de participantes genera conflicto para iniciar este torneo, por favor revisar`;
        throw new MiExcepcionPersonalizada(message, 409);
      }
    }
    //return torneo
    torneo.estado = Estado.SORTEO;
    await this.torneoRepository.save(torneo);
    return {
      message:
        'Se han cerrado las inscripciones a este torneo ahora esta en fase de ' +
        Estado.SORTEO +
        ' Este es el torneo que se dara inicio',
      torneo: torneo,
    };
  }

  async formarGrupos(id: number) {
    //try {
    if (!id) {
      throw new MiExcepcionPersonalizada(
        'No se Proporciono un id de Torneo',
        400,
      );
    }

    const torneo = await this.torneoRepository.findOne({
      where: { id: id },
      relations: [
        'inscripciones',
        'inscripciones.jugador',
        'inscripciones.jugador.userid',
        'inscripciones.pareja',
      ],
    });

    if (!torneo) {
      throw new MiExcepcionPersonalizada('No se encontro el Torneo', 404);
    }

    if (torneo.estado != Estado.SORTEO) {
      const message = `este torneo esta en estado ${torneo.estado} por lo cual es imposible realizar esta accion`;
      throw new MiExcepcionPersonalizada(message, 403);
    }

    if (torneo.tipo_torneo === Tipo.REGULAR) {
      const inscripciones = torneo.inscripciones;
      const inscripcionesAleatorias = inscripciones.sort(
        () => Math.random() - 0.5,
      );
      //return inscripcionesAleatorias
      // Calcular cantidad de participantes por grupo y cantidad de grupos
      const participantesPorGrupo = Math.ceil(
        inscripciones.length / torneo.cantidad_grupos,
      );
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
      const gruposResponse = [];
      let grupoIndex = 0;
      for (const inscripcion of inscripcionesAleatorias) {
        grupos[grupoIndex].participantes.push(inscripcion);
        if (grupos[grupoIndex].participantes.length >= participantesPorGrupo) {
          // Persistir el grupo actual en la base de datos
          const grupoPersistido = await this.grupoRepository.save(
            grupos[grupoIndex],
          );
          gruposResponse.push(grupoPersistido);
          grupoIndex++;
        }
      }
      //  persistir el último grupo
      if (grupoIndex < cantidadGrupos) {
        await this.grupoRepository.save(grupos[grupoIndex]);
      }
      //torneo.estado = Estado.PROGRAMACION
      torneo.estado = Estado.SORTEO;
      await this.torneoRepository.save(torneo);
      for (const grupo of gruposResponse) {
        grupo['torneo'] = undefined;
      }
      return gruposResponse;
    } else if (torneo.tipo_torneo === Tipo.ESCALERA) {
      let inscripciones = torneo.inscripciones;
      const modalidad = torneo.modalidad;

      const rankingsRepetidos = await this.verificarRankingDuplicado(
        inscripciones,
        modalidad,
      );
      if (rankingsRepetidos == true) {
        console.log('entre al reorganizar');
        inscripciones = await this.reorganizarRankings(
          inscripciones,
          modalidad,
        );
        // const message = `Hay participantes con rankings repetidos, para este tipo de torneo se deben reorganizar los rankings`
        // throw new MiExcepcionPersonalizada(message, 409);
      }

      //return inscripciones

      const jugadoresPorGrupo =
        torneo.inscripciones.length / torneo.cantidad_grupos;

      console.log('ins', inscripciones);

      //return jugadoresPorGrupo

      const grupos = await this.asignacionGruposTorneoEscalera(
        inscripciones,
        torneo.cantidad_grupos,
        jugadoresPorGrupo,
        modalidad,
        torneo,
      );

      const gruposResponse = [];

      for (const grupo of grupos) {
        const grupoPersistido = await this.grupoRepository.save(grupo);

        grupoPersistido.forEach((e: Grupo) => {
          e.participantes;
        });

        gruposResponse.push(grupoPersistido);
      }

      //torneo.estado = Estado.PROGRAMACION
      //torneo.estado = Estado.SORTEO
      torneo.estado = Estado.PROCESO;
      await this.torneoRepository.save(torneo);
      for (const grupo of gruposResponse) {
        grupo['torneo'] = undefined;
      }

      //formar jornadas

      const jornadas = await this.formarJornadas(
        torneo.cantidad_jornadas_regulares,
        torneo.cantidad_jornadas_cruzadas,
        grupos,
        torneo,
      );

      let regulares = [];
      let cruzadas = [];
      let contadorregulares = 0;
      let contadorcruzadas = 0;

      for (const jornada of jornadas) {
        if (jornada.tipo === TipoJornada.REGULAR) {
          if (contadorregulares % 2 == 0) {
            jornada.retadores = Retadores.PARES;
            await this.jornadaRepository.save(jornada);
          } else {
            jornada.retadores = Retadores.IMPARES;
            await this.jornadaRepository.save(jornada);
          }
          contadorregulares++;
        } else if (jornada.tipo === TipoJornada.CRUZADA) {
          if (contadorcruzadas % 2 == 0) {
            jornada.retadores = Retadores.PARES;
            await this.jornadaRepository.save(jornada);
          } else {
            jornada.retadores = Retadores.IMPARES;
            await this.jornadaRepository.save(jornada);
          }

          contadorcruzadas++;
        }
      }
      return {
        gruposResponse,
        jornadas,
      };
    }
  }

  verificarRankingDuplicado(datos, modalidad: string) {
    const rankings = {};

    for (const item of datos) {
      if (modalidad === 'singles') {
        const ranking = item.jugador.ranking;
        if (rankings[ranking]) {
          return true;
        } else {
          rankings[ranking] = true;
        }
      } else if (modalidad === 'dobles') {
        const ranking = item.pareja.ranking;
        if (rankings[ranking]) {
          return true;
        } else {
          rankings[ranking] = true;
        }
      }
    }
  }

  //TODO: hacerlo funcionar
  // reorganizarRankings(datos, modalidad) {
  //   // Obtener los rankings actuales
  //   const rankings = datos.map(obj => obj.jugador.ranking);

  //   // Crear un array de rankings únicos ordenados de menor a mayor
  //   const uniqueRankings = [...new Set(rankings)].sort((a, b) => a - b);

  //   // Asignar nuevos rankings a los participantes
  //   datos.forEach(obj => {
  //     const ranking = obj.jugador.ranking;
  //     const index = uniqueRankings.indexOf(ranking);

  //     if (index !== -1) {
  //       // El ranking ya está definido
  //       uniqueRankings.splice(index, 1);
  //     } else {
  //       // El ranking debe ser asignado
  //       const newRanking = uniqueRankings.shift();
  //       obj.jugador.ranking = newRanking;
  //     }
  //   });

  //   console.log(datos);
  //   return datos;
  // }

  reorganizarRankings(datos, modalidad) {
    //const uniqueRankings = [...new Set(rankings)].sort((a: number, b:number) => a - b);

    const uniqueRankings = Array.from(
      { length: datos.length },
      (_, index) => index + 1,
    );

    if (modalidad === 'singles') {
      datos.forEach((obj) => {
        const ranking = obj.jugador.ranking;

        const index = uniqueRankings.indexOf(ranking);

        if (index !== -1) {
          uniqueRankings.splice(index, 1);
        } else {
          const newRanking = uniqueRankings.shift();
          obj.jugador.ranking = newRanking;
        }
      });
      return datos;
    } else {
      datos.forEach((obj) => {
        const ranking = obj.pareja.ranking;
        const index = uniqueRankings.indexOf(ranking);

        if (index !== -1) {
          uniqueRankings.splice(index, 1);
        } else {
          const newRanking = uniqueRankings.shift();
          obj.pareja.ranking = newRanking;
        }
      });
      return datos;
    }
  }

  // reorganizarRankings(datos, modalidad) {
  //   const rankings = datos.map(obj => obj.jugador.ranking);

  //   const uniqueRankings = [...new Set(rankings)].sort((a: number, b: number) => a - b);
  //   //const uniqueRankings = Array.from({ length: datos.length }, (_, index) => index + 1);

  //   uniqueRankings.forEach((ranking, index) => {
  //     const playersWithRanking = datos.filter(obj => obj.jugador.ranking === ranking);
  //     const randomIndex = Math.floor(Math.random() * playersWithRanking.length);
  //     const selectedPlayer = playersWithRanking[randomIndex];

  //     selectedPlayer.jugador.ranking = index + 1;

  //     for (let i = index + 1; i < uniqueRankings.length; i++) {
  //       const higherRanking = uniqueRankings[i];
  //       const playersToMove = datos.filter(obj => obj.jugador.ranking === higherRanking);

  //       playersToMove.forEach(obj => {
  //         obj.jugador.ranking++;
  //       });
  //     }
  //   });

  //   console.log(datos);
  //   return datos;
  // }

  async formarJornadas(
    cantidadJornadasRegulares: number,
    cantidadJornadasCruzadas: number,
    participantes: any,
    torneo: Torneo,
  ): Promise<Jornada[]> {
    const jornadas: Jornada[] = [];

    const cantidadOriginalRegulares = cantidadJornadasRegulares;
    const cantidadOriginalCruzadas = cantidadJornadasCruzadas;

    const cantidadJornadasPorCruzada = Math.floor(
      cantidadJornadasRegulares / cantidadJornadasCruzadas,
    );
    const cantidadTotalJornadas =
      cantidadJornadasRegulares + cantidadJornadasCruzadas;

    let contadorJornadasCruzadas = 0;

    if (cantidadOriginalRegulares > cantidadOriginalCruzadas) {
      for (let i = 0; i < cantidadTotalJornadas; i++) {
        if (contadorJornadasCruzadas < cantidadJornadasCruzadas) {
          //jornadas.push('regular');
          const jornada = new Jornada();
          jornada.tipo = 'regular';
          jornadas.push(jornada);
          contadorJornadasCruzadas++;
        } else {
          const jornada = new Jornada();
          jornada.tipo = 'cruzada';
          jornadas.push(jornada);
          contadorJornadasCruzadas = 0;
        }
      }
    }
    if (cantidadOriginalRegulares == cantidadOriginalCruzadas) {
      for (let i = 0; i < cantidadTotalJornadas; i++) {
        if (i % 2 === 0) {
          const jornada = new Jornada();
          jornada.tipo = 'regular';
          jornadas.push(jornada);
        } else {
          const jornada = new Jornada();
          jornada.tipo = 'cruzada';
          jornadas.push(jornada);
        }
      }
    }

    let contadorJornadas = 0;
    for (const jornada of jornadas) {
      if (contadorJornadas == 0) {
        jornada.participantes = participantes;
        jornada.posiciones = participantes;
        jornada.torneo = torneo;
        const jornadaPersitida = await this.jornadaRepository.save(jornada);
        contadorJornadas++;
      } else {
        jornada.torneo = torneo;
        const jornadaPersitida = await this.jornadaRepository.save(jornada);
      }
    }

    return jornadas;
  }

  async asignacionGruposTorneoEscalera(
    inscripciones: Array<any>,
    cantidadGrupos: number,
    jugadoresPorGrupo: number,
    modalidad: string,
    torneo: Torneo,
  ) {
    console.log('asi llegan', inscripciones);

    const inscripcionesRankingPares = [];
    const inscripcionesRankingImpares = [];

    for (const inscripcion of inscripciones) {
      if (modalidad === Modalidad.SINGLES) {
        if (inscripcion.jugador.ranking % 2 == 0) {
          inscripcionesRankingPares.push(inscripcion);
        } else {
          inscripcionesRankingImpares.push(inscripcion);
        }
      } else if (modalidad === Modalidad.DOBLES) {
        if (inscripcion.pareja.ranking % 2 == 0) {
          inscripcionesRankingPares.push(inscripcion);
        } else {
          inscripcionesRankingImpares.push(inscripcion);
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
      grupo.participantes.reverse();
      grupo.participantes.forEach((participante, index) => {
        participante.ranking = index + 1;
        console.log('particioante', participante);
      });
    }

    console.log('asi se van', grupos);

    return grupos;
  }

  async programarPartidosFaseGrupos(idTorneo: number) {
    if (!idTorneo) {
      throw new MiExcepcionPersonalizada(
        'No se Proporciono un id de Torneo',
        430,
      );
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
          contador++;

          // Puedes ajustar el manejo de fechas y otros campos según tus necesidades
          await this.partidoRepository.save(partido);
        }
      }
    }

    // Actualizar el estado del torneo
    torneo.estado = Estado.PROCESO;
    await this.torneoRepository.save(torneo);

    return {
      message: `se han creado un total de  ${contador} partidos, por favor dijita la fecha en la que se realizaran cada uno de ellos`,
    };
  }

  async programarPartidosFaseGruposTorneoEscalera(
    torneoId: number,
    jornadaId: number,
  ) {
    if (!torneoId || !jornadaId) {
      throw new MiExcepcionPersonalizada(
        'No se Proporciono un id de Torneo o de Jornada',
        400,
      );
    }
    const torneo = await this.torneoRepository.findOne({
      where: { id: torneoId },
      relations: ['grupos', 'jornadas'],
    });
    if (!torneo) {
      throw new MiExcepcionPersonalizada('No se encontró el Torneo', 404);
    }

    if (torneo.tipo_torneo != Tipo.ESCALERA) {
      throw new MiExcepcionPersonalizada(
        `el torneo es de tipo ${torneo.tipo_torneo} por lo cual no se puede realizar esta acción`,
        409,
      );
    }

    /*if (torneo.estado !== Estado.PROCESO) {
      const message = `Este torneo está en estado ${torneo.estado}, por lo cual es imposible realizar esta acción`;
      throw new MiExcepcionPersonalizada(message, 409);
    }*/

    let jornada = await this.jornadaRepository.findOneBy({ id: jornadaId });

    if (!jornada) {
      throw new MiExcepcionPersonalizada('No se encontro La Jornada', 404);
    }

    if (jornada.sorteado || jornada.finalizado) {
      throw new MiExcepcionPersonalizada(
        'No puedes hacer esto, los partidos de esta jornada ya fueron sorteados',
        409,
      );
    }

    const jornadas = await this.jornadaRepository.find({
      where: { torneo: torneo },
    });

    console.log('jornadas', jornadas);

    if (jornadas[0].id !== jornada.id) {
      const jornadaActual = jornada.id;

      let idAnteriorJornada = await this.obtenerAnteriorIdCercano(
        jornadaActual,
        jornadas,
      );
      console.log('id', idAnteriorJornada);

      let anteriorJornada = await this.jornadaRepository.findOne({
        where: { id: idAnteriorJornada },
      });
      console.log('anterior', anteriorJornada);
      if (anteriorJornada.finalizado != true) {
        throw new MiExcepcionPersonalizada(
          'No puedes hacer esto, la anterior jornada aun no ha finalizado',
          409,
        );
      }
    }
    let jornadaFound;
    for (let index = 0; index < torneo.jornadas.length; index++) {
      jornadaFound = torneo.jornadas[torneo.jornada_actual - 1];
    }

    if (jornadaFound.id == jornada.id) {
      //progrmar los partidos

      const tipoJornada = jornada.tipo;
      const retadores = jornada.retadores;

      let partidos;

      if (tipoJornada === TipoJornada.REGULAR) {
        if (retadores === Retadores.PARES) {
          for (const grupo of jornada.participantes) {
            partidos =
              await this.programarPartidosGruposJornadaRegularRetadoresPares(
                grupo.participantes,
                jornada,
                torneo,
                grupo.id,
              );
          }
          jornada.sorteado = true;
          await this.jornadaRepository.save(jornada);
        } else if (retadores === Retadores.IMPARES) {
          for (const grupo of jornada.participantes) {
            partidos =
              await this.programarPartidosGruposJornadaRegularRetadoresImpares(
                grupo.participantes,
                jornada,
                torneo,
                grupo.id,
              );
          }
          //return partidos
          jornada.sorteado = true;
          await this.jornadaRepository.save(jornada);
        }
      } else if (tipoJornada === TipoJornada.CRUZADA) {
        if (retadores === Retadores.PARES) {
          //partidos = await this.programarPartidosGruposJornadaCruzadaRetadoresPares(jornada.participantes, torneo, jornada)
          partidos =
            await this.programarPartidosGruposJornadaCruzadaRetadoresPares(
              jornada.posiciones,
              torneo,
              jornada,
            );
          jornada.sorteado = true;
          await this.jornadaRepository.save(jornada);
        } else if (retadores === Retadores.IMPARES) {
          partidos =
            await this.programarPartidosFaseGruposJornadaCruzadaRetadoresImpares(
              jornada.posiciones,
              torneo,
              jornada,
            );
          jornada.sorteado = true;
          await this.jornadaRepository.save(jornada);
        }
      }

      torneo.jornada_actual = torneo.jornada_actual + 1;
      await this.torneoRepository.save(torneo);

      return {
        message: `se formaron un total de ${partidos} partidos para esta Jornada`,
      };
    }
  }

  async obtenerAnteriorIdCercano(
    idActual: number,
    jornadas: any[],
  ): Promise<number> {
    const idsOrdenados = jornadas
      .map((jornada) => jornada.id)
      .sort((a, b) => a - b);

    const indiceActual = idsOrdenados.indexOf(idActual);
    //TODO: si algo se daña fue aqui
    if (indiceActual !== -1 && indiceActual < idsOrdenados.length /* - 1*/) {
      return idsOrdenados[indiceActual - 1];
    }

    return null;
  }

  async programarPartidosGruposJornadaRegularRetadoresPares(
    participantes: any[],
    jornada: Jornada,
    torneo: Torneo,
    grupo,
  ) {
    // Ordena los participantes por ranking de manera descendente
    const participantesOrdenados = participantes.sort(
      (a, b) => b.ranking - a.ranking,
    );

    // Divide los participantes en dos arreglos: pares e impares
    const pares = participantesOrdenados.filter((_, index) => index % 2 === 0);
    const impares = participantesOrdenados.filter(
      (_, index) => index % 2 !== 0,
    );

    // Organiza los enfrentamientos
    //const enfrentamientos: [any, any][] = [];
    let contador = 0;
    for (let i = 0; i < Math.min(pares.length, impares.length); i++) {
      //enfrentamientos.push([pares[i], impares[i]]);

      const partido = new Partido();
      partido.torneo = torneo;
      partido.fase = 'grupos';
      partido.grupo = grupo;
      partido.jornada = jornada;

      // Asignar IDs de participantes al partido
      if (torneo.modalidad === 'singles') {
        partido.jugador1 = pares[i].jugador;
        partido.jugador2 = impares[i].jugador;
      } else if (torneo.modalidad === 'dobles') {
        partido.pareja1 = pares[i].pareja;
        partido.pareja2 = impares[i].pareja;
      }

      //partidos.push(partido)
      contador++;
      // Puedes ajustar el manejo de fechas y otros campos según tus necesidades
      await this.partidoRepository.save(partido);
    }
    return contador + contador;
  }

  // async programarPartidosGruposJornadaRegularRetadoresImpares(participantes: any[], jornada: Jornada, torneo: Torneo, grupo) {
  //   // Ordena los participantes por ranking de manera descendente
  //   const participantesOrdenados = participantes.sort((a, b) => b.ranking - a.ranking);

  //   // Divide los participantes en dos arreglos: pares e impares
  //   const pares = participantesOrdenados.filter((_, index) => index % 2 === 0);
  //   const impares = participantesOrdenados.filter((_, index) => index % 2 !== 0);

  //   // Organiza los enfrentamientos
  //   // const enfrentamientos: [any, any][] = [];
  //   let contador = 0;

  //   // Obtén el índice del último participante impar
  //   const ultimoImparIndex = impares.length - 1;

  //   for (let i = 0; i < Math.min(pares.length, impares.length); i++) {
  //     // Si no es el primer o último participante impar, organiza el enfrentamiento
  //     if (i !== 0 && i !== ultimoImparIndex) {
  //       const partido = new Partido();
  //       partido.torneo = torneo;
  //       partido.fase = 'grupos';
  //       partido.grupo = grupo;
  //       partido.jornada = jornada;

  //       // Asignar IDs de participantes al partido
  //       if (torneo.modalidad === 'singles') {
  //         partido.jugador1 = impares[i].jugador;
  //         partido.jugador2 = pares[i].jugador;
  //       } else if (torneo.modalidad === 'dobles') {
  //         partido.pareja1 = impares[i].pareja;
  //         partido.pareja2 = pares[i].pareja;
  //       }

  //       // Puedes ajustar el manejo de fechas y otros campos según tus necesidades
  //       await this.partidoRepository.save(partido);

  //       contador++;
  //     }
  //   }

  //   return contador;
  // }

  async programarPartidosGruposJornadaRegularRetadoresImpares(
    participantes: any[],
    jornada: Jornada,
    torneo: Torneo,
    grupo,
  ) {
    // Ordena los participantes por ranking de manera descendente
    const participantesOrdenados = participantes.sort(
      (a, b) => a.ranking - b.ranking,
    );

    // Divide los participantes en dos arreglos: pares e impares
    let pares = participantesOrdenados.filter((_, index) => index % 2 === 0);
    let impares = participantesOrdenados.filter((_, index) => index % 2 !== 0);

    // Organiza los enfrentamientos
    // const enfrentamientos: [any, any][] = [];
    let contador = 0;

    // Obtén el índice del último participante impar
    const ultimoParIndex = pares.length - 1;
    pares.splice(0, 1);
    impares.splice(ultimoParIndex, 1);

    for (let i = 0; i < Math.max(pares.length, impares.length); i++) {
      // Si no es el primer o último participante impar, organiza el enfrentamiento
      const partido = new Partido();
      partido.torneo = torneo;
      partido.fase = 'grupos';
      partido.grupo = grupo;
      partido.jornada = jornada;

      // Asignar IDs de participantes al partido
      if (torneo.modalidad === 'singles') {
        partido.jugador1 = pares[i].jugador;
        partido.jugador2 = impares[i].jugador;
      } else if (torneo.modalidad === 'dobles') {
        partido.pareja1 = pares[i].pareja;
        partido.pareja2 = impares[i].pareja;
      }

      // Puedes ajustar el manejo de fechas y otros campos según tus necesidades
      await this.partidoRepository.save(partido);

      contador++;
    }

    return contador + contador;
  }

  // async programarPartidosGruposJornadaCruzadaRetadoresPares(grupos, torneo: Torneo, jornada: Jornada) {
  //   // Ordenar participantes dentro de cada grupo por ranking
  //   grupos.forEach((grupo) => {
  //     grupo.participantes.sort((a, b) => a.ranking - b.ranking);
  //   });

  //   // Asignar parejas según el criterio de pares e impares

  //   const vs = []

  //   for (let i = 0; i < grupos.length; i += 2) {
  //     const grupoA = grupos[i];
  //     const grupoB = grupos[i + 1];

  //     //for (let j = 0; j < grupoA.participantes.length; j += 2) {
  //     //for (let j = 0; j < grupoA.participantes.length / 2; j++) {
  //     for (let j = 0; j < grupoA.participantes.length; j++) {
  //     //for (let j = 0; j < grupoA.participantes.length / 2; j++) {
  //       const partido = new Partido();
  //       // partido.torneo = torneo;
  //       partido.fase = 'grupos';
  //       //partido.grupo = grupo;
  //       // partido.jornada = jornada;

  //       // Asignar IDs de participantes al partido
  //       // if (torneo.modalidad === 'singles') {
  //       //   partido.jugador1 =  grupoB.participantes[j + 1].jugador;
  //       //   partido.jugador2 = grupoA.participantes[j].jugador;

  //       // } else if (torneo.modalidad === 'dobles') {
  //       //   partido.pareja1 =  grupoB.participantes[j + 1].pareja;
  //       //   partido.pareja2 = grupoA.participantes[j].pareja;
  //       // }

  //       //   if (torneo.modalidad === 'singles') {

  //       //     partido.jugador1 = grupoA.participantes[j * 2 + 1].jugador;
  //       //     partido.jugador2 = grupoB.participantes[j * 2].jugador;
  //       // } else if (torneo.modalidad === 'dobles') {

  //       //     partido.pareja1 = grupoA.participantes[j * 2 + 1].pareja;
  //       //     partido.pareja2 = grupoB.participantes[j * 2].pareja;
  //       // }

  //       //   if (torneo.modalidad === 'singles') {
  //       //     const participanteGrupoA = grupoA.participantes[j];
  //       //     const participanteGrupoB = grupoB.participantes[j % grupoB.participantes.length];

  //       //     partido.jugador1 = participanteGrupoB.jugador;
  //       //     partido.jugador2 = participanteGrupoA.jugador;
  //       // } else if (torneo.modalidad === 'dobles') {
  //       //     const participanteGrupoA = grupoA.participantes[j];
  //       //     const participanteGrupoB = grupoB.participantes[j % grupoB.participantes.length];

  //       //     partido.pareja1 = participanteGrupoB.pareja;
  //       //     partido.pareja2 = participanteGrupoA.pareja;
  //       // }

  //       //   if (torneo.modalidad === 'singles') {
  //       //     const participanteGrupoA = grupoA.participantes[j];
  //       //     const participanteGrupoB = grupoB.participantes[(grupoB.participantes.length - 1) - j];

  //       //     partido.jugador1 = participanteGrupoB.jugador;
  //       //     partido.jugador2 = participanteGrupoA.jugador;
  //       // } else if (torneo.modalidad === 'dobles') {
  //       //     const participanteGrupoA = grupoA.participantes[j];
  //       //     const participanteGrupoB = grupoB.participantes[(grupoB.participantes.length - 1) - j];

  //       //     partido.pareja1 = participanteGrupoB.pareja;
  //       //     partido.pareja2 = participanteGrupoA.pareja;
  //       // }

  //       if (torneo.modalidad === 'singles') {
  //         // const participanteGrupoA = grupoA.participantes[j];
  //         // const participanteGrupoB = grupoB.participantes[(grupoB.participantes.length - 1) - j];

  //         // const participanteGrupoA = grupoA.participantes[j];
  //         // const participanteGrupoB = grupoB.participantes[j % grupoB.participantes.length];

  //         // partido.jugador1 = participanteGrupoB.jugador;
  //         // partido.jugador2 = participanteGrupoA.jugador;
  //         partido.jugador1 = grupoA.participantes[j * 2 + 1].jugador;
  //         partido.jugador2 = grupoB.participantes[j * 2].jugador;
  //     } else if (torneo.modalidad === 'dobles') {
  //         // const participanteGrupoA = grupoA.participantes[j];
  //         // const participanteGrupoB = grupoB.participantes[(grupoB.participantes.length - 1) - j];

  //             const participanteGrupoA = grupoA.participantes[j];
  //           const participanteGrupoB = grupoB.participantes[j % grupoB.participantes.length];

  //         partido.pareja1 = participanteGrupoB.pareja;
  //         partido.pareja2 = participanteGrupoA.pareja;
  //     }

  //       //const parejaA = grupoA.participantes[j];
  //       //const parejaB = grupoB.participantes[j + 1];

  //       // Asignar parejas
  //       // parejaA.pareja = parejaB;
  //       // parejaB.pareja = parejaA;

  //       vs.push(partido)
  //       //vs.push(parejaB)
  //     }
  //   }

  //   return vs
  // }

  async programarPartidosGruposJornadaCruzadaRetadoresPares(
    grupos,
    torneo: Torneo,
    jornada: Jornada,
  ) {
    // Ordenar participantes dentro de cada grupo por ranking
    grupos.forEach((grupo) => {
      grupo.participantes.sort((a, b) => a.ranking - b.ranking);
    });

    for (let i = 0; i < grupos.length; i += 2) {
      let grupoA = grupos[i].participantes;
      let grupoB = grupos[i + 1].participantes;

      const participantesIntercambiados = await this.intercambiarParesImpares(
        grupoA,
        grupoB,
      );

      grupos[i].participantes = participantesIntercambiados.nuevoGrupoA;
      grupos[i + 1].participantes = participantesIntercambiados.nuevoGrupoB;
    }
    const vs = [];

    for (const grupoint of grupos) {
      vs.push(
        await this.programarPartidosGruposJornadaCruzadaRetadoresPares1(
          grupoint.participantes,
          jornada,
          torneo,
        ),
      );
    }
    return vs;
  }

  async programarPartidosGruposJornadaCruzadaRetadoresPares1(
    participantes: any[],
    jornada: Jornada,
    torneo: Torneo,
  ) {
    const participantesOrdenados = participantes.sort(
      (a, b) => b.ranking - a.ranking,
    );

    const pares = participantesOrdenados.filter((_, index) => index % 2 === 0);
    const impares = participantesOrdenados.filter(
      (_, index) => index % 2 !== 0,
    );

    const partidos = [];
    let contador = 0;
    for (let i = 0; i < Math.min(pares.length, impares.length); i++) {
      //enfrentamientos.push([pares[i], impares[i]]);

      const partido = new Partido();
      partido.torneo = torneo;
      partido.fase = 'grupos';
      //partido.grupo = grupo;
      partido.jornada = jornada;

      if (torneo.modalidad === 'singles') {
        partido.jugador1 = pares[i].jugador;
        partido.jugador2 = impares[i].jugador;
      } else if (torneo.modalidad === 'dobles') {
        partido.pareja1 = pares[i].pareja;
        partido.pareja2 = impares[i].pareja;
      }

      partidos.push(partido);
      contador++;

      await this.partidoRepository.save(partido);
    }
    //return partidos
    return contador + contador;
  }

  async programarPartidosFaseGruposJornadaCruzadaRetadoresImpares(
    grupos,
    torneo: Torneo,
    jornada: Jornada,
  ) {
    grupos.forEach((grupo) => {
      grupo.participantes.sort((a, b) => a.ranking - b.ranking);
    });

    for (let i = 0; i < grupos.length; i += 2) {
      let grupoA = grupos[i].participantes;
      let grupoB = grupos[i + 1].participantes;

      const participantesIntercambiados = await this.intercambiarParesImpares(
        grupoA,
        grupoB,
      );

      grupos[i].participantes = participantesIntercambiados.nuevoGrupoA;
      grupos[i + 1].participantes = participantesIntercambiados.nuevoGrupoB;
    }
    const vs = [];

    for (const grupoint of grupos) {
      vs.push(
        await this.programarPartidosGruposJornadaCruzadaRetadoresImPares1(
          grupoint.participantes,
          jornada,
          torneo,
        ),
      );
    }
    return vs;
  }

  async programarPartidosGruposJornadaCruzadaRetadoresImPares1(
    participantes: any[],
    jornada: Jornada,
    torneo: Torneo,
  ) {
    // Ordena los participantes por ranking de manera descendente
    const participantesOrdenados = participantes.sort(
      (a, b) => a.ranking - b.ranking,
    );

    // Divide los participantes en dos arreglos: pares e impares
    let pares = participantesOrdenados.filter((_, index) => index % 2 === 0);
    let impares = participantesOrdenados.filter((_, index) => index % 2 !== 0);

    // Organiza los enfrentamientos
    // const enfrentamientos: [any, any][] = [];
    let contador = 0;

    // Obtén el índice del último participante impar
    const ultimoParIndex = pares.length - 1;
    pares.splice(0, 1);
    impares.splice(ultimoParIndex, 1);

    for (let i = 0; i < Math.max(pares.length, impares.length); i++) {
      // Si no es el primer o último participante impar, organiza el enfrentamiento
      const partido = new Partido();
      partido.torneo = torneo;
      partido.fase = 'grupos';
      //partido.grupo = grupo;
      partido.jornada = jornada;

      // Asignar IDs de participantes al partido
      if (torneo.modalidad === 'singles') {
        partido.jugador1 = pares[i].jugador;
        partido.jugador2 = impares[i].jugador;
      } else if (torneo.modalidad === 'dobles') {
        partido.pareja1 = pares[i].pareja;
        partido.pareja2 = impares[i].pareja;
      }

      // Puedes ajustar el manejo de fechas y otros campos según tus necesidades
      await this.partidoRepository.save(partido);

      contador++;
    }

    return contador + contador;
  }

  async intercambiarParesImpares(grupoA, grupoB) {
    const paresA = grupoA.filter((objeto) => objeto.ranking % 2 === 0);
    const imparesA = grupoA.filter((objeto) => objeto.ranking % 2 !== 0);

    const paresB = grupoB.filter((objeto) => objeto.ranking % 2 === 0);
    const imparesB = grupoB.filter((objeto) => objeto.ranking % 2 !== 0);

    // Intercambiar pares entre los grupos
    const nuevoGrupoA = [...imparesA, ...paresB];
    const nuevoGrupoB = [...imparesB, ...paresA];

    return { nuevoGrupoA, nuevoGrupoB };
  }

  async volverAsorteoGruupos(id: number) {
    const torneo = await this.torneoRepository.findOneBy({ id: id });

    torneo.estado = Estado.SORTEO;

    await this.torneoRepository.save(torneo);

    return {
      message:
        'El Torneo Ha vuelto al estado Sorteo, para poder gestionar grupos o particiopantes en los grupos, se debe tener precaución al momento de realizar dicha gestión',
    };
  }

  async CambiarTorneoAProgramacion(id: number) {
    if (!id) {
      throw new MiExcepcionPersonalizada(
        'No se Proporciono un id de Torneo',
        400,
      );
    }

    const torneo = await this.torneoRepository.findOne({
      where: { id: id },
    });

    if (!torneo) {
      throw new MiExcepcionPersonalizada('No se encontro el Torneo', 404);
    }

    if (torneo.estado != Estado.SORTEO) {
      const message = `Este torneo esta en estado ${torneo.estado} por lo cual es imposible realizar esta accion`;
      throw new MiExcepcionPersonalizada(message, 409);
    }

    torneo.estado = Estado.PROGRAMACION;
    await this.torneoRepository.save(torneo);

    return {
      message: `El Torneo ha avanzado manualmente al estado ${torneo.estado}`,
    };
  }

  async editarTorneo(updateTorneoDto: UpdateTorneoDto, id: number) {
    if (!id) {
      throw new MiExcepcionPersonalizada(
        'No se Proporciono un id de Torneo',
        400,
      );
    }

    const torneo = await this.torneoRepository.findOne({
      where: { id: id },
    });

    if (!torneo) {
      throw new MiExcepcionPersonalizada('No se encontro el Torneo', 404);
    }

    if (torneo.estado != Estado.INICIAL) {
      const message = `este torneo esta en estado ${torneo.estado} por lo cual es imposible realizar esta accion`;
      throw new MiExcepcionPersonalizada(message, 409);
    }

    if (updateTorneoDto.tipo_torneo === Tipo.ESCALERA) {
      const verificarCantidadGrupos = updateTorneoDto.cantidad_grupos % 2;
      if (verificarCantidadGrupos != 0) {
        throw new MiExcepcionPersonalizada(
          `La cantidad de grupos de un torneo ${Tipo.ESCALERA} debe ser par`,
          430,
        );
      }
    }

    if (updateTorneoDto.nombre) torneo.nombre = updateTorneoDto.nombre;

    if (updateTorneoDto.tipo_torneo)
      torneo.tipo_torneo = updateTorneoDto.tipo_torneo;

    if (updateTorneoDto.rama) torneo.rama = updateTorneoDto.rama;

    if (updateTorneoDto.modalidad) torneo.modalidad = updateTorneoDto.modalidad;

    if (updateTorneoDto.cantidad_grupos)
      torneo.cantidad_grupos = updateTorneoDto.cantidad_grupos;

    if (updateTorneoDto.categoria) torneo.categoria = updateTorneoDto.categoria;

    if (updateTorneoDto.configuracion_sets)
      torneo.configuracion_sets = updateTorneoDto.configuracion_sets;

    if (updateTorneoDto.cantidad_jornadas_regulares)
      torneo.cantidad_jornadas_regulares =
        updateTorneoDto.cantidad_jornadas_regulares;

    if (updateTorneoDto.cantidad_jornadas_cruzadas)
      torneo.cantidad_jornadas_cruzadas =
        updateTorneoDto.cantidad_jornadas_cruzadas;

    const torneoActualizado = await this.torneoRepository.save(torneo);

    return {
      torneoActualizado,
    };
  }

  async obtenerTorneos(usuario: Usuario) {
    //obtener el id del jugador a través del usuario

    //return usuario
    const jugador = await this.jugadorRepository.findOne({
      where: { userid: { id: usuario.id } },
    });

    //se van a devolver 3 objetos, torneos en los que el jugador esta inscrito, torneos proximos y torneos finalizados, torneos proximos son los mas faciles de obtener ya que es solo buscar los torneos que estan en estado Inicial y que coincidan con la categoria y la rama del jugador

    const torneosProximos = (
      await this.torneoRepository.find({
        where: {
          estado: Estado.INICIAL,
          categoria: jugador.categoria,
          rama: jugador.rama,
        },
      })
    ).sort((a, b) => Number(a.fecha_inicio) - Number(b.fecha_inicio));

    //para obtener los torneos en los que el jugador esta inscrito, se debe buscar en la tabla de inscripciones, y buscar las inscripciones que coincidan con el id del jugador, y luego buscar el torneo al que pertenece esa inscripcion, el estado del torneo debe ser diferente de finalizado

    const inscripciones = await this.inscripcionRepository.find({
      where: { jugador: jugador },
      relations: ['torneo'],
    });

    let torneosInscrito = [];

    for (const inscripcion of inscripciones) {
      const torneo = await this.torneoRepository.findOne({
        where: { id: inscripcion.torneo.id, estado: Not(Estado.FINALIZADO) },
      });
      if (torneo) {
        torneosInscrito.push(torneo);
      }
    }

    //para obtener los torneos finalizados, se debe buscar en la tabla de inscripciones, y buscar las inscripciones que coincidan con el id del jugador, y luego buscar el torneo al que pertenece esa inscripcion, el estado del torneo debe ser finalizado

    const inscripcionesFinalizadas = await this.inscripcionRepository.find({
      where: { jugador: jugador },
      relations: ['torneo'],
    });

    let torneosFinalizados = [];

    for (const inscripcion of inscripcionesFinalizadas) {
      const torneo = await this.torneoRepository.findOne({
        where: { id: inscripcion.torneo.id, estado: Estado.FINALIZADO },
      });
      if (torneo) {
        torneosFinalizados.push(torneo);
      }
    }

    return {
      torneosInscrito: torneosInscrito,
      torneosProximos: torneosProximos,
      torneosFinalizados: torneosFinalizados,
    };
  }
  async obtenerTorneoByid(id: number) {
    const torneo = await this.torneoRepository.findOne({
      where: { id: id },
      relations: [
        'grupos',
        'jornadas',
        'partidos',
        'partidos.jugador1',
        'partidos.jugador2',
        'partidos.pareja1',
        'partidos.pareja2',
        'llaves',
        'partidos.grupo',
        'inscripciones',
        'inscripciones.jugador',
        'inscripciones.pareja',
      ],
    });

    if (!torneo) {
      throw new MiExcepcionPersonalizada('No se encontro el Torneo', 404);
    }

    const partidosFormateados = [];

    for (const partido of torneo.partidos) {
      console.log(partido.grupo);

      let partidoFormateado = {
        id: partido.id,
        fase: partido.fase,
        resultado: partido.resultado,
        date: partido.date,
        jornada: partido.jornada,
        grupo: {
          id: partido.grupo ? partido.grupo.id : undefined, //partido.jugador1 ? partido.jugador1.id : undefined,
          nombre_grupo: partido.grupo ? partido.grupo.nombre_grupo : undefined,
        },
        jugador1: {
          id: partido.jugador1 ? partido.jugador1.id : undefined,
          nombre: partido.jugador1
            ? partido.jugador1.nombre_a_mostrar
            : undefined,
        },
        jugador2: {
          id: partido.jugador2 ? partido.jugador2.id : undefined,
          nombre: partido.jugador2
            ? partido.jugador2.nombre_a_mostrar
            : undefined,
        },
        pareja1: {
          id: partido.pareja1 ? partido.pareja1.id : undefined,
          nombre: partido.pareja1
            ? partido.pareja1.jugador1.nombre_a_mostrar +
              ' - ' +
              partido.pareja1.jugador2.nombre_a_mostrar
            : undefined,
        },
        pareja2: {
          id: partido.pareja2 ? partido.pareja2.id : undefined,
          nombre: partido.pareja2
            ? partido.pareja2.jugador1.nombre_a_mostrar +
              ' - ' +
              partido.pareja2.jugador2.nombre_a_mostrar
            : undefined,
        },
      };
      partidosFormateados.push(partidoFormateado);
    }

    torneo.partidos = partidosFormateados;

    return torneo;
  }

  async dashboardTorneos(id: number) {
    const jugador = await this.jugadorRepository.find({
      where: { userid: { id } },
    });

    const id_jugador = jugador[0].id;

    const inscripciones = await this.inscripcionRepository.find({
      where: { jugador: { id: id_jugador } },
      relations: ['torneo'],
    });

    const torneos = inscripciones.map((inscripcion) => inscripcion.torneo);

    const torneosEnProceso = torneos
      .filter((torneo) => torneo.estado === 'En Proceso')
      .map((torneo) => ({
        nombre: torneo.nombre,
        fase_actual: torneo.fase_actual,
      }));

    const totalTorneosEnProceso = torneosEnProceso.length;

    const torneosParticipados = torneos.length;

    const partidosGanados = await this.resultadosSetsService.count({
      ganador: { id_jugador },
    });

    const torneosCampeon = await this.resultadosSetsService.countCampeon(
      id_jugador,
    );
    const torneosSubcampeon =
      await this.resultadosSetsService.countSubcampeonatos(id_jugador);
    const partidosGanadosSingles =
      await this.resultadosSetsService.countGanadosSingles(id_jugador);
    const partidosPerdidosSingles =
      await this.resultadosSetsService.countPerdidosSingles(id_jugador);
    const partidosGanadosPareja =
      await this.resultadosSetsService.countGanadosPareja(id_jugador);
    const partidosPerdidosPareja =
      await this.resultadosSetsService.countPerdidosPareja(id_jugador);

    return {
      torneosEnProceso,
      totalTorneosEnProceso,
      torneosParticipados,
      partidosGanados,
      torneosCampeon,
      torneosSubcampeon,
      partidosGanadosSingles,
      partidosPerdidosSingles,
      partidosGanadosPareja,
      partidosPerdidosPareja,
    };
  }

  async adminEstadisticasTorneos() {
    const stats = {
      totalTorneosTipoRegular: await this.torneoRepository.count({ where: { tipo_torneo: Tipo.REGULAR } }),
      totalTorneosTipoEscalera: await this.torneoRepository.count({ where: { tipo_torneo: Tipo.ESCALERA } }),
      totalTorneosSingles: await this.torneoRepository.count({ where: { modalidad: Modalidad.SINGLES } }),
      totalTorneosDobles: await this.torneoRepository.count({ where: { modalidad: Modalidad.DOBLES } }),
      totalTorneosEstadoInicial: await this.torneoRepository.count({ where: { estado: Estado.INICIAL } }),
      totalTorneosEstadoSorteo: await this.torneoRepository.count({ where: { estado: Estado.SORTEO } }),
      totalTorneosEstadoProgramacion: await this.torneoRepository.count({ where: { estado: Estado.PROGRAMACION } }),
      totalTorneosEstadoEnProceso: await this.torneoRepository.count({ where: { estado: Estado.PROCESO } }),
      totalTorneosEstadoFinalizado: await this.torneoRepository.count({ where: { estado: Estado.FINALIZADO } }),
      totalTorneosFaseGrupos: await this.torneoRepository.count({ where: { fase_actual: Fases.GRUPOS } }),
      totalTorneosFaseOctavos: await this.torneoRepository.count({ where: { fase_actual: Fases.OCTAVOS } }),
      totalTorneosFaseCuartos: await this.torneoRepository.count({ where: { fase_actual: Fases.CUARTOS } }),
      totalTorneosFaseSemifinales: await this.torneoRepository.count({ where: { fase_actual: Fases.SEMIFINALES } }),
      totalTorneosFaseFinal: await this.torneoRepository.count({ where: { fase_actual: Fases.FINAL } }),
  };

    const torneos = await this.torneoRepository.find({
      relations: [
        'partidos',
        'resultadosSets',
        'resultadosSets.ganador',
        'resultadosSets.perdedor',
      ],
    });

    const jugadoresMayorPuntaje = [];

    const puntajes = [];
    torneos.forEach((e) => {
      e.resultadosSets.forEach((e) => {
        const ganador = e.ganador;
        const perdedor = e.perdedor;

        let j = puntajes.find((e) => e.id === ganador.id);

        if (!j) {
          puntajes.push({ ...ganador, puntos: e.puntos_ganador });
        } else {
          const jugador = puntajes.find((e) => e.id === ganador.id);

          jugador.puntos += e.puntos_ganador;

          for (let i = 0; i < puntajes.length; i++) {
            if (puntajes[i] === jugador.id) {
              puntajes[i] = jugador;
              break;
            }
          }
        }

        j = puntajes.find((e) => e.id === perdedor.id);

        if (!j) {
          puntajes.push({ ...perdedor, puntos: e.puntos_ganador });
        } else {
          const jugador = puntajes.find((e) => e.id === perdedor.id);

          jugador.puntos += e.puntos_perdedor;

          for (let i = 0; i < puntajes.length; i++) {
            if (puntajes[i] === jugador.id) {
              puntajes[i] = jugador;
              break;
            }
          }
        }
      });

      puntajes.sort((a, b) => b.puntos - a.puntos);
    });

    for (let i = 0; i < 5; i++) {
      jugadoresMayorPuntaje.push(puntajes[i]);
    }

    const top5JugadoresConMasTorneosGanados = await this.resultadosSetsService.Top5JugadoresConMasTorneosGanados();

    return {
      stats,
      jugadoresMayorPuntaje,
      top5JugadoresConMasTorneosGanados
    };
  }
}
