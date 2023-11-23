import { Usuario } from "../entities/usuario.entity";

export class UsuarioResponseDto {
    id: number;
    correo: string;
   

    constructor(usuario: Usuario) {
        this.id = usuario.id;
        this.correo = usuario.correo;
       
    }
}
