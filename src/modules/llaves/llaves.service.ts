import { Injectable } from '@nestjs/common';
import { CreateLlaveDto } from './dto/create-llave.dto';
import { UpdateLlaveDto } from './dto/update-llave.dto';
import { Llave } from './entities/llave.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Torneo } from '../torneos/entities/torneo.entity';
import { Jugador } from '../jugadores/entities/jugadore.entity';

@Injectable()
export class LlavesService {


  constructor(
    @InjectRepository(Llave) private llaveRepository: Repository<Llave>,
    @InjectRepository(Torneo) private torneoRepository: Repository<Torneo>,
    @InjectRepository(Jugador) private jugadorRepository: Repository<Jugador>
  ){
   
  }


  async findAll( idTorneo: number): Promise<Llave[]> {

    const torneo = await this.torneoRepository.findOne({where: {id: idTorneo}});   
    const llaves = this.llaveRepository.find({
      where: {torneo: torneo},
      relations: ['jugador1', 'jugador2']
    })

    return llaves;
  }


  async editarJugador1(idLlave: number, idJugador: number): Promise<Llave> {
    const llave = await this.llaveRepository.findOne({where: {id: idLlave}});
    const jugador = await this.jugadorRepository.findOne({where: {id: idJugador}});
    
    llave.jugador1 = jugador;
    return this.llaveRepository.save(llave);
  }

  async editarJugador2(idLlave: number, idJugador: number): Promise<Llave> {
    const llave = await this.llaveRepository.findOne({where: {id: idLlave}});
    const jugador = await this.jugadorRepository.findOne({where: {id: idJugador}});
    
    llave.jugador2 = jugador;
    return this.llaveRepository.save(llave);
  }




 
}
