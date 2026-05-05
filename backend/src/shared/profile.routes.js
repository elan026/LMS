import express from 'express';
import { handleGetMe, handleUpdateMe } from './profile.controller.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', handleGetMe);
router.put('/', handleUpdateMe);

export default router;
