import { Router } from 'express';
import { EditorialController } from '../controllers/editorialController';

const router = Router();

router.get('/', EditorialController.getAll);
router.get('/:id', EditorialController.getById);
router.post('/', EditorialController.create);
router.put('/:id', EditorialController.update);
router.delete('/:id', EditorialController.delete);

export default router;
