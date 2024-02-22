import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { PartidosService } from './partidos.service';
import { CreatePartidoDto } from './dto/create-partido.dto';
import { UpdatePartidoDto } from './dto/update-partido.dto';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ResultadoPartidoDTO } from './dto/resultado.dto';
import { JwtAuthAccessGuard } from '../iam/guards/jwt-auth.guard';
import { FiltersPaginatedQuery } from 'src/common/FiltersPaginatedQuery';

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



  @ApiQuery({
    name: 'torneoId',
    type: Number,
    description: 'Id del torneo a buscar',
    required: true

  })
  @Get('SortearSiguienteLlaveFaseGrupos')
  SortearSiguienteLlaveFaseGrupos(@Query('torneoId') torneoId : number){
    return this.partidosService.sortearSiguienteFase(torneoId)

  }


 


  @UseGuards(JwtAuthAccessGuard)
  //@ApiQuery({ name: 'page', type: Number, required: true })
 // @ApiQuery({ name: 'limit', type: Number, required: true })
  @Get('App/ProximosPartidos')
  obtenerProximosPartidos(@Request() req, /* @Query() query: FiltersPaginatedQuery*/){
    return this.partidosService.obtenerProximosPartidos(req.user, /*query.page, query.limit*/)
  }
 

  
}
