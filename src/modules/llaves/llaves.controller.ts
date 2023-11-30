import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LlavesService } from './llaves.service';
import { CreateLlaveDto } from './dto/create-llave.dto';
import { UpdateLlaveDto } from './dto/update-llave.dto';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('llaves')
@Controller('llaves')
export class LlavesController {
  constructor(private readonly llavesService: LlavesService) {}

}
