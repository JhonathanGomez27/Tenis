import { Partido } from "src/modules/partidos/entities/partido.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


export enum TipoJornada {
    REGULAR = 'regular',
    CRUZADA = 'cruzada'
   
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


      @OneToMany(() => Partido, partido => partido.jornada)
      partidos: Partido[];



}
