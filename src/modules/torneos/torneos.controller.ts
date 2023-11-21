import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TorneosService } from './torneos.service';
import { CreateTorneoDto } from './dto/create-torneo.dto';
import { UpdateTorneoDto } from './dto/update-torneo.dto';
import { ApiTags } from '@nestjs/swagger';



@ApiTags('torneos')
@Controller('torneos')
export class TorneosController {
  constructor(private readonly torneosService: TorneosService) {}

  @Post()
  create(@Body() createTorneoDto: CreateTorneoDto) {
    return this.torneosService.create(createTorneoDto);
  }

  
}
