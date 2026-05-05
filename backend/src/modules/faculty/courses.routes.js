import express from 'express';
import { handleGetMyCourses } from './courses.controller.js';

const router = express.Router();

router.get('/', handleGetMyCourses);

export default router;
