import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('media')
export class Media {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  url!: string;

  @Column({ type: 'enum', enum: ['imagen', 'video', 'pdf'] })
  tipo!: 'imagen' | 'video' | 'pdf';

  @Column({ nullable: true })
  descripcion?: string;
} 