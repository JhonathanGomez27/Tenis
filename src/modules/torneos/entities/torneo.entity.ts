import { Grupo } from "src/modules/grupos/entities/grupo.entity";
import { Inscripcion } from "src/modules/inscripciones/entities/inscripcione.entity";
import { categoria, rama } from "src/modules/jugadores/entities/jugadore.entity";
import { Partido } from "src/modules/partidos/entities/partido.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";



export enum Tipo {
    REGULAR = 'regular',
    ESCALERA = 'escalera'
}

export enum Modalidad {
    SINGLES = 'singles',
    DOBLES = 'dobles'
}

export enum Estado {
    INICIAL = 'Inicial',
    SORTEO = 'Sorteo',
    PROGRAMACION = 'Programacion',
    PROCESO = 'En Proceso',
    FINALIZADO = 'Finalizado'
}


export enum Fases {
    GRUPOS = 'grupos',
    OCTAVOS = 'octavos',
    CUARTOS = 'cuartos',
    SEMIFINALES = 'semifinales',
    FINAL = 'final',
    OTRA = 'otra'
}

@Entity({ name: 'torneos' })
export class Torneo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column({
        type: 'enum',
        enum: Tipo
        //default: Tipo.REGULAR
    })
    tipo_torneo: 'regular' | 'escalera';

    @Column({
        type: 'enum',
        enum: rama
    })
    rama: 'masculina' | 'femenina' | 'mixta';

    @Column({
        type: 'enum',
        enum: Modalidad,
        default: Modalidad.SINGLES
    })
    modalidad: 'singles' | 'dobles';


    //@Column({ default: 4 })
    // cantidad_grupos: number;

    @Column({ default: 4 })
    cantidad_grupos: number;

    @Column({
        type: 'enum',
        enum: categoria
    })
    categoria: 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D'

    @Column({
        type: 'json',
        transformer: {
            to(value: any): string {
                return JSON.stringify(value);
            },
            from(value: string): any {
                return JSON.parse(value);
            },
        },
    })
    configuracion_sets: any;


    @Column({
        type: 'enum',
        enum: Fases
    })
    fase_actual: 'grupos' | 'octavos' | 'cuartos' | 'semifinales' | 'final' | 'otra';

    @Column({ type: "datetime" })
    fecha_inicio: Date;

    @Column({ type: "datetime" })
    fecha_fin: Date;

    @Column({
        type: 'enum',
        enum: Estado,
        default: Estado.INICIAL
    })
    estado: 'Inicial' | 'En Proceso' | 'Finalizado' | 'Sorteo' | 'Programacion'


    @OneToMany(() => Partido, partido => partido.torneo)
    partidos: Partido[];


    @OneToMany(() => Inscripcion, inscripcion => inscripcion.torneo)
    inscripciones: Inscripcion[];

    @OneToMany(() => Grupo, grupo => grupo.torneo)
    grupos: Grupo[];



}
