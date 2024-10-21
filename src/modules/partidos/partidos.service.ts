import { Injectable } from '@nestjs/common';
import { Partido } from './entities/partido.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Tipo, Torneo } from '../torneos/entities/torneo.entity';
import { MiExcepcionPersonalizada } from 'src/utils/exception';
import { ResultadoPartidoDTO } from './dto/resultado.dto';
import { Grupo } from '../grupos/entities/grupo.entity';
import { Llave } from '../llaves/entities/llave.entity';
import { Jornada, TipoJornada } from '../jornadas/entities/jornada.entity';
import { Inscripcion } from '../inscripciones/entities/inscripcione.entity';
import { Pareja } from '../parejas/entities/pareja.entity';
import { Jugador } from '../jugadores/entities/jugadore.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { ResultadosSetsService } from '../resultados-sets/resultados-sets.service';
import { Modalidad } from '../resultados-sets/entities/resultados-set.entity';

@Injectable()
export class PartidosService {
  constructor(
    @InjectRepository(Partido) private partidoRepository: Repository<Partido>,
    private resultadosSetsService: ResultadosSetsService,
    @InjectRepository(Torneo) private torneoRepository: Repository<Torneo>,
    @InjectRepository(Grupo) private grupoRepository: Repository<Grupo>,
    @InjectRepository(Llave) private llaveRepository: Repository<Llave>,
    @InjectRepository(Jornada) private jornadaRepository: Repository<Jornada>,
    @InjectRepository(Inscripcion)
    private inscripcionRepository: Repository<Inscripcion>,
    @InjectRepository(Pareja) private parejaRepository: Repository<Pareja>,
    @InjectRepository(Jugador) private jugadorRepository: Repository<Jugador>,
  ) {}

  generarBracketsPredefinidos(fase: string) {
    // console.log(fase);
    // Lógica para generar los brackets predefinidos según la fase
    const brackets = [];

    // Ejemplo: Generar brackets para cuartos de final
    if (fase === 'cuartos') {
      // Lado A
      brackets.push({
        fase,
        lado: 'izquierda',
        participante1: 1,
        participante2: 8,
        identificador: 1,
        proximoRival: 2,
      });
      brackets.push({
        fase,
        lado: 'izquierda',
        participante1: 4,
        participante2: 5,
        identificador: 2,
        proximoRival: 1,
      });
      // Lado B
      brackets.push({
        fase,
        lado: 'derecha',
        participante1: 2,
        participante2: 7,
        identificador: 3,
        proximoRival: 4,
      });
      brackets.push({
        fase,
        lado: 'derecha',
        participante1: 3,
        participante2: 6,
        identificador: 4,
        proximoRival: 3,
      });
    }
    //caso de octavos
    if (fase === 'octavos') {
      // Lado A
      brackets.push({
        fase,
        lado: 'izquierda',
        participante1: 1,
        participante2: 16,
        identificador: 1,
        proximoRival: 2,
      });
      brackets.push({
        fase,
        lado: 'izquierda',
        participante1: 8,
        participante2: 9,
        identificador: 2,
        proximoRival: 1,
      });
      brackets.push({
        fase,
        lado: 'izquierda',
        participante1: 4,
        participante2: 13,
        identificador: 3,
        proximoRival: 4,
      });
      brackets.push({
        fase,
        lado: 'izquierda',
        participante1: 5,
        participante2: 12,
        identificador: 4,
        proximoRival: 3,
      });
      // Lado B
      brackets.push({
        fase,
        lado: 'derecha',
        participante1: 2,
        participante2: 15,
        identificador: 5,
        proximoRival: 6,
      });
      brackets.push({
        fase,
        lado: 'derecha',
        participante1: 7,
        participante2: 10,
        identificador: 6,
        proximoRival: 5,
      });
      brackets.push({
        fase,
        lado: 'derecha',
        participante1: 3,
        participante2: 14,
        identificador: 7,
        proximoRival: 8,
      });
      brackets.push({
        fase,
        lado: 'derecha',
        participante1: 6,
        participante2: 11,
        identificador: 8,
        proximoRival: 7,
      });
    }

    //dieciseisavos
    if (fase === 'dieciseisavos') {
      // Lado A
      brackets.push({
        fase,
        lado: 'izquierda',
        participante1: 1,
        participante2: 32,
        identificador: 1,
        proximoRival: 2,
      });
      brackets.push({
        fase,
        lado: 'izquierda',
        participante1: 16,
        participante2: 17,
        identificador: 2,
        proximoRival: 1,
      });
      brackets.push({
        fase,
        lado: 'izquierda',
        participante1: 8,
        participante2: 25,
        identificador: 3,
        proximoRival: 4,
      });
      brackets.push({
        fase,
        lado: 'izquierda',
        participante1: 9,
        participante2: 24,
        identificador: 4,
        proximoRival: 3,
      });
      brackets.push({
        fase,
        lado: 'izquierda',
        participante1: 4,
        participante2: 29,
        identificador: 5,
        proximoRival: 6,
      });
      brackets.push({
        fase,
        lado: 'izquierda',
        participante1: 13,
        participante2: 20,
        identificador: 6,
        proximoRival: 5,
      });
      brackets.push({
        fase,
        lado: 'izquierda',
        participante1: 5,
        participante2: 28,
        identificador: 7,
        proximoRival: 8,
      });
      brackets.push({
        fase,
        lado: 'izquierda',
        participante1: 12,
        participante2: 21,
        identificador: 8,
        proximoRival: 7,
      });
      // Lado B
      brackets.push({
        fase,
        lado: 'derecha',
        participante1: 2,
        participante2: 31,
        identificador: 9,
        proximoRival: 10,
      });
      brackets.push({
        fase,
        lado: 'derecha',
        participante1: 15,
        participante2: 18,
        identificador: 10,
        proximoRival: 9,
      });
      brackets.push({
        fase,
        lado: 'derecha',
        participante1: 7,
        participante2: 26,
        identificador: 11,
        proximoRival: 12,
      });
      brackets.push({
        fase,
        lado: 'derecha',
        participante1: 10,
        participante2: 23,
        identificador: 12,
        proximoRival: 11,
      });
      brackets.push({
        fase,
        lado: 'derecha',
        participante1: 3,
        participante2: 30,
        identificador: 13,
        proximoRival: 14,
      });
      brackets.push({
        fase,
        lado: 'derecha',
        participante1: 14,
        participante2: 19,
        identificador: 14,
        proximoRival: 13,
      });
      brackets.push({
        fase,
        lado: 'derecha',
        participante1: 6,
        participante2: 27,
        identificador: 15,
        proximoRival: 16,
      });
      brackets.push({
        fase,
        lado: 'derecha',
        participante1: 11,
        participante2: 22,
        identificador: 16,
        proximoRival: 15,
      });
    }

    //semifinal
    if (fase === 'semifinales') {
      // Lado A
      brackets.push({
        fase,
        lado: 'izquierda',
        participante1: 1,
        participante2: 4,
        identificador: 1,
        proximoRival: 2,
      });

      // Lado B
      brackets.push({
        fase,
        lado: 'derecha',
        participante1: 2,
        participante2: 3,
        identificador: 2,
        proximoRival: 1,
      });
    }

    //final
    if (fase === 'final') {
      brackets.push({
        fase,
        lado: 'final',
        participante1: 1,
        participante2: 2,
        identificador: 1,
        proximoRival: 2,
      });
    }

    return brackets;
  }

  async obtenerPartidosTorneo(idTorneo: number) {
    if (!idTorneo) {
      throw new MiExcepcionPersonalizada(
        'No se Proporciono un id de Torneo',
        400,
      );
    }
    const torneo = await this.torneoRepository.findOne({
      where: { id: idTorneo },
    });
    if (!torneo) {
      throw new MiExcepcionPersonalizada('No se encontro el Torneo', 404);
    }
    const partidos = await this.partidoRepository.find({
      where: { torneo: { id: idTorneo } },
      relations: [
        'jugador1',
        'jugador1.userid',
        'jugador2',
        'jugador2.userid',
        'pareja1',
        'pareja2',
        'grupo',
        'pareja1.jugador1',
        'pareja1.jugador1.userid',
        'pareja1.jugador2',
        'pareja1.jugador2.userid',
        'pareja2.jugador1',
        'pareja2.jugador1.userid',
        'pareja2.jugador2',
        'pareja2.jugador2.userid',
        'jornada',
      ],
    });

    // return partidos
    const partidosFormateados = [];
    for (const partido of partidos) {
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
          nombre_a_mostrar: partido.jugador1
            ? partido.jugador1.nombre_a_mostrar
            : undefined,
          nombre: partido.jugador1 ? partido.jugador1.userid.nombre : undefined,
          apellido: partido.jugador1
            ? partido.jugador1.userid.apellido
            : undefined,
        },
        jugador2: {
          id: partido.jugador2 ? partido.jugador2.id : undefined,
          nombre_a_mostrar: partido.jugador2
            ? partido.jugador2.nombre_a_mostrar
            : undefined,
          nombre: partido.jugador2 ? partido.jugador2.userid.nombre : undefined,
          apellido: partido.jugador2
            ? partido.jugador2.userid.apellido
            : undefined,
        },
        pareja1: {
          id: partido.pareja1 ? partido.pareja1.id : undefined,
          nombres_a_mostrar: partido.pareja1
            ? partido.pareja1.jugador1.nombre_a_mostrar +
              ' - ' +
              partido.pareja1.jugador2.nombre_a_mostrar
            : undefined,
          nombre_jugador1: partido.pareja1
            ? `${partido.pareja1.jugador1.userid.nombre} ${partido.pareja1.jugador1.userid.apellido}`
            : undefined,
          nombre_jugador2: partido.pareja1
            ? `${partido.pareja1.jugador2.userid.nombre} ${partido.pareja1.jugador2.userid.apellido}`
            : undefined,
        },
        pareja2: {
          id: partido.pareja2 ? partido.pareja2.id : undefined,
          nombres_a_mostrar: partido.pareja2
            ? partido.pareja2.jugador1.nombre_a_mostrar +
              ' - ' +
              partido.pareja2.jugador2.nombre_a_mostrar
            : undefined,
          nombre_jugador1: partido.pareja2
            ? `${partido.pareja2.jugador1.userid.nombre} ${partido.pareja2.jugador1.userid.apellido}`
            : undefined,
          nombre_jugador2: partido.pareja2
            ? `${partido.pareja2.jugador2.userid.nombre} ${partido.pareja2.jugador2.userid.apellido}`
            : undefined,
        },
      };
      partidosFormateados.push(partidoFormateado);
    }
    return partidosFormateados;
  }

  async actualizarResultado(id: number, nuevoResultado: ResultadoPartidoDTO) {
    if (!id) {
      throw new MiExcepcionPersonalizada(
        'No se Proporciono un id del partido',
        400,
      );
    }
    const partido = await this.partidoRepository.findOne({
      where: { id: id },
      relations: [
        'grupo',
        'torneo',
        'jornada',
        'jugador1',
        'jugador2',
        'pareja1',
        'pareja2',
      ],
    });

    if (!partido) {
      throw new MiExcepcionPersonalizada('No se encontro el partido', 404);
    }

    if (partido.torneo.estado === 'Finalizado') {
      throw new MiExcepcionPersonalizada(
        'No Se puede actualizar un partido de un Torneo Finalizado',
        403,
      );
    }
    const { sets, ganador, perdedor } = nuevoResultado;

    let modalidad: Modalidad;
    if (
      partido.jugador1 &&
      partido.jugador2 &&
      !partido.pareja1 &&
      !partido.pareja2
    ) {
      modalidad = Modalidad.SINGLES;
    } else if (
      partido.pareja1 &&
      partido.pareja2 &&
      !partido.jugador1 &&
      !partido.jugador2
    ) {
      modalidad = Modalidad.PAREJA;
    } else {
      throw new MiExcepcionPersonalizada(
        'No se puede determinar la modalidad del partido',
        400,
      );
    }

    for (const set of sets) {
      const [puntosGanador, puntosPerdedor] = set.marcador
        .split('-')
        .map(Number);

      await this.resultadosSetsService.create({
        id_torneo: partido.torneo.id,
        id_partido: partido.id,
        ganador: ganador.id,
        perdedor: perdedor.id,
        puntos_ganador: puntosGanador,
        puntos_perdedor: puntosPerdedor,
        modalidad: modalidad,
        fase: partido.torneo.fase_actual,
      });
    }

    if (partido.torneo.tipo_torneo === Tipo.REGULAR) {
      if (partido.fase === 'grupos') {
        // Obtener las posiciones actuales del grupo
        const posicionesActuales = partido.grupo.posiciones || {};
        if (Object.keys(posicionesActuales).length === 0) {
          if (ganador) {
            const ganadorId = ganador.id;
            posicionesActuales[ganadorId] = posicionesActuales[ganadorId] || {};
            posicionesActuales[ganadorId].puntos =
              (posicionesActuales[ganadorId]?.puntos || 0) + 1;
            posicionesActuales[ganadorId].setsGanados =
              (posicionesActuales[ganadorId]?.setsGanados || 0) +
              ganador.setsGanados;
            posicionesActuales[ganadorId].setsPerdidos =
              (posicionesActuales[ganadorId]?.setsPerdidos || 0) +
              ganador.setsPerdidos;
            posicionesActuales[ganadorId].puntosSets =
              (posicionesActuales[ganadorId]?.puntosSets || 0) +
              ganador.puntosSets;
            posicionesActuales[ganadorId].partidosJugados =
              (posicionesActuales[ganadorId]?.partidosJugados || 0) + 1;

            posicionesActuales[ganadorId].juegosGanados =
              (posicionesActuales[ganadorId]?.juegosGanados || 0) +
              ganador.puntosSets;
            posicionesActuales[ganadorId].juegosPerdidos =
              (posicionesActuales[ganadorId]?.juegosPerdidos || 0) +
              perdedor.puntosSets;
          }

          // Incrementar los valores del perdedor
          if (perdedor) {
            const perdedorId = perdedor.id;
            posicionesActuales[perdedorId] =
              posicionesActuales[perdedorId] || {};
            posicionesActuales[perdedorId].puntos =
              (posicionesActuales[perdedorId]?.puntos || 0) + 0; // No suma puntos al perdedor
            posicionesActuales[perdedorId].setsGanados =
              (posicionesActuales[perdedorId]?.setsGanados || 0) +
              perdedor.setsGanados;
            posicionesActuales[perdedorId].setsPerdidos =
              (posicionesActuales[perdedorId]?.setsPerdidos || 0) +
              perdedor.setsPerdidos;
            posicionesActuales[perdedorId].puntosSets =
              (posicionesActuales[perdedorId]?.puntosSets || 0) +
              perdedor.puntosSets;
            posicionesActuales[perdedorId].partidosJugados =
              (posicionesActuales[perdedorId]?.partidosJugados || 0) + 1;
            posicionesActuales[perdedorId].juegosGanados =
              (posicionesActuales[perdedorId]?.juegosGanados || 0) +
              perdedor.puntosSets;
            posicionesActuales[perdedorId].juegosPerdidos =
              (posicionesActuales[perdedorId]?.juegosPerdidos || 0) +
              ganador.puntosSets;
          }

          const participantesOrdenados = partido.grupo.participantes.sort(
            (a, b) => {
              const puntosA =
                posicionesActuales[a.jugador?.id || a.pareja?.id]?.puntos || 0;
              const puntosB =
                posicionesActuales[b.jugador?.id || b.pareja?.id]?.puntos || 0;
              return puntosB - puntosA;
            },
          );

          // Actualizar las posiciones en el grupo
          partido.grupo.posiciones = participantesOrdenados.map(
            (participante) => {
              const participanteId =
                participante.jugador?.id || participante.pareja?.id;
              return {
                id: participanteId,
                puntos: posicionesActuales[participanteId]?.puntos || 0,
                setsGanados:
                  posicionesActuales[participanteId]?.setsGanados || 0,
                setsPerdidos:
                  posicionesActuales[participanteId]?.setsPerdidos || 0,
                puntosSets: posicionesActuales[participanteId]?.puntosSets || 0,
                partidosJugados:
                  posicionesActuales[participanteId]?.partidosJugados || 0,
                juegosGanados:
                  posicionesActuales[participanteId]?.juegosGanados || 0,
                juegosPerdidos:
                  posicionesActuales[participanteId]?.juegosPerdidos || 0,
              };
            },
          );
        } else {
          if (ganador && perdedor) {
            partido.grupo.posiciones = await this.actualizarDatos(
              posicionesActuales,
              nuevoResultado,
            );
          }
        }
        await this.grupoRepository.save(partido.grupo);

        partido.resultado = {
          sets: sets,
          ganador: ganador,
          perdedor: perdedor,
        };

        partido.finalizado = true;

        const partidoActualizado = await this.partidoRepository.save(partido);

        return partidoActualizado;
      } else {
        partido.resultado = {
          sets: sets,
          ganador: ganador,
          perdedor: perdedor,
        };

        partido.finalizado = true;

        const partidoActualizado = await this.partidoRepository.save(partido);
        return partidoActualizado;
      }
    } else if (partido.torneo.tipo_torneo === Tipo.ESCALERA) {
      if (partido.finalizado) {
        throw new MiExcepcionPersonalizada(
          'El partido ya se ha marcado como finalizado, no se puede editar',
          403,
        );
      }

      if (partido.fase === 'grupos') {
        const jornada = partido.jornada;
        const grupo = partido.grupo;

        const jornadaEntidad = await this.jornadaRepository.findOneBy(jornada);
        const grupoEntidad = await this.grupoRepository.findOneBy(grupo);

        //return grupoEntidad

        if (jornadaEntidad.tipo === TipoJornada.REGULAR) {
          partido.resultado = {
            sets: sets,
            ganador: ganador,
            perdedor: perdedor,
          };

          //return 'jornada regular'

          partido.finalizado = true;

          //TODO: descomentar
          const partidoActualizado = await this.partidoRepository.save(partido);
          let cambioRanking = false;
          let tipocambio: string;

          if (ganador.tipo == 'jugador') {
            if (partido.jugador1.id == ganador.id) {
              console.log('si hay cambio');
              console.log(
                '--------------------------------------------------------------------------------------------------------------------------------------',
              );
              cambioRanking = true;
              tipocambio = 'jugador';
            }
          }

          if (ganador.tipo == 'pareja') {
            if (partido.pareja1.id == ganador.id) {
              cambioRanking = true;
              tipocambio = 'pareja';
            }
          }

          if (cambioRanking && tipocambio === 'jugador') {
            //return jornada.participantes
            //buscar el perdedor y el ganador y cambiarlos
            for (const grupo of jornada.participantes) {
              console.log(
                grupo.id,
                'entro al grupo',
                grupo.id,
                partido.grupo.id,
              );
              if (grupo.id == partido.grupo.id)
                console.log('----------------------- - -');
              {
                // console.log(grupo.participantes)
                console.log('entro al if grupo');

                const ganadorIndex = grupo.participantes.findIndex(
                  (participante) => participante.jugador.id === ganador.id,
                );
                const ganadorRes = grupo.participantes.find(
                  (participante) => participante.jugador.id === ganador.id,
                );
                console.log('ganador', ganadorIndex, ganadorRes);
                const perdedorIndex = grupo.participantes.findIndex(
                  (participante) => participante.jugador.id === perdedor.id,
                );
                const perdedorRes = grupo.participantes.find(
                  (participante) => participante.jugador.id === perdedor.id,
                );
                console.log('perdedor', perdedorIndex, perdedorRes);

                if (ganadorIndex !== -1 && perdedorIndex !== -1) {
                  //console.log('ganador',grupo.participantes[ganadorIndex], 'perdedor', grupo.participantes[perdedorIndex]  )
                  // Intercambiar los rankings
                  const tempRanking = grupo.participantes[ganadorIndex].ranking;
                  //console.log('tempranking despues de const',tempRanking, grupo.participantes[ganadorIndex] )
                  grupo.participantes[ganadorIndex].ranking =
                    grupo.participantes[perdedorIndex].ranking;

                  // console.log(' grupo.participantes[ganadorIndex]', grupo.participantes[ganadorIndex])
                  grupo.participantes[perdedorIndex].ranking = tempRanking;
                  // console.log(' grupo.participantes[perdedorIndex]', grupo.participantes[perdedorIndex])
                  //console.log(' grupo.participantes', grupo.participantes)
                  grupoEntidad.participantes = grupo.participantes;

                  //console.log('---------')
                  //console.log('grupoEntidad.participantes', grupoEntidad.participantes)

                  //return { grupoEntidad, t: 'algo' }

                  //TODO: descomentar REVISAR LAS CRUZADAS CUANDO HAY GANADOR
                  await this.grupoRepository.save(grupoEntidad);
                }
              }
            }

            jornadaEntidad.participantes = jornada.participantes;
            jornadaEntidad.posiciones = jornada.participantes;

            console.log('---------');

            // for (const jornadaent of jornadaEntidad.participantes) {
            //   console.log(' jornadaEntidad.participantes', jornadaent.participantes)

            // }

            // jornadaEntidad.participantes =  grupoEntidad.participantes
            // jornadaEntidad.posiciones =  grupoEntidad.participantes

            // return {
            //   pos: jornadaEntidad.posiciones,
            //   par: jornadaEntidad.participantes,
            //   grup: grupoEntidad.participantes
            // }
            //TODO: descomentar
            const retorno = await this.jornadaRepository.save(jornadaEntidad);

            //  return {

            //   grupo: grupoEntidad,
            //   retorno: retorno

            // }
          }

          if (cambioRanking && tipocambio === 'pareja') {
            console.log('parejas');

            //return jornada.participantes
            //buscar el perdedor y el ganador y cambiarlos
            for (const grupo of jornada.participantes) {
              if (grupo.id == partido.grupo.id) {
                const ganadorIndex = grupo.participantes.findIndex(
                  (participante) => participante.pareja.id === ganador.id,
                );
                const perdedorIndex = grupo.participantes.findIndex(
                  (participante) => participante.pareja.id === perdedor.id,
                );

                if (ganadorIndex !== -1 && perdedorIndex !== -1) {
                  // Intercambiar los rankings
                  const tempRanking = grupo.participantes[ganadorIndex].ranking;
                  grupo.participantes[ganadorIndex].ranking =
                    grupo.participantes[perdedorIndex].ranking;
                  grupo.participantes[perdedorIndex].ranking = tempRanking;

                  grupoEntidad.participantes = grupo.participantes;

                  await this.grupoRepository.save(grupoEntidad);
                }
              }
            }
            jornadaEntidad.participantes = jornada.participantes;
            jornadaEntidad.posiciones = jornada.participantes;
            await this.jornadaRepository.save(jornadaEntidad);
          }

          // return{
          //   pos: jornadaEntidad.posiciones,
          //     par: jornadaEntidad.participantes,
          //      grup: grupoEntidad.participantes

          // }

          const jornadaActual = partido.jornada.id;
          const numeroJornadaActual = partido.torneo.jornada_actual;
          const cantidad_jornadas =
            partido.torneo.cantidad_jornadas_cruzadas +
            partido.torneo.cantidad_jornadas_regulares;

          //return
          //return jornadaActual
          // where: { torneo: { id: idTorneo } },
          const todosFinalizados = await this.partidoRepository.find({
            where: { jornada: { id: jornadaActual }, finalizado: true },
          });

          // return todosFinalizados

          const partidos = await this.partidoRepository.find({
            where: { jornada: { id: jornadaActual } },
          });

          if (todosFinalizados.length == partidos.length) {
            console.log('primer if');

            if (numeroJornadaActual <= cantidad_jornadas) {
              console.log('segundo if');

              //buscar todas las jornadas del torneo

              const jornadas = await this.jornadaRepository.find({
                where: { torneo: partido.torneo },
              });

              let idSiguienteJornada = await this.obtenerSiguienteIdCercano(
                jornadaActual,
                jornadas,
              );

              let siguienteJornada = await this.jornadaRepository.findOne({
                where: { id: idSiguienteJornada },
              });

              siguienteJornada.participantes = jornada.participantes;
              siguienteJornada.posiciones = jornada.participantes;

              // return {
              //   todosFinalizados,siguienteJornada, posi: jornada.posiciones
              // }

              await this.jornadaRepository.save(siguienteJornada);
            }

            jornada.finalizado = true;
            await this.jornadaRepository.save(jornada);
          }

          return {
            message: 'Partido Editado con exito',
          };
        } else if (jornadaEntidad.tipo === TipoJornada.CRUZADA) {
          partido.resultado = {
            sets: sets,
            ganador: ganador,
            perdedor: perdedor,
          };

          //return 'estoy en un partido de jornada cruzada'

          partido.finalizado = true;

          //TODO:Descomentar
          const partidoActualizado = await this.partidoRepository.save(partido);
          let cambioRanking = false;
          let tipocambio: string;

          if (ganador.tipo === 'jugador') {
            if (partido.jugador1.id == ganador.id) {
              cambioRanking = true;
              tipocambio = 'jugador';
            }
          }
          if (ganador.tipo === 'pareja') {
            if (partido.pareja1.id == ganador.id) {
              cambioRanking = true;
              tipocambio = 'pareja';
            }
          }

          //return jornada.posiciones
          //obtener los grupos involucrados
          //const grupos = await this.grupoRepository.find({ where: { torneo: partido.torneo}})
          //return grupos

          let grupo1: number;
          let grupo2: number;

          for (const grupo of jornada.participantes) {
            for (const participante of grupo.participantes) {
              if (
                ganador.tipo === 'jugador' &&
                ganador.id === participante.jugador.id
              ) {
                grupo1 = grupo.id;
              }
              if (
                perdedor.tipo === 'jugador' &&
                perdedor.id === participante.jugador.id
              ) {
                grupo2 = grupo.id;
              }
              if (
                ganador.tipo === 'pareja' &&
                ganador.id === participante.pareja.id
              ) {
                grupo1 = grupo.id;
              }
              if (
                perdedor.tipo === 'pareja' &&
                perdedor.id === participante.pareja.id
              ) {
                grupo2 = grupo.id;
              }
            }
          }
          //obtener los grupos involucrados

          const grupoAEntidad = await this.grupoRepository.findOne({
            where: { id: grupo1 },
          });
          const grupoBEntidad = await this.grupoRepository.findOne({
            where: { id: grupo2 },
          });

          grupoAEntidad.participantes.sort((a, b) => a.ranking - b.ranking);
          grupoBEntidad.participantes.sort((a, b) => a.ranking - b.ranking);
          // return{
          //   grupoAEntidad,
          //   grupoBEntidad
          // }
          const jornadaActual = partido.jornada.id;
          const todosFinalizados = await this.partidoRepository.find({
            where: { jornada: { id: jornadaActual }, finalizado: true },
          });
          const partidos = await this.partidoRepository.find({
            where: { jornada: { id: jornadaActual } },
          });

          /*TODO:DEJAR LA CONDICION ORIGINAL*/
          /*if (partidos.length - todosFinalizados.length != 0) {/*if (partidos.length - todosFinalizados.length != 1) {

            if (cambioRanking && tipocambio == 'jugador') {
              let cont: number = 0
              for (const grupoA of jornada.participantes) {
                for (const grupoB of jornada.participantes) {
                  if (grupoA.id !== grupoB.id) {

                    const ganadorIndex = grupoA.participantes.findIndex(participante => participante.jugador.id === ganador.id);
                    const ganadorRes = grupoA.participantes.find(participante => participante.jugador.id === ganador.id);
                    console.log('ganador', ganadorIndex, ganadorRes)
                    const perdedorIndex = grupoB.participantes.findIndex(participante => participante.jugador.id === perdedor.id);
                    const perdedorRes = grupoB.participantes.find(participante => participante.jugador.id === perdedor.id);
                    console.log('perdedor', perdedorIndex, perdedorRes)

                    if (ganadorIndex !== -1 && perdedorIndex !== -1) {
                      console.log('entre a cuando no es la ultima fecha', partidos.length - todosFinalizados.length)
                      // Intercambiar participantes entre los grupos
                      const ganadorTemp = grupoA.participantes[ganadorIndex];
                      const perdedorTemp = grupoB.participantes[perdedorIndex];



                      const nuevoRankingGanador = perdedorTemp.ranking
                      const nuevoRankingPerdedor = ganadorTemp.ranking



                      ganadorTemp.ranking = nuevoRankingGanador
                      perdedorTemp.ranking = nuevoRankingPerdedor

                      console.log('ganadorTem', ganadorTemp)
                      console.log('perdedorTemp', perdedorTemp)

                      grupoA.participantes[ganadorIndex] = perdedorTemp;
                      grupoB.participantes[perdedorIndex] = ganadorTemp;

                      // Actualizar participantes en las entidades de grupo
                      grupoAEntidad.participantes = grupoA.participantes;
                      grupoBEntidad.participantes = grupoB.participantes;

                      console.log('entre ', cont, ' veces')

                      cont++

                      // Guardar los cambios en la base de datos
                      //TODO:DESCOMENTAR
                      await this.grupoRepository.save(grupoAEntidad);
                      await this.grupoRepository.save(grupoBEntidad);
                    }
                  }
                }
              }
              jornadaEntidad.participantes = jornada.participantes

              // return{
              //   jornadaEntidad
              // }
              //jornadaEntidad.posiciones = jornada.participantes
              //TODO:DESCOMENTAR
              await this.jornadaRepository.save(jornadaEntidad)
            }
            if (cambioRanking && tipocambio == 'pareja') {
              for (const grupoA of jornada.participantes) {
                for (const grupoB of jornada.participantes) {
                  if (grupoA.id !== grupoB.id) {
                    const ganadorIndex = grupoA.participantes.findIndex(participante => participante.pareja.id === ganador.id);
                    const perdedorIndex = grupoB.participantes.findIndex(participante => participante.pareja.id === perdedor.id);

                    if (ganadorIndex !== -1 && perdedorIndex !== -1) { 
                      // Intercambiar participantes entre los grupos
                      const ganadorTemp = grupoA.participantes[ganadorIndex];
                      const perdedorTemp = grupoB.participantes[perdedorIndex];
                      const nuevoRankingGanador = perdedorTemp.ranking
                      const nuevoRankingPerdedor = ganadorTemp.ranking
                      ganadorTemp.ranking = nuevoRankingGanador
                      perdedorTemp.ranking = nuevoRankingPerdedor
                      grupoA.participantes[ganadorIndex] = perdedorTemp;
                      grupoB.participantes[perdedorIndex] = ganadorTemp;
                      // Actualizar participantes en las entidades de grupo
                      grupoAEntidad.participantes = grupoA.participantes;
                      grupoBEntidad.participantes = grupoB.participantes;
                      // Guardar los cambios en la base de datos
                      await this.grupoRepository.save(grupoAEntidad);
                      await this.grupoRepository.save(grupoBEntidad);
                    }
                  }
                }
              }

              jornadaEntidad.participantes = jornada.participantes
              //jornadaEntidad.posiciones = jornada.participantes
              await this.jornadaRepository.save(jornadaEntidad)


            }
          */ //}//FIXME:AWQUIDESCOMENTAR* else {

          if (cambioRanking && tipocambio == 'jugador') {
            let cont: number = 0;
            for (const grupoA of jornada.participantes) {
              for (const grupoB of jornada.participantes) {
                if (grupoA.id !== grupoB.id) {
                  if (cont === 0) {
                    const ganadorIndex = grupoA.participantes.findIndex(
                      (participante) => participante.jugador.id === ganador.id,
                    );
                    const ganadorRes = grupoA.participantes.find(
                      (participante) => participante.jugador.id === ganador.id,
                    );
                    console.log('ganador', ganadorIndex, ganadorRes);
                    const perdedorIndex = grupoB.participantes.findIndex(
                      (participante) => participante.jugador.id === perdedor.id,
                    );
                    const perdedorRes = grupoB.participantes.find(
                      (participante) => participante.jugador.id === perdedor.id,
                    );
                    console.log('perdedor', perdedorIndex, perdedorRes);

                    if (ganadorIndex !== -1 && perdedorIndex !== -1) {
                      console.log('entre a cambiar rankings');
                      // Intercambiar participantes entre los grupos
                      const ganadorTemp = grupoA.participantes[ganadorIndex];
                      const perdedorTemp = grupoB.participantes[perdedorIndex];

                      const nuevoRankingGanador = perdedorTemp.ranking;
                      const nuevoRankingPerdedor = ganadorTemp.ranking;

                      ganadorTemp.ranking = nuevoRankingGanador;
                      perdedorTemp.ranking = nuevoRankingPerdedor;

                      console.log('ganadorTem', ganadorTemp);
                      console.log('perdedorTemp', perdedorTemp);

                      grupoA.participantes[ganadorIndex] = perdedorTemp;
                      grupoB.participantes[perdedorIndex] = ganadorTemp;

                      // Actualizar participantes en las entidades de grupo
                      grupoAEntidad.participantes = grupoA.participantes;
                      grupoBEntidad.participantes = grupoB.participantes;

                      console.log(
                        'estoy probando que entra a cambiar rankings ',
                        cont,
                        ' veces',
                      );
                      cont++;
                      // Guardar los cambios en la base de datos
                      //TODO:DESCOMENTAR
                      await this.grupoRepository.save(grupoAEntidad);
                      await this.grupoRepository.save(grupoBEntidad);
                    }
                  }
                }
              }
            }

            jornadaEntidad.participantes = jornada.participantes;
            // return{
            //   jornadaEntidad
            // }
            //jornadaEntidad.posiciones = jornada.participantes

            //TODO:DESCOMENTAR
            await this.jornadaRepository.save(jornadaEntidad);
          }
          if (cambioRanking && tipocambio == 'pareja') {
            let cont: number = 0;
            for (const grupoA of jornada.participantes) {
              for (const grupoB of jornada.participantes) {
                if (grupoA.id !== grupoB.id) {
                  if (cont === 0) {
                    const ganadorIndex = grupoA.participantes.findIndex(
                      (participante) => participante.pareja.id === ganador.id,
                    );
                    const perdedorIndex = grupoB.participantes.findIndex(
                      (participante) => participante.pareja.id === perdedor.id,
                    );

                    if (ganadorIndex !== -1 && perdedorIndex !== -1) {
                      // Intercambiar participantes entre los grupos
                      const ganadorTemp = grupoA.participantes[ganadorIndex];
                      const perdedorTemp = grupoB.participantes[perdedorIndex];
                      const nuevoRankingGanador = perdedorTemp.ranking;
                      const nuevoRankingPerdedor = ganadorTemp.ranking;
                      ganadorTemp.ranking = nuevoRankingGanador;
                      perdedorTemp.ranking = nuevoRankingPerdedor;
                      grupoA.participantes[ganadorIndex] = perdedorTemp;
                      grupoB.participantes[perdedorIndex] = ganadorTemp;
                      // Actualizar participantes en las entidades de grupo
                      grupoAEntidad.participantes = grupoA.participantes;
                      grupoBEntidad.participantes = grupoB.participantes;
                      // Guardar los cambios en la base de datos
                      await this.grupoRepository.save(grupoAEntidad);
                      await this.grupoRepository.save(grupoBEntidad);
                    }
                  }
                }
              }
            }

            jornadaEntidad.participantes = jornada.participantes;
            //jornadaEntidad.posiciones = jornada.participantes
            await this.jornadaRepository.save(jornadaEntidad);
          }

          //FIXME:AWQUIDESCOMENTAR*}

          //return{ grupoAEntidad, grupoBEntidad}
          const numeroJornadaActual = partido.torneo.jornada_actual;
          const cantidad_jornadas =
            partido.torneo.cantidad_jornadas_cruzadas +
            partido.torneo.cantidad_jornadas_regulares;
          //FIXME:borrar este auxiliar
          //const aux = 1
          /*TODO:DEJAR EL IF ORIGINAL*/
          if (todosFinalizados.length == partidos.length) {
            /*if (aux == 1) {*/
            if (numeroJornadaActual <= cantidad_jornadas) {
              console.log('--------------');
              console.log('entre al if de la ultima jornada');
              //buscar todas las jornadas del torneo
              const jornadas = await this.jornadaRepository.find({
                where: { torneo: partido.torneo },
              });
              let idSiguienteJornada = await this.obtenerSiguienteIdCercano(
                jornadaActual,
                jornadas,
              );
              let siguienteJornada = await this.jornadaRepository.findOne({
                where: { id: idSiguienteJornada },
              });
              //siguienteJornada.posiciones = jornada.posiciones
              siguienteJornada.posiciones = jornada.participantes;
              siguienteJornada.participantes = jornada.participantes;
              //TODO:DESCOMENTAR
              await this.jornadaRepository.save(siguienteJornada);
            }
            jornada.finalizado = true;
            //TODO:DESCOMENTAR
            await this.jornadaRepository.save(jornada);
          }
          // return {
          //   jornadaEntidad
          // }
          return {
            message: 'Partido Editado con exito',
          };
        }
      } else {
        partido.resultado = {
          sets: sets,
          ganador: ganador,
          perdedor: perdedor,
        };

        partido.finalizado = true;

        const partidoActualizado = await this.partidoRepository.save(partido);
        return partidoActualizado;
      }
    }
  }

  actualizarDatos(posiciones: any, resultado: ResultadoPartidoDTO): any {
    const { ganador, perdedor } = resultado;
    if (ganador && perdedor) {
      const ganadorId = ganador.id;
      const perdedorId = perdedor.id;

      for (const posicion of posiciones) {
        if (posicion.id === ganadorId) {
          posicion.puntos += 1;
          posicion.setsGanados += ganador.setsGanados;
          posicion.setsPerdidos += ganador.setsPerdidos;
          posicion.juegosGanados += ganador.puntosSets;
          posicion.juegosPerdidos += perdedor.puntosSets;
          posicion.puntosSets += ganador.puntosSets;
          posicion.partidosJugados += 1;
        }
        if (posicion.id === perdedorId) {
          posicion.puntos += 0;
          posicion.setsGanados += perdedor.setsGanados;
          posicion.setsPerdidos += perdedor.setsPerdidos;
          posicion.juegosGanados += perdedor.puntosSets;
          posicion.juegosPerdidos += ganador.puntosSets;
          posicion.puntosSets += perdedor.puntosSets;
          posicion.partidosJugados += 1;
        }
      }
    }

    return posiciones;
  }

  async obtenerSiguienteIdCercano(
    idActual: number,
    jornadas: any[],
  ): Promise<number> {
    const idsOrdenados = jornadas
      .map((jornada) => jornada.id)
      .sort((a, b) => a - b);

    const indiceActual = idsOrdenados.indexOf(idActual);

    if (indiceActual !== -1 && indiceActual < idsOrdenados.length - 1) {
      return idsOrdenados[indiceActual + 1];
    }

    return null;
  }

  async sortearSiguienteFase(torneoId: number) {
    // Verificar que todos los partidos de la fase de grupos estén finalizados

    if (!torneoId) {
      throw new MiExcepcionPersonalizada(
        'No se Proporciono un id del Torneo',
        404,
      );
    }
    const torneo = await this.torneoRepository.findOne({
      where: { id: torneoId },
    });

    if (!torneo) {
      throw new MiExcepcionPersonalizada('El torneo buscado No existe', 404);
    }

    if (torneo.estado !== 'En Proceso') {
      throw new MiExcepcionPersonalizada(
        `El torneo buscado esta en estado ${torneo.estado} por lo cual no se puede sortear la siguiente fase`,
        409,
      );
    }

    switch (torneo.fase_actual) {
      case 'grupos':
        if (torneo.tipo_torneo === 'regular') {
          return this.sortearSiguienteFaseTorneoRegularFaseGrupos(torneo);
        } else if (torneo.tipo_torneo === 'escalera') {
          return this.sortearSiguienteFaseTorneoEscaleraFaseGrupos(torneo);
        }
        break;
      case 'final':
        return this.jugarFinal(torneo);
        break;
      default:
        return this.sortearFasesIntermedias(torneo);
        break;
    }
  }

  async sortearSiguienteFaseTorneoRegularFaseGrupos(torneo: Torneo) {
    const grupos = await this.grupoRepository.find({
      where: { torneo: { id: torneo.id } },
      relations: ['partidos'],
    });

    //return grupos
    const todosFinalizados = grupos.every((grupo) =>
      grupo.partidos.every((partido) => partido.finalizado),
    );
    //obtener los partidos no finalizados
    const noFinalizados = grupos.filter((grupo) =>
      grupo.partidos.some((partido) => !partido.finalizado),
    );

    //return noFinalizados

    if (!todosFinalizados) {
      throw new MiExcepcionPersonalizada(
        'No todos los partidos de la fase de grupos han finalizado.',
        400,
      );
    }
    // return todosFinalizados
    // Obtener los dos mejores participantes de cada grupo
    const participantesOrdenados = this.ordenarPosicionesGrupos(grupos);
    //return participantesOrdenados
    // Ordenar los participantes globales para sortear la fase de llaves
    const participantesOrdenadosGlobal = this.ordenarPosicionesGlobales(
      participantesOrdenados,
    );
    // Organizar la fase de llaves
    const llaves = this.organizarLlaves(participantesOrdenadosGlobal);
    //return llaves;
    const llavesReturn = [];
    // guardar las llaves en la bd
    const modalidad = torneo.modalidad;
    const fase = this.obtenerEtapa(llaves.length);

    console.log(llaves);
    //return fase
    for (const llave of llaves) {
      let jugador1: any;
      let jugador2: any;
      let pareja1: any;
      let pareja2: any;
      const generarBracketsPredefinidos =
        this.generarBracketsPredefinidos(fase);
      //let fase: any

      if (modalidad === 'singles') {
        jugador1 = llave.participante1.id;
        jugador2 = llave.participante2.id;

        let semiidentificador = llave.semiidentificadorpt1;
        let semiidentificador2 = llave.semiidentificadorpt2; //aunque solo con el primero es suficiente

        const bracket = generarBracketsPredefinidos.find(
          (bracket) => bracket.participante1 === semiidentificador,
        );
        //return bracket

        const llaveCreada = this.llaveRepository.create({
          torneo: torneo,
          fase: fase,
          jugador1: jugador1,
          jugador2: jugador2,
          identificador: bracket.identificador,
          lado: bracket.lado,
          proximoRivalIdentificador: bracket.proximoRival,
        });
        //console.log('llaveCreada', llaveCreada)

        const llaveGuardada = await this.llaveRepository.save(llaveCreada);
        const partidoCreado = this.partidoRepository.create({
          fase: fase,
          torneo: torneo,
          jugador1: jugador1,
          jugador2: jugador2,
        });
        const partidoGuardado = await this.partidoRepository.save(
          partidoCreado,
        );
        llavesReturn.push(llaveGuardada);
      } else {
        let semiidentificador = llave.semiidentificadorpt1;
        let semiidentificador2 = llave.semiidentificadorpt2; //aunque solo con el primero es suficiente

        const bracket = generarBracketsPredefinidos.find(
          (bracket) => bracket.participante1 === semiidentificador,
        );

        pareja1 = llave.participante1.id;
        pareja2 = llave.participante2.id;
        const llaveCreada = this.llaveRepository.create({
          torneo: torneo,
          fase: fase,
          pareja1: pareja1,
          pareja2: pareja2,
          identificador: bracket.identificador,
          lado: bracket.lado,
          proximoRivalIdentificador: bracket.proximoRival,
        });

        const llaveGuardada = await this.llaveRepository.save(llaveCreada);
        const partidoCreado = this.partidoRepository.create({
          fase: fase,
          torneo: torneo,
          pareja1: pareja1,
          pareja2: pareja2,
        });
        const partidoGuardado = await this.partidoRepository.save(
          partidoCreado,
        );
        llavesReturn.push(llaveGuardada);
      }
    }
    torneo.fase_actual = fase;
    await this.torneoRepository.save(torneo);

    return llavesReturn;
  }

  async sortearSiguienteFaseTorneoEscaleraFaseGrupos(torneo: Torneo) {
    const grupos = await this.grupoRepository.find({
      where: { torneo: torneo },
      relations: ['partidos'],
    });

    const partidosJugadosGrupos = await this.partidoRepository.find({
      where: { torneo: torneo, fase: 'grupos' },
    });

    const todosFinalizados = partidosJugadosGrupos.every(
      (partido) => partido.finalizado,
    );
    if (!todosFinalizados) {
      throw new MiExcepcionPersonalizada(
        'No todos los partidos de la fase de grupos han finalizado.',
        400,
      );
    }

    let cantidadparticipantesclasificanGrupo = 0;

    if (torneo.cantidad_grupos === 2) {
      cantidadparticipantesclasificanGrupo = 4;
    } else {
      cantidadparticipantesclasificanGrupo = 2;
    }
    const participantesOrdenados = [];
    for (const grupo of grupos) {
      const participantesGrupo = grupo.participantes || [];

      const participantesOrdenadosGrupo = participantesGrupo
        .sort((a, b) => a.ranking - b.ranking)
        .slice(0, cantidadparticipantesclasificanGrupo); // Tomar los x mejores participantes
      participantesOrdenados.push(...participantesOrdenadosGrupo);
    }

    const participantesOrdenadosGlobal = participantesOrdenados.sort(
      (a, b) => a.ranking - b.ranking,
    );
    const llaves = this.organizarLlaves(participantesOrdenadosGlobal);

    const llavesReturn = [];

    const modalidad = torneo.modalidad;
    const fase = this.obtenerEtapa(llaves.length);

    for (const llave of llaves) {
      let jugador1: any;
      let jugador2: any;
      let pareja1: any;
      let pareja2: any;
      //let fase: any
      if (modalidad === 'singles') {
        jugador1 = llave.participante1.jugador.id;
        jugador2 = llave.participante2.jugador.id;
        //fase = this.obtenerEtapa(llaves.length)

        const llaveCreada = this.llaveRepository.create({
          torneo: torneo,
          fase: fase,
          jugador1: jugador1,
          jugador2: jugador2,
        });
        const llaveGuardada = await this.llaveRepository.save(llaveCreada);
        const partidoCreado = this.partidoRepository.create({
          fase: fase,
          torneo: torneo,
          jugador1: jugador1,
          jugador2: jugador2,
        });
        const partidoGuardado = await this.partidoRepository.save(
          partidoCreado,
        );
        llavesReturn.push(llaveGuardada);
      } else {
        pareja1 = llave.participante1.pareja.id;
        pareja2 = llave.participante2.pareja.id;
        const llaveCreada = this.llaveRepository.create({
          torneo: torneo,
          fase: fase,
          pareja1: pareja1,
          pareja2: pareja2,
        });

        const llaveGuardada = await this.llaveRepository.save(llaveCreada);
        const partidoCreado = this.partidoRepository.create({
          fase: fase,
          torneo: torneo,
          pareja1: pareja1,
          pareja2: pareja2,
        });
        const partidoGuardado = await this.partidoRepository.save(
          partidoCreado,
        );
        llavesReturn.push(llaveGuardada);
      }
    }
    torneo.fase_actual = fase;
    await this.torneoRepository.save(torneo);
    return llavesReturn;
  }

  async sortearFasesIntermedias(torneo: Torneo) {
    const llavesJugadas = await this.llaveRepository.find({
      where: { torneo: torneo },
    });
    const partidosJugadosLlaves = await this.partidoRepository.find({
      where: { torneo: { id: torneo.id } },
    });
    const todosFinalizados = partidosJugadosLlaves.every(
      (partido) => partido.finalizado,
    );
    if (!todosFinalizados) {
      throw new MiExcepcionPersonalizada(
        `No todos los partidos de la fase ${torneo.fase_actual} han finalizado.`,
        400,
      );
    }

    const llaves = await this.llaveRepository.find({
      where: { torneo: torneo, fase: torneo.fase_actual },
      relations: [
        'jugador1',
        'jugador2',
        'pareja1',
        'pareja2',
        'pareja1.jugador1',
        'pareja1.jugador2',
        'pareja2.jugador1',
        'pareja2.jugador1',
      ],
    });

    const ganadores = [];
    for (const partido of partidosJugadosLlaves) {
      let participante = partido.resultado.ganador;
      //let llave = partido.llave
      ganadores.push(participante);
    }

    let semifinales:any = [];
    for(const llave of partidosJugadosLlaves){
      if(llave.fase === 'semifinales'){
        semifinales.push(llave.resultado.ganador)
      }
    }

    //return {ganadores, llaves}
    const nuevaFase = this.obtenerSiguienteFase(torneo.fase_actual);

    // validar si la nueva fase es la final, no se hace todo el proceso de llaves sino que simplemente se obtiene el ganador de las dos llaves y se crea una llave final y un partido final y se retorna
    // return {ganadores, semifinales};s

    if (nuevaFase === 'final') {
      //validar si es singles o dobles
      // console.log(ganadores, nuevaFase);
      if (torneo.modalidad === 'singles') {
        const jugador1 = semifinales[0].id;
        const jugador2 = semifinales[1].id;
        const llaveCreada = this.llaveRepository.create({
          torneo: torneo,
          fase: nuevaFase,
          jugador1: jugador1,
          jugador2: jugador2,
        });
        const llaveGuardada = await this.llaveRepository.save(llaveCreada);
        const partidoCreado = this.partidoRepository.create({
          fase: nuevaFase,
          torneo: torneo,
          jugador1: jugador1,
          jugador2: jugador2,
        });
        const partidoGuardado = await this.partidoRepository.save(
          partidoCreado,
        );

        // console.log(llaveCreada);
        torneo.fase_actual = 'final';
        await this.torneoRepository.save(torneo);
        return llaveGuardada;
      } else {
        const pareja1 = ganadores[0].id;
        const pareja2 = ganadores[1].id;
        const llaveCreada = this.llaveRepository.create({
          torneo: torneo,
          fase: nuevaFase,
          pareja1: pareja1,
          pareja2: pareja2,
        });
        const llaveGuardada = await this.llaveRepository.save(llaveCreada);
        const partidoCreado = this.partidoRepository.create({
          fase: nuevaFase,
          torneo: torneo,
          pareja1: pareja1,
          pareja2: pareja2,
        });
        const partidoGuardado = await this.partidoRepository.save(
          partidoCreado,
        );
        torneo.fase_actual = 'final';
        await this.torneoRepository.save(torneo);

        return llaveGuardada;
      }
    }

    // Crear un mapa para almacenar las nuevas llaves y evitar duplicados
    const nuevasLlavesMap = new Map();

    if (torneo.modalidad === 'singles') {
      // Iterar sobre el arreglo de ganadores
      for (const ganador of ganadores) {
        // Verificar si el ganador ya fue asignado a alguna llave
        if (nuevasLlavesMap.size > 0) {
          const jugadorAsignado = Array.from(nuevasLlavesMap.values()).find(
            (llave) =>
              llave.jugador1 === ganador.id || llave.jugador2 === ganador.id,
          );
          if (jugadorAsignado) {
            continue; // Pasar a la siguiente iteración si el ganador ya ha sido asignado a otra llave
          }
        }

        // Buscar la participación del ganador en el arreglo de llaves
        const llaveParticipacion = llaves.find((llave) => {
          // Verificar si el ganador participó como jugador1 o jugador2 en la llave
          return (
            llave.jugador1?.id === ganador.id ||
            llave.jugador2?.id === ganador.id
          );
        });

        // Verificar si se encontró la llave de participación del ganador
        if (llaveParticipacion) {
          // Obtener el proximoRivalIdentificador de la llave de participación
          const proximoRivalIdentificador =
            llaveParticipacion.proximoRivalIdentificador;

          // Buscar la llave que tenga el proximoRivalIdentificador
          const llaveProximoRival = llaves.find(
            (llave) => llave.identificador === proximoRivalIdentificador,
          );
          //return llaveProximoRival
          const proximoRivalGanador1 = ganadores.find(
            (gana) => gana.id === llaveProximoRival.jugador1.id,
          );
          const proximoRivalGanador2 = ganadores.find(
            (gana) => gana.id === llaveProximoRival.jugador2.id,
          );

          const proximoRivalGanador =
            proximoRivalGanador1 || proximoRivalGanador2;

          // Verificar si se encontró la llave del próximo rival
          if (llaveProximoRival) {
            // Determinar quién es el otro participante de la llave del próximo rival
            let jugador1, jugador2;
            /*if (llaveParticipacion.jugador1?.id === ganador.id) {
              jugador1 = ganador.id;
              jugador2 = llaveProximoRival.jugador1?.id !== ganador.id ? llaveProximoRival.jugador1?.id : llaveProximoRival.jugador2?.id;
            } else {
              jugador1 = llaveProximoRival.jugador1?.id !== ganador.id ? llaveProximoRival.jugador1?.id : llaveProximoRival.jugador2?.id;
              jugador2 = ganador.id;
            }*/

            if (
              llaveParticipacion.jugador1 &&
              llaveParticipacion.jugador1.id === ganador.id
            ) {
              jugador1 = ganador.id;
              jugador2 = proximoRivalGanador.id;
              /*if (llaveProximoRival.jugador1 && llaveProximoRival.jugador1.id === proximoRivalGanador.id) {
                jugador2 = proximoRivalGanador.id//llaveProximoRival.jugador1.id;//llaveProximoRival.jugador1.id;
              } else {
                jugador2 = llaveProximoRival.jugador2.id;//llaveProximoRival.jugador2.id;
              }*/
            } else {
              jugador2 = ganador.id;
              jugador1 = proximoRivalGanador.id;
              /*if (llaveProximoRival.jugador1 && llaveProximoRival.jugador1.id === proximoRivalGanador.id) {
                jugador1 = llaveProximoRival.jugador1.id; //llaveProximoRival.jugador1.id;
              } else {
                jugador1 = llaveProximoRival.jugador2.id;//llaveProximoRival.jugador2.id;
              }*/
            }

            // Verificar si se encontró al otro participante
            if (jugador1 && jugador2) {
              // Determinar el lado de la nueva llave como el lado de la llave original
              const lado = llaveParticipacion.lado;

              // Crear una clave única para la nueva llave
              const nuevaLlaveKey = `${jugador1}_${jugador2}_${lado}`;

              // Verificar si la nueva llave ya existe en el mapa
              if (!nuevasLlavesMap.has(nuevaLlaveKey)) {
                // Crear una nueva llave con los ganadores de las llaves anteriores
                const nuevaLlave = {
                  fase: nuevaFase,
                  identificador: null, // Esto se asignará más adelante
                  proximoRivalIdentificador: null, // Esto se asignará más adelante
                  lado: lado,
                  jugador1: jugador1,
                  jugador2: jugador2,
                };

                // Agregar la nueva llave al mapa de nuevas llaves
                nuevasLlavesMap.set(nuevaLlaveKey, nuevaLlave);
              }
            } else {
              console.log(
                'No se pudo encontrar al otro participante de la llave del próximo rival.',
              );
            }
          } else {
            console.log('No se pudo encontrar la llave del próximo rival.');
          }
        } else {
          console.log(
            'No se pudo encontrar la llave de participación del ganador.',
          );
        }
      }
    } else if (torneo.modalidad === 'dobles') {
      for (const ganador of ganadores) {
        // Verificar si el ganador ya fue asignado a alguna llave
        if (nuevasLlavesMap.size > 0) {
          const parejaAsignada = Array.from(nuevasLlavesMap.values()).find(
            (llave) =>
              llave.pareja1 === ganador.id || llave.pareja2 === ganador.id,
          );
          if (parejaAsignada) {
            continue; // Pasar a la siguiente iteración si el ganador ya ha sido asignado a otra llave
          }
        }

        // Buscar la participación del ganador en el arreglo de llaves
        const llaveParticipacion = llaves.find((llave) => {
          // Verificar si el ganador participó como pareja1 o pareja2 en la llave
          return (
            llave.pareja1?.id === ganador.id || llave.pareja2?.id === ganador.id
          );
        });

        // Verificar si se encontró la llave de participación del ganador
        if (llaveParticipacion) {
          // Obtener el proximoRivalIdentificador de la llave de participación
          const proximoRivalIdentificador =
            llaveParticipacion.proximoRivalIdentificador;

          // Buscar la llave que tenga el proximoRivalIdentificador
          const llaveProximoRival = llaves.find(
            (llave) => llave.identificador === proximoRivalIdentificador,
          );

          // Verificar si se encontró la llave del próximo rival
          if (llaveProximoRival) {
            // Determinar quién es el otro participante de la llave del próximo rival
            let pareja1, pareja2;
            if (llaveParticipacion.pareja1?.id === ganador.id) {
              pareja1 = ganador.id;
              pareja2 =
                llaveProximoRival.pareja1?.id !== ganador.id
                  ? llaveProximoRival.pareja1?.id
                  : llaveProximoRival.pareja2?.id;
            } else {
              pareja1 =
                llaveProximoRival.pareja1?.id !== ganador.id
                  ? llaveProximoRival.pareja1?.id
                  : llaveProximoRival.pareja2?.id;
              pareja2 = ganador.id;
            }

            // Verificar si se encontró al otro participante
            if (pareja1 && pareja2) {
              // Determinar el lado de la nueva llave como el lado de la llave original
              const lado = llaveParticipacion.lado;

              // Crear una clave única para la nueva llave
              const nuevaLlaveKey = `${pareja1}_${pareja2}_${lado}`;

              // Verificar si la nueva llave ya existe en el mapa
              if (!nuevasLlavesMap.has(nuevaLlaveKey)) {
                // Crear una nueva llave con los ganadores de las llaves anteriores
                const nuevaLlave = {
                  fase: nuevaFase,
                  identificador: null, // Esto se asignará más adelante
                  proximoRivalIdentificador: null, // Esto se asignará más adelante
                  lado: lado,
                  pareja1: pareja1,
                  pareja2: pareja2,
                };

                // Agregar la nueva llave al mapa de nuevas llaves
                nuevasLlavesMap.set(nuevaLlaveKey, nuevaLlave);
              }
            } else {
              console.log(
                'No se pudo encontrar al otro participante de la llave del próximo rival.',
              );
            }
          } else {
            console.log('No se pudo encontrar la llave del próximo rival.');
          }
        } else {
          console.log(
            'No se pudo encontrar la llave de participación del ganador.',
          );
        }
      }
    }

    // Convertir el mapa de nuevas llaves a un arreglo
    const nuevasLlaves = Array.from(nuevasLlavesMap.values());
    //return nuevasLlaves;

    // Asignar identificadores y próximos rivales identificadores a las nuevas llaves
    let identificadorIzquierda = 1;
    let identificadorDerecha = nuevasLlaves.length / 2 + 1;

    for (const nuevaLlave of nuevasLlaves) {
      if (nuevaLlave.lado === 'izquierda') {
        // Asignar identificador ascendente para las llaves del lado izquierdo
        nuevaLlave.identificador = identificadorIzquierda;
        // Asignar próximo rival identificador descendente para las llaves del lado izquierdo
        nuevaLlave.proximoRivalIdentificador =
          identificadorIzquierda % 2 === 1
            ? identificadorIzquierda + 1
            : identificadorIzquierda - 1;
        identificadorIzquierda++;
      } else if (nuevaLlave.lado === 'derecha') {
        // Asignar identificador descendente para las llaves del lado derecho
        nuevaLlave.identificador = identificadorDerecha;
        // Asignar próximo rival identificador ascendente para las llaves del lado derecho
        nuevaLlave.proximoRivalIdentificador =
          identificadorDerecha % 2 === 1
            ? identificadorDerecha + 1
            : identificadorDerecha - 1;
        identificadorDerecha++;
      }
    }
    //aqui se deben guardar las llaves en la base de datos

    //para no hacer mas grande la funcion se creara una funcion que se encargue de guardar las llaves

    const llavesGuardadas = await this.guardarLLavesIntermedias(
      torneo,
      nuevasLlaves,
    );
    //actualizar la fase actual del torneo

    torneo.fase_actual = nuevaFase;
    await this.torneoRepository.save(torneo);

    return llavesGuardadas;
  }

  async guardarLLavesIntermedias(torneo: Torneo, llaves: any[]) {
    const llavesGuardadas = [];
    for (const llave of llaves) {
      const llaveCreada = this.llaveRepository.create({
        torneo: torneo,
        fase: llave.fase,
        jugador1: llave.jugador1,
        jugador2: llave.jugador2,
        pareja1: llave.pareja1,
        pareja2: llave.pareja2,
        identificador: llave.identificador,
        lado: llave.lado,
        proximoRivalIdentificador: llave.proximoRivalIdentificador,
      });
      const llaveGuardada = await this.llaveRepository.save(llaveCreada);
      llavesGuardadas.push(llaveGuardada);

      const partidoCreado = this.partidoRepository.create({
        fase: llave.fase,
        torneo: torneo,
        jugador1: llave.jugador1,
        jugador2: llave.jugador2,
        pareja1: llave.pareja1,
        pareja2: llave.pareja2,
      });
      const partidoGuardado = await this.partidoRepository.save(partidoCreado);
    }
    return llavesGuardadas;
  }

  async jugarFinal(torneo: Torneo) {
    const partidosJugadosLlaves = await this.partidoRepository.find({
      where: { torneo: { id: torneo.id }, fase: torneo.fase_actual },
      relations: [
        'jugador1',
        'jugador2',
        'pareja1',
        'pareja2',
        'pareja1.jugador1',
        'pareja1.jugador2',
        'pareja2.jugador1',
        'pareja2.jugador1',
      ],
    });

    const todosFinalizados = partidosJugadosLlaves.every(
      (partido) => partido.finalizado,
    );

    if (!todosFinalizados) {
      return {
        message: `No se ha jugado la final, por favor actualizar resultados`,
      };
    } else {
      let ranking;
      if (torneo.tipo_torneo === 'regular') {
        ranking = await this.actualizarRanking(torneo);
      }
      const partido = partidosJugadosLlaves[0];
      let ganadorNombre = '';
      if (partido.resultado.ganador.tipo === 'jugador') {
        if (
          partido.jugador1 &&
          partido.jugador1.id === partido.resultado.ganador.id
        ) {
          ganadorNombre = partido.jugador1.nombre_a_mostrar;
        } else if (
          partido.jugador2 &&
          partido.jugador2.id === partido.resultado.ganador.id
        ) {
          ganadorNombre = partido.jugador2.nombre_a_mostrar;
        }
      } else if (partido.resultado.ganador.tipo === 'pareja') {
        if (
          partido.pareja1 &&
          partido.pareja1.id === partido.resultado.ganador.id
        ) {
          ganadorNombre =
            partido.pareja1.jugador1.nombre_a_mostrar +
            ' - ' +
            partido.pareja1.jugador2.nombre_a_mostrar;
        } else if (
          partido.pareja2 &&
          partido.pareja2.id === partido.resultado.ganador.id
        ) {
          ganadorNombre =
            partido.pareja2.jugador1.nombre_a_mostrar +
            ' - ' +
            partido.pareja2.jugador2.nombre_a_mostrar;
        }
      }
      torneo.estado = 'Finalizado';
      await this.torneoRepository.save(torneo);
      return {
        message: `EL TORNEO YA FINALIZO`,
        ganador: ganadorNombre,
      };
    }
  }

  //esto solo aplica en fases de mata mata
  obtenerSiguienteFase(faseActual: string) {
    switch (faseActual) {
      case 'dieciseisavos':
        return 'octavos';
        break;
      case 'octavos':
        return 'cuartos';
        break;
      case 'cuartos':
        return 'semifinales';
        break;
      case 'semifinales':
        return 'final';
        break;
    }
  }

  async obtenerTodasLasPoscionesFaseGrupos(torneoId: number) {
    if (!torneoId) {
      throw new MiExcepcionPersonalizada(
        'No se Proporciono un id del Torneo',
        404,
      );
    }
    const torneo = await this.torneoRepository.findOne({
      where: { id: torneoId },
    });

    if (!torneo) {
      throw new MiExcepcionPersonalizada('El torneo buscado No existe', 404);
    }

    if (torneo.estado !== 'En Proceso') {
      throw new MiExcepcionPersonalizada(
        `El torneo buscado esta en estado ${torneo.estado} por lo cual no se puede sortear la siguiente fase`,
        409,
      );
    }

    const grupos = await this.grupoRepository.find({
      where: { torneo: torneo },
      relations: ['partidos'],
    });

    const participantesOrdenados = this.ordenarPosicionesGrupos(grupos);
    //return participantesOrdenados
    // Ordenar los participantes globales para sortear la fase de llaves
    const participantesOrdenadosGlobal = this.ordenarPosicionesGlobales(
      participantesOrdenados,
    );
    //saber quienes son, el nombre de los participantes
    const participantesOrdenadosGlobalConNombre =
      await this.obtenerNombresParticipantesOrdenados(
        participantesOrdenadosGlobal,
        torneo,
      );
    return participantesOrdenadosGlobalConNombre;
  }

  ordenarPosicionesGrupos(grupos) {
    const participantesOrdenados = [];
    for (const grupo of grupos) {
      //const participantesGrupo = grupo.participantes || [];
      const participantesGrupo = grupo.posiciones || [];

      const participantesOrdenadosGrupo = participantesGrupo
        .sort((a, b) => {
          // Lógica de ordenación basada en los resultados de la fase de grupos
          if (b.puntos !== a.puntos) {
            return b.puntos - a.puntos;
          }
          //porcentaje de sets ganados osea sets ganados/sets perdidos
          //sacar el porcentaje de sets ganados de cada participante

          let porcentajeSetsGanadosA =
            a.setsGanados / (a.setsGanados + a.setsPerdidos);
          let porcentajeSetsGanadosB =
            b.setsGanados / (b.setsGanados + b.setsPerdidos);

          if (porcentajeSetsGanadosA !== porcentajeSetsGanadosB) {
            return porcentajeSetsGanadosB - porcentajeSetsGanadosA;
          }
          //porcentaje de juegos ganados osea juegos ganados/juegos perdidos
          //sacar el porcentaje de juegos ganados de cada participante
          let porcentajeJuegosGanadosA =
            a.juegosGanados / (a.juegosGanados + a.juegosPerdidos);
          let porcentajeJuegosGanadosB =
            b.juegosGanados / (b.juegosGanados + b.juegosPerdidos);
          if (porcentajeJuegosGanadosA !== porcentajeJuegosGanadosB) {
            return porcentajeJuegosGanadosB - porcentajeJuegosGanadosA;
          }
          return a.juegosPerdidos - b.juegosPerdidos;
        })
        .slice(0, 2);
      participantesOrdenados.push(...participantesOrdenadosGrupo);
    }

    return participantesOrdenados;
  }

  ordenarPosicionesGlobales(participantesOrdenados) {
    const participantesOrdenadosGlobal = participantesOrdenados.sort((a, b) => {
      // Lógica de ordenación basada en los resultados de la fase de grupos
      if (b.puntos !== a.puntos) {
        return b.puntos - a.puntos;
      }
      //porcentaje de sets ganados osea sets ganados/sets perdidos
      //sacar el porcentaje de sets ganados de cada participante

      let porcentajeSetsGanadosA =
        a.setsGanados / (a.setsGanados + a.setsPerdidos);
      let porcentajeSetsGanadosB =
        b.setsGanados / (b.setsGanados + b.setsPerdidos);
      if (porcentajeSetsGanadosA !== porcentajeSetsGanadosB) {
        return porcentajeSetsGanadosB - porcentajeSetsGanadosA;
      }
      //porcentaje de juegos ganados osea juegos ganados/juegos perdidos
      //sacar el porcentaje de juegos ganados de cada participante
      let porcentajeJuegosGanadosA =
        a.juegosGanados / (a.juegosGanados + a.juegosPerdidos);
      let porcentajeJuegosGanadosB =
        b.juegosGanados / (b.juegosGanados + b.juegosPerdidos);
      if (porcentajeJuegosGanadosA !== porcentajeJuegosGanadosB) {
        return porcentajeJuegosGanadosB - porcentajeJuegosGanadosA;
      }
      return a.juegosPerdidos - b.juegosPerdidos;
    });

    return participantesOrdenadosGlobal;
  }

  async obtenerNombresParticipantesOrdenados(
    participantesOrdenadosGlobal,
    torneo: Torneo,
  ) {
    const participantesOrdenadosGlobalConNombre = [];
    for (const participante of participantesOrdenadosGlobal) {
      if (torneo.modalidad === 'singles') {
        let jugador = {
          nombre: '',
          puntos: 0,
          porcentajeSetsGanados: 0,
          porcentajeJuegosGanados: 0,
          juegosPerdidos: 0,
        };
        const jg = await this.jugadorRepository.findOne({
          where: { id: participante.id },
          select: ['nombre_a_mostrar'],
        });
        jugador['nombre'] = jg.nombre_a_mostrar;
        jugador.puntos = participante.puntos;
        jugador.porcentajeSetsGanados =
          participante.setsGanados /
          (participante.setsGanados + participante.setsPerdidos);
        jugador.porcentajeJuegosGanados =
          participante.juegosGanados /
          (participante.juegosGanados + participante.juegosPerdidos);
        jugador.juegosPerdidos = participante.juegosPerdidos;
        participantesOrdenadosGlobalConNombre.push(jugador);
      } else if (torneo.modalidad === 'dobles') {
        const pareja = await this.parejaRepository.findOne({
          where: { id: participante.id },
        });
        participantesOrdenadosGlobalConNombre.push(pareja);
      }
    }

    return participantesOrdenadosGlobalConNombre;
  }

  organizarLlaves(participantesOrdenados) {
    const numParticipantes = participantesOrdenados.length;

    // Verificar si el número de participantes es una potencia de 2
    if (!this.esPotenciaDeDos(numParticipantes)) {
      // Encontrar la siguiente potencia de 2 mayor o igual al número de participantes
      const potenciaSiguiente =
        this.encontrarPotenciaDeDosSiguiente(numParticipantes);

      // Calcular cuántos participantes adicionales se necesitan
      const participantesAdicionales = potenciaSiguiente - numParticipantes;

      // Crear participantes "vacíos" adicionales
      for (let i = 0; i < participantesAdicionales; i++) {
        participantesOrdenados.push({ id: null, puntos: 0 });
      }
    }

    // Ahora, procedemos a organizar las llaves de la forma original

    //return participantesOrdenados
    const llaves = [];
    const numPartidos = participantesOrdenados.length / 2;

    //return numPartidos

    for (let i = 0; i < numPartidos; i++) {
      const participante1 = participantesOrdenados[i];
      const participante2 =
        participantesOrdenados[participantesOrdenados.length - 1 - i];
      // console.log(participante1.id, 'vs', participante2.id);
      const llave = {
        participante1,
        participante2, //borra lo siguiente
        semiidentificadorpt1: i + 1,
        semiidentificadorpt2: participantesOrdenados.length - i,
      };

      llaves.push(llave);
    }

    return llaves;
  }

  obtenerEtapa(
    numero: number,
  ): 'octavos' | 'cuartos' | 'semifinales' | 'final' | 'otra' | 'grupos' {
    switch (true) {
      case numero > 4 && numero <= 8:
        return 'octavos';
      case numero > 2 && numero <= 4:
        return 'cuartos';
      case numero > 1 && numero <= 2:
        return 'semifinales';
      case numero == 1:
        return 'final';
      default:
        return 'otra';
    }
  }

  async actualizarRanking(torneo: Torneo) {
    //obtener la cantiadad maxima de inscripciones

    const fases = await this.llaveRepository.find({
      where: { torneo: { id: torneo.id } },
      relations: ['jugador1', 'jugador2', 'pareja1', 'pareja2'],
    });

    //obtener los finalistas

    const final = await this.partidoRepository.findOne({
      where: { torneo: { id: torneo.id } },
      relations: ['jugador1', 'jugador2', 'pareja1', 'pareja2'],
    });

    //const nuevoRanking: any[] = []

    const yaConRanking: number[] = [];

    const modalidadTorneo = torneo.modalidad;

    //actualizar primero y segundo

    const primero = final.resultado.ganador.id;
    const segundo = final.resultado.perdedor.id;

    yaConRanking.push(primero);
    yaConRanking.push(segundo);

    if (modalidadTorneo === 'dobles') {
      await this.actualizarrankingPareja(primero, 1);
      await this.actualizarrankingPareja(segundo, 2);
    } else if (modalidadTorneo === 'singles') {
      await this.actualizarRankingJugador(primero, 1);
      await this.actualizarRankingJugador(segundo, 2);
    }

    //saber cuantos mas son

    let rankingGrupos = 4;

    const semifinales = await this.partidoRepository.find({
      where: { torneo: torneo, fase: 'semifinales' },
      relations: ['jugador1', 'jugador2', 'pareja1', 'pareja2'],
    });

    for (const semifinal of semifinales) {
      const tercero = semifinal.resultado.perdedor.id;
      yaConRanking.push(tercero);
      if (modalidadTorneo === 'dobles') {
        await this.actualizarrankingPareja(tercero, 3);
      } else if (modalidadTorneo === 'singles') {
        await this.actualizarRankingJugador(tercero, 3);
      }
    }

    if (fases.length > 3) {
      const cuartos = await this.partidoRepository.find({
        where: { torneo: torneo, fase: 'cuartos' },
        relations: ['jugador1', 'jugador2', 'pareja1', 'pareja2'],
      });
      for (const cuarto of cuartos) {
        const cuartoRanking = cuarto.resultado.perdedor.id;
        yaConRanking.push(cuartoRanking);
        if (modalidadTorneo === 'dobles') {
          await this.actualizarrankingPareja(cuartoRanking, 4);
        } else if (modalidadTorneo === 'singles') {
          await this.actualizarRankingJugador(cuartoRanking, 4);
        }
      }
      rankingGrupos = 5;
      if (fases.length > 7) {
        const octavos = await this.partidoRepository.find({
          where: { torneo: torneo, fase: 'octavos' },
          relations: ['jugador1', 'jugador2', 'pareja1', 'pareja2'],
        });
        for (const octavo of octavos) {
          const quintoRanking = octavo.resultado.perdedor.id;
          yaConRanking.push(quintoRanking);
          if (modalidadTorneo === 'dobles') {
            await this.actualizarrankingPareja(quintoRanking, 5);
          } else if (modalidadTorneo === 'singles') {
            await this.actualizarRankingJugador(quintoRanking, 5);
          }
        }
        rankingGrupos = 6;
      }
    }

    const inscripciones = await this.inscripcionRepository.find({
      where: { torneo: torneo },
      relations: ['jugador', 'pareja'],
    });

    for (const inscripcion of inscripciones) {
      if (modalidadTorneo === 'dobles') {
        if (!yaConRanking.includes(inscripcion.pareja.id)) {
          await this.actualizarrankingPareja(
            inscripcion.pareja.id,
            rankingGrupos,
          );
          yaConRanking.push(inscripcion.pareja.id);
        }
      } else if (modalidadTorneo === 'singles') {
        if (!yaConRanking.includes(inscripcion.jugador.id)) {
          await this.actualizarRankingJugador(
            inscripcion.jugador.id,
            rankingGrupos,
          );
          yaConRanking.push(inscripcion.jugador.id);
        }
      }
    }

    return yaConRanking;
  }

  async actualizarrankingPareja(idpareja: number, ranking: number) {
    const pareja = await this.parejaRepository.findOne({
      where: { id: idpareja },
    });
    pareja.ranking = ranking;
    await this.parejaRepository.save(pareja);
  }

  async actualizarRankingJugador(idjugador: number, ranking: number) {
    const jugador = await this.jugadorRepository.findOne({
      where: { id: idjugador },
    });
    jugador.ranking = ranking;
    await this.jugadorRepository.save(jugador);
  }

  // Función para verificar si un número es una potencia de 2
  esPotenciaDeDos(numero: number): boolean {
    return (numero & (numero - 1)) === 0 && numero !== 0;
  }

  // Función para encontrar la siguiente potencia de 2 mayor o igual a un número dado
  encontrarPotenciaDeDosSiguiente(numero: number): number {
    let potencia = 1;
    while (potencia < numero) {
      potencia *= 2;
    }
    return potencia;
  }

  //Obtener los proximos partidos de un usuario
  async obtenerProximosPartidos(
    usuario: Usuario /*page: number,limit: number*/,
  ) {
    const jugador = await this.jugadorRepository.findOne({
      where: { userid: { id: usuario.id } },
    });

    if (!jugador) {
      throw new MiExcepcionPersonalizada('El usuario no es un jugador', 404);
    }

    // primero los partidos de singles

    //obtener los partidos donde el jugador participe y no hayan finalizado del mas reciente al mas antiguo, para eso se tiene que hacer un or con jugador1 y jugador2

    const partidosSingles = await this.partidoRepository.find({
      where: [
        { jugador1: jugador, finalizado: false },
        { jugador2: jugador, finalizado: false },
      ],
      order: { date: 'DESC' },
      relations: ['jugador1', 'jugador2', 'torneo'],
    });

    return { partidosSingles: partidosSingles, partidosDobles: [] };
  }

  async editarJugador1Partido(idPartido: number, idJugador: number) {
    const partido = await this.partidoRepository.findOne({
      where: { id: idPartido },
    });
    if (!partido) {
      throw new MiExcepcionPersonalizada('El partido no existe', 404);
    }
    const jugador = await this.jugadorRepository.findOne({
      where: { id: idJugador },
    });
    if (!jugador) {
      throw new MiExcepcionPersonalizada('El jugador no existe', 404);
    }
    partido.jugador1 = jugador;
    await this.partidoRepository.save(partido);
    return {
      message: 'Jugador 1 del partido editado con exito',
    };
  }

  async editarJugador2Partido(idPartido: number, idJugador: number) {
    const partido = await this.partidoRepository.findOne({
      where: { id: idPartido },
    });
    if (!partido) {
      throw new MiExcepcionPersonalizada('El partido no existe', 404);
    }
    const jugador = await this.jugadorRepository.findOne({
      where: { id: idJugador },
    });
    if (!jugador) {
      throw new MiExcepcionPersonalizada('El jugador no existe', 404);
    }
    partido.jugador2 = jugador;
    await this.partidoRepository.save(partido);
    return {
      message: 'Jugador 2 del partido editado con exito',
    };
  }
}
