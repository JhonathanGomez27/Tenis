import { IsEmail, IsEnum, IsIn, IsOptional, IsString, MinLength } from "class-validator";
import { categoria, rama } from "src/modules/jugadores/entities/jugadore.entity";

export class CreateUsuarioDto {

    @IsString()
    readonly nombre: string;
  
    @IsEmail()
    readonly correo: string;
  
    // @IsEnum(['admin', 'user'])
    // readonly rol: 'admin' | 'user';
  
    @MinLength(6)
    contrasena: string;
        

    @IsOptional()
    //@IsEnum(['masculina', 'femenina'])
    @IsIn(Object.values(rama))
    readonly rama?: 'masculina' | 'femenina'


    @IsOptional()
    //@IsEnum(['A', 'B+', 'B', 'C+', 'C', 'D'])
    @IsIn(Object.values(categoria))
    readonly categoria?: 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D'  




}
