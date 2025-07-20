import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('noticias')
export class News {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 150 })
  titulo!: string;

  @Column('text')
  contenido!: string;

  @Column({ length: 300 })
  resumen!: string;

  @Column({ nullable: true })
  imagen!: string;

  @Column({ nullable: true })
  imagen_filename!: string;

  @Column({ length: 100, name: 'autor_texto' })
  autorTexto!: string;

  @Column({ nullable: true, name: 'autor_foto' })
  autorFoto!: string;

  @Column({
    type: 'enum',
    enum: ['Nacionales', 'Municipales', 'Deportes', 'Cultura', 'Economía', 'Sociales', 'Sucesos']
  })
  seccion!: string;

  @Column({ default: false })
  destacada!: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'fecha_publicacion' })
  fechaPublicacion!: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
} 