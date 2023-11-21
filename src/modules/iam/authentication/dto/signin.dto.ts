import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";


export class SignInDto {

    @IsNotEmpty({ message: "Por favor ingrese un email y/o contraseña válida" })
    @ApiProperty()
    readonly correo: string;
  
    @IsNotEmpty({ message: "Por favor ingrese un email y/o contraseña válida" })
    @ApiProperty()
    readonly contrasena: string;
}