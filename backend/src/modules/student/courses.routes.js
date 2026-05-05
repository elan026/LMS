import express from 'express';
import { handleGetEnrolledCourses, handleEnroll } from './courses.controller.js';

const router = express.Router();

router.get('/', handleGetEnrolledCourses);
router.post('/enroll', handleEnroll);

export default router;
