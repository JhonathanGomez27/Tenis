import { Type } from "class-transformer";
import { IsDate, IsIn, IsNotEmpty, IsNumber, IsOptional, IsPositive, Validate } from "class-validator";
import { Jugador } from "src/modules/jugadores/entities/jugadore.entity";
import { Pareja } from "src/modules/parejas/entities/pareja.entity";
import { Fases, Torneo } from "src/modules/torneos/entities/torneo.entity";
import { ParejasDiferentes, ParejasOJugadores, ParejasOJugadoresObligatorio } from "./validators";
import { JugadoresDiferentes } from "src/modules/parejas/dto/create-pareja.dto";



export class CreatePartidoDto {

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    readonly torneo: Torneo

    @IsOptional()
    @ParejasOJugadores()
    @ParejasDiferentes()
    readonly pareja1?: Pareja;

    @IsOptional()
    @ParejasOJugadores()
    readonly pareja2?: Pareja;

    @IsOptional()
    @ParejasOJugadores()
    @JugadoresDiferentes()
    readonly jugador1?: Jugador;

    @IsOptional()
    @ParejasOJugadores()
    readonly jugador2?: Jugador;

    @IsNotEmpty()
    @IsIn(Object.values(Fases))
    fase: 'grupos' | 'octavos' | 'cuartos' | 'semifinales' | 'final' | 'otra';

    readonly resultado?: any;


    @IsOptional()
    @IsDate()
    @Type(() => Date)
    readonly fecha?: Date


    @ParejasOJugadoresObligatorio()
    public parejasOJugadoresRequeridos: string;


    // @Validate(ParejasOJugadoresObligatorio, ["pareja1", "pareja2", "jugador1", "jugador2"], {
    //     message: 'Debe proporcionar al menos parejas o jugadores'
    // })
    // parejasOJugadoresObligatorio?: number[];
}
