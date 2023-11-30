import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { GruposService } from './grupos.service';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { UpdateGrupoDto } from './dto/update-grupo.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('grupos')
@Controller('grupos')
export class GruposController {
  constructor(private readonly gruposService: GruposService) {}

  @ApiQuery({
    name: 'torneoId',
    type: Number,
    description: 'Id del torneo a buscar',
    required: true

  }) 
  @Get('obtenerGruposPorTorneoId')
  obtenerTodasLosGruposPorTorneo(@Query('torneoId') torneoId : number ){
    return this.gruposService.obtenerTodosLosGruposPorTorneo(torneoId)
  }

  @ApiQuery({
    name: 'torneoId',
    type: Number,
    description: 'Id del torneo a buscar',
    required: true

  }) 
  @Patch('finalizarGruposPorTorneo')
  finalizarGruposPorTorneo(@Query('torneoId') torneoId : number ){
    return this.gruposService.finalizarGruposPorTorneo(torneoId)
  }

  
}
