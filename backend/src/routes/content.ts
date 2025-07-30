import { Router } from 'express';
import { getPrismaClient } from '../config/prisma';
import { uploadPublicidad } from '../middleware/upload';

const router = Router();

// TODO: Implementar rutas de contenido
router.get('/', (req, res) => {
  res.json({ message: 'Rutas de contenido' });
});

// Obtener todos los banners (opcional: filtrar por posición y fechas activas)
router.get('/banners', async (req, res) => {
  try {
    const { posicion, activos } = req.query;
    const prisma = getPrismaClient();
    
    let where: any = {};
    
    if (posicion) {
      where.posicion = posicion;
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
    
    const banners = await prisma.publicidad.findMany({ where });
    res.json(banners);
  } catch (error) {
    console.error('Error al obtener banners:', error);
    res.status(500).json({ message: 'Error al obtener los banners' });
  }
});

// Subir banner
router.post('/banners', uploadPublicidad.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No se subió ningún archivo' });
    
    const { url, fecha_inicio, fecha_fin, descripcion, posicion } = req.body;
    const prisma = getPrismaClient();
    
    if (!posicion) return res.status(400).json({ message: 'La posición es obligatoria' });
    
    const imagen = `/uploads/publicidad/${req.file.filename}`;
    const banner = await prisma.publicidad.create({ 
      data: {
        imagen, 
        url, 
        fechaInicio: fecha_inicio ? new Date(fecha_inicio) : null, 
        fechaFin: fecha_fin ? new Date(fecha_fin) : null, 
        descripcion, 
        posicion,
        visible: true
      }
    });
    
    res.status(201).json(banner);
  } catch (error) {
    console.error('Error al crear banner:', error);
    res.status(500).json({ message: 'Error al crear el banner', error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Editar banner
router.put('/banners/:id', uploadPublicidad.single('file'), async (req, res) => {
  try {
    const prisma = getPrismaClient();
    const banner = await prisma.publicidad.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!banner) return res.status(404).json({ message: 'Banner no encontrado' });
    
    const { url, fecha_inicio, fecha_fin, descripcion, posicion } = req.body;
    
    const updateData: any = {};
    if (posicion) updateData.posicion = posicion;
    if (url !== undefined) updateData.url = url;
    if (fecha_inicio !== undefined) updateData.fechaInicio = fecha_inicio ? new Date(fecha_inicio) : null;
    if (fecha_fin !== undefined) updateData.fechaFin = fecha_fin ? new Date(fecha_fin) : null;
    if (descripcion !== undefined) updateData.descripcion = descripcion;
    if (req.file) updateData.imagen = `/uploads/publicidad/${req.file.filename}`;
    
    const updatedBanner = await prisma.publicidad.update({
      where: { id: parseInt(req.params.id) },
      data: updateData
    });
    
    res.json(updatedBanner);
  } catch (error) {
    console.error('Error al actualizar banner:', error);
    res.status(500).json({ message: 'Error al actualizar el banner' });
  }
});

// Eliminar banner
router.delete('/banners/:id', async (req, res) => {
  try {
    const prisma = getPrismaClient();
    const banner = await prisma.publicidad.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!banner) return res.status(404).json({ message: 'Banner no encontrado' });
    
    await prisma.publicidad.delete({ where: { id: parseInt(req.params.id) } });
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar banner:', error);
    res.status(500).json({ message: 'Error al eliminar el banner' });
  }
});

export default router; 