import { Injectable } from '@nestjs/common';
import { CreatePartidoDto } from './dto/create-partido.dto';
import { UpdatePartidoDto } from './dto/update-partido.dto';
import { Partido } from './entities/partido.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Tipo, Torneo } from '../torneos/entities/torneo.entity';
import { MiExcepcionPersonalizada } from 'src/utils/exception';
import { ResultadoPartidoDTO } from './dto/resultado.dto';
import { Grupo } from '../grupos/entities/grupo.entity';
import { Llave } from '../llaves/entities/llave.entity';
import { Jornada, TipoJornada } from '../jornadas/entities/jornada.entity';

@Injectable()
export class PartidosService {


  constructor(
    @InjectRepository(Partido) private partidoRepository: Repository<Partido>,
    @InjectRepository(Torneo) private torneoRepository: Repository<Torneo>,
    @InjectRepository(Grupo) private grupoRepository: Repository<Grupo>,
    @InjectRepository(Llave) private llaveRepository: Repository<Llave>,
    @InjectRepository(Jornada) private jornadaRepository: Repository<Jornada>,

  ) { }



  async obtenerPartidosTorneo(idTorneo: number) {
    if (!idTorneo) {
      throw new MiExcepcionPersonalizada('No se Proporciono un id de Torneo', 400);
    }


    // const torneo = await manager.findOneOrFail(Torneo, idTorneo, { relations: ['grupos'] });

    const torneo = await this.torneoRepository.findOne({
      where: { id: idTorneo }
    });


    // return 


    if (!torneo) {
      throw new MiExcepcionPersonalizada('No se encontro el Torneo', 404);
    }
    const partidos = await this.partidoRepository.find({
      where: { torneo: { id: idTorneo } },
      relations: ['jugador1', 'jugador2', 'pareja1', 'pareja2', 'grupo', 'pareja1.jugador1', 'pareja1.jugador2', 'pareja2.jugador1', 'pareja2.jugador2', 'jornada'],
    });

    // return partidos
    const partidosFormateados = []
    for (const partido of partidos) {

      let partidoFormateado = {
        id: partido.id,
        fase: partido.fase,
        resultado: partido.resultado,
        date: partido.date,
        jornada: partido.jornada,
        grupo: {
          id: partido.grupo ? partido.grupo.id : undefined,   //partido.jugador1 ? partido.jugador1.id : undefined,
          nombre_grupo: partido.grupo ? partido.grupo.nombre_grupo : undefined
        },
        jugador1: {
          id: partido.jugador1 ? partido.jugador1.id : undefined,
          nombre: partido.jugador1 ? partido.jugador1.nombre : undefined,
        },
        jugador2: {
          id: partido.jugador2 ? partido.jugador2.id : undefined,
          nombre: partido.jugador2 ? partido.jugador2.nombre : undefined,
        },
        pareja1: {
          id: partido.pareja1 ? partido.pareja1.id : undefined,
          nombre: partido.pareja1
            ? partido.pareja1.jugador1.nombre + ' - ' + partido.pareja1.jugador2.nombre
            : undefined,
        },
        pareja2: {
          id: partido.pareja2 ? partido.pareja2.id : undefined,
          nombre: partido.pareja2
            ? partido.pareja2.jugador1.nombre + ' - ' + partido.pareja2.jugador2.nombre
            : undefined,
        }
      }
      partidosFormateados.push(partidoFormateado)

    }
    return partidosFormateados
  }




  async actualizarResultado(id: number, nuevoResultado: ResultadoPartidoDTO) {
    if (!id) {
      throw new MiExcepcionPersonalizada('No se Proporciono un id del partido', 400);
    }
    const partido = await this.partidoRepository.findOne({
      where: { id: id },
      relations: ['grupo', 'torneo', 'jornada', 'jugador1', 'jugador2', 'pareja1', 'pareja2'],
    });

    if (!partido) {
      throw new MiExcepcionPersonalizada('No se encontro el partido', 404);
    }




    if (partido.torneo.estado === 'Finalizado') {
      throw new MiExcepcionPersonalizada('No Se puede actualizar un partido de un Torneo Finalizado', 403);
    }




    const { sets, ganador, perdedor } = nuevoResultado;


    if (partido.torneo.tipo_torneo === Tipo.REGULAR) {
      if (partido.fase === 'grupos') {
        // Obtener las posiciones actuales del grupo
        const posicionesActuales = partido.grupo.posiciones || {};


        if (Object.keys(posicionesActuales).length === 0) {

          if (ganador) {
            const ganadorId = ganador.id;
            posicionesActuales[ganadorId] = posicionesActuales[ganadorId] || {};
            posicionesActuales[ganadorId].puntos = (posicionesActuales[ganadorId]?.puntos || 0) + 1;
            posicionesActuales[ganadorId].setsGanados = (posicionesActuales[ganadorId]?.setsGanados || 0) + ganador.setsGanados;
            posicionesActuales[ganadorId].setsPerdidos = (posicionesActuales[ganadorId]?.setsPerdidos || 0) + ganador.setsPerdidos;
            posicionesActuales[ganadorId].puntosSets = (posicionesActuales[ganadorId]?.puntosSets || 0) + ganador.puntosSets;
          }

          // Incrementar los valores del perdedor
          if (perdedor) {
            const perdedorId = perdedor.id;
            posicionesActuales[perdedorId] = posicionesActuales[perdedorId] || {};
            posicionesActuales[perdedorId].puntos = (posicionesActuales[perdedorId]?.puntos || 0) + 0; // No suma puntos al perdedor
            posicionesActuales[perdedorId].setsGanados = (posicionesActuales[perdedorId]?.setsGanados || 0) + perdedor.setsGanados;
            posicionesActuales[perdedorId].setsPerdidos = (posicionesActuales[perdedorId]?.setsPerdidos || 0) + perdedor.setsPerdidos;
            posicionesActuales[perdedorId].puntosSets = (posicionesActuales[perdedorId]?.puntosSets || 0) + perdedor.puntosSets;
          }



          const participantesOrdenados = partido.grupo.participantes.sort((a, b) => {
            const puntosA = posicionesActuales[a.jugador?.id || a.pareja?.id]?.puntos || 0;
            const puntosB = posicionesActuales[b.jugador?.id || b.pareja?.id]?.puntos || 0;
            return puntosB - puntosA;
          });

          // return posicionesActuales

          // Actualizar las posiciones en el grupo
          partido.grupo.posiciones = participantesOrdenados.map((participante) => {
            const participanteId = participante.jugador?.id || participante.pareja?.id;
            return {
              id: participanteId,
              puntos: posicionesActuales[participanteId]?.puntos || 0,
              setsGanados: posicionesActuales[participanteId]?.setsGanados || 0,
              setsPerdidos: posicionesActuales[participanteId]?.setsPerdidos || 0,
              puntosSets: posicionesActuales[participanteId]?.puntosSets || 0,
            };
          });

        } else {

          if (ganador && perdedor) {
            partido.grupo.posiciones = await this.actualizarDatos(posicionesActuales, nuevoResultado);
          }
        }
        await this.grupoRepository.save(partido.grupo);

        partido.resultado = {
          sets: sets,
          ganador: ganador,
          perdedor: perdedor,
        };

        partido.finalizado = true

        const partidoActualizado = await this.partidoRepository.save(partido);

        return partidoActualizado;
      } else {
        partido.resultado = {
          sets: sets,
          ganador: ganador,
          perdedor: perdedor,
        };

        partido.finalizado = true

        const partidoActualizado = await this.partidoRepository.save(partido);
        return partidoActualizado;


      }
    } else if (partido.torneo.tipo_torneo === Tipo.ESCALERA) {

      if(partido.finalizado){
        throw new MiExcepcionPersonalizada('El partido ya se ha marcado como finalizado, no se puede editar', 403);

      }

      if (partido.fase === 'grupos') {

        const jornada = partido.jornada
        const grupo = partido.grupo

        const jornadaEntidad = await this.jornadaRepository.findOneBy(jornada)
        const grupoEntidad = await this.grupoRepository.findOneBy(grupo)

        //return grupoEntidad


        if(jornadaEntidad.tipo === TipoJornada.REGULAR){
          partido.resultado = {
            sets: sets,
            ganador: ganador,
            perdedor: perdedor,
          };
  
          partido.finalizado = true
  
          const partidoActualizado = await this.partidoRepository.save(partido);
  
  
          //buscar si el ganador es el jugador1 o la pareja1
  
          let cambioRanking = false
          let tipocambio: string;
  
  
  
          if (ganador.tipo == 'jugador') {
            if (partido.jugador1.id == ganador.id) {
              cambioRanking = true
              tipocambio = 'jugador'
            }
          }
  
          if (ganador.tipo == 'pareja') {
            if (partido.pareja1.id == ganador.id) {
              cambioRanking = true
              tipocambio = 'pareja'
            }
          }
  
  
          
          if (cambioRanking && tipocambio == 'jugador') {
  
            //return jornada.participantes
            //buscar el perdedor y el ganador y cambiarlos
            for (const grupo of jornada.participantes) {
              if (grupo.id == partido.grupo.id) {
                //console.log(grupo.participantes)
               /* ganadorFound = grupo.participantes.find((participante) =>  participante.jugador.id == ganador.id);
                perdedorFound = grupo.participantes.find((participante) =>  participante.jugador.id == perdedor.id);*/
                const ganadorIndex = grupo.participantes.findIndex(participante => participante.jugador.id === ganador.id);
                const perdedorIndex = grupo.participantes.findIndex(participante => participante.jugador.id === perdedor.id);
            
                if (ganadorIndex !== -1 && perdedorIndex !== -1) {
                  console.log('entre')
                  // Intercambiar los rankings
                  const tempRanking = grupo.participantes[ganadorIndex].ranking;
                  grupo.participantes[ganadorIndex].ranking = grupo.participantes[perdedorIndex].ranking;
                  grupo.participantes[perdedorIndex].ranking = tempRanking;
  
                  grupoEntidad.participantes = grupo.participantes
  
                  await this.grupoRepository.save(grupoEntidad)
  
  
                }           
  
              }  
            }  
            jornadaEntidad.participantes = jornada.participantes
            jornadaEntidad.posiciones = jornada.participantes
            await this.jornadaRepository.save(jornadaEntidad)  
          }   
          return {
            message: 'Partido Editado con exito'
          }
        }
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
          posicion.puntosSets += ganador.puntosSets;
        }
        if (posicion.id === perdedorId) {
          posicion.puntos += 0;
          posicion.setsGanados += perdedor.setsGanados;
          posicion.setsPerdidos += perdedor.setsPerdidos;
          posicion.puntosSets += perdedor.puntosSets;
        }
      }
    }

    return posiciones;
  }




  async sortearSiguienteFase(torneoId: number) {
    // Verificar que todos los partidos de la fase de grupos estén finalizados

    if (!torneoId) {
      throw new MiExcepcionPersonalizada('No se Proporciono un id del Torneo', 404);
    }
    const torneo = await this.torneoRepository.findOne({
      where: { id: torneoId }
    })

    if (!torneo) {
      throw new MiExcepcionPersonalizada('El torneo buscado No existe', 404);
    }

    if (torneo.estado !== 'En Proceso') {
      throw new MiExcepcionPersonalizada(`El torneo buscado esta en estado ${torneo.estado} por lo cual no se puede sortear la siguiente fase`, 409);
    }


    if (torneo.fase_actual === 'grupos') {
      const grupos = await this.grupoRepository.find({
        where: { torneo: torneo },
        relations: ['partidos'],
      });

      //return grupos
      const todosFinalizados = grupos.every((grupo) =>
        grupo.partidos.every((partido) => partido.finalizado)
      );

      if (!todosFinalizados) {
        throw new MiExcepcionPersonalizada('No todos los partidos de la fase de grupos han finalizado.', 400);

      }
      // return todosFinalizados
      // Obtener los dos mejores participantes de cada grupo
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
            if (b.puntosSets !== a.puntosSets) {

              return b.puntosSets - a.puntosSets;
            }
            if (b.setsGanados !== a.setsGanados) {

              return b.setsGanados - a.setsGanados;
            }
            return a.setsPerdidos - b.setsPerdidos;
          })
          .slice(0, 2); // Tomar los dos mejores participantes

        participantesOrdenados.push(...participantesOrdenadosGrupo);
      }

      //return participantesOrdenados

      // Ordenar los participantes globales para sortear la fase de llaves
      const participantesOrdenadosGlobal = participantesOrdenados.sort((a, b) => {
        // Lógica de ordenación basada en los resultados de la fase de grupos
        if (b.puntos !== a.puntos) {
          return b.puntos - a.puntos;
        }
        if (b.puntosSets !== a.puntosSets) {
          return b.puntosSets - a.puntosSets;
        }
        if (b.setsGanados !== a.setsGanados) {
          return b.setsGanados - a.setsGanados;
        }
        return a.setsPerdidos - b.setsPerdidos;
      });
      // Organizar la fase de llaves
      const llaves = this.organizarLlaves(participantesOrdenadosGlobal);
      const llavesReturn = []
      // guardar las llaves en la bd
      const modalidad = torneo.modalidad
      const fase = this.obtenerEtapa(llaves.length)
      for (const llave of llaves) {

        let jugador1: any
        let jugador2: any
        let pareja1: any
        let pareja2: any
        //let fase: any
        if (modalidad === 'singles') {
          jugador1 = llave.participante1.id
          jugador2 = llave.participante2.id
          //fase = this.obtenerEtapa(llaves.length)

          const llaveCreada = await this.llaveRepository.create({
            torneo: torneo,
            fase: fase,
            jugador1: jugador1,
            jugador2: jugador2
          })
          const llaveGuardada = await this.llaveRepository.save(llaveCreada)
          const partidoCreado = await this.partidoRepository.create({
            fase: fase,
            torneo: torneo,
            jugador1: jugador1,
            jugador2: jugador2
          })
          const partidoGuardado = await this.partidoRepository.save(partidoCreado)
          llavesReturn.push(llaveGuardada)
        } else {
          pareja1 = llave.participante1.id
          pareja2 = llave.participante2.id
          const llaveCreada = await this.llaveRepository.create({
            torneo: torneo,
            fase: fase,
            pareja1: pareja1,
            pareja2: pareja2
          })

          const llaveGuardada = await this.llaveRepository.save(llaveCreada)
          const partidoCreado = await this.partidoRepository.create({
            fase: fase,
            torneo: torneo,
            pareja1: pareja1,
            pareja2: pareja2
          })
          const partidoGuardado = await this.partidoRepository.save(partidoCreado)
          llavesReturn.push(llaveGuardada)
        }
      }
      torneo.fase_actual = fase
      await this.torneoRepository.save(torneo)
      return llavesReturn;
    } else if (torneo.fase_actual === 'octavos' || torneo.fase_actual === 'cuartos' || torneo.fase_actual === 'semifinales') {
      const llavesJugadas = await this.llaveRepository.find({
        where: { torneo: torneo }
      })
      const partidosJugadosLlaves = await this.partidoRepository.find({
        where: { torneo: torneo, fase: torneo.fase_actual }
      })
      const todosFinalizados = partidosJugadosLlaves.every(
        (partido) => partido.finalizado
      );
      if (!todosFinalizados) {
        throw new MiExcepcionPersonalizada(`No todos los partidos de la fase ${torneo.fase_actual} han finalizado.`, 400);
      }
      const participantesOrdenados = []
      for (const partido of partidosJugadosLlaves) {
        let participante = partido.resultado.ganador
        participantesOrdenados.push(participante)
      }
      const participantesOrdenadosGlobal = participantesOrdenados.sort((a, b) => {
        // Lógica de ordenación basada en los resultados de la fase de grupos
        if (b.puntos !== a.puntos) {
          return b.puntos - a.puntos;
        }
        if (b.puntosSets !== a.puntosSets) {
          return b.puntosSets - a.puntosSets;
        }
        if (b.setsGanados !== a.setsGanados) {
          return b.setsGanados - a.setsGanados;
        }
        return a.setsPerdidos - b.setsPerdidos;
      });
      const llaves = this.organizarLlaves(participantesOrdenadosGlobal);
      const llavesReturn = []
      // guardar las llaves en la bd
      const modalidad = torneo.modalidad
      const fase = this.obtenerEtapa(llaves.length)
      for (const llave of llaves) {

        let jugador1: any
        let jugador2: any
        let pareja1: any
        let pareja2: any
        //let fase: any
        if (modalidad === 'singles') {
          jugador1 = llave.participante1.id
          jugador2 = llave.participante2.id
          //fase = this.obtenerEtapa(llaves.length)

          const llaveCreada = await this.llaveRepository.create({
            torneo: torneo,
            fase: fase,
            jugador1: jugador1,
            jugador2: jugador2
          })

          const llaveGuardada = await this.llaveRepository.save(llaveCreada)

          const partidoCreado = await this.partidoRepository.create({
            fase: fase,
            torneo: torneo,
            jugador1: jugador1,
            jugador2: jugador2
          })
          const partidoGuardado = await this.partidoRepository.save(partidoCreado)
          llavesReturn.push(llaveGuardada)



        } else {
          pareja1 = llave.participante1.id
          pareja2 = llave.participante2.id
          //fase = this.obtenerEtapa(llaves.length)

          const llaveCreada = await this.llaveRepository.create({
            torneo: torneo,
            fase: fase,
            pareja1: pareja1,
            pareja2: pareja2
          })

          const llaveGuardada = await this.llaveRepository.save(llaveCreada)
          const partidoCreado = await this.partidoRepository.create({
            fase: fase,
            torneo: torneo,
            pareja1: pareja1,
            pareja2: pareja2
          })
          const partidoGuardado = await this.partidoRepository.save(partidoCreado)
          llavesReturn.push(llaveGuardada)
        }
      }


      torneo.fase_actual = fase
      await this.torneoRepository.save(torneo)

      return llavesReturn;

    } else if (torneo.fase_actual === 'final') {

      const partidosJugadosLlaves = await this.partidoRepository.find({
        where: { torneo: torneo, fase: torneo.fase_actual },
        relations: ['jugador1', 'jugador2', 'pareja1', 'pareja2'],
      })

      const todosFinalizados = partidosJugadosLlaves.every(
        (partido) => partido.finalizado

      );

      if (!todosFinalizados) {
        return {
          message: `No se ha jugado la final, por favor actualizar resultados`
        }
      } else {
        const partido = partidosJugadosLlaves[0]
        let ganadorNombre = '';
        if (partido.resultado.ganador.tipo === "jugador") {
          if (partido.jugador1 && partido.jugador1.id === partido.resultado.ganador.id) {
            ganadorNombre = partido.jugador1.nombre;
          } else if (partido.jugador2 && partido.jugador2.id === partido.resultado.ganador.id) {
            ganadorNombre = partido.jugador2.nombre;
          }
        } else if (partido.resultado.ganador.tipo === "pareja") {
          if (partido.pareja1 && partido.pareja1.id === partido.resultado.ganador.id) {
            ganadorNombre = partido.pareja1.jugador1.nombre + ' - ' + partido.pareja1.jugador2.nombre
          } else if (partido.pareja2 && partido.pareja2.id === partido.resultado.ganador.id) {
            ganadorNombre = partido.pareja2.jugador1.nombre + ' - ' + partido.pareja2.jugador2.nombre
          }
        }
        torneo.estado = 'Finalizado';
        await this.torneoRepository.save(torneo)
        return {
          message: `EL TORNEO YA FINALIZO`,
          ganador: ganadorNombre
        }
      }
    }
  }


  organizarLlaves(participantesOrdenados) {
    const numParticipantes = participantesOrdenados.length;

    // Verificar si el número de participantes es una potencia de 2
    if (!this.esPotenciaDeDos(numParticipantes)) {
      // Encontrar la siguiente potencia de 2 mayor o igual al número de participantes
      const potenciaSiguiente = this.encontrarPotenciaDeDosSiguiente(numParticipantes);

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
      const participante2 = participantesOrdenados[participantesOrdenados.length - 1 - i];
      console.log(participante1.id, 'vs', participante2.id)
      const llave = {
        participante1,
        participante2,
      };

      llaves.push(llave);
    }

    return llaves;
  }



  obtenerEtapa(numero: number): "octavos" | "cuartos" | "semifinales" | "final" | "otra" | "grupos" {
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











}
