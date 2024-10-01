import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthAccessGuard } from '../iam/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { rolEnum } from './entities/usuario.entity';
import { Roles } from '../iam/decorators';
import { RolesGuard } from '../iam/guards/roles.guard';
import { filterImage, getLimitFile, storage } from '../files/config_file';

@Controller('usuarios')
@ApiTags('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @UseGuards(JwtAuthAccessGuard)
  @Get('MisDatos')
  misDatos(@Request() req) {
    //console.log(req.user)
    return this.usuariosService.getMisDatos(req.user);
  }

  @ApiParam({
    name: 'userId',
    required: true,
    type: Number,
  })
  @Patch('/editar/:userId')
  editarInfo(
    @Param('userId') userId: number,
    @Body() editUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.usuariosService.editarInfo(userId, editUsuarioDto);
  }

  @Post('/cargaHistoricos')
  @UseInterceptors(FileInterceptor('file'))
  async cargarHistoricos(@UploadedFile() file: Express.Multer.File) {
    const fileBuffer = file.buffer; // Accede al buffer del archivo
    return this.usuariosService.cargarHistoricos(fileBuffer);
  }

  @Post('/actualizarHistoricos')
  @UseInterceptors(FileInterceptor('file'))
  async actualizarHistoricos(@UploadedFile() file: Express.Multer.File) {
    const fileBuffer = file.buffer; // Accede al buffer del archivo
    return this.usuariosService.ActualizarNombresYApellidos(fileBuffer);
  }

  @Roles(rolEnum.ADMIN)
  @UseGuards(JwtAuthAccessGuard, RolesGuard)
  @Get('/contar')
  contarUsuarios() {
    return this.usuariosService.contarUsuarios();
  }

  @UseInterceptors(
    FileInterceptor('file', {
      limits: getLimitFile(5, 'MB'),
      fileFilter: filterImage,
      storage: storage,
    }),
  )
  @Patch('/subir-imagen/:id')
  uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: number,
  ) {
    return this.usuariosService.uploadProfileImage(id, file);
  }
}
