import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ResultadosSetsService } from './resultados-sets.service';
import { CreateResultadosSetDto } from './dto/create-resultados-set.dto';
import { UpdateResultadosSetDto } from './dto/update-resultados-set.dto';

@Controller('resultados-sets')
export class ResultadosSetsController {
  constructor(private readonly resultadosSetsService: ResultadosSetsService) {}

  @Post()
  create(@Body() createResultadosSetDto: CreateResultadosSetDto) {
    return this.resultadosSetsService.create(createResultadosSetDto);
  }

  @Get()
  findAll() {
    return this.resultadosSetsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resultadosSetsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResultadosSetDto: UpdateResultadosSetDto) {
    return this.resultadosSetsService.update(+id, updateResultadosSetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resultadosSetsService.remove(+id);
  }
}
