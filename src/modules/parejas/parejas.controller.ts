import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ParejasService } from './parejas.service';
import { CreateParejaDto } from './dto/create-pareja.dto';
import { UpdateParejaDto } from './dto/update-pareja.dto';
import { ApiParam, ApiTags, ApiQuery } from '@nestjs/swagger';
import { Roles } from '../iam/decorators';
import { JwtAuthAccessGuard } from '../iam/guards/jwt-auth.guard';
import { RolesGuard } from '../iam/guards/roles.guard';
import { Role } from '../iam/models/roles.model';
import { FiltersPaginatedQuery } from 'src/common/FiltersPaginatedQuery';
import { FiltersParejaDto } from './dto/filters.pareja.dto';

@ApiTags('parejas')
@Controller('parejas')
export class ParejasController {
  constructor(private readonly parejasService: ParejasService) { }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthAccessGuard, RolesGuard)
  @Post()
  create(@Body() createParejaDto: CreateParejaDto) {
    return this.parejasService.create(createParejaDto);
  }


  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthAccessGuard, RolesGuard)
  @ApiParam({
    name: 'parejaId',
    required: true,
    type: Number
  })
  @Patch('editar/:parejaId')
  update(@Param('parejaId') parejaId: number, @Body() updateParejaDto: UpdateParejaDto) {
    return this.parejasService.update(parejaId, updateParejaDto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthAccessGuard, RolesGuard)
  @Get()
  finAll() {
    return this.parejasService.findAll();
  }


  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthAccessGuard, RolesGuard)
  @Get('filters')
  async getParejas(
    @Query('ranking') ranking?: number,
    @Query('rama') rama?: string,
    @Query('categoria') categoria?: string
  ) {
    return this.parejasService.findParejasByFilters(ranking, rama, categoria);
  }





  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthAccessGuard, RolesGuard)
  @ApiQuery({ name: 'page', type: Number, required: true })
  @ApiQuery({ name: 'limit', type: Number, required: true })
  @Post('filtersPaginated')
  async getParejasPaginated(
    @Query() query: FiltersPaginatedQuery,
    @Body() filters: FiltersParejaDto
    // @Query('ranking') ranking?: number,
    // @Query('rama') rama?: string,
    // @Query('categoria') categoria?: string
  ) {
    return this.parejasService.findParejasByFiltersPaginated(query.page, query.limit, filters);
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
    return this.parejasService.getParejaById(id)
  }


}
