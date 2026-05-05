import express from 'express';
import { handleGetCourseGrades, handleCreateOrUpdateGrade } from './grades.controller.js';

const router = express.Router();

router.get('/course/:courseId', handleGetCourseGrades);
router.post('/', handleCreateOrUpdateGrade);

export default router;
