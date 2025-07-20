import { Router } from 'express';
import { AppDataSource } from '../config/database';
import { News } from '../models/News';
import { Section } from '../models/Section';
import { Author } from '../models/Author';
import { Media } from '../models/Media';

const router = Router();
const newsRepo = AppDataSource.getRepository(News);
const sectionRepo = AppDataSource.getRepository(Section);
const authorRepo = AppDataSource.getRepository(Author);
const mediaRepo = AppDataSource.getRepository(Media);

// Obtener todas las noticias
router.get('/', async (req, res) => {
  try {
    const news = await newsRepo.find({
      relations: [
        'seccion',
        'newsAuthors',
        'newsAuthors.autor',
        'newsMedia',
        'newsMedia.media'
      ],
      order: { fecha_publicacion: 'DESC' }
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
    res.status(500).json({ message: 'Error al obtener las noticias' });
  }
});

// Obtener noticias por sección (por nombre)
router.get('/section/:seccion', async (req, res) => {
  try {
    const section = await sectionRepo.findOne({ where: { nombre: req.params.seccion } });
    if (!section) return res.status(404).json({ message: 'Sección no encontrada' });
    const news = await newsRepo.find({
      where: { seccion: section },
      relations: [
        'seccion',
        'newsAuthors',
        'newsAuthors.autor',
        'newsMedia',
        'newsMedia.media'
      ],
      order: { fecha_publicacion: 'DESC' }
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
});

// Obtener noticia por ID
router.get('/:id', async (req, res) => {
  try {
    const noticia = await newsRepo.findOne({
      where: { id: parseInt(req.params.id) },
      relations: [
        'seccion',
        'newsAuthors',
        'newsAuthors.autor',
        'newsMedia',
        'newsMedia.media'
      ]
    });
    if (!noticia) return res.status(404).json({ message: 'Noticia no encontrada' });
    const formatted = {
      id: noticia.id,
      titulo: noticia.titulo,
      contenido: noticia.contenido,
      resumen: noticia.resumen,
      seccion: noticia.seccion ? { id: noticia.seccion.id, nombre: noticia.seccion.nombre, color: noticia.seccion.color } : null,
      autores: noticia.newsAuthors?.map(na => na.autor?.nombre) || [],
      media: noticia.newsMedia?.map(nm => ({ url: nm.media?.url, tipo: nm.media?.tipo, descripcion: nm.media?.descripcion })) || [],
      destacada: noticia.destacada,
      fecha_publicacion: noticia.fecha_publicacion,
      created_at: noticia.created_at,
      updated_at: noticia.updated_at
    };
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la noticia' });
  }
});

// Crear noticia
router.post('/', async (req, res) => {
  try {
    const { titulo, contenido, resumen, seccion_id, autores, media, destacada, fecha_publicacion } = req.body;
    if (!titulo || !contenido || !resumen || !seccion_id || !Array.isArray(autores) || autores.length === 0) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }
    const seccion = await sectionRepo.findOne({ where: { id: seccion_id } });
    if (!seccion) return res.status(400).json({ message: 'Sección no válida' });
    const noticia = newsRepo.create({
      titulo,
      contenido,
      resumen,
      seccion,
      destacada: !!destacada,
      fecha_publicacion: fecha_publicacion ? new Date(fecha_publicacion) : undefined
    });
    await newsRepo.save(noticia);
    // Asociar autores
    for (const autor_id of autores) {
      const autor = await authorRepo.findOne({ where: { id: autor_id } });
      if (autor) {
        await AppDataSource.getRepository('noticia_autor').save({ noticia_id: noticia.id, autor_id: autor.id });
      }
    }
    // Asociar media
    if (Array.isArray(media)) {
      for (const media_id of media) {
        const mediaItem = await mediaRepo.findOne({ where: { id: media_id } });
        if (mediaItem) {
          await AppDataSource.getRepository('noticia_media').save({ noticia_id: noticia.id, media_id: mediaItem.id });
        }
      }
    }
    // Devolver noticia con relaciones
    const noticiaCompleta = await newsRepo.findOne({
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
});

// Editar noticia
router.put('/:id', async (req, res) => {
  try {
    const noticia = await newsRepo.findOne({ where: { id: parseInt(req.params.id) } });
    if (!noticia) return res.status(404).json({ message: 'Noticia no encontrada' });
    const { titulo, contenido, resumen, seccion_id, autores, media, destacada, fecha_publicacion } = req.body;
    if (seccion_id) {
      const seccion = await sectionRepo.findOne({ where: { id: seccion_id } });
      if (!seccion) return res.status(400).json({ message: 'Sección no válida' });
      noticia.seccion = seccion;
    }
    if (titulo !== undefined) noticia.titulo = titulo;
    if (contenido !== undefined) noticia.contenido = contenido;
    if (resumen !== undefined) noticia.resumen = resumen;
    if (destacada !== undefined) noticia.destacada = !!destacada;
    if (fecha_publicacion !== undefined) noticia.fecha_publicacion = new Date(fecha_publicacion);
    await newsRepo.save(noticia);
    // Actualizar autores
    if (Array.isArray(autores)) {
      await AppDataSource.getRepository('noticia_autor').delete({ noticia_id: noticia.id });
      for (const autor_id of autores) {
        const autor = await authorRepo.findOne({ where: { id: autor_id } });
        if (autor) {
          await AppDataSource.getRepository('noticia_autor').save({ noticia_id: noticia.id, autor_id: autor.id });
        }
      }
    }
    // Actualizar media
    if (Array.isArray(media)) {
      await AppDataSource.getRepository('noticia_media').delete({ noticia_id: noticia.id });
      for (const media_id of media) {
        const mediaItem = await mediaRepo.findOne({ where: { id: media_id } });
        if (mediaItem) {
          await AppDataSource.getRepository('noticia_media').save({ noticia_id: noticia.id, media_id: mediaItem.id });
        }
      }
    }
    // Devolver noticia con relaciones
    const noticiaCompleta = await newsRepo.findOne({
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
});

// Eliminar noticia
router.delete('/:id', async (req, res) => {
  try {
    const noticia = await newsRepo.findOne({ where: { id: parseInt(req.params.id) } });
    if (!noticia) return res.status(404).json({ message: 'Noticia no encontrada' });
    // Eliminar relaciones
    await AppDataSource.getRepository('noticia_autor').delete({ noticia_id: noticia.id });
    await AppDataSource.getRepository('noticia_media').delete({ noticia_id: noticia.id });
    await newsRepo.remove(noticia);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la noticia' });
  }
});

export default router; 