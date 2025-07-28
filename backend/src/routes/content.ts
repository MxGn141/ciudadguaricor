import { Router } from 'express';
import { AppDataSource } from '../config/database';
import { Publicidad } from '../models/Publicidad';
import { uploadPublicidad } from '../middleware/upload';

const router = Router();

// TODO: Implementar rutas de contenido
router.get('/', (req, res) => {
  res.json({ message: 'Rutas de contenido' });
});

const publicidadRepo = AppDataSource.getRepository(Publicidad);

// Obtener todos los banners (opcional: filtrar por posición y fechas activas)
router.get('/banners', async (req, res) => {
  try {
    const { posicion, activos } = req.query;
    let where: any = {};
    
    if (posicion) {
      where.posicion = posicion;
    }
    
    let banners = await publicidadRepo.find({ where });
    
    // Filtrar por fechas activas si se solicita
    if (activos === 'true') {
      const hoy = new Date().toISOString().slice(0, 10);
      banners = banners.filter(banner => {
        const inicioValido = !banner.fecha_inicio || banner.fecha_inicio <= hoy;
        const finValido = !banner.fecha_fin || banner.fecha_fin >= hoy;
        return inicioValido && finValido;
      });
    }
    
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
    
    if (!posicion) return res.status(400).json({ message: 'La posición es obligatoria' });
    
    const imagen = `/uploads/publicidad/${req.file.filename}`;
    const banner = publicidadRepo.create({ 
      imagen, 
      url, 
      fecha_inicio, 
      fecha_fin, 
      descripcion, 
      posicion
    });
    
    await publicidadRepo.save(banner);
    res.status(201).json(banner);
  } catch (error) {
    console.error('Error al crear banner:', error);
    res.status(500).json({ message: 'Error al crear el banner', error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Editar banner
router.put('/banners/:id', uploadPublicidad.single('file'), async (req, res) => {
  try {
    const banner = await publicidadRepo.findOne({ where: { id: parseInt(req.params.id) } });
    if (!banner) return res.status(404).json({ message: 'Banner no encontrado' });
    const { url, fecha_inicio, fecha_fin, descripcion, posicion } = req.body;
    if (posicion) banner.posicion = posicion;
    if (url !== undefined) banner.url = url;
    if (fecha_inicio !== undefined) banner.fecha_inicio = fecha_inicio;
    if (fecha_fin !== undefined) banner.fecha_fin = fecha_fin;
    if (descripcion !== undefined) banner.descripcion = descripcion;
    if (req.file) banner.imagen = `/uploads/publicidad/${req.file.filename}`;
    await publicidadRepo.save(banner);
    res.json(banner);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el banner' });
  }
});

// Eliminar banner
router.delete('/banners/:id', async (req, res) => {
  try {
    const banner = await publicidadRepo.findOne({ where: { id: parseInt(req.params.id) } });
    if (!banner) return res.status(404).json({ message: 'Banner no encontrado' });
    await publicidadRepo.remove(banner);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el banner' });
  }
});

export default router; 