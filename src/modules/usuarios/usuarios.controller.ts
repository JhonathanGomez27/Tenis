import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthAccessGuard } from '../iam/guards/jwt-auth.guard';

@Controller('usuarios')
@ApiTags('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) { }

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {    
    return this.usuariosService.create(createUsuarioDto);    
  }


  @UseGuards(JwtAuthAccessGuard)
  @Get('MisDatos')
  misDatos( @Request() req) {
    //console.log(req.user)
    return this.usuariosService.getMisDatos(req.user)
  }

 
}
