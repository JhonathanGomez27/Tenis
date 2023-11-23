import { IsNotEmpty, IsOptional } from "class-validator";
import { Jugador } from "src/modules/jugadores/entities/jugadore.entity";
import { Pareja } from "src/modules/parejas/entities/pareja.entity";
import { Torneo } from "src/modules/torneos/entities/torneo.entity";
import { ParejaOJugador, ParejaOJugadorObligatorio } from "./validators.inscripcion";



export class CreateInscripcioneDto {


    @IsNotEmpty()
    readonly torneo: Torneo


    @IsOptional()
    @ParejaOJugador()
    readonly jugador: Jugador


    @IsOptional()
    @ParejaOJugador()
    readonly pareja: Pareja


    @ParejaOJugadorObligatorio()
    public ParejaOJugadorRequeridos: string;




}


