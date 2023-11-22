import { Usuario } from "../entities/usuario.entity";

export class UsuarioResponseDto {
    id: number;
    correo: string;
    // Otros campos que deseas exponer...

    constructor(usuario: Usuario) {
        this.id = usuario.id;
        this.correo = usuario.correo;
        // Mapea otros campos que deseas exponer...
    }
}
