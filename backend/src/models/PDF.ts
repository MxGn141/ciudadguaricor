import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('pdfs')
export class PDF {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  url!: string;

  @Column({ type: 'date' })
  fecha!: string;

  @Column({ nullable: true })
  descripcion?: string;
} 