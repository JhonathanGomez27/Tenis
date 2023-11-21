import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario, rolEnum } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import { handleDbError } from 'src/utils/error.message';
import { HashingService } from 'src/providers/hashing.service';
import { JugadoresService } from '../jugadores/jugadores.service';


@Injectable()
export class UsuariosService {



  constructor(
    @InjectRepository(Usuario) private usuarioRepository: Repository<Usuario>,
    private readonly hashingService: HashingService,
    private readonly jugadoresService: JugadoresService
  ) {}







  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario | { /*error: any;*/ message: string }> {
    try {



      createUsuarioDto.contrasena = await this.hashingService.hash(createUsuarioDto.contrasena.trim());


      const usuario = this.usuarioRepository.create(createUsuarioDto);
      const usuarioGuardado = await this.usuarioRepository.save(usuario);

      if(usuarioGuardado.rol === rolEnum.USER){
        const jugadorDto = {
          nombre: createUsuarioDto.nombre,
          //ranking: createUsuarioDto.ranking,
          rama: createUsuarioDto.rama,
          categoria: createUsuarioDto.categoria,
          userid: usuarioGuardado


        }
        const jugador = await this.jugadoresService.create(jugadorDto)       
      }



      usuarioGuardado.contrasena = undefined
      return usuarioGuardado;
    } catch (error) {

      const message = handleDbError(error)
      return {message}
    }
  }


  async getMisDatos(usuario: Usuario){   
    
    const userFound = await this.usuarioRepository.findOneBy({id: usuario.id})
    userFound.contrasena = undefined;

    if(!userFound){
      throw new UnauthorizedException('El Token No esta asociado a ningun Usuario, por favor verificar')
    }

    if(userFound.rol === rolEnum.ADMIN){
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
