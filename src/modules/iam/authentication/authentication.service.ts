import { Injectable } from '@nestjs/common';
import { AuthenticationCommonService } from './authentication.common.service';
import { SigninPayload } from '../models/signin.model';
import { PayloadToken } from '../models/token.model';
import { handleDbError } from 'src/utils/error.message';
import { Jugador } from 'src/modules/jugadores/entities/jugadore.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly authcommonService: AuthenticationCommonService,
    @InjectRepository(Jugador) private jugadorRepository: Repository<Jugador>,
  ) {}

  async signIn(payload: SigninPayload) {
    try {
      const data: PayloadToken = { id: payload.id, rol: payload.rol };
      const [accessToken, refreshToken] = await Promise.all([
        this.authcommonService.generateJwtAccessToken(data),
        this.authcommonService.generateJwtRefreshoken(data),
      ]);

      payload.contrasena = undefined;

      const user = await this.authcommonService.findUserAutenticated(
        payload.id,
      );

      let jugador = null;

      if (user.rol === 'user') {
        jugador = await this.jugadorRepository.findOne({
          where: { userid: { id: user.id } },
        });
      }

      const { contrasena, ...result } = user;

      return {
        message: 'Acceso autorizado',
        accessToken,
        refreshToken,
        user: result,
        jugador: jugador,
      };
    } catch (error) {
      console.log('error', error);
      const message = handleDbError(error);
      return { message };
    }
  }

  async generateNewAccessToken(payload: SigninPayload, refreshToken: string) {
    try {
      /** Data para generar el access y refresh Token */
      const data: PayloadToken = { id: payload.id, rol: payload.rol };

      const accesstoken = await this.authcommonService.generateJwtAccessToken(
        data,
      );
      const user = await this.authcommonService.findUserAutenticated(
        payload.id,
      );

      const { contrasena, ...result } = user;

      return {
        message: 'Acceso autorizado',
        accesstoken,
        refreshToken,
        user: result,
      };
    } catch (error) {
      const message = handleDbError(error);
      return { message };
    }
  }
}
