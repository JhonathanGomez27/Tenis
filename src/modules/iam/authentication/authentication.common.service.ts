import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import config from 'src/config';
import { ConfigType } from '@nestjs/config';
import { PayloadToken } from '../models/token.model';
import { handleDbError } from 'src/utils/error.message';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from 'src/modules/usuarios/entities/usuario.entity';
import { Repository } from 'typeorm';
import { SignInDto } from './dto/signin.dto';
import { HashingService } from 'src/providers/hashing.service';

@Injectable()
export class AuthenticationCommonService {
  constructor(
    @InjectRepository(Usuario) private usuarioRepository: Repository<Usuario>,
    @Inject(config.KEY)
    private readonly configSerivce: ConfigType<typeof config>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
  ) {}

  generateJwtAccessToken(payload: PayloadToken) {
    //console.log('first')
    try {
      const accessToken = this.jwtService.signAsync(payload, {
        secret: this.configSerivce.session.jwtAccessTokenSecret,
        expiresIn: this.configSerivce.session.jwtAccessTokenExpiresTime,
      });

      return accessToken;
    } catch (error) {
      console.log('auth', error);
      const message = handleDbError(error);
      return { message };
    }
  }

  generateJwtRefreshoken(payload: PayloadToken) {
    //console.log('first')
    try {
      const refreshToken = this.jwtService.signAsync(payload, {
        secret: this.configSerivce.session.jwtRefreshTokenSecret,
        expiresIn: this.configSerivce.session.jwtRefreshTokenExpiresTime,
      });

      return refreshToken;
    } catch (error) {
      console.log('auth', error);
      const message = handleDbError(error);
      return { message };
    }
  }

  async existUser(correo: string) {
    if (!correo) {
      throw new ConflictException('Por favor ingrese un correo válido');
    }
    const existUser = await this.usuarioRepository.findOneBy({ correo });
    if (!existUser) {
      return false;
    }
    return true;
  }

  async findUserToAuthenticate(payload: SignInDto) {
    try {
      /** Buscamos los datos del usuario */
      //const user = await this.userModel.findOne({ email: payload.email.trim() }).exec();
      const user = await this.usuarioRepository.findOneBy({
        correo: payload.correo,
      });

      /** Si el usuario no existe enviamos una excepcion */
      if (!user) {
        throw new ConflictException(
          'Por favor ingrese un email y/o contraseña válida',
        );
      }

      /** Confirmamos que la contraseña sea la correcta */
      const isPasswordMatched = await this.hashingService.compare(
        payload.contrasena.trim(),
        user.contrasena,
      );

      if (!isPasswordMatched) {
        throw new ConflictException(
          'Por favor ingrese un email y/o contraseña válida',
        );
      }

      return user;
    } catch (error) {
      const message = handleDbError(error);
      console.log(message);
      //guardar logs o algo
    }
  }

  async findUserAutenticated(id: number) {
    try {
      return await this.usuarioRepository.findOne({
        where: { id },
        relations: ['imagen_perfil'],
      });
    } catch (error) {
      console.log('third');
      const message = handleDbError(error);
      //return {message}
    }
  }

  async findUserByEmail(correo: string) {
    try {
      //const user = await this.userModel.findOne({ email: email.trim() }).exec();
      const user = await this.usuarioRepository.findOneBy({
        correo: correo.trim(),
      });
      if (!user) {
        throw new ConflictException('El usuario no existe');
      }
      return user;
    } catch (error) {
      const message = handleDbError(error);
      return { message };
    }
  }
}
