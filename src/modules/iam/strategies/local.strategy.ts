import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthenticationCommonService } from "../authentication/authentication.common.service";
import { Usuario } from "src/modules/usuarios/entities/usuario.entity";
import { SignInDto } from "../authentication/dto/signin.dto";



@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "local") {

    constructor(
        private readonly authenticationCommonService: AuthenticationCommonService
    ) {
        super({
            usernameField: "correo",
            passwordField: "contrasena"
        })
    }

    async validate(correo: string, contrasena: string) : Promise<Usuario> {
        const payload : SignInDto = {correo, contrasena};
        const user = await this.authenticationCommonService.findUserToAuthenticate(payload);
        return user;
    }

}