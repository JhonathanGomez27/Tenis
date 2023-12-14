import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JornadasService } from './jornadas.service';
import { CreateJornadaDto } from './dto/create-jornada.dto';
import { UpdateJornadaDto } from './dto/update-jornada.dto';

@Controller('jornadas')
export class JornadasController {
  constructor(private readonly jornadasService: JornadasService) {}

 
}
