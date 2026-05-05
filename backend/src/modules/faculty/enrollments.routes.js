import express from 'express';
import { handleGetCourseEnrollments } from './enrollments.controller.js';

const router = express.Router();

router.get('/course/:courseId', handleGetCourseEnrollments);

export default router;
