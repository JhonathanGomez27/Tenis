import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { TorneosService } from './torneos.service';
import { CreateTorneoDto } from './dto/create-torneo.dto';
import { UpdateTorneoDto } from './dto/update-torneo.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { categoria, rama } from '../jugadores/entities/jugadore.entity';
import { Estado, Fases, Modalidad, Tipo } from './entities/torneo.entity';
import { JwtAuthAccessGuard } from '../iam/guards/jwt-auth.guard';
import { RolesGuard } from '../iam/guards/roles.guard';
import { Roles } from '../iam/decorators';
import { Role } from '../iam/models/roles.model';



@ApiTags('torneos')
@Controller('torneos')
export class TorneosController {
  constructor(private readonly torneosService: TorneosService) {}


  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthAccessGuard, RolesGuard)
  @Post()
  create(@Body() createTorneoDto: CreateTorneoDto) {
    return this.torneosService.create(createTorneoDto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthAccessGuard, RolesGuard)
  @Get()
  findAll() {
    return this.torneosService.findAll();
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthAccessGuard, RolesGuard)
  @Get('byId')
  @ApiQuery({
    name: 'id',
    type: Number,
    required: true
  })
  getById(@Query('id') id) {
    return this.torneosService.getTorneoById(id)
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


  @Get('ObtenerEstados')
  obtenerEstados() {
    return this.torneosService.enumToJsonArray(Estado);
  }


  @ApiQuery({
    name: 'torneoId',
    type: Number,
    description: 'Id del torneo a buscar',
    required: true

  })
  @Patch('FinalizarInscripciones')
  FinalizarInscripcion(@Query('torneoId') torneoId : number) {
    return this.torneosService.finalizarInscripciones(torneoId);
  }



  @ApiQuery({
    name: 'torneoId',
    type: Number,
    description: 'Id del torneo a buscar',
    required: true

  })
  @Patch('CambiarTorneoASorteo')
  CambiarTorneoASorteo(@Query('torneoId') torneoId : number) {
    return this.torneosService.CambiarTorneoASorteo(torneoId);
  }



  @ApiQuery({
    name: 'torneoId',
    type: Number,
    description: 'Id del torneo a buscar',
    required: true

  })
  @Get('FormarGrupos')
  formarGrupos(@Query('torneoId') torneoId : number){
    return this.torneosService.formarGrupos(torneoId)

  }


  @ApiQuery({
    name: 'torneoId',
    type: Number,
    description: 'Id del torneo a buscar',
    required: true

  })
  @Get('programarPartidosFaseGrupos')
  programarPartidosFaseGrupos(@Query('torneoId') torneoId : number){
    return this.torneosService.programarPartidosFaseGrupos(torneoId)

  }


  @ApiQuery({
    name: 'torneoId',
    type: Number,
    description: 'Id del torneo a buscar',
    required: true

  })
  @Get('volverAsorteoGruupos')
  volverAsorteoGruupos(@Query('torneoId') torneoId : number){
    return this.torneosService.volverAsorteoGruupos(torneoId)

  }



  



 
  
}
