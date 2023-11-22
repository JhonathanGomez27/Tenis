import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ParejasService } from './parejas.service';
import { CreateParejaDto } from './dto/create-pareja.dto';
import { UpdateParejaDto } from './dto/update-pareja.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('parejas')
@Controller('parejas')
export class ParejasController {
  constructor(private readonly parejasService: ParejasService) {}

  @Post()
  create(@Body() createParejaDto: CreateParejaDto) {
    return this.parejasService.create(createParejaDto);
  }

 
}
