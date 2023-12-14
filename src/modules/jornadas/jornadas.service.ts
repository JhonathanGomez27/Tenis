import { Injectable } from '@nestjs/common';
import { CreateJornadaDto } from './dto/create-jornada.dto';
import { UpdateJornadaDto } from './dto/update-jornada.dto';
import { Jornada } from './entities/jornada.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class JornadasService {
  constructor(
    @InjectRepository(Jornada) private jornadaRepository: Repository<Jornada>,
   
  ) { }
}
