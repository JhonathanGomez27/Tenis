import { Jugador, categoria, rama } from "src/modules/jugadores/entities/jugadore.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: 'parejas'})
export class Pareja {

    @PrimaryGeneratedColumn()
    id: number


    @Column({
        type: 'enum',
        enum: rama        
    })
    rama: 'masculina' | 'femenina' | 'mixta'

    @Column({
        type: 'enum',
        enum: categoria,
        default: categoria.D
    })
    categoria: 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D'

    @Column({default: 0})
    ranking: number; 

    @OneToOne(() => Jugador)
    @JoinColumn()
    jugador1: Jugador

    @OneToOne(() => Jugador)
    @JoinColumn()
    jugador2: Jugador

}
