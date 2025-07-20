import { Router } from 'express';

const router = Router();

// TODO: Implementar rutas de contenido
router.get('/', (req, res) => {
  res.json({ message: 'Rutas de contenido' });
});

export default router; 