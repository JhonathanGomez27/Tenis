// usuario.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


export enum rolEnum {
  USER = 'user',
  ADMIN = 'admin'

}

@Entity({ name: 'usuarios'})
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({
    type: 'enum',
    enum: rolEnum,
    default: rolEnum.USER
  })
  rol: 'admin' | 'user'; 

  @Column()
  contrasena: string;

  @Column({ unique: true })
  correo: string;
}
