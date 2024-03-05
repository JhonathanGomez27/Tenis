import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LlavesService } from './llaves.service';
import { CreateLlaveDto } from './dto/create-llave.dto';
import { UpdateLlaveDto } from './dto/update-llave.dto';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('llaves')
@Controller('llaves')
export class LlavesController {
  constructor(private readonly llavesService: LlavesService) {}

  @Get('/byTorneo/:idTorneo')
  findAll( @Param('idTorneo') idTorneo: number) {
    return this.llavesService.findAll(idTorneo);
  }

  @Patch('/editarJugador1/:idLlave/:idJugador')
  editarJugador1(@Param('idLlave') idLlave: number, @Param('idJugador') idJugador: number) {
    return this.llavesService.editarJugador1(idLlave, idJugador);
  }

  @Patch('/editarJugador2/:idLlave/:idJugador')
  editarJugador2(@Param('idLlave') idLlave: number, @Param('idJugador') idJugador: number) {
    return this.llavesService.editarJugador2(idLlave, idJugador);
  }
  

}
