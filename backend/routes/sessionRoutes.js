import express from 'express';
import { getSessions, newSession } from '../controllers/sessionController.js';

const router = express.Router();

router.get('/all', getSessions);
router.post('/create', newSession);

export default router;