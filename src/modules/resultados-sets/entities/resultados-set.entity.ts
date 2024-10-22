import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Torneo } from 'src/modules/torneos/entities/torneo.entity';
import { Partido } from 'src/modules/partidos/entities/partido.entity';
import { Jugador } from 'src/modules/jugadores/entities/jugadore.entity';

export enum Modalidad {
  SINGLES = 'singles',
  PAREJA = 'pareja',
}

@Entity({ name: 'resultadosSets' })
export class ResultadosSet {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Torneo, (torneo) => torneo.resultadosSets)
  torneo: Torneo;

  @ManyToOne(() => Partido)
  partido: Partido;

  @ManyToOne(() => Jugador)
  ganador: Jugador;

  @ManyToOne(() => Jugador)
  perdedor: Jugador;

  @Column()
  puntos_ganador: number;

  @Column()
  puntos_perdedor: number;

  @Column({
    type: 'enum',
    enum: Modalidad,
  })
  modalidad: Modalidad;
  @Column()
  fase: 'grupos' | 'octavos' | 'cuartos' | 'semifinales' | 'final' | 'otra';
}
