import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { GruposService } from './grupos.service';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { UpdateGrupoDto } from './dto/update-grupo.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ParticipanteDto } from './dto/participante.dto';


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

  // /
  // @Roles(Role.ADMIN)
  // @UseGuards(JwtAuthAccessGuard, RolesGuard)
  // @Post()
  // create(@Body() createTorneoDto: CreateTorneoDto) {
  //   return this.torneosService.create(createTorneoDto);
  // }


  // }) 

  @ApiQuery({
    name: 'torneoId',
    type: Number,
    description: 'Id del torneo a buscar',
    required: true

  }) 
  @Post('crearGrupo')
  create(@Body() createGrupoDto: CreateGrupoDto, @Query('torneoId') torneoId : number ){
    return this.gruposService.create(createGrupoDto, torneoId)
  }


  @ApiQuery({
    name: 'torneoId',
    type: Number,
    description: 'Id del torneo a buscar',
    required: true

  })
  @ApiQuery({
    name: 'grupoId',
    type: Number,
    description: 'Id del torneo a buscar',
    required: true

  })
  @Patch('agregarParticipante')
  agregarParticipante(@Body() participante: ParticipanteDto, @Query('torneoId') torneoId : number, @Query('grupoId') grupoId : number ){
    return this.gruposService.agregarParticipanteAGrupo(participante, torneoId, grupoId)
  }





  

  
}
