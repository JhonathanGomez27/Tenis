import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario, rolEnum } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import { handleDbError } from 'src/utils/error.message';
import { HashingService } from 'src/providers/hashing.service';
import { JugadoresService } from '../jugadores/jugadores.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';


@Injectable()
export class UsuariosService {



  constructor(
    @InjectRepository(Usuario) private usuarioRepository: Repository<Usuario>,
    private readonly hashingService: HashingService,
    private readonly jugadoresService: JugadoresService
  ) { }

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario | { /*error: any;*/ message: string }> {
    try {

      createUsuarioDto.contrasena = await this.hashingService.hash(createUsuarioDto.contrasena.trim());
      const usuario = this.usuarioRepository.create(createUsuarioDto);
      const usuarioGuardado = await this.usuarioRepository.save(usuario);

      if (usuarioGuardado.rol === rolEnum.USER) {
        const jugadorDto = {
          nombre: createUsuarioDto.nombre,
          //ranking: createUsuarioDto.ranking,
          rama: createUsuarioDto.rama,
          categoria: createUsuarioDto.categoria,
          categoria_dobles: createUsuarioDto.categoria_dobles,
          userid: usuarioGuardado,


        }
        const jugador = await this.jugadoresService.create(jugadorDto)
      }
      usuarioGuardado.contrasena = undefined
      return usuarioGuardado;
    } catch (error) {

      const message = handleDbError(error)
      return { message }
    }
  }


  async editarInfo(id: number, editUsuarioDto: UpdateUsuarioDto) {


    console.log('editUsuarioDto', editUsuarioDto)

    try {
      //buscar si existe
      const userFound = await this.usuarioRepository.findOneBy({ id: id })

      if (!userFound) {
        throw new NotFoundException('Usuario no encontrado, por favor verifique');
      }

      if (userFound.rol === rolEnum.USER) {
        const jugador = await this.jugadoresService.getJugadorByUserId(userFound);

        if (!jugador) {
          throw new NotFoundException('Jugador no encontrado, por favor verifique');
        }
        if (editUsuarioDto.categoria)
          jugador.categoria = editUsuarioDto.categoria

        if (editUsuarioDto.categoria_dobles)
          jugador.categoria_dobles = editUsuarioDto.categoria_dobles

        if (editUsuarioDto.rama)
          jugador.rama = editUsuarioDto.rama


        if (editUsuarioDto.ranking)
          jugador.ranking = editUsuarioDto.ranking


        if (editUsuarioDto.nombre) {
          jugador.nombre = editUsuarioDto.nombre
          userFound.nombre = editUsuarioDto.nombre
        }

        if (editUsuarioDto.correo)
          userFound.correo = editUsuarioDto.correo


        //hacer el update de jugador
        await this.jugadoresService.actualizarJugador(jugador);

        //hacer el update de usuario
        await this.usuarioRepository.save(userFound);

        return {
          message: 'Jugador actualizado Correctamente'
        }



      }

    } catch (error) {
      const message = handleDbError(error)
      return { message }

    }
  }


  async getMisDatos(usuario: Usuario) {

    const userFound = await this.usuarioRepository.findOneBy({ id: usuario.id })
    userFound.contrasena = undefined;

    if (!userFound) {
      throw new UnauthorizedException('El Token No esta asociado a ningun Usuario, por favor verificar')
    }

    if (userFound.rol === rolEnum.ADMIN) {
      return userFound
    }


    let additionalInfo = {};

    if (userFound.rol === rolEnum.USER) {
      const jugador = await this.jugadoresService.getJugadorByUserId(userFound);
      jugador.id = undefined;
      jugador.nombre = undefined;
      additionalInfo = { jugador };
    }

    const datos = { ...userFound, ...additionalInfo };

    return datos;

  }






}
