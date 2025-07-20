import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { News } from './News';
import { Author } from './Author';

@Entity('noticia_autor')
export class NewsAuthor {
  @PrimaryColumn()
  noticia_id!: number;

  @PrimaryColumn()
  autor_id!: number;

  @ManyToOne(() => News, news => news.newsAuthors, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'noticia_id' })
  noticia!: News;

  @ManyToOne(() => Author, author => author, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'autor_id' })
  autor!: Author;
} 