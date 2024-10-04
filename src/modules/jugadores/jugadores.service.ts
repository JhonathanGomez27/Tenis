import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJugadorDto } from './dto/create-jugadore.dto';
import { UpdateJugadorDto } from './dto/update-jugadore.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Jugador } from './entities/jugadore.entity';
import { ILike, Repository } from 'typeorm';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { UsuarioResponseDto } from '../usuarios/dto/UsuarioResponse.dto';
import { FiltersJugadorDto } from './dto/filters.jugador.dto';

@Injectable()
export class JugadoresService {
  constructor(
    @InjectRepository(Jugador)
    private readonly jugadorRepository: Repository<Jugador>,
  ) {}

  async create(createJugadorDto: CreateJugadorDto) {
    const jugador = this.jugadorRepository.create(createJugadorDto);
    const jugadorGuardado = await this.jugadorRepository.save(jugador);
    return jugadorGuardado;
  }

  async actualizarJugador(updateJugadorDto: UpdateJugadorDto) {
    const jugador = await this.jugadorRepository.save(updateJugadorDto);
    return jugador;
  }

  async getJugadorByUserId(usuario: Usuario) {
    const jugador = await this.jugadorRepository.findOneBy({
      userid: { id: usuario.id },
    });
    return jugador;
  }

  async findAll() {
    const jugadores = await this.jugadorRepository.find({
      relations: ['userid'],
    });

    const jugadoresResponse = jugadores.map((jugador) => ({
      id: jugador.id,
      nombre_a_mostrar: jugador.nombre_a_mostrar,
      ranking: jugador.ranking,
      rama: jugador.rama,
      categoria: jugador.categoria,
      categoria_dobles: jugador.categoria_dobles,
      userid: {
        id: jugador.userid.id,
        //nombre: jugador.userid.nombre,
        rol: jugador.userid.rol,
        correo: jugador.userid.correo,
      },
    }));

    return jugadoresResponse;
  }

  async findJugadoresByFilters(
    nombre?: string,
    rama?: string,
    categoria?: string,
  ) {
    const whereConditions: Record<string, any> = {};

    console.log('categoria', categoria);

    if (rama) {
      whereConditions.rama = rama;
    }

    if (categoria) {
      whereConditions.categoria = categoria;
    }

    // Búsqueda por coincidencia parcial en el nombre
    if (nombre) {
      whereConditions.nombre = ILike(`%${nombre}%`);
    }

    const jugadores = await this.jugadorRepository.find({
      where: whereConditions,
      relations: ['userid'],
    });

    const jugadoresResponse = jugadores.map((jugador) => ({
      id: jugador.id,
      nombre_a_mostrar: jugador.nombre_a_mostrar,
      ranking: jugador.ranking,
      rama: jugador.rama,
      categoria: jugador.categoria,
      categoria_dobles: jugador.categoria_dobles,
      userid: {
        id: jugador.userid.id,
        //nombre: jugador.userid.nombre,
        rol: jugador.userid.rol,
        correo: jugador.userid.correo,
      },
    }));

    return {
      jugadores: jugadoresResponse,
      total: jugadoresResponse.length,
    };
  }

  async findJugadoresByFiltersPaginated(
    page: number,
    limit: number,
    filters: FiltersJugadorDto,
  ) {
    const whereConditions: Record<string, any> = {};

    if (filters.rama) {
      whereConditions.rama = filters.rama;
    }

    if (filters.categoria) {
      whereConditions.categoria = filters.categoria;
    }

    // Búsqueda por coincidencia parcial en el nombre
    if (filters.nombre_a_mostrar) {
      whereConditions.nombre_a_mostrar = ILike(`%${filters.nombre_a_mostrar}%`);
    }

    const [jugadores, total] = await this.jugadorRepository.findAndCount({
      where: whereConditions,
      relations: ['userid'],
      skip: (page - 1) * limit,
      take: limit,
    });

    const jugadoresResponse = jugadores.map((jugador) => ({
      id: jugador.id,
      nombre_a_mostrar: jugador.nombre_a_mostrar,
      ranking: jugador.ranking,
      rama: jugador.rama,
      categoria: jugador.categoria,
      categoria_dobles: jugador.categoria_dobles,
      userid: {
        id: jugador.userid.id,
        nombre: jugador.userid.nombre,
        apellido: jugador.userid.apellido,
        rol: jugador.userid.rol,
        correo: jugador.userid.correo,
      },
    }));

    return { jugadores: jugadoresResponse, total };
  }

  async getJugadorById(id: number) {
    const jugador = await this.jugadorRepository.findOne({
      where: { id: id },
      relations: ['userid'],
    });

    if (!jugador) throw new NotFoundException('El jugador buscado no existe');

    jugador.userid.contrasena = undefined;
    //jugador.userid.nombre = undefined

    return jugador;
  }

  async getJugadorByUserId2(userId: number): Promise<Jugador | null> {
    const jugador = await this.jugadorRepository.findOne({
      where: { userid: { id: userId } },
      relations: ['userid'],
    });

    if (!jugador) throw new NotFoundException('El jugador buscado no existe');

    jugador.userid.contrasena = undefined;
    //jugador.userid.nombre = undefined

    return jugador;
  }

  async contarJugadores() {
    const total = await this.jugadorRepository.count();

    return {
      message: `Hay un total de ${total} jugadores registrados`,
      total,
    };
  }
}
