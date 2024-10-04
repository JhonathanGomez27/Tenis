import { Usuario } from 'src/modules/usuarios/entities/usuario.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum rama {
  MASCULINA = 'masculina',
  FEMENINA = 'femenina',
  MIXTA = 'mixta',
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
  id: number;

  @Column({ nullable: true })
  nombre_a_mostrar: string;

  @Column({ default: 0 })
  ranking: number;

  @Column({
    type: 'enum',
    enum: rama,
  })
  rama: 'masculina' | 'femenina';

  @Column({
    type: 'enum',
    enum: categoria,
    nullable: true,
  })
  categoria: 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D';

  @Column({
    type: 'enum',
    enum: categoria,
    nullable: true,
  })
  categoria_dobles: 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D';

  @OneToOne(() => Usuario)
  @JoinColumn({ name: 'useridId' })
  userid: Usuario;
}
