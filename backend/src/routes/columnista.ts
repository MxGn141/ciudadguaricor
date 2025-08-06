import { Router } from 'express';
import { ColumnistaController } from '../controllers/columnistaController';

const router = Router();

router.get('/', ColumnistaController.getAll);
router.get('/:id', ColumnistaController.getById);
router.post('/', ColumnistaController.create);
router.put('/:id', ColumnistaController.update);
router.delete('/:id', ColumnistaController.delete);

export default router;
