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
  
    // Incrementar los puntos del ganador y establecer los demás valores
    if (ganador) {
      const ganadorId = ganador.id;
      posicionesActuales[ganadorId] = {
        puntos: (posicionesActuales[ganadorId]?.puntos || 0) + 1,
        setsGanados: ganador.setsGanados,
        setsPerdidos: ganador.setsPerdidos,
        puntosSets: ganador.puntosSets,
      };
    }
  
    // Incrementar los valores del perdedor
    if (perdedor) {
      const perdedorId = perdedor.id;
      posicionesActuales[perdedorId] = {
        puntos: (posicionesActuales[perdedorId]?.puntos || 0),
        setsGanados: perdedor.setsGanados,
        setsPerdidos: perdedor.setsPerdidos,
        puntosSets: perdedor.puntosSets,
      };
    }
  
    // Ordenar los participantes por puntos (y posiblemente por otras métricas)
    const participantesOrdenados = partido.grupo.participantes.sort((a, b) => {
      const puntosA = posicionesActuales[a.jugador?.id || a.pareja?.id]?.puntos || 0;
      const puntosB = posicionesActuales[b.jugador?.id || b.pareja?.id]?.puntos || 0;
  
      return puntosB - puntosA;
    });
  
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
  
    await this.grupoRepository.save(partido.grupo);
  
    partido.resultado = {
      sets: sets,
      ganador: ganador,
      perdedor: perdedor,
    };
  
    const partidoActualizado = await this.partidoRepository.save(partido);
  
    return partidoActualizado;



    /* const { sets, ganador, perdedor } = nuevoResultado;
 
     // Obtener las posiciones actuales del grupo
     const posicionesActuales = partido.grupo.posiciones || {};
 
     // Actualizar las posiciones según el resultado del partido
     partido.grupo.participantes.forEach((participante) => {
       const participanteId = participante.jugador?.id || participante.pareja?.id;
 
       // Inicializar puntos si no existe
       posicionesActuales[participanteId] = posicionesActuales[participanteId] || {
         puntos: 0,
         setsGanados: 0,
         setsPerdidos: 0,
         puntosSets: 0,
       };
 
       // Incrementar los puntos del ganador, en este caso, solo si el participante es el ganador
       if (ganador && participanteId === ganador.id) {
         posicionesActuales[participanteId].puntos += 1;
         posicionesActuales[participanteId].setsGanados += 1;
       }
 
       // Incrementar sets ganados, sets perdidos y puntosSets según corresponda al perdedor
       if (perdedor && participanteId === perdedor.id) {
         const [puntosParticipante1, puntosParticipante2] = sets[0].marcador.split('-').map(Number);
         posicionesActuales[participanteId].setsGanados += puntosParticipante2 > puntosParticipante1 ? 1 : 0;
         posicionesActuales[participanteId].setsPerdidos += puntosParticipante2 < puntosParticipante1 ? 1 : 0;
         posicionesActuales[participanteId].puntosSets += puntosParticipante2;
       }
     });
 
     // Ordenar los participantes por puntos (y posiblemente por otras métricas)
     const participantesOrdenados = partido.grupo.participantes.sort((a, b) => {
       const puntosA = posicionesActuales[a.jugador?.id || a.pareja?.id]?.puntos || 0;
       const puntosB = posicionesActuales[b.jugador?.id || b.pareja?.id]?.puntos || 0;
 
       return puntosB - puntosA;
     });
 
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
 
     await this.grupoRepository.save(partido.grupo);
 
     partido.resultado = {
       sets: sets,
       ganador: ganador,
       perdedor: perdedor,
     };
 
     const partidoActualizado = await this.partidoRepository.save(partido);
 
     return partidoActualizado;*/



    // const { sets, ganador, perdedor } = nuevoResultado;

    // // Obtener las posiciones actuales del grupo
    // const posicionesActuales = partido.grupo.posiciones || {};

    // // Actualizar las posiciones según el resultado del partido
    // partido.grupo.participantes.forEach((participante) => {
    //   const participanteId = participante.jugador?.id || participante.pareja?.id;

    //   // Inicializar puntos si no existe
    //   posicionesActuales[participanteId] = posicionesActuales[participanteId] || {
    //     puntos: 0,
    //     setsGanados: 0,
    //     setsPerdidos: 0,
    //     puntosSets: 0,
    //   };

    //   // Incrementar los puntos del ganador, en este caso, solo si el participante es el ganador
    //   if (ganador && participanteId === ganador.id) {
    //     posicionesActuales[participanteId].puntos += 1;
    //   }

    //   // Incrementar sets ganados, sets perdidos y puntosSets según corresponda al perdedor
    //   if (perdedor && participanteId === perdedor.id) {
    //     const [puntosParticipante1, puntosParticipante2] = sets[0].marcador.split('-').map(Number);
    //     posicionesActuales[participanteId].setsGanados += puntosParticipante2 > puntosParticipante1 ? 1 : 0;
    //     posicionesActuales[participanteId].setsPerdidos += puntosParticipante2 < puntosParticipante1 ? 1 : 0;
    //     posicionesActuales[participanteId].puntosSets += puntosParticipante2;
    //   }
    // });

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

    // await this.grupoRepository.save(partido.grupo);

    // partido.resultado = {
    //   sets: sets,
    //   ganador: ganador,
    //   perdedor: perdedor,
    // };

    // const partidoActualizado = await this.partidoRepository.save(partido);

    // return partidoActualizado;









    /*const { sets, ganador: { tipo: ganadorTipo, id: ganadorId }, perdedor: { tipo: perdedorTipo, id: perdedorId} } = nuevoResultado;

    // Obtener las posiciones actuales del grupo
    const posicionesActuales = partido.grupo.posiciones || {};

    // Actualizar las posiciones según el resultado del partido
    partido.grupo.participantes.forEach((participante) => {
      const participanteId = participante.jugador?.id || participante.pareja?.id;

      // Inicializar puntos si no existe
      posicionesActuales[participanteId] = posicionesActuales[participanteId] || {
        puntos: 0,
        setsGanados: 0,
        setsPerdidos: 0,
        puntosSets: 0,
      };

      // Incrementar los puntos del ganador, en este caso, solo si el participante es el ganador
      if (participanteId === ganadorId) {
        posicionesActuales[participanteId].puntos += 1;
      }

      // Incrementar sets ganados, sets perdidos y puntosSets según corresponda al perdedor
      if (perdedor && participanteId === perdedor.id) {
        const [puntosParticipante1, puntosParticipante2] = sets[0].marcador.split('-').map(Number);
        posicionesActuales[participanteId].setsGanados += puntosParticipante2 > puntosParticipante1 ? 1 : 0;
        posicionesActuales[participanteId].setsPerdidos += puntosParticipante2 < puntosParticipante1 ? 1 : 0;
        posicionesActuales[participanteId].puntosSets += puntosParticipante2;
      }

      // Incrementar sets ganados, sets perdidos y puntosSets según corresponda al ganador
      if (participanteId === ganadorId) {
        const [puntosParticipante1, puntosParticipante2] = sets[0].marcador.split('-').map(Number);
        posicionesActuales[participanteId].setsGanados += puntosParticipante1 > puntosParticipante2 ? 1 : 0;
        posicionesActuales[participanteId].setsPerdidos += puntosParticipante1 < puntosParticipante2 ? 1 : 0;
        posicionesActuales[participanteId].puntosSets += puntosParticipante1;
      }
    });

    // Ordenar los participantes por puntos (y posiblemente por otras métricas)
    const participantesOrdenados = partido.grupo.participantes.sort((a, b) => {
      const puntosA = posicionesActuales[a.jugador?.id || a.pareja?.id]?.puntos || 0;
      const puntosB = posicionesActuales[b.jugador?.id || b.pareja?.id]?.puntos || 0;

      return puntosB - puntosA;
    });

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

    await this.grupoRepository.save(partido.grupo);

    partido.resultado = {
      sets: sets,
      ganador: {
        tipo: ganadorTipo,
        id: ganadorId,
      },
      perdedor: {
        tipo: perdedorTipo
      }
    };

    const partidoActualizado = await this.partidoRepository.save(partido);

    return partidoActualizado;*/








    // const { sets, ganador: { tipo: ganadorTipo, id: ganadorId } } = nuevoResultado;

    //  // Obtener las posiciones actuales del grupo
    //  const posicionesActuales = partido.grupo.posiciones || {};

    //  // Actualizar las posiciones según el resultado del partido
    //  partido.grupo.participantes.forEach((participante) => {
    //    const participanteId = participante.jugador?.id || participante.pareja?.id;

    //    // Inicializar puntos si no existe
    //    posicionesActuales[participanteId] = posicionesActuales[participanteId] || { puntos: 0 };

    //    // Incrementar los puntos del ganador, en este caso, solo si el participante es el ganador
    //    if (participanteId === ganadorId) {
    //      posicionesActuales[participanteId].puntos += 1;
    //    }
    //  });

    //  // Ordenar los participantes por puntos (y posiblemente por otras métricas)
    //  const participantesOrdenados = partido.grupo.participantes.sort((a, b) => {
    //    const puntosA = posicionesActuales[a.jugador?.id || a.pareja?.id]?.puntos || 0;
    //    const puntosB = posicionesActuales[b.jugador?.id || b.pareja?.id]?.puntos || 0;

    //    return puntosB - puntosA;
    //  });

    //  // Actualizar las posiciones en el grupo
    //  partido.grupo.posiciones = participantesOrdenados.map((participante) => {
    //    const participanteId = participante.jugador?.id || participante.pareja?.id;
    //    return { id: participanteId, puntos: posicionesActuales[participanteId]?.puntos || 0 };
    //  });  

    // await this.grupoRepository.save(partido.grupo);   

    // partido.resultado = {
    //   sets: sets,
    //   ganador: {
    //     tipo: ganadorTipo,
    //     id: ganadorId,
    //   },
    // };

    // const partidoActualizado = await this.partidoRepository.save(partido);

    // return partidoActualizado;
  }









}
