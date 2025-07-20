import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { News } from '../models/News';
import { NewsAuthor } from '../models/NewsAuthor';
import { NewsMedia } from '../models/NewsMedia';
import { Section } from '../models/Section';
import { validationResult } from 'express-validator';

export class NewsController {
  private newsRepository = getRepository(News);

  // Obtener todas las noticias (con autores, sección y media)
  public getAllNews = async (req: Request, res: Response): Promise<void> => {
    try {
      const news = await this.newsRepository.find({
        relations: [
          'seccion',
          'newsAuthors',
          'newsAuthors.autor',
          'newsMedia',
          'newsMedia.media'
        ],
        order: {
          fecha_publicacion: 'DESC'
        }
      });
      // Formatear la respuesta para que sea fácil de consumir en el frontend
      const formatted = news.map(n => ({
        id: n.id,
        titulo: n.titulo,
        contenido: n.contenido,
        resumen: n.resumen,
        seccion: n.seccion ? { id: n.seccion.id, nombre: n.seccion.nombre, color: n.seccion.color } : null,
        autores: n.newsAuthors?.map(na => na.autor?.nombre) || [],
        media: n.newsMedia?.map(nm => ({ url: nm.media?.url, tipo: nm.media?.tipo, descripcion: nm.media?.descripcion })) || [],
        destacada: n.destacada,
        fecha_publicacion: n.fecha_publicacion,
        created_at: n.created_at,
        updated_at: n.updated_at
      }));
      res.json(formatted);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener las noticias' });
    }
  };

  // Obtener una noticia por ID (con autores, sección y media)
  public getNewsById = async (req: Request, res: Response): Promise<void> => {
    try {
      const news = await this.newsRepository.findOne({
        where: { id: parseInt(req.params.id) },
        relations: [
          'seccion',
          'newsAuthors',
          'newsAuthors.autor',
          'newsMedia',
          'newsMedia.media'
        ]
      });
      if (!news) {
        res.status(404).json({ message: 'Noticia no encontrada' });
        return;
      }
      const formatted = {
        id: news.id,
        titulo: news.titulo,
        contenido: news.contenido,
        resumen: news.resumen,
        seccion: news.seccion ? { id: news.seccion.id, nombre: news.seccion.nombre, color: news.seccion.color } : null,
        autores: news.newsAuthors?.map(na => na.autor?.nombre) || [],
        media: news.newsMedia?.map(nm => ({ url: nm.media?.url, tipo: nm.media?.tipo, descripcion: nm.media?.descripcion })) || [],
        destacada: news.destacada,
        fecha_publicacion: news.fecha_publicacion,
        created_at: news.created_at,
        updated_at: news.updated_at
      };
      res.json(formatted);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener la noticia' });
    }
  };

  // Crear una nueva noticia (con autores, sección y media)
  public createNews = async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }
      const { titulo, contenido, resumen, seccion_id, destacada, fecha_publicacion, autores, media } = req.body;
      const sectionRepo = getRepository(Section);
      const authorRepo = getRepository('autores');
      const mediaRepo = getRepository('media');
      // Validar sección
      const seccion = await sectionRepo.findOne({ where: { id: seccion_id } });
      if (!seccion) {
        res.status(400).json({ message: 'Sección no válida' });
        return;
      }
      // Crear noticia
      const noticia = this.newsRepository.create({
        titulo,
        contenido,
        resumen,
        seccion,
        destacada: !!destacada,
        fecha_publicacion: fecha_publicacion ? new Date(fecha_publicacion) : undefined
      });
      await this.newsRepository.save(noticia);
      // Asociar autores
      if (Array.isArray(autores)) {
        for (const autor_id of autores) {
          const autor = await authorRepo.findOne({ where: { id: autor_id } });
          if (autor) {
            await getRepository('noticia_autor').save({ noticia_id: noticia.id, autor_id: autor.id });
          }
        }
      }
      // Asociar media
      if (Array.isArray(media)) {
        for (const media_id of media) {
          const mediaItem = await mediaRepo.findOne({ where: { id: media_id } });
          if (mediaItem) {
            await getRepository('noticia_media').save({ noticia_id: noticia.id, media_id: mediaItem.id });
          }
        }
      }
      // Devolver noticia con relaciones
      const noticiaCompleta = await this.newsRepository.findOne({
        where: { id: noticia.id },
        relations: [
          'seccion',
          'newsAuthors',
          'newsAuthors.autor',
          'newsMedia',
          'newsMedia.media'
        ]
      });
      res.status(201).json(noticiaCompleta);
    } catch (error) {
      res.status(500).json({ message: 'Error al crear la noticia' });
    }
  };

  // Actualizar una noticia (con autores, sección y media)
  public updateNews = async (req: Request, res: Response): Promise<void> => {
    try {
      const noticia = await this.newsRepository.findOne({ where: { id: parseInt(req.params.id) } });
      if (!noticia) {
        res.status(404).json({ message: 'Noticia no encontrada' });
        return;
      }
      const { titulo, contenido, resumen, seccion_id, destacada, fecha_publicacion, autores, media } = req.body;
      const sectionRepo = getRepository(Section);
      const authorRepo = getRepository('autores');
      const mediaRepo = getRepository('media');
      // Validar sección
      if (seccion_id) {
        const seccion = await sectionRepo.findOne({ where: { id: seccion_id } });
        if (!seccion) {
          res.status(400).json({ message: 'Sección no válida' });
          return;
        }
        noticia.seccion = seccion;
      }
      if (titulo !== undefined) noticia.titulo = titulo;
      if (contenido !== undefined) noticia.contenido = contenido;
      if (resumen !== undefined) noticia.resumen = resumen;
      if (destacada !== undefined) noticia.destacada = !!destacada;
      if (fecha_publicacion !== undefined) noticia.fecha_publicacion = new Date(fecha_publicacion);
      await this.newsRepository.save(noticia);
      // Actualizar autores
      if (Array.isArray(autores)) {
        await getRepository('noticia_autor').delete({ noticia_id: noticia.id });
        for (const autor_id of autores) {
          const autor = await authorRepo.findOne({ where: { id: autor_id } });
          if (autor) {
            await getRepository('noticia_autor').save({ noticia_id: noticia.id, autor_id: autor.id });
          }
        }
      }
      // Actualizar media
      if (Array.isArray(media)) {
        await getRepository('noticia_media').delete({ noticia_id: noticia.id });
        for (const media_id of media) {
          const mediaItem = await mediaRepo.findOne({ where: { id: media_id } });
          if (mediaItem) {
            await getRepository('noticia_media').save({ noticia_id: noticia.id, media_id: mediaItem.id });
          }
        }
      }
      // Devolver noticia con relaciones
      const noticiaCompleta = await this.newsRepository.findOne({
        where: { id: noticia.id },
        relations: [
          'seccion',
          'newsAuthors',
          'newsAuthors.autor',
          'newsMedia',
          'newsMedia.media'
        ]
      });
      res.json(noticiaCompleta);
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar la noticia' });
    }
  };

  // Eliminar una noticia
  public deleteNews = async (req: Request, res: Response): Promise<void> => {
    try {
      const news = await this.newsRepository.findOne({ where: { id: parseInt(req.params.id) } });
      if (!news) {
        res.status(404).json({ message: 'Noticia no encontrada' });
        return;
      }

      await this.newsRepository.remove(news);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar la noticia' });
    }
  };

  // Obtener noticias por sección
  public getNewsBySection = async (req: Request, res: Response): Promise<void> => {
    try {
      // Buscar la sección por nombre para obtener su id
      const sectionRepo = getRepository(Section);
      const section = await sectionRepo.findOne({ where: { nombre: req.params.section } });
      if (!section) {
        res.status(404).json({ message: 'Sección no encontrada' });
        return;
      }
      const news = await this.newsRepository.find({
        where: { seccion: section },
        relations: [
          'seccion',
          'newsAuthors',
          'newsAuthors.autor',
          'newsMedia',
          'newsMedia.media'
        ],
        order: {
          fecha_publicacion: 'DESC'
        }
      });
      const formatted = news.map(n => ({
        id: n.id,
        titulo: n.titulo,
        contenido: n.contenido,
        resumen: n.resumen,
        seccion: n.seccion ? { id: n.seccion.id, nombre: n.seccion.nombre, color: n.seccion.color } : null,
        autores: n.newsAuthors?.map(na => na.autor?.nombre) || [],
        media: n.newsMedia?.map(nm => ({ url: nm.media?.url, tipo: nm.media?.tipo, descripcion: nm.media?.descripcion })) || [],
        destacada: n.destacada,
        fecha_publicacion: n.fecha_publicacion,
        created_at: n.created_at,
        updated_at: n.updated_at
      }));
      res.json(formatted);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener las noticias de la sección' });
    }
  };

  // Obtener noticias destacadas
  public getFeaturedNews = async (req: Request, res: Response): Promise<void> => {
    try {
      const news = await this.newsRepository.find({
        where: { destacada: true },
        order: {
          fecha_publicacion: 'DESC'
        }
      });
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener las noticias destacadas' });
    }
  };
} 