import { IsNotEmpty, IsOptional } from "class-validator";
import { Jugador } from "src/modules/jugadores/entities/jugadore.entity";
import { Pareja } from "src/modules/parejas/entities/pareja.entity";
import { Torneo } from "src/modules/torneos/entities/torneo.entity";
import { ParejaOJugador, ParejaOJugadorObligatorio } from "./validators.inscripcion";



export class CreateInscripcioneDto {


    @IsNotEmpty()
    torneo: Torneo


    // @IsOptional()
    // @ParejaOJugador()
    // jugador: Jugador


    @IsOptional()
    @ParejaOJugador()
    jugador: number

    // @IsOptional()
    // @ParejaOJugador()
    // pareja: Pareja


    @IsOptional()
    @ParejaOJugador()
    pareja: number


    @ParejaOJugadorObligatorio()
    public ParejaOJugadorRequeridos: string;




}


