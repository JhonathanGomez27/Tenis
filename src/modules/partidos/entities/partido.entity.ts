import { Grupo } from "src/modules/grupos/entities/grupo.entity";
import { Jugador } from "src/modules/jugadores/entities/jugadore.entity";
import { Pareja } from "src/modules/parejas/entities/pareja.entity";
import { Fases, Torneo } from "src/modules/torneos/entities/torneo.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";



@Entity({ name: 'partidos' })
export class Partido {

    @PrimaryGeneratedColumn()
    id: number; 


    @ManyToOne(() => Torneo, torneo => torneo.partidos)
    @JoinColumn({ name: 'torneoId' })
    torneo: Torneo;

    @Column()
    fase: 'grupos' | 'octavos' | 'cuartos' | 'semifinales' | 'final' | 'otra';    


    @Column({
        type: 'json',
        nullable: true, 
        transformer: {
            to(value: any): string {
                return JSON.stringify(value);
            },
            from(value: string): any {
                return JSON.parse(value);
            },
        },
    })
    resultado: any;    
   

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    date: Date;
    
    @ManyToOne(() => Pareja, { nullable: true })  // Puedes ajustar esta relación según tu lógica de negocio
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


    @ManyToOne(() => Grupo, { nullable: true })
    @JoinColumn({ name: 'grupoId' })
    grupo: Grupo;
   
}