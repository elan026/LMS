import express from 'express';
import { handleGetAllGrades } from './grades.controller.js';

const router = express.Router();

router.get('/', handleGetAllGrades);

export default router;
