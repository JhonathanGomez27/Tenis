import { Injectable } from '@nestjs/common';
import { CreateJornadaDto } from './dto/create-jornada.dto';
import { UpdateJornadaDto } from './dto/update-jornada.dto';
import { Jornada } from './entities/jornada.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Tipo, Torneo } from '../torneos/entities/torneo.entity';
import { MiExcepcionPersonalizada } from 'src/utils/exception';

@Injectable()
export class JornadasService {
  constructor(
    @InjectRepository(Jornada) private jornadaRepository: Repository<Jornada>,
    @InjectRepository(Torneo) private torneoRepository: Repository<Torneo>,
   
  ) { }




 async obtenerJornadasTorneo(id:number){

    if (!id) {
      throw new MiExcepcionPersonalizada('No se Proporciono un id de Torneo', 400);
    }

    const torneo = await this.torneoRepository.findOne({
      where: { id: id }      
    });

    if (!torneo) {
      throw new MiExcepcionPersonalizada('No se encontro el Torneo', 404);
    }

    if(torneo.tipo_torneo != Tipo.ESCALERA){
      throw new MiExcepcionPersonalizada(`el torneo es de tipo ${torneo.tipo_torneo} por lo cual no se puede realizar esta acción`, 409);
    }

    const jornadas = await this.jornadaRepository.findBy({torneo: torneo})

    return{
      jornadas: jornadas,
      message: 'Jornadas'
    }



  }



  async obtenerJornadaById(id: number){
    
    if (!id) {
      throw new MiExcepcionPersonalizada('No se Proporciono un id de Jornada', 400);
    }

    const jornada = await this.jornadaRepository.findOneBy({id: id})

    if(!jornada){
      throw new MiExcepcionPersonalizada('No se encontro La Jornada', 404);
    }

    

    return {
      jornada: jornada
    }

  }
}
