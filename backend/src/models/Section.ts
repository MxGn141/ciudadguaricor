import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('secciones')
export class Section {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  nombre!: string;

  @Column({ nullable: true })
  color?: string;
} 