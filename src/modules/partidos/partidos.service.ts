import { Injectable } from '@nestjs/common';
import { CreatePartidoDto } from './dto/create-partido.dto';
import { UpdatePartidoDto } from './dto/update-partido.dto';
import { Partido } from './entities/partido.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Torneo } from '../torneos/entities/torneo.entity';
import { MiExcepcionPersonalizada } from 'src/utils/exception';
import { ResultadoPartidoDTO } from './dto/resultado.dto';
import { Grupo } from '../grupos/entities/grupo.entity';
import { group } from 'console';

@Injectable()
export class PartidosService {


  constructor(
    @InjectRepository(Partido) private partidoRepository: Repository<Partido>,
    @InjectRepository(Torneo) private torneoRepository: Repository<Torneo>,
    @InjectRepository(Grupo) private grupoRepository: Repository<Grupo>,

  ) { }



  async obtenerPartidosTorneo(idTorneo: number) {
    if (!idTorneo) {
      throw new MiExcepcionPersonalizada('No se Proporciono un id de Torneo', 430);
    }


    // const torneo = await manager.findOneOrFail(Torneo, idTorneo, { relations: ['grupos'] });

    const torneo = await this.torneoRepository.findOne({
      where: { id: idTorneo }
    });


    if (!torneo) {
      throw new MiExcepcionPersonalizada('No se encontro el Torneo', 430);
    }


    const partidos = await this.partidoRepository.find({
      where: { torneo: { id: idTorneo } },
      relations: ['jugador1', 'jugador2', 'pareja1', 'pareja2', 'grupo'],
    });


    const partidosFormateados = []

    for (const partido of partidos) {

      let partidoFormateado = {
        id: partido.id,
        fase: partido.fase,
        resultado: partido.resultado,
        date: partido.date,
        grupo: {
          id: partido.grupo.id,
          nombre_grupo: partido.grupo.nombre_grupo
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
            ? partido.pareja1.jugador1.nombre + partido.pareja1.jugador2.nombre
            : undefined,
        },
        pareja2: {
          id: partido.pareja2 ? partido.pareja2.id : undefined,
          nombre: partido.pareja2
            ? partido.pareja2.jugador1.nombre + partido.pareja2.jugador2.nombre
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
      relations: ['grupo'],
    });

    if (!partido) {
      throw new MiExcepcionPersonalizada('No se encontro el partido', 404);
    }
    const { sets, ganador, perdedor } = nuevoResultado;

    // Obtener las posiciones actuales del grupo
    const posicionesActuales = partido.grupo.posiciones || {};


    if (Object.keys(posicionesActuales).length === 0) {
      console.log('first')

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
      throw new MiExcepcionPersonalizada('No se Proporciono un id del Torneo', 400);
    }
    const torneo = await this.torneoRepository.findOne({
      where: { id: torneoId }
    })

    if (!torneo) {
      throw new MiExcepcionPersonalizada('El torneo buscado No existe', 400);
    }


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
    const participantesOrdenados/*: Participante[]*/ = [];

    for (const grupo of grupos) {
      //const participantesGrupo = grupo.participantes || [];
      const participantesGrupo = grupo.posiciones || [];

      const participantesOrdenadosGrupo = participantesGrupo
        .sort((a, b) => {
          // Lógica de ordenación basada en los resultados de la fase de grupos
          if (b.puntos !== a.puntos) {
            console.log('entre')
            return b.puntos - a.puntos;
          }
          if (b.puntosSets !== a.puntosSets) {
            console.log('entre')
            return b.puntosSets - a.puntosSets;
          }
          if (b.setsGanados !== a.setsGanados) {
            console.log('entre')
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


    //return participantesOrdenadosGlobal

    // const ejemplo = [
    //   {
    //     "id": 6,
    //     "puntos": 3,
    //     "setsGanados": 6,
    //     "setsPerdidos": 3,
    //     "puntosSets": 54
    //   },
    //   {
    //     "id": 14,
    //     "puntos": 3,
    //     "setsGanados": 6,
    //     "setsPerdidos": 3,
    //     "puntosSets": 54
    //   },
    //   {
    //     "id": 3,
    //     "puntos": 3,
    //     "setsGanados": 6,
    //     "setsPerdidos": 3,
    //     "puntosSets": 54
    //   },
    //   {
    //     "id": 4,
    //     "puntos": 3,
    //     "setsGanados": 6,
    //     "setsPerdidos": 2,
    //     "puntosSets": 49
    //   },
    //   {
    //     "id": 10,
    //     "puntos": 2,
    //     "setsGanados": 5,
    //     "setsPerdidos": 4,
    //     "puntosSets": 53
    //   },
    //   {
    //     "id": 15,
    //     "puntos": 2,
    //     "setsGanados": 5,
    //     "setsPerdidos": 4,
    //     "puntosSets": 53
    //   },
    //   {
    //     "id": 9,
    //     "puntos": 2,
    //     "setsGanados": 5,
    //     "setsPerdidos": 4,
    //     "puntosSets": 53
    //   }
    // ]

    // Organizar la fase de llaves
    const llaves = this.organizarLlaves(participantesOrdenadosGlobal);
    //const llaves = this.organizarLlaves(ejemplo)

    // guardar las llaves en la bd
    // ...

    return llaves;
  }

  



   organizarLlaves(participantesOrdenados) {
    const numParticipantes = participantesOrdenados.length;
  
    // Verificar si el número de participantes es una potencia de 2

    let participantesAdicionales = 0
    if (!this.esPotenciaDeDos(numParticipantes)) {
      // Encontrar la siguiente potencia de 2 mayor o igual al número de participantes
      const potenciaSiguiente = this.encontrarPotenciaDeDosSiguiente(numParticipantes);
  
      // Calcular cuántos participantes adicionales se necesitan
      participantesAdicionales = potenciaSiguiente - numParticipantes;
  
      // Crear participantes "vacíos" adicionales
      for (let i = 0; i < participantesAdicionales; i++) {
        participantesOrdenados.push({ id: null, puntos: 0 });
      }
    }
    //return participantesOrdenados
  
    //organizar las llaves de la forma original
    const llaves = [];
    const numPartidos = participantesOrdenados.length / 2;
    console.log(numPartidos, participantesOrdenados.length ) 


    if(participantesAdicionales > 0){
      for (let i = 0; i < numPartidos; i++) {
        const participante1 = participantesOrdenados[i];
        const participante2 = participantesOrdenados[numParticipantes - i ];
  
        console.log(participante1, ' vs ', participante2)
    
        const llave = {
          participante1,
          participante2,
        };
    
        llaves.push(llave);
      }
    }else{
      for (let i = 0; i < numPartidos; i++) {
        const participante1 = participantesOrdenados[i];
        const participante2 = participantesOrdenados[numParticipantes - 1 - i ];
  
        console.log(participante1, ' vs ', participante2)
    
        const llave = {
          participante1,
          participante2,
        };
    
        llaves.push(llave);
      }

    }

   
  
    return llaves;
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
