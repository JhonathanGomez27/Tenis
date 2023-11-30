import { IsBoolean, IsIn, IsNotEmpty, IsOptional } from "class-validator";
import { Torneo } from "src/modules/torneos/entities/torneo.entity";
import { NombreGrupo } from "../entities/grupo.entity";
import { ApiProperty } from "@nestjs/swagger";
import { number } from "joi";




export class CreateGrupoDto {



    @IsOptional()
    torneo?: Torneo 


    // @ApiProperty({
    //     name: 'torneo',
    //     type: Number,
    //     required: true,
    //     description: 'id del torneo en el cual se quiere crear el grupo'
    // })
    // @IsNotEmpty()
    // torneo: Torneo

    @IsIn(Object.values(NombreGrupo))
    @IsNotEmpty()
    nombre_grupo: 'A'  | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' 

    @IsNotEmpty()
    @IsBoolean()
    completado: boolean;

    @IsOptional()
    posiciones?: any


    @IsOptional()
    participantes?: any
}
