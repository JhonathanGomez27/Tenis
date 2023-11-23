import { Injectable } from '@nestjs/common';
import { CreateInscripcioneDto } from './dto/create-inscripcione.dto';
import { UpdateInscripcioneDto } from './dto/update-inscripcione.dto';
import { Inscripcion } from './entities/inscripcione.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class InscripcionesService {


  constructor(
    @InjectRepository(Inscripcion) private readonly inscripcionRepository: Repository<Inscripcion>
  ) { }




  create(createInscripcioneDto: CreateInscripcioneDto) {
    return 'This action adds a new inscripcione';
  }

  findAll() {
    return `This action returns all inscripciones`;
  }

  findOne(id: number) {
    return `This action returns a #${id} inscripcione`;
  }

  update(id: number, updateInscripcioneDto: UpdateInscripcioneDto) {
    return `This action updates a #${id} inscripcione`;
  }

  remove(id: number) {
    return `This action removes a #${id} inscripcione`;
  }
}
