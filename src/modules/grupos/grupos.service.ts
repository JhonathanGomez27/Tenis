import { Injectable } from '@nestjs/common';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { UpdateGrupoDto } from './dto/update-grupo.dto';
import { Grupo } from './entities/grupo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MiExcepcionPersonalizada } from 'src/utils/exception';
import { Torneo } from '../torneos/entities/torneo.entity';

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




}
