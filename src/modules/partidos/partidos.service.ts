import { Injectable } from '@nestjs/common';
import { CreatePartidoDto } from './dto/create-partido.dto';
import { UpdatePartidoDto } from './dto/update-partido.dto';
import { Partido } from './entities/partido.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Torneo } from '../torneos/entities/torneo.entity';
import { MiExcepcionPersonalizada } from 'src/utils/exception';

@Injectable()
export class PartidosService {


  constructor(
    @InjectRepository(Partido) private partidoRepository: Repository<Partido>,
    @InjectRepository(Torneo) private torneoRepository: Repository<Torneo>,
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
}
