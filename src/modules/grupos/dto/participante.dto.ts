import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional } from "class-validator"

export class ParticipanteDto {

     @ApiProperty({
        name: 'id',
        type: Number,
        required: true,
        description: 'id de la inscripcion del participante(pareja o jugador)'
    })
    @IsNotEmpty()   
    id: number

    @IsOptional()
    jugador?: any

    @IsOptional()
    pareja?: any
    
}
