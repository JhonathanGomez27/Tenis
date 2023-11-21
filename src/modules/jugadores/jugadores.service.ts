import { Injectable } from '@nestjs/common';
import { CreateJugadorDto } from './dto/create-jugadore.dto';
import { UpdateJugadorDto } from './dto/update-jugadore.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Jugador } from './entities/jugadore.entity';
import { Repository } from 'typeorm';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Injectable()
export class JugadoresService {

  constructor(
    @InjectRepository(Jugador) private readonly jugadorRepository: Repository<Jugador>
  ){}




  async create(createJugadorDto: CreateJugadorDto) {
    const jugador = this.jugadorRepository.create(createJugadorDto)   
    const jugadorGuardado = await this.jugadorRepository.save(jugador)
    return jugadorGuardado   
  }


  async getJugadorByUserId(usuario: Usuario){
    const jugador = await this.jugadorRepository.findOneBy({userid: usuario})
    return jugador
  }

  
}
