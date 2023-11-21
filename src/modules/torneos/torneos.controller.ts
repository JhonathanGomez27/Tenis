import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TorneosService } from './torneos.service';
import { CreateTorneoDto } from './dto/create-torneo.dto';
import { UpdateTorneoDto } from './dto/update-torneo.dto';
import { ApiTags } from '@nestjs/swagger';
import { categoria, rama } from '../jugadores/entities/jugadore.entity';
import { Fases, Modalidad, Tipo } from './entities/torneo.entity';



@ApiTags('torneos')
@Controller('torneos')
export class TorneosController {
  constructor(private readonly torneosService: TorneosService) {}

  @Post()
  create(@Body() createTorneoDto: CreateTorneoDto) {
    return this.torneosService.create(createTorneoDto);
  }


  @Get('ObtenerRamas')
  obtenerRamas() {
    return this.torneosService.enumToJsonArray(rama);
  }


  @Get('ObtenerTipos')
  obtenerTipos() {
    return this.torneosService.enumToJsonArray(Tipo);
  }


  @Get('ObtenerModalidades')
  obtenerModalidades() {
    return this.torneosService.enumToJsonArray(Modalidad);
  }


  @Get('ObtenerCategorias')
  obtenerCategorias() {
    return this.torneosService.enumToJsonArray(categoria);
  }


  @Get('ObtenerFases')
  obtenerFases() {
    return this.torneosService.enumToJsonArray(Fases);
  }

  
}
