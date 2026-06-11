import { Router } from 'express';
import * as assessmentController from '../controllers/assessmentController.js';

const router = Router();

router.get('/stats', assessmentController.getDashboardStats);
router.post('/evaluate/:resumeId', assessmentController.evaluate);
router.get('/', assessmentController.getAll);
router.get('/resume/:resumeId', assessmentController.getByResumeId);

export default router;
