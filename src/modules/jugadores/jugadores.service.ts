import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJugadorDto } from './dto/create-jugadore.dto';
import { UpdateJugadorDto } from './dto/update-jugadore.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Jugador } from './entities/jugadore.entity';
import { Repository } from 'typeorm';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { UsuarioResponseDto } from '../usuarios/dto/UsuarioResponse.dto';

@Injectable()
export class JugadoresService {

  constructor(
    @InjectRepository(Jugador) private readonly jugadorRepository: Repository<Jugador>
  ) { }




  async create(createJugadorDto: CreateJugadorDto) {
    const jugador = this.jugadorRepository.create(createJugadorDto)
    const jugadorGuardado = await this.jugadorRepository.save(jugador)
    return jugadorGuardado
  }


  async getJugadorByUserId(usuario: Usuario) {
    const jugador = await this.jugadorRepository.findOneBy({ userid: usuario })
    return jugador
  }


  async findAll() {
    const jugadores = await this.jugadorRepository.find({ relations: ['userid'] });

    const jugadoresResponse = jugadores.map(jugador => ({
      id: jugador.id,
      nombre: jugador.nombre,
      ranking: jugador.ranking,
      rama: jugador.rama,
      categoria: jugador.categoria,
      userid: {
        id: jugador.userid.id,
        //nombre: jugador.userid.nombre,
        rol: jugador.userid.rol,
        correo: jugador.userid.correo
      },
    }));


    return jugadoresResponse;
  }





  async getJugadorById(id: number) {
    console.log(id)
    const jugador = await this.jugadorRepository.findOne({
      where: { id: id },
      relations: ['userid']
    });

    if(!jugador)
    throw new NotFoundException('El jugador buscado no existe')

    jugador.userid.contrasena = undefined
    jugador.userid.nombre = undefined

    return jugador;
  }

  async getJugadorByUserId2(userId: number): Promise<Jugador | null> {
    const jugador = await this.jugadorRepository.findOne({
      where: { userid: { id: userId } },
      relations: ['userid']
    });

    if(!jugador)
    throw new NotFoundException('El jugador buscado no existe')

    jugador.userid.contrasena = undefined
    jugador.userid.nombre = undefined

    return jugador
  }

}
