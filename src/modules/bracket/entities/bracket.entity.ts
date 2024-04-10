// bracket.entity.ts

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Bracket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fase: string;

  @Column()
  lado: string;

  @Column({ nullable: true })
  participante1: number;

  @Column({ nullable: true })
  participante2: number;
}
