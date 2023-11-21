import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JugadoresService } from './jugadores.service';
import { CreateJugadorDto } from './dto/create-jugadore.dto';
import { UpdateJugadorDto } from './dto/update-jugadore.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('jugadores')
@Controller('jugadores')
export class JugadoresController {
  constructor(private readonly jugadoresService: JugadoresService) {}

  @Post()
  create(@Body() createJugadoreDto: CreateJugadorDto) {
    return this.jugadoresService.create(createJugadoreDto);
  }


}
