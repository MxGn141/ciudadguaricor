import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { News } from '../models/News';
import { AppDataSource } from '../config/database';
import { authenticateToken, isAdmin } from '../middleware/auth';
import { upload, deleteImage } from '../middleware/upload';
import path from 'path';
import express from 'express';
const router = Router();
const newsRepository = AppDataSource.getRepository(News);

// Validaciones para crear/actualizar noticias
const newsValidations = [
  body('titulo').notEmpty().withMessage('El título es requerido')
    .isLength({ max: 150 }).withMessage('El título no puede exceder 150 caracteres'),
  body('contenido').notEmpty().withMessage('El contenido es requerido'),
  body('resumen').notEmpty().withMessage('El resumen es requerido')
    .isLength({ max: 300 }).withMessage('El resumen no puede exceder 300 caracteres'),
  body('seccion').notEmpty().withMessage('La sección es requerida')
    .isIn(['Nacionales', 'Municipales', 'Deportes', 'Cultura', 'Economía', 'Sociales', 'Sucesos'])
    .withMessage('Sección inválida'),
  body('autorTexto').notEmpty().withMessage('El nombre del autor es requerido')
];

// Obtener todas las noticias
router.get('/', async (_req: Request, res: Response) => {
  try {
    const noticias = await newsRepository.find({
      order: { fechaPublicacion: 'DESC' }
    });
    
    // Agregar URL completa a las imágenes
    const noticiasConImagenes = noticias.map(noticia => ({
      ...noticia,
      imagen: noticia.imagen_filename ? `/uploads/noticias/${noticia.imagen_filename}` : noticia.imagen
    }));
    
    res.json(noticiasConImagenes);
  } catch (error) {
    console.error('Error al obtener noticias:', error);
    res.status(500).json({ message: 'Error al obtener las noticias' });
  }
});

// Obtener noticias por sección
router.get('/section/:seccion', async (req: Request, res: Response) => {
  try {
    const noticias = await newsRepository.find({
      where: { seccion: req.params.seccion },
      order: { fechaPublicacion: 'DESC' }
    });

    // Agregar URL completa a las imágenes
    const noticiasConImagenes = noticias.map(noticia => ({
      ...noticia,
      imagen: noticia.imagen_filename ? `/uploads/noticias/${noticia.imagen_filename}` : noticia.imagen
    }));

    res.json(noticiasConImagenes);
  } catch (error) {
    console.error('Error al obtener noticias por sección:', error);
    res.status(500).json({ message: 'Error al obtener las noticias de la sección' });
  }
});

// Obtener noticias destacadas
router.get('/featured', async (_req: Request, res: Response) => {
  try {
    const noticias = await newsRepository.find({
      where: { destacada: true },
      order: { fechaPublicacion: 'DESC' }
    });
    res.json(noticias);
  } catch (error) {
    console.error('Error al obtener noticias destacadas:', error);
    res.status(500).json({ message: 'Error al obtener las noticias destacadas' });
  }
});

// Crear noticia (requiere autenticación)
router.post('/', [authenticateToken, isAdmin, upload.single('imagen'), ...newsValidations], async (req: Request, res: Response) => {
  try {
    const noticia = newsRepository.create({
      ...req.body,
      fechaPublicacion: new Date(),
      imagen_filename: req.file?.filename,
      imagen: req.file ? `/uploads/noticias/${req.file.filename}` : undefined
    });
    
    await newsRepository.save(noticia);
    res.status(201).json(noticia);
  } catch (error) {
    // Si hay error, eliminar la imagen si se subió
    if (req.file) {
      deleteImage(req.file.filename);
    }
    console.error('Error al crear noticia:', error);
    res.status(500).json({ message: 'Error al crear la noticia' });
  }
});

// Actualizar noticia
router.put('/:id', [authenticateToken, isAdmin, upload.single('imagen'), ...newsValidations], async (req: Request, res: Response) => {
  try {
    const noticia = await newsRepository.findOne({ where: { id: parseInt(req.params.id) } });
    if (!noticia) {
      if (req.file) {
        deleteImage(req.file.filename);
      }
      return res.status(404).json({ message: 'Noticia no encontrada' });
    }

    // Si hay una nueva imagen, eliminar la anterior
    if (req.file) {
      if (noticia.imagen_filename) {
        deleteImage(noticia.imagen_filename);
      }
      noticia.imagen_filename = req.file.filename;
      noticia.imagen = `/uploads/noticias/${req.file.filename}`;
    }

    newsRepository.merge(noticia, {
      ...req.body,
      imagen_filename: noticia.imagen_filename,
      imagen: noticia.imagen
    });
    
    const results = await newsRepository.save(noticia);
    res.json(results);
  } catch (error) {
    if (req.file) {
      deleteImage(req.file.filename);
    }
    console.error('Error al actualizar noticia:', error);
    res.status(500).json({ message: 'Error al actualizar la noticia' });
  }
});

// Eliminar noticia
router.delete('/:id', [authenticateToken, isAdmin], async (req: Request, res: Response) => {
  try {
    const noticia = await newsRepository.findOne({ where: { id: parseInt(req.params.id) } });
    if (!noticia) {
      return res.status(404).json({ message: 'Noticia no encontrada' });
    }

    // Eliminar la imagen si existe
    if (noticia.imagen_filename) {
      deleteImage(noticia.imagen_filename);
    }

    await newsRepository.remove(noticia);
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar noticia:', error);
    res.status(500).json({ message: 'Error al eliminar la noticia' });
  }
});

export default router; 