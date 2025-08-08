import { Router } from 'express';
import { getPrismaClient } from '../config/prisma';
import { upload } from '../middleware/upload';

const router = Router();

// Obtener todas las noticias (con búsqueda global)
router.get('/', async (req, res) => {
  try {
    const prisma = getPrismaClient();
    const search = req.query.search ? String(req.query.search).toLowerCase() : '';
    
    let news;
    if (search) {
      news = await prisma.noticia.findMany({
        include: {
          seccion: true,
          noticiaMedia: {
            include: {
              media: true
            }
          }
        },
        orderBy: { fechaPublicacion: 'desc' }
      });
      news = news.filter(n =>
        n.titulo.toLowerCase().includes(search) ||
        n.resumen.toLowerCase().includes(search) ||
        n.contenido.toLowerCase().includes(search) ||
        n.autorTexto.toLowerCase().includes(search) ||
        n.autorFoto.toLowerCase().includes(search)
      );
    } else {
      news = await prisma.noticia.findMany({
        include: {
          seccion: true,
          noticiaMedia: {
            include: {
              media: true
            }
          }
        },
        orderBy: { fechaPublicacion: 'desc' }
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
      media: n.noticiaMedia?.map(nm => ({ 
        url: nm.media?.url, 
        tipo: nm.media?.tipo, 
        descripcion: nm.media?.descripcion 
      })) || [],
      destacada: n.destacada,
      fecha_publicacion: n.fechaPublicacion,
      created_at: n.createdAt,
      updated_at: n.updatedAt
    }));
    res.json(formatted);
  } catch (error) {
    console.error('Error al obtener noticias:', error);
    res.status(500).json({ message: 'Error al obtener las noticias' });
  }
});

// Obtener noticias por sección (por nombre)
router.get('/section/:seccion', async (req, res) => {
  try {
    const prisma = getPrismaClient();
    const section = await prisma.seccion.findFirst({ where: { nombre: req.params.seccion } });
    if (!section) return res.status(404).json({ message: 'Sección no encontrada' });
    const news = await prisma.noticia.findMany({
      where: { seccionId: section.id },
      include: {
        seccion: true,
        noticiaMedia: {
          include: {
            media: true
          }
        }
      },
      orderBy: { fechaPublicacion: 'desc' }
    });
    const formatted = news.map(n => ({
      id: n.id,
      titulo: n.titulo,
      contenido: n.contenido,
      resumen: n.resumen,
      seccion: n.seccion ? { id: n.seccion.id, nombre: n.seccion.nombre } : null,
      autorTexto: n.autorTexto,
      autorFoto: n.autorFoto,
      media: n.noticiaMedia?.map(nm => ({ url: nm.media?.url, tipo: nm.media?.tipo, descripcion: nm.media?.descripcion })) || [],
      destacada: n.destacada,
      fecha_publicacion: n.fechaPublicacion,
      created_at: n.createdAt,
      updated_at: n.updatedAt
    }));
    res.json(formatted);
  } catch (error) {
    console.error('Error al obtener noticias por sección:', error);
    res.status(500).json({ message: 'Error al obtener las noticias de la sección' });
  }
});

// Obtener noticia por ID
router.get('/:id', async (req, res) => {
  try {
    const prisma = getPrismaClient();
    const noticia = await prisma.noticia.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        seccion: true,
        noticiaMedia: {
          include: {
            media: true
          }
        }
      }
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
      media: noticia.noticiaMedia?.map(nm => ({ url: nm.media?.url, tipo: nm.media?.tipo, descripcion: nm.media?.descripcion })) || [],
      destacada: noticia.destacada,
      fecha_publicacion: noticia.fechaPublicacion,
      created_at: noticia.createdAt,
      updated_at: noticia.updatedAt
    };
    res.json(formatted);
  } catch (error) {
    console.error('Error al obtener noticia por ID:', error);
    res.status(500).json({ message: 'Error al obtener la noticia' });
  }
});

// Crear noticia
router.post('/', upload.none(), async (req, res) => {
  try {
    const prisma = getPrismaClient();
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
    const seccion = await prisma.seccion.findUnique({ where: { id: seccion_id } });
    if (!seccion) {
      console.error('Sección no válida:', seccion_id);
      return res.status(400).json({ message: 'Sección no válida' });
    }
    // Si se marca como destacada, verificar el límite de 3
    if (!!destacada) {
      const noticiasDestacadas = await prisma.noticia.findMany({
        where: { destacada: true },
        orderBy: { fechaPublicacion: 'asc' }, // Más antigua primero
        select: { id: true }
      });
      
      // Si ya hay 3 destacadas, quitar la más antigua
      if (noticiasDestacadas.length >= 3) {
        await prisma.noticia.update({
          where: { id: noticiasDestacadas[0].id },
          data: { destacada: false }
        });
      }
    }

    const noticia = await prisma.noticia.create({
      data: {
        titulo,
        contenido,
        resumen,
        seccion: { connect: { id: seccion_id } },
        autorTexto,
        autorFoto,
        destacada: !!destacada,
        fechaPublicacion: fecha_publicacion ? new Date(fecha_publicacion) : undefined
      },
      include: {
        seccion: true,
        noticiaMedia: {
          include: {
            media: true
          }
        }
      }
    });
    // Asociar media
    if (Array.isArray(media)) {
      for (const media_id of media) {
        const mediaItem = await prisma.media.findUnique({ where: { id: media_id } });
        if (mediaItem) {
          await prisma.noticiaMedia.create({
            data: {
              noticiaId: noticia.id,
              mediaId: mediaItem.id
            }
          });
        }
      }
    }
    // Devolver noticia con relaciones
    res.status(201).json(noticia);
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
    const prisma = getPrismaClient();
    const noticia = await prisma.noticia.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!noticia) return res.status(404).json({ message: 'Noticia no encontrada' });
    const { titulo, contenido, resumen, seccion_id, autorTexto, autorFoto, media, destacada, fecha_publicacion } = req.body;
    
    const updateData: any = {};
    if (seccion_id) {
      const seccion = await prisma.seccion.findUnique({ where: { id: seccion_id } });
      if (!seccion) return res.status(400).json({ message: 'Sección no válida' });
      updateData.seccionId = seccion_id;
    }
    if (autorTexto !== undefined) updateData.autorTexto = autorTexto;
    if (autorFoto !== undefined) updateData.autorFoto = autorFoto;
    if (titulo !== undefined) updateData.titulo = titulo;
    if (contenido !== undefined) updateData.contenido = contenido;
    if (resumen !== undefined) updateData.resumen = resumen;
    if (destacada !== undefined) {
      updateData.destacada = !!destacada;
      
      // Si se marca como destacada, verificar el límite de 3
      if (!!destacada && !noticia.destacada) { // Solo si no era destacada antes
        const noticiasDestacadas = await prisma.noticia.findMany({
          where: { destacada: true },
          orderBy: { fechaPublicacion: 'asc' }, // Más antigua primero
          select: { id: true }
        });
        
        // Si ya hay 3 destacadas, quitar la más antigua
        if (noticiasDestacadas.length >= 3) {
          await prisma.noticia.update({
            where: { id: noticiasDestacadas[0].id },
            data: { destacada: false }
          });
        }
      }
    }
    if (fecha_publicacion !== undefined) updateData.fechaPublicacion = new Date(fecha_publicacion);
    
    const updatedNoticia = await prisma.noticia.update({
      where: { id: noticia.id },
      data: updateData,
      include: {
        seccion: true,
        noticiaMedia: {
          include: {
            media: true
          }
        }
      }
    });
    res.json(updatedNoticia);
  } catch (error) {
    console.error('Error al actualizar noticia:', error);
    res.status(500).json({ message: 'Error al actualizar la noticia' });
  }
});

// Eliminar noticia
router.delete('/:id', async (req, res) => {
  try {
    const prisma = getPrismaClient();
    const noticia = await prisma.noticia.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!noticia) return res.status(404).json({ message: 'Noticia no encontrada' });
    // Eliminar relaciones
    await prisma.noticiaMedia.deleteMany({ where: { noticiaId: noticia.id } });
    await prisma.noticia.delete({ where: { id: noticia.id } });
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar noticia:', error);
    res.status(500).json({ message: 'Error al eliminar la noticia' });
  }
});

export default router; 