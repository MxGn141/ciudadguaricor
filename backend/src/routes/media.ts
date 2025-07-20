import { Router } from 'express';
import { AppDataSource } from '../config/database';
import { Media } from '../models/Media';
import { upload } from '../middleware/upload';

const router = Router();
const mediaRepo = AppDataSource.getRepository(Media);

// Subir imagen
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se subió ningún archivo' });
    }
    // Guardar en la base de datos
    const url = `/uploads/noticias/${req.file.filename}`;
    const tipo = 'imagen'; // Solo imágenes por ahora
    const descripcion = req.body.descripcion || null;
    const media = mediaRepo.create({ url, tipo, descripcion });
    await mediaRepo.save(media);
    res.status(201).json(media);
  } catch (error) {
    res.status(500).json({ message: 'Error al subir la imagen' });
  }
});

export default router; 