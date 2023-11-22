import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { JugadoresService } from './jugadores.service';
import { CreateJugadorDto } from './dto/create-jugadore.dto';
import { UpdateJugadorDto } from './dto/update-jugadore.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { number } from 'joi';

@ApiTags('jugadores')
@Controller('jugadores')
export class JugadoresController {
  constructor(private readonly jugadoresService: JugadoresService) {}

  @Post()
  create(@Body() createJugadoreDto: CreateJugadorDto) {
    return this.jugadoresService.create(createJugadoreDto);
  }


  @Get()
  findAll(){
    return this.jugadoresService.findAll();
  }


  @Get('byId')
  @ApiQuery({
    name: 'id',
    type: number,
    required: true
  })
  getById(@Query('id') id){
    return this.jugadoresService.getJugadorById(id)
  } 
  
  @Get('byUserId')
  @ApiQuery({
    name: 'userId',
    type: number,
    required: true
  })
  getByUserId(@Query('userId') userId){
    return this.jugadoresService.getJugadorByUserId2(userId)
  }


}
