import express from 'express';
import { upload } from '../middleware/upload.js';
import { uploadAndAnalyze } from '../controllers/fileController.js';

const router = express.Router();

router.post('/upload', upload.single('file'), uploadAndAnalyze);

export default router;