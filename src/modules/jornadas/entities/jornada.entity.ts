import { Partido } from "src/modules/partidos/entities/partido.entity";
import { Torneo } from "src/modules/torneos/entities/torneo.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


export enum TipoJornada {
    REGULAR = 'regular',
    CRUZADA = 'cruzada'
   
}


export enum Retadores {
    PARES = 'pares',
    IMPARES = 'impares'
   
}

@Entity({ name: 'jornadas' })
export class Jornada {

    @PrimaryGeneratedColumn()
    id: number;


    @Column({
        type: 'enum',
        enum: TipoJornada
    })
    tipo: 'regular' | 'cruzada'


    @Column({
        type: 'enum',
        enum: Retadores,
        nullable: true
    })
    retadores: 'pares' | 'impares'


    @Column({
        type: 'json',
        nullable: true,
        transformer: {
          to(value: any): string {
              if (typeof value === 'object') {
                  value = JSON.stringify(value);
              }
          
              return value;
          },
          from(value: string): any {
              if (typeof value === 'string') {
                  try {
                    return JSON.parse(value);
                  } catch (e) {
                    return value;
                  }
              }
    
              return value;
          },
          },
      })
      posiciones: any
    
    
      @Column({
        type: 'json',
        nullable: true,
        transformer: {
          to(value: any): string {
            if (typeof value === 'object') {
                value = JSON.stringify(value);
            }
        
            return value;
          },
          from(value: string): any {
              if (typeof value === 'string') {
                  try {
                    return JSON.parse(value);
                  } catch (e) {
                    return value;
                  }
              }
    
              return value;
          },
        },
      })
      participantes: any[];


      @Column({type: 'boolean', default: false})
      finalizado: boolean


      @Column({type: 'boolean', default: false})
      sorteado: boolean


      @OneToMany(() => Partido, partido => partido.jornada)
      partidos: Partido[];


      @ManyToOne(() => Torneo, torneo => torneo.grupos)
      @JoinColumn({ name: 'torneoId' })
      torneo: Torneo;



}
