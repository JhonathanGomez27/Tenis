import { Injectable } from '@nestjs/common';
import { CreateTorneoDto } from './dto/create-torneo.dto';
import { UpdateTorneoDto } from './dto/update-torneo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Torneo } from './entities/torneo.entity';
import { Repository } from 'typeorm';
import { handleDbError } from 'src/utils/error.message';

@Injectable()
export class TorneosService {

  constructor(
    @InjectRepository(Torneo) private torneoRepository: Repository<Torneo>
  ){}



  async create(createTorneoDto: CreateTorneoDto) {
    try {

      const torneo = this.torneoRepository.create(createTorneoDto);
      const torneoGuardado = await this.torneoRepository.save(torneo);

      return{
        torneoGuardado
      }
      
    } catch (error) {
      const message = handleDbError(error)
      return {message}
      
    }
  }

 
}
