import { ApiProperty } from "@nestjs/swagger";
import {  IsNotEmpty } from "class-validator";



export class SignInDto {

    @ApiProperty({
        name: 'correo',
        type: String,
        required: true,
        example: "correo@correo.com"
    })
    @IsNotEmpty({ message: "Por favor ingrese un email y/o contraseña válida" })    
    readonly correo: string;
  

    @ApiProperty({
        name: 'contrasena',
        type: String,
        required: true,
        example: "contrasena1234"
    })
    @IsNotEmpty({ message: "Por favor ingrese un email y/o contraseña válida" })    
    readonly contrasena: string;
}