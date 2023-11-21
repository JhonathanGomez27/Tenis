import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from "class-validator";

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
    @IsEnum(['masculina', 'femenina'])
    readonly rama?: 'masculina' | 'femenina'


    @IsOptional()
    @IsEnum(['A', 'B+', 'B', 'C+', 'C', 'D'])
    readonly categoria?: 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D'  




}
