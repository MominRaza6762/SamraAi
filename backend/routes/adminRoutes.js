import express from 'express';
import { authenticateAdmin } from '../middleware/auth.js';
import { login, getAllChats, getAllFiles, getDashboardStats } from '../controllers/adminController.js';

const router = express.Router();

router.post('/login', authenticateAdmin, login);
router.get('/chats', getAllChats);
router.get('/files', getAllFiles);
router.get('/stats', getDashboardStats);

export default router;