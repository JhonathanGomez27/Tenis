import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateParejaDto } from './dto/create-pareja.dto';
import { UpdateParejaDto } from './dto/update-pareja.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pareja } from './entities/pareja.entity';
import { Repository } from 'typeorm';
import { handleDbError } from 'src/utils/error.message';
import { MiExcepcionPersonalizada } from 'src/utils/exception';
import { FiltersParejaDto } from './dto/filters.pareja.dto';

@Injectable()
export class ParejasService {
  constructor(
    @InjectRepository(Pareja)
    private readonly parejaRepository: Repository<Pareja>,
  ) {}

  async create(createParejaDto: CreateParejaDto) {
    try {
      const pareja = this.parejaRepository.create(createParejaDto);
      const parejaGuardada = await this.parejaRepository.save(pareja);
      return parejaGuardada;
    } catch (error) {
      const message = handleDbError(error);
      return { message };
    }
  }

  async update(id: number, updateParejaDto: UpdateParejaDto) {
    try {
      //buscar si existe

      const parejaFound = await this.parejaRepository.findOneBy({ id: id });

      if (!parejaFound) {
        throw new NotFoundException(
          'Pareja no encontrada, por favor verifique',
        );
      }

      if (
        parejaFound.jugador1 === updateParejaDto.jugador2 ||
        parejaFound.jugador2 === updateParejaDto.jugador1
      ) {
        throw new MiExcepcionPersonalizada(
          'Los jugadores deben ser diferentes',
          430,
        );
      }

      if (updateParejaDto.categoria)
        parejaFound.categoria = updateParejaDto.categoria;

      if (updateParejaDto.rama) parejaFound.rama = updateParejaDto.rama;

      if (updateParejaDto.ranking)
        parejaFound.ranking = updateParejaDto.ranking;

      if (updateParejaDto.jugador1)
        parejaFound.jugador1 = updateParejaDto.jugador1;

      if (updateParejaDto.jugador2)
        parejaFound.jugador2 = updateParejaDto.jugador2;

      await this.parejaRepository.save(parejaFound);

      return {
        message: 'Pareja Actuzalizada correctamente',
      };
    } catch (error) {
      //console.log('error', error)

      //return error
      const message = handleDbError(error);
      return { message };
    }
  }

  async findAll() {
    const parejas = await this.parejaRepository.find({
      //relations: ['jugador1', 'jugador2']
      relations: ['jugador1', 'jugador1.userid', 'jugador2', 'jugador2.userid'],
    });

    const parejaResponse = parejas.map((pareja) => ({
      id: pareja.id,
      rama: pareja.rama,
      ranking: pareja.ranking,
      categoria: pareja.categoria,
      jugador1: pareja.jugador1.nombre_a_mostrar,
      jugador2: pareja.jugador2.nombre_a_mostrar,
      juagador1: {
        id: pareja.jugador1.id,
        nombre: pareja.jugador1.nombre_a_mostrar,
        ranking: pareja.jugador1.ranking,
        rama: pareja.jugador1.rama,
        categoria: pareja.jugador1.categoria,
        categoria_dobles: pareja.jugador1.categoria_dobles,
        userid: pareja.jugador1.userid.id,
        correo: pareja.jugador1.userid.correo,
      },
      juagador2: {
        id: pareja.jugador2.id,
        nombre: pareja.jugador2.nombre_a_mostrar,
        ranking: pareja.jugador2.ranking,
        rama: pareja.jugador2.rama,
        categoria: pareja.jugador2.categoria,
        categoria_dobles: pareja.jugador2.categoria_dobles,
        userid: pareja.jugador2.userid.id,
        correo: pareja.jugador2.userid.correo,
      },
    }));
    return parejaResponse;
  }

  async findParejasByFilters(
    ranking?: number,
    rama?: string,
    categoria?: string,
  ) {
    const whereConditions: Record<string, any> = {};

    if (ranking) {
      whereConditions.ranking = ranking;
    }

    if (rama) {
      whereConditions.rama = rama;
    }

    if (categoria) {
      whereConditions.categoria = categoria;
    }

    const parejas = await this.parejaRepository.find({
      where: whereConditions,
      relations: ['jugador1', 'jugador1.userid', 'jugador2', 'jugador2.userid'],
    });

    const parejaResponse = parejas.map((pareja) => ({
      id: pareja.id,
      rama: pareja.rama,
      ranking: pareja.ranking,
      categoria: pareja.categoria,
      jugador1: pareja.jugador1.nombre_a_mostrar,
      jugador2: pareja.jugador2.nombre_a_mostrar,
      juagador1: {
        id: pareja.jugador1.id,
        nombre: pareja.jugador1.nombre_a_mostrar,
        ranking: pareja.jugador1.ranking,
        rama: pareja.jugador1.rama,
        categoria: pareja.jugador1.categoria,
        categoria_dobles: pareja.jugador1.categoria_dobles,
        userid: pareja.jugador1.userid.id,
        correo: pareja.jugador1.userid.correo,
      },
      juagador2: {
        id: pareja.jugador2.id,
        nombre: pareja.jugador2.nombre_a_mostrar,
        ranking: pareja.jugador2.ranking,
        rama: pareja.jugador2.rama,
        categoria: pareja.jugador2.categoria,
        categoria_dobles: pareja.jugador2.categoria_dobles,
        userid: pareja.jugador2.userid.id,
        correo: pareja.jugador2.userid.correo,
      },
    }));

    return {
      parejas: parejaResponse,
      total: parejaResponse.length,
    };
  }

  async findParejasByFiltersPaginated(
    page: number,
    limit: number,
    filters: FiltersParejaDto,
    // ranking?: number,
    // rama?: string,
    // categoria?: string
  ) {
    const whereConditions: Record<string, any> = {};

    if (filters.ranking) {
      whereConditions.ranking = filters.ranking;
    }

    if (filters.rama) {
      whereConditions.rama = filters.rama;
    }

    if (filters.categoria) {
      whereConditions.categoria = filters.categoria;
    }

    const [parejas, total] = await this.parejaRepository.findAndCount({
      where: whereConditions,
      relations: ['jugador1', 'jugador1.userid', 'jugador2', 'jugador2.userid'],
      skip: (page - 1) * limit,
      take: limit,
    });

    const parejaResponse = parejas.map((pareja) => ({
      id: pareja.id,
      rama: pareja.rama,
      ranking: pareja.ranking,
      categoria: pareja.categoria,
      jugador1: pareja.jugador1.nombre_a_mostrar,
      jugador2: pareja.jugador2.nombre_a_mostrar,
      juagador1: {
        id: pareja.jugador1.id,
        nombre: pareja.jugador1.userid.nombre,
        apellido: pareja.jugador1.userid.apellido,
        ranking: pareja.jugador1.ranking,
        rama: pareja.jugador1.rama,
        categoria: pareja.jugador1.categoria,
        categoria_dobles: pareja.jugador1.categoria_dobles,
        userid: pareja.jugador1.userid.id,
        correo: pareja.jugador1.userid.correo,
      },
      juagador2: {
        id: pareja.jugador2.id,
        nombre: pareja.jugador2.userid.nombre,
        apellido: pareja.jugador2.userid.apellido,
        ranking: pareja.jugador2.ranking,
        rama: pareja.jugador2.rama,
        categoria: pareja.jugador2.categoria,
        categoria_dobles: pareja.jugador2.categoria_dobles,
        userid: pareja.jugador2.userid.id,
        correo: pareja.jugador2.userid.correo,
      },
    }));

    return {
      parejas: parejaResponse,
      total,
    };
  }

  async getParejaById(id: number) {
    const pareja = await this.parejaRepository.findOne({
      where: { id: id },
      relations: ['jugador1', 'jugador1.userid', 'jugador2', 'jugador2.userid'],
    });

    if (!pareja) throw new NotFoundException('La Pareja buscado no existe');

    pareja.jugador1.userid.contrasena = undefined;
    pareja.jugador2.userid.contrasena = undefined;

    return pareja;
  }
}
