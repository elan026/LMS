import express from 'express';
import { handleGetMyGrades } from './grades.controller.js';

const router = express.Router();

router.get('/', handleGetMyGrades);

export default router;
