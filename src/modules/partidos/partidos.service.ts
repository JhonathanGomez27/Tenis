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
        
        const ganadorId = ganador.id;
       partido.grupo.posiciones = await this.actualizarDatos(posicionesActuales, nuevoResultado);


      }

    }



    await this.grupoRepository.save(partido.grupo);

    partido.resultado = {
      sets: sets,
      ganador: ganador,
      perdedor: perdedor,
    };

    const partidoActualizado = await this.partidoRepository.save(partido);

    return partidoActualizado;







    // const { sets, ganador, perdedor } = nuevoResultado;




    // // Obtener las posiciones actuales del grupo
    // const posicionesActuales = partido.grupo.posiciones || {};

    // // Incrementar los puntos del ganador y establecer los demás valores
    // if (ganador) {
    //   const ganadorId = ganador.id;
    //   posicionesActuales[ganadorId] = posicionesActuales[ganadorId] || {};
    //   posicionesActuales[ganadorId].puntos = (posicionesActuales[ganadorId]?.puntos || 0) + 1;
    //   posicionesActuales[ganadorId].setsGanados = (posicionesActuales[ganadorId]?.setsGanados || 0) + ganador.setsGanados;
    //   posicionesActuales[ganadorId].setsPerdidos = (posicionesActuales[ganadorId]?.setsPerdidos || 0) + ganador.setsPerdidos;
    //   posicionesActuales[ganadorId].puntosSets = (posicionesActuales[ganadorId]?.puntosSets || 0) + ganador.puntosSets;
    // }

    // // Incrementar los valores del perdedor
    // if (perdedor) {
    //   const perdedorId = perdedor.id;
    //   posicionesActuales[perdedorId] = posicionesActuales[perdedorId] || {};
    //   posicionesActuales[perdedorId].puntos = (posicionesActuales[perdedorId]?.puntos || 0) + 0; // No suma puntos al perdedor
    //   posicionesActuales[perdedorId].setsGanados = (posicionesActuales[perdedorId]?.setsGanados || 0) + perdedor.setsGanados;
    //   posicionesActuales[perdedorId].setsPerdidos = (posicionesActuales[perdedorId]?.setsPerdidos || 0) + perdedor.setsPerdidos;
    //   posicionesActuales[perdedorId].puntosSets = (posicionesActuales[perdedorId]?.puntosSets || 0) + perdedor.puntosSets;
    // }


    // //return posicionesActuales

    // // Ordenar los participantes por puntos (y posiblemente por otras métricas)
    // const participantesOrdenados = partido.grupo.participantes.sort((a, b) => {
    //   const puntosA = posicionesActuales[a.jugador?.id || a.pareja?.id]?.puntos || 0;
    //   const puntosB = posicionesActuales[b.jugador?.id || b.pareja?.id]?.puntos || 0;

    //   return puntosB - puntosA;
    // });

    // // Actualizar las posiciones en el grupo
    // partido.grupo.posiciones = participantesOrdenados.map((participante) => {
    //   const participanteId = participante.jugador?.id || participante.pareja?.id;
    //   return {
    //     id: participanteId,
    //     puntos: posicionesActuales[participanteId]?.puntos || 0,
    //     setsGanados: posicionesActuales[participanteId]?.setsGanados || 0,
    //     setsPerdidos: posicionesActuales[participanteId]?.setsPerdidos || 0,
    //     puntosSets: posicionesActuales[participanteId]?.puntosSets || 0,
    //   };
    // });

    // return partido.grupo.posiciones

    // await this.grupoRepository.save(partido.grupo);



    // partido.resultado = {
    //   sets: sets,
    //   ganador: ganador,
    //   perdedor: perdedor,
    // };

    // const partidoActualizado = await this.partidoRepository.save(partido);

    // return partidoActualizado;




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









}
