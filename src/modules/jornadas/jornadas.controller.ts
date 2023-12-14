import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { JornadasService } from './jornadas.service';
import { CreateJornadaDto } from './dto/create-jornada.dto';
import { UpdateJornadaDto } from './dto/update-jornada.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('jornadas')
export class JornadasController {
  constructor(private readonly jornadasService: JornadasService) {}



  @ApiQuery({
    name: 'torneoId',
    type: Number,
    description: 'Id del torneo a buscar',
    required: true

  })  
  @Get('ObtenerJornadasTorneo')
  obtenerJornadasTorneo(@Query('torneoId') torneoId : number){
    return this.jornadasService.obtenerJornadasTorneo(torneoId)
  }


  // @Roles(Role.ADMIN)
  // @UseGuards(JwtAuthAccessGuard, RolesGuard)
  @Get('byId')
  @ApiQuery({
    name: 'id',
    type: Number,
    required: true
  })
  getJornadaById(@Query('id') id) {
    return this.jornadasService.obtenerJornadaById(id)
  }





 

 
}
