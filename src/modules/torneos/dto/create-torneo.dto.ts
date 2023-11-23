import { IsDate, IsIn, IsJSON, IsNotEmpty, IsNumber, IsObject, IsString } from "class-validator";
import { Fases, Modalidad, Tipo } from "../entities/torneo.entity";
import { categoria, rama } from "src/modules/jugadores/entities/jugadore.entity";
import { Type } from "class-transformer"; 

export class CreateTorneoDto {


    @IsNotEmpty()
    @IsString()
    readonly nombre: string

    @IsNotEmpty()
    @IsIn(Object.values(Tipo))
    readonly tipo_torneo: 'regular' | 'escalera';

    @IsNotEmpty()
    @IsIn(Object.values(rama))
    readonly rama: 'masculina' | 'femenina' | 'mixta';

    @IsNotEmpty()
    @IsIn(Object.values(Modalidad))
    readonly modalidad: 'singles' | 'dobles';

    @IsNotEmpty()
    @IsNumber()
    readonly cantidad_grupos: number

    @IsNotEmpty()
    @IsIn(Object.values(categoria))
    readonly categoria: 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D'

    @IsObject()
    readonly configuracion_sets: object

    @IsNotEmpty()
    @IsIn(Object.values(Fases))
    readonly fase_actual: 'grupos' | 'octavos' | 'cuartos' | 'semifinales' | 'final' | 'otra';

    @IsDate()
    @Type(() => Date)
    readonly fecha_inicio: Date

    @IsDate()
    @Type(() => Date)
    readonly fecha_fin: Date

}
