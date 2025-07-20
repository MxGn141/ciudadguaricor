import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { News } from './News';
import { Media } from './Media';

@Entity('noticia_media')
export class NewsMedia {
  @PrimaryColumn()
  noticia_id!: number;

  @PrimaryColumn()
  media_id!: number;

  @ManyToOne(() => News, news => news.newsMedia, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'noticia_id' })
  noticia!: News;

  @ManyToOne(() => Media, media => media, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'media_id' })
  media!: Media;
} 