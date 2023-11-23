import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsIn, IsOptional, IsString, MinLength } from "class-validator";
import { categoria, rama } from "src/modules/jugadores/entities/jugadore.entity";

export class CreateUsuarioDto {



    @ApiProperty({
        name: 'nombre',
        type: String,
        required: true
    })
    @IsString()
    readonly nombre: string;
  

    @ApiProperty({
        name: 'correo',
        type: String,
        required: true
    })
    @IsEmail()
    readonly correo: string;
  
    // @IsEnum(['admin', 'user'])
    // readonly rol: 'admin' | 'user';
  
    @ApiProperty({
        name: 'contrasena',
        type: String,
        required: true,
        minLength: 6
    })
    @MinLength(6)
    contrasena: string;
        

    @ApiProperty({
        name: 'rama',
        type: String,
        required: false,
        description: 'solo es opcional en caso de que se registre un admin, si es un usuario es obligatoria',
        enum: rama,
    })
    @IsOptional()  
    @IsIn(Object.values(rama))
    readonly rama?: 'masculina' | 'femenina'



    @ApiProperty({
        name: 'categoria',
        type: String,
        required: false,
        description: 'solo es opcional en caso de que se registre un admin, si es un usuario es obligatoria',
        enum: categoria,
    })
    @IsOptional()    
    @IsIn(Object.values(categoria))
    readonly categoria?: 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D'  


    @ApiProperty({
        name: 'categoria_dobles',
        type: String,
        required: false,
        description: 'solo es opcional en caso de que se registre un admin, si es un usuario es obligatoria',
        enum: categoria,
    })
    @IsOptional()    
    @IsIn(Object.values(categoria))
    readonly categoria_dobles?: 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D'  




}
