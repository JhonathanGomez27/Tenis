import { Injectable } from '@nestjs/common';
import { CreateParejaDto } from './dto/create-pareja.dto';
import { UpdateParejaDto } from './dto/update-pareja.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pareja } from './entities/pareja.entity';
import { Repository } from 'typeorm';
import { handleDbError } from 'src/utils/error.message';

@Injectable()
export class ParejasService {

  constructor(
    @InjectRepository(Pareja) private readonly parejaRepository: Repository<Pareja>
  ) { }


  async create(createParejaDto: CreateParejaDto) {

    try {
      const pareja = this.parejaRepository.create(createParejaDto);
      const parejaGuardada = await this.parejaRepository.save(pareja)
      return parejaGuardada

    } catch (error) {      
      const message = handleDbError(error)
      return { message }
    }

  }


  


}
