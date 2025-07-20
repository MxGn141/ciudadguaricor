import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { News } from '../models/News';
import { validationResult } from 'express-validator';

export class NewsController {
  private newsRepository = getRepository(News);

  // Obtener todas las noticias
  public getAllNews = async (req: Request, res: Response): Promise<void> => {
    try {
      const news = await this.newsRepository.find({
        order: {
          fechaPublicacion: 'DESC'
        }
      });
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener las noticias' });
    }
  };

  // Obtener una noticia por ID
  public getNewsById = async (req: Request, res: Response): Promise<void> => {
    try {
      const news = await this.newsRepository.findOne({ where: { id: parseInt(req.params.id) } });
      if (!news) {
        res.status(404).json({ message: 'Noticia no encontrada' });
        return;
      }
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener la noticia' });
    }
  };

  // Crear una nueva noticia
  public createNews = async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const news = this.newsRepository.create(req.body);
      await this.newsRepository.save(news);
      res.status(201).json(news);
    } catch (error) {
      res.status(500).json({ message: 'Error al crear la noticia' });
    }
  };

  // Actualizar una noticia
  public updateNews = async (req: Request, res: Response): Promise<void> => {
    try {
      const news = await this.newsRepository.findOne({ where: { id: parseInt(req.params.id) } });
      if (!news) {
        res.status(404).json({ message: 'Noticia no encontrada' });
        return;
      }

      this.newsRepository.merge(news, req.body);
      const results = await this.newsRepository.save(news);
      res.json(results);
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
      const news = await this.newsRepository.find({
        where: { seccion: req.params.section },
        order: {
          fechaPublicacion: 'DESC'
        }
      });
      res.json(news);
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
          fechaPublicacion: 'DESC'
        }
      });
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener las noticias destacadas' });
    }
  };
} 