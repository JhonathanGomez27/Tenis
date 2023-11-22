import { Usuario } from "src/modules/usuarios/entities/usuario.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";


export enum rama {
    MASCULINA = 'masculina',
    FEMENINA = 'femenina',
    MIXTA = 'mixta'
}


export enum categoria {
    A = 'A',
    BMAS = 'B+',
    B = 'B',
    CMAS = 'C+',
    C = 'C',
    D = 'D',
}



@Entity({ name: 'jugadores' })
export class Jugador {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nombre: string;

    @Column({ default: 0 })
    ranking: number;

    @Column({
        type: 'enum',
        enum: rama
    })
    rama: 'masculina' | 'femenina'

    @Column({
        type: 'enum',
        enum: categoria,
        default: categoria.D
    })
    categoria: 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D'

    // @OneToOne(() => Usuario)
    // @JoinColumn({ name: 'useridId' })
    // userid: Usuario


    @OneToOne(() => Usuario)
    @JoinColumn({ name: 'useridId' })
    userid: Usuario;
}
