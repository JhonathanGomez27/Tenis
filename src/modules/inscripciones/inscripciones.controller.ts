import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { InscripcionesService } from './inscripciones.service';
import { CreateInscripcioneDto } from './dto/create-inscripcione.dto';
import { UpdateInscripcioneDto } from './dto/update-inscripcione.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('inscripciones')
@Controller('inscripciones')
export class InscripcionesController {
  constructor(private readonly inscripcionesService: InscripcionesService) {}

  @Post('inscribirJugador')
  createInscripcionJugador(@Body() createInscripcioneDto: CreateInscripcioneDto) {
    return this.inscripcionesService.inscribirJugadorATorneo(createInscripcioneDto);
  }


  @Post('inscribirPareja')
  createInscripcionPareja(@Body() createInscripcioneDto: CreateInscripcioneDto) {
    return this.inscripcionesService.inscribirParejaATorneo(createInscripcioneDto);
  }


  


  
  @ApiQuery({
    name: 'torneoId',
    type: Number,
    description: 'Id del torneo a buscar',
    required: true

  }) 
  @Get('obtenerInscripcionesPorTorneoId')
  obtenerTodasLasInscripcionesPorTorneo(@Query('torneoId') torneoId : number ){
    return this.inscripcionesService.obtenerTodasLasInscripcionesPorTorneo(torneoId)
  }


 

 
}
