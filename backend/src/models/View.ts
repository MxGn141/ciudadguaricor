import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('views')
export class View {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column()
  tipo!: string;

  @Column({ type: 'json', nullable: true })
  configuracion?: any;

  @Column({ default: true })
  activo!: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at!: Date;
} 