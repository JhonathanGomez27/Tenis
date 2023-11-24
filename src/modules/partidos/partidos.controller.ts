import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PartidosService } from './partidos.service';
import { CreatePartidoDto } from './dto/create-partido.dto';
import { UpdatePartidoDto } from './dto/update-partido.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('partidos')
@Controller('partidos')
export class PartidosController {
  constructor(private readonly partidosService: PartidosService) {}

  @ApiQuery({
    name: 'torneoId',
    type: Number,
    description: 'Id del torneo a buscar',
    required: true

  })
  @Get('ObtenerPartidosTorneo')
  obtenerPartidosFaseTorneo(@Query('torneoId') torneoId : number){
    return this.partidosService.obtenerPartidosTorneo(torneoId)

  }

  
}
