import { Router } from 'express';
import { OpinionController } from '../controllers/opinionController';

const router = Router();

router.get('/', OpinionController.getAll);
router.get('/:id', OpinionController.getById);
router.post('/', OpinionController.create);
router.put('/:id', OpinionController.update);
router.delete('/:id', OpinionController.delete);

export default router;
