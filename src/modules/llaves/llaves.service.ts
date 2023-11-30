import { Injectable } from '@nestjs/common';
import { CreateLlaveDto } from './dto/create-llave.dto';
import { UpdateLlaveDto } from './dto/update-llave.dto';
import { Llave } from './entities/llave.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class LlavesService {


  constructor(
    @InjectRepository(Llave) private llaveRepository: Repository<Llave>,
  ){
   
  }




 
}
