import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TorneosService } from './torneos.service';
import { CreateTorneoDto } from './dto/create-torneo.dto';
import { UpdateTorneoDto } from './dto/update-torneo.dto';
import { ApiTags } from '@nestjs/swagger';
import { categoria, rama } from '../jugadores/entities/jugadore.entity';
import { Fases, Modalidad, Tipo } from './entities/torneo.entity';
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
