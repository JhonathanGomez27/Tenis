import { IsBoolean, IsIn, IsNotEmpty, IsOptional } from "class-validator";
import { Torneo } from "src/modules/torneos/entities/torneo.entity";
import { NombreGrupo } from "../entities/grupo.entity";




export class CreateGrupoDto {

    @IsNotEmpty()
    torneo: Torneo

    @IsIn(Object.values(NombreGrupo))
    @IsNotEmpty()
    nombre_grupo: 'A'  | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' 

    @IsNotEmpty()
    @IsBoolean()
    completado: boolean;

    @IsOptional()
    posiciones?: any
}
