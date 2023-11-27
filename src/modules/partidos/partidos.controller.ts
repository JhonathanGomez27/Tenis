import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PartidosService } from './partidos.service';
import { CreatePartidoDto } from './dto/create-partido.dto';
import { UpdatePartidoDto } from './dto/update-partido.dto';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ResultadoPartidoDTO } from './dto/resultado.dto';

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



  @ApiParam({
    name: 'id',
    required: true,
    type: Number
  }) 
  @Patch('actualizarResultadoPartido/:id')
  actualizarResultado(@Param('id') id: number, @Body() resultadoDto: ResultadoPartidoDTO){
    return this.partidosService.actualizarResultado(id, resultadoDto)

  }

  
}
