import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { JugadoresService } from './jugadores.service';
import { CreateJugadorDto } from './dto/create-jugadore.dto';
import { UpdateJugadorDto } from './dto/update-jugadore.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { number } from 'joi';
import { JwtAuthAccessGuard } from '../iam/guards/jwt-auth.guard';
import { RolesGuard } from '../iam/guards/roles.guard';
import { Roles } from '../iam/decorators';
import { Role } from '../iam/models/roles.model';
import { FiltersPaginatedQuery } from 'src/common/FiltersPaginatedQuery';

@ApiTags('jugadores')
@Controller('jugadores')
export class JugadoresController {
  constructor(private readonly jugadoresService: JugadoresService) { }

  @Post()
  create(@Body() createJugadoreDto: CreateJugadorDto) {
    return this.jugadoresService.create(createJugadoreDto);
  }


  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthAccessGuard, RolesGuard)
  @Get()
  findAll() {
    return this.jugadoresService.findAll();
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthAccessGuard, RolesGuard)
  @Get('filters')
  async getJugadores(
    @Query('nombre') nombre?: string,
    @Query('rama') rama?: string,
    @Query('categoria') categoria?: string
  ) {
    return this.jugadoresService.findJugadoresByFilters(nombre, rama, categoria);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthAccessGuard, RolesGuard)
  @Get('filtersPaginated')
  @ApiQuery({ name: 'page', type: Number, required: true })
  @ApiQuery({ name: 'limit', type: Number, required: true })
  async getJugadoresPaginated(
    @Query() query: FiltersPaginatedQuery,
    @Query('nombre') nombre?: string,
    @Query('rama') rama?: string,
    @Query('categoria') categoria?: string
  ) {
    return this.jugadoresService.findJugadoresByFiltersPaginated(query.page, query.limit, nombre, rama, categoria);
  }


  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthAccessGuard, RolesGuard)
  @Get('byId')
  @ApiQuery({
    name: 'id',
    type: number,
    required: true
  })
  getById(@Query('id') id) {
    return this.jugadoresService.getJugadorById(id)
  }


  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthAccessGuard, RolesGuard)
  @Get('byUserId')
  @ApiQuery({
    name: 'userId',
    type: number,
    required: true
  })
  getByUserId(@Query('userId') userId) {
    return this.jugadoresService.getJugadorByUserId2(userId)
  }


}
