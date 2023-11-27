import { Injectable } from '@nestjs/common';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { UpdateGrupoDto } from './dto/update-grupo.dto';
import { Grupo } from './entities/grupo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MiExcepcionPersonalizada } from 'src/utils/exception';
import { Torneo } from '../torneos/entities/torneo.entity';
import { ResultadoPartidoDTO } from '../partidos/dto/resultado.dto';

@Injectable()
export class GruposService {


  constructor(
    @InjectRepository(Grupo) private readonly grupoRepository: Repository<Grupo>,
    @InjectRepository(Torneo) private torneoRepository: Repository<Torneo>,
   
  ) { }


  async obtenerTodosLosGruposPorTorneo(id: number){

    if(!id){
      throw new MiExcepcionPersonalizada('No se Proporciono un id de Torneo', 430);
    }
    const torneo = await this.torneoRepository.findOneBy({id})
    if (!torneo) {
      throw new MiExcepcionPersonalizada('No se encontro el Torneo', 430);
    }
 
    const grupos = await this.grupoRepository.find({ 
        where: {torneo: { id: torneo.id } }
    });   
    return grupos
  }



  // async actualizarPosiciones(idGrupo: number, nuevoResultado: ResultadoPartidoDTO): Promise<Grupo> {

  //   if(!idGrupo){
  //     throw new MiExcepcionPersonalizada('No se Proporciono un id del Grupo', 400);
  //   }

    
  //   const grupo = await this.grupoRepository.findOne({
  //     where: {id: idGrupo},
  //     relations: ['partidos'] 
  //   });

  //   if (!grupo) {
  //     throw new MiExcepcionPersonalizada('No se encontro el Grupo', 404);      
  //   }

  //   // Lógica para actualizar las posiciones según el resultado del partido
  //   // ...

  //   // Calcular los puntos y sets
  //   const participantes = {}; // Objeto para llevar el registro de participantes

  //   for (const partido of grupo.partidos) {
  //     const ganador = partido.resultado.ganador; // 'jugador1' o 'jugador2'
  //     const perdedor = ganador === 'jugador1' ? 'jugador2' : 'jugador1';

  //     // Asignar puntos al ganador
  //     participantes[ganador] = participantes[ganador] || { puntos: 0, setsGanados: 0, setsPerdidos: 0, totalPuntos: 0 };
  //     participantes[ganador].puntos += 1;

  //     // Actualizar sets ganados y perdidos
  //     participantes[ganador].setsGanados += partido.resultado.sets.filter(set => set.ganador === ganador).length;
  //     participantes[perdedor].setsPerdidos += partido.resultado.sets.filter(set => set.ganador === perdedor).length;

  //     // Calcular total de puntos en sets
  //     participantes[ganador].totalPuntos += partido.resultado.sets.reduce((total, set) => total + set.puntos, 0);
  //     participantes[perdedor].totalPuntos += partido.resultado.sets.reduce((total, set) => total + set.puntos, 0);
  //   }

  //   // Convertir el objeto a un array para facilitar el ordenamiento
  //   const participantesArray = Object.keys(participantes).map(key => ({ id: key, ...participantes[key] }));

  //   // Ordenar participantes
  //   participantesArray.sort((a, b) => {
  //     if (a.puntos !== b.puntos) {
  //       return b.puntos - a.puntos;
  //     }
  //     if (a.setsGanados !== b.setsGanados) {
  //       return b.setsGanados - a.setsGanados;
  //     }
  //     if (a.setsPerdidos !== b.setsPerdidos) {
  //       return a.setsPerdidos - b.setsPerdidos;
  //     }
  //     return b.totalPuntos - a.totalPuntos;
  //   });

  //   // Actualizar el atributo `posiciones` en el grupo
  //   grupo.posiciones = participantesArray;

  //   // Guardar los cambios en la base de datos
  //   const grupoActualizado = await this.grupoRepository.save(grupo);

  //   return grupoActualizado;
  // }








}
