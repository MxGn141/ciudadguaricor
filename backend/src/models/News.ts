import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Section } from './Section';
import { NewsAuthor } from './NewsAuthor';
import { NewsMedia } from './NewsMedia';

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

  @ManyToOne(() => Section, { eager: true })
  @JoinColumn({ name: 'seccion_id' })
  seccion!: Section;

  @Column({ default: false })
  destacada!: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'fecha_publicacion' })
  fecha_publicacion!: Date;

  @CreateDateColumn({ name: 'created_at' })
  created_at!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at!: Date;

  @OneToMany(() => NewsAuthor, newsAuthor => newsAuthor.noticia)
  newsAuthors!: NewsAuthor[];

  @OneToMany(() => NewsMedia, newsMedia => newsMedia.noticia)
  newsMedia!: NewsMedia[];
} 