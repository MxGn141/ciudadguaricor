import { Router } from 'express';
import { getPrismaClient } from '../config/prisma';
import { upload } from '../middleware/upload';

const router = Router();

// Subir imagen
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se subió ningún archivo' });
    }
    
    const prisma = getPrismaClient();
    
    // Cloudinary devuelve la URL completa en req.file.path
    const url = req.file.path; // URL completa de Cloudinary
    const tipo = 'imagen';
    const descripcion = req.body.descripcion || null;
    
    const media = await prisma.media.create({
      data: { 
        url, 
        tipo: tipo as any, 
        descripcion 
      }
    });
    
    res.status(201).json(media);
  } catch (error) {
    console.error('Error al subir imagen:', error);
    res.status(500).json({ message: 'Error al subir la imagen' });
  }
});

export default router; 