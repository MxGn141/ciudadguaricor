import { Router } from 'express';
import { getPrismaClient } from '../config/prisma';
import { uploadContenido } from '../middleware/upload';

const router = Router();

// TODO: Implementar rutas de contenido
router.get('/', (req, res) => {
  res.json({ message: 'Rutas de contenido' });
});

// Obtener todos los contenidos destacados
router.get('/contenido-destacado', async (req, res) => {
  try {
    const { ubicacion, activos } = req.query;
    const prisma = getPrismaClient();
    
    let where: any = {};
    
    if (ubicacion) {
      where.ubicacion = ubicacion;
    }
    
    if (activos === 'true') {
      const hoy = new Date();
      where.AND = [
        {
          OR: [
            { fechaInicio: null },
            { fechaInicio: { lte: hoy } }
          ]
        },
        {
          OR: [
            { fechaFin: null },
            { fechaFin: { gte: hoy } }
          ]
        }
      ];
    }
    
    const contenidos = await prisma.contenidoDestacado.findMany({ where });
    res.json(contenidos);
  } catch (error) {
    console.error('Error al obtener contenidos destacados:', error);
    res.status(500).json({ message: 'Error al obtener los contenidos destacados' });
  }
});

// Subir contenido destacado
router.post('/contenido-destacado', uploadContenido.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No se subió ningún archivo' });
    
    const { url, fecha_inicio, fecha_fin, titulo, ubicacion } = req.body;
    const prisma = getPrismaClient();
    
    if (!ubicacion) return res.status(400).json({ message: 'La ubicación es obligatoria' });
    
    // Cloudinary devuelve la URL completa en req.file.path
    const media = req.file.path;
    const contenido = await prisma.contenidoDestacado.create({ 
      data: {
        media, 
        url, 
        fechaInicio: fecha_inicio ? new Date(fecha_inicio) : null, 
        fechaFin: fecha_fin ? new Date(fecha_fin) : null, 
        titulo, 
        ubicacion,
        visible: true
      }
    });
    
    res.status(201).json(contenido);
  } catch (error) {
    console.error('Error al crear contenido destacado:', error);
    res.status(500).json({ message: 'Error al crear el contenido destacado', error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Editar contenido destacado
router.put('/contenido-destacado/:id', uploadContenido.single('file'), async (req, res) => {
  try {
    const prisma = getPrismaClient();
    const contenido = await prisma.contenidoDestacado.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!contenido) return res.status(404).json({ message: 'Contenido destacado no encontrado' });
    
    const { url, fecha_inicio, fecha_fin, titulo, ubicacion } = req.body;
    
    const updateData: any = {};
    if (ubicacion) updateData.ubicacion = ubicacion;
    if (url !== undefined) updateData.url = url;
    if (fecha_inicio !== undefined) updateData.fechaInicio = fecha_inicio ? new Date(fecha_inicio) : null;
    if (fecha_fin !== undefined) updateData.fechaFin = fecha_fin ? new Date(fecha_fin) : null;
    if (titulo !== undefined) updateData.titulo = titulo;
    if (req.file) updateData.media = req.file.path; // URL de Cloudinary
    
    const updatedContenido = await prisma.contenidoDestacado.update({
      where: { id: parseInt(req.params.id) },
      data: updateData
    });
    
    res.json(updatedContenido);
  } catch (error) {
    console.error('Error al actualizar contenido destacado:', error);
    res.status(500).json({ message: 'Error al actualizar el contenido destacado' });
  }
});

// Eliminar contenido destacado
router.delete('/contenido-destacado/:id', async (req, res) => {
  try {
    const prisma = getPrismaClient();
    
    // Buscar el contenido destacado antes de eliminarlo
    const contenido = await prisma.contenidoDestacado.findUnique({ 
      where: { id: parseInt(req.params.id) } 
    });
    
    if (!contenido) {
      return res.status(404).json({ message: 'Contenido destacado no encontrado' });
    }
    
    // Extraer URL de la imagen para eliminar de Cloudinary
    const imageUrl = contenido.media;
    
    // Eliminar el contenido de la base de datos
    await prisma.contenidoDestacado.delete({ where: { id: parseInt(req.params.id) } });
    
    // Eliminar imagen de Cloudinary de forma asíncrona
    if (imageUrl) {
      // Importar las funciones de Cloudinary
      const { extractPublicIdFromUrl, deleteImage } = require('../config/cloudinary');
      
      // Eliminar imagen en segundo plano (no bloquear la respuesta)
      const publicId = extractPublicIdFromUrl(imageUrl);
      if (publicId) {
        deleteImage(publicId).catch((error: any) => {
          console.error('Error al limpiar imagen de Cloudinary:', error);
        });
        
        console.log(`Contenido destacado eliminado. Limpiando imagen de Cloudinary: ${publicId}`);
      }
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar contenido destacado:', error);
    res.status(500).json({ message: 'Error al eliminar el contenido destacado' });
  }
});

export default router;