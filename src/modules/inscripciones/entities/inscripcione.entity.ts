import { Jugador } from "src/modules/jugadores/entities/jugadore.entity";
import { Pareja } from "src/modules/parejas/entities/pareja.entity";
import { Torneo } from "src/modules/torneos/entities/torneo.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";



@Entity({ name: 'inscripciones' })
export class Inscripcion {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Torneo, torneo => torneo.inscripciones)
    @JoinColumn({ name: 'torneoId' })
    torneo: Torneo;

    @ManyToOne(() => Pareja, { nullable: true })
    @JoinColumn({ name: 'parejaId' })
    pareja: Pareja;

    @ManyToOne(() => Jugador, { nullable: true })
    @JoinColumn({ name: 'jugadorId' })
    jugador: Jugador;

   
    // @Column()
    // fechaInscripcion: Date;

    
}
