import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { News } from './News';

@Entity('autores')
export class Author {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  nombre!: string;

  // Relación muchos a muchos con noticias (opcional, para queries inversas)
  // @ManyToMany(() => News, news => news.authors)
  // noticias!: News[];
} 