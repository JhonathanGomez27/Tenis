import { Injectable } from '@nestjs/common';
import { CreateTorneoDto } from './dto/create-torneo.dto';
import { UpdateTorneoDto } from './dto/update-torneo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Torneo } from './entities/torneo.entity';
import { Repository } from 'typeorm';
import { handleDbError } from 'src/utils/error.message';
import { rama } from '../jugadores/entities/jugadore.entity';

@Injectable()
export class TorneosService {

  constructor(
    @InjectRepository(Torneo) private torneoRepository: Repository<Torneo>
  ) { }



  async create(createTorneoDto: CreateTorneoDto) {
    try {

      const torneo = this.torneoRepository.create(createTorneoDto);
      const torneoGuardado = await this.torneoRepository.save(torneo);

      return {
        torneoGuardado
      }

    } catch (error) {
      const message = handleDbError(error)
      return { message }

    }
  }


  // obtenerRamas(): { nombre: string, descripcion: string }[] {
  //   const enumKeys = Object.keys(rama);
  //   return enumKeys.map(key => ({ nombre: rama[key], descripcion: rama[key] }));
  // }



  enumToJsonArray(enumObj: any): { nombre: string, descripcion: string }[] {
    const enumKeys = Object.keys(enumObj);
    return enumKeys.map(key => ({ nombre: enumObj[key], descripcion: enumObj[key] }));
  }


}
