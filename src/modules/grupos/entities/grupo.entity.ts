import { boolean } from "joi";
import { Partido } from "src/modules/partidos/entities/partido.entity";
import { Torneo } from "src/modules/torneos/entities/torneo.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export enum NombreGrupo {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  F = 'F',
  G = 'G',
  H = 'H',
}


@Entity({ name: 'grupos' })
export class Grupo {



  @PrimaryGeneratedColumn()
  id: number;

  @Column() // Número identificador del grupo (Grupo A, Grupo B, etc.)
  nombre_grupo: string


  @Column({type: 'boolean'})
  completado: boolean


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
  posiciones: any


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
  participantes: any[];




  @ManyToOne(() => Torneo, torneo => torneo.grupos)
  @JoinColumn({ name: 'torneoId' })
  torneo: Torneo;

  @OneToMany(() => Partido, partido => partido.grupo)
  partidos: Partido[];




}
