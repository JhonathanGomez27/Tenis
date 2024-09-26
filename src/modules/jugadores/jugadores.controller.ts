import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { JugadoresService } from './jugadores.service';
import { CreateJugadorDto } from './dto/create-jugadore.dto';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthAccessGuard } from '../iam/guards/jwt-auth.guard';
import { RolesGuard } from '../iam/guards/roles.guard';
import { Roles } from '../iam/decorators';
import { Role } from '../iam/models/roles.model';
import { FiltersPaginatedQuery } from 'src/common/FiltersPaginatedQuery';
import { FiltersJugadorDto } from './dto/filters.jugador.dto';
import { rolEnum } from '../usuarios/entities/usuario.entity';

@ApiTags('jugadores')
@Controller('jugadores')
export class JugadoresController {
  constructor(private readonly jugadoresService: JugadoresService) {}

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
    @Query('categoria') categoria?: string,
  ) {
    return this.jugadoresService.findJugadoresByFilters(
      nombre,
      rama,
      categoria,
    );
  }

  // @Roles(Role.ADMIN)
  // @UseGuards(JwtAuthAccessGuard, RolesGuard)
  // @Get('filtersPaginated')
  // @ApiQuery({ name: 'page', type: Number, required: true })
  // @ApiQuery({ name: 'limit', type: Number, required: true })
  // async getJugadoresPaginated(
  //   @Query() query: FiltersPaginatedQuery,
  //   // @Query('nombre') nombre?: string,
  //   // @Query('rama') rama?: string,
  //   // @Query('categoria') categoria?: string
  // ) {
  //   return this.jugadoresService.findJugadoresByFiltersPaginated(query.page, query.limit, nombre, rama, categoria);
  // }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthAccessGuard, RolesGuard)
  @Post('filtersPaginated')
  @ApiQuery({ name: 'page', type: Number, required: true })
  @ApiQuery({ name: 'limit', type: Number, required: true })
  @ApiBody({
    type: FiltersJugadorDto,
    required: false,
    description: 'filtros',
  })
  async getJugadoresPaginated(
    @Query() query: FiltersPaginatedQuery,
    @Body() filters: FiltersJugadorDto,
    // @Query('nombre') nombre?: string,
    // @Query('rama') rama?: string,
    // @Query('categoria') categoria?: string
  ) {
    return this.jugadoresService.findJugadoresByFiltersPaginated(
      query.page,
      query.limit,
      filters,
    );
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthAccessGuard, RolesGuard)
  @Get('byId')
  @ApiQuery({
    name: 'id',
    type: Number,
    required: true,
  })
  getById(@Query('id') id) {
    return this.jugadoresService.getJugadorById(id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthAccessGuard, RolesGuard)
  @Get('byUserId')
  @ApiQuery({
    name: 'userId',
    type: Number,
    required: true,
  })
  getByUserId(@Query('userId') userId) {
    return this.jugadoresService.getJugadorByUserId2(userId);
  }

  @Roles(rolEnum.ADMIN)
  @UseGuards(JwtAuthAccessGuard, RolesGuard)
  @Get('/contar')
  contarJugadores() {
    return this.jugadoresService.contarJugadores();
  }
}
