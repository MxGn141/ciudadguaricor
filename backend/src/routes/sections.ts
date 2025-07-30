import { Router } from 'express';
import { getPrismaClient } from '../config/prisma';

const router = Router();

// Obtener todas las secciones
router.get('/', async (req, res) => {
  try {
    const prisma = getPrismaClient();
    const secciones = await prisma.seccion.findMany();
    res.json(secciones);
  } catch (error) {
    console.error('Error al obtener secciones:', error);
    res.status(500).json({ message: 'Error al obtener las secciones' });
  }
});

export default router; 