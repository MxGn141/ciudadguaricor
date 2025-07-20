import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('publicidades')
export class Publicidad {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  imagen!: string;

  @Column({ nullable: true })
  url?: string;

  @Column({ type: 'date', nullable: true })
  fecha_inicio?: string;

  @Column({ type: 'date', nullable: true })
  fecha_fin?: string;

  @Column({ nullable: true })
  descripcion?: string;
} 