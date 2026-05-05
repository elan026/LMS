import express from 'express';
import { handleLogin, handleVerify } from './auth.controller.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Public endpoints
router.post('/login', handleLogin);

// Protected endpoints
router.post('/verify', verifyToken, handleVerify);

export default router;
