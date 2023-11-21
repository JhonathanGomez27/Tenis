import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthenticationCommonService } from './authentication.common.service';
import { Request } from 'express';
import { AuthenticationService } from './authentication.service';
import { Usuario } from 'src/modules/usuarios/entities/usuario.entity';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { JwtAuthRefreshGuard } from '../guards/jwt-auth-refresh.guard';


@ApiTags("Auth")
@Controller("authentication")
export class AuthenticationController {

    constructor(
        private readonly authenticationCommonService: AuthenticationCommonService,
        private readonly authService: AuthenticationService

    ) { }




    @UseGuards(LocalAuthGuard)
    @Post("signin")
    async signIn(@Req() req: Request) {
      const user = req.user as Usuario;
      console.log('user', user)
      //const tfaCode = req.body.tfaCode || null;  
      return await this.authService.signIn(user/*, tfaCode*/);      
    }


    @Get('existUser')
    async existUser(@Query('correo') correo: string) {
      return await this.authenticationCommonService.existUser(correo);
    }

    
    @UseGuards(JwtAuthRefreshGuard)
    @Get("refresh")
    async refreshToken(@Req() req: Request) {
     
      const user = req.user as Usuario;
      const refreshToken = req.headers.authorization.split(" ")[1];  
      
      return await this.authService.generateNewAccessToken(user, refreshToken);
    }


    




}
