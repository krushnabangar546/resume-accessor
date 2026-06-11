import { Router } from 'express';
import * as jobController from '../controllers/jobController.js';

const router = Router();

router.post('/', jobController.create);
router.get('/', jobController.getAll);
router.get('/:id', jobController.getOne);
router.put('/:id', jobController.update);
router.delete('/:id', jobController.remove);

export default router;
