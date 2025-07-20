import { Router } from 'express';
import { AppDataSource } from '../config/database';
import { News } from '../models/News';
import { Section } from '../models/Section';
import { Media } from '../models/Media';
import { upload } from '../middleware/upload';

const router = Router();
const newsRepo = AppDataSource.getRepository(News);
const sectionRepo = AppDataSource.getRepository(Section);
const mediaRepo = AppDataSource.getRepository(Media);

// Obtener todas las noticias (con búsqueda global)
router.get('/', async (req, res) => {
  try {
    const search = req.query.search ? String(req.query.search).toLowerCase() : '';
    let news;
    if (search) {
      news = await newsRepo.find({
        relations: [
          'seccion',
          'newsMedia',
          'newsMedia.media'
        ],
        order: { fecha_publicacion: 'DESC' }
      });
      news = news.filter(n =>
        n.titulo.toLowerCase().includes(search) ||
        n.resumen.toLowerCase().includes(search) ||
        n.contenido.toLowerCase().includes(search) ||
        n.autorTexto.toLowerCase().includes(search) ||
        n.autorFoto.toLowerCase().includes(search)
      );
    } else {
      news = await newsRepo.find({
        relations: [
          'seccion',
          'newsMedia',
          'newsMedia.media'
        ],
        order: { fecha_publicacion: 'DESC' }
      });
    }
    const formatted = news.map(n => ({
      id: n.id,
      titulo: n.titulo,
      contenido: n.contenido,
      resumen: n.resumen,
      seccion: n.seccion ? { id: n.seccion.id, nombre: n.seccion.nombre } : null,
      autorTexto: n.autorTexto,
      autorFoto: n.autorFoto,
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
      seccion: n.seccion ? { id: n.seccion.id, nombre: n.seccion.nombre } : null,
      autorTexto: n.autorTexto,
      autorFoto: n.autorFoto,
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
      seccion: noticia.seccion ? { id: noticia.seccion.id, nombre: noticia.seccion.nombre } : null,
      autorTexto: noticia.autorTexto,
      autorFoto: noticia.autorFoto,
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
router.post('/', upload.none(), async (req, res) => {
  try {
    // Normalizar datos para aceptar FormData
    let { titulo, contenido, resumen, seccion_id, autorTexto, autorFoto, media, destacada, fecha_publicacion } = req.body;
    console.log('REQ.BODY:', req.body);
    // Convertir seccion_id a número
    if (typeof seccion_id === 'string') seccion_id = parseInt(seccion_id);
    // Convertir destacada a booleano
    if (typeof destacada === 'string') destacada = destacada === 'true' || destacada === '1';
    // Convertir media a array de números
    if (typeof media === 'string') media = [media];
    if (Array.isArray(media)) media = media.map(id => parseInt(id));
    // Validar campos obligatorios
    if (!titulo || !contenido || !resumen || !seccion_id || !autorTexto || !autorFoto) {
      console.error('Faltan campos:', { titulo, contenido, resumen, seccion_id, autorTexto, autorFoto });
      return res.status(400).json({ message: 'Faltan campos obligatorios', detalle: { titulo, contenido, resumen, seccion_id, autorTexto, autorFoto } });
    }
    const seccion = await sectionRepo.findOne({ where: { id: seccion_id } });
    if (!seccion) {
      console.error('Sección no válida:', seccion_id);
      return res.status(400).json({ message: 'Sección no válida' });
    }
    const noticia = newsRepo.create({
      titulo,
      contenido,
      resumen,
      seccion,
      autorTexto,
      autorFoto,
      destacada: !!destacada,
      fecha_publicacion: fecha_publicacion ? new Date(fecha_publicacion) : undefined
    });
    await newsRepo.save(noticia);
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
        'newsMedia',
        'newsMedia.media'
      ]
    });
    res.status(201).json(noticiaCompleta);
  } catch (error) {
    console.error('Error al crear noticia:', error);
    let errorMsg = '';
    if (error instanceof Error) {
      errorMsg = error.message;
    } else if (typeof error === 'object' && error && 'message' in error) {
      errorMsg = (error as any).message;
    } else {
      errorMsg = String(error);
    }
    res.status(500).json({ message: 'Error al crear la noticia', error: errorMsg });
  }
});

// Editar noticia
router.put('/:id', async (req, res) => {
  try {
    const noticia = await newsRepo.findOne({ where: { id: parseInt(req.params.id) } });
    if (!noticia) return res.status(404).json({ message: 'Noticia no encontrada' });
    const { titulo, contenido, resumen, seccion_id, autorTexto, autorFoto, media, destacada, fecha_publicacion } = req.body;
    if (seccion_id) {
      const seccion = await sectionRepo.findOne({ where: { id: seccion_id } });
      if (!seccion) return res.status(400).json({ message: 'Sección no válida' });
      noticia.seccion = seccion;
    }
    if (autorTexto !== undefined) noticia.autorTexto = autorTexto;
    if (autorFoto !== undefined) noticia.autorFoto = autorFoto;
    if (titulo !== undefined) noticia.titulo = titulo;
    if (contenido !== undefined) noticia.contenido = contenido;
    if (resumen !== undefined) noticia.resumen = resumen;
    if (destacada !== undefined) noticia.destacada = !!destacada;
    if (fecha_publicacion !== undefined) noticia.fecha_publicacion = new Date(fecha_publicacion);
    await newsRepo.save(noticia);
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
    await AppDataSource.getRepository('noticia_media').delete({ noticia_id: noticia.id });
    await newsRepo.remove(noticia);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la noticia' });
  }
});

export default router; 