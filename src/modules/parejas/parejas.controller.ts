import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ParejasService } from './parejas.service';
import { CreateParejaDto } from './dto/create-pareja.dto';
import { UpdateParejaDto } from './dto/update-pareja.dto';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { Roles } from '../iam/decorators';
import { JwtAuthAccessGuard } from '../iam/guards/jwt-auth.guard';
import { RolesGuard } from '../iam/guards/roles.guard';
import { Role } from '../iam/models/roles.model';

@ApiTags('parejas')
@Controller('parejas')
export class ParejasController {
  constructor(private readonly parejasService: ParejasService) {}

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

 
}
