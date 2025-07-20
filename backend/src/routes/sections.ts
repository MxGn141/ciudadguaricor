import { Router } from 'express';
import { AppDataSource } from '../config/database';
import { Section } from '../models/Section';

const router = Router();
const sectionRepo = AppDataSource.getRepository(Section);

// Obtener todas las secciones
router.get('/', async (req, res) => {
  try {
    const secciones = await sectionRepo.find();
    res.json(secciones);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las secciones' });
  }
});

export default router; 