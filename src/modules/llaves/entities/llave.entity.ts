import { Jugador } from "src/modules/jugadores/entities/jugadore.entity";
import { Pareja } from "src/modules/parejas/entities/pareja.entity";
import { Partido } from "src/modules/partidos/entities/partido.entity";
import { Torneo } from "src/modules/torneos/entities/torneo.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";



@Entity({ name: 'llaves' })
export class Llave {

    
    @PrimaryGeneratedColumn()
    id: number; 


    @ManyToOne(() => Torneo, torneo => torneo.llaves)
    @JoinColumn({ name: 'torneoId' })
    torneo: Torneo;


    @Column()
    fase:  'octavos' | 'cuartos' | 'semifinales' | 'final' | 'otra' | 'grupos';

    @ManyToOne(() => Pareja, { nullable: true })  
    @JoinColumn({ name: 'pareja1Id' })
    pareja1: Pareja;

    @ManyToOne(() => Pareja, { nullable: true })
    @JoinColumn({ name: 'pareja2Id' })
    pareja2: Pareja;

    @ManyToOne(() => Jugador, { nullable: true })
    @JoinColumn({ name: 'jugador1Id' })
    jugador1: Jugador;

    @ManyToOne(() => Jugador, { nullable: true })
    @JoinColumn({ name: 'jugador2Id' })
    jugador2: Jugador;
  
    @Column({ nullable: true })
    identificador: number;
    
    @Column({ nullable: true })
    proximoRivalIdentificador: number;

    @Column({ nullable: true })
    lado: 'izquierda' | 'derecha';

}
