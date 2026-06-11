import { Router } from 'express';
import multer from 'multer';
import * as resumeController from '../controllers/resumeController.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files are allowed'), false);
  }
});

router.post('/upload', upload.single('resume'), resumeController.upload);
router.post('/:id/parse', resumeController.parseResume);
router.get('/', resumeController.getAll);
router.get('/:id', resumeController.getOne);
router.delete('/:id', resumeController.remove);

export default router;
