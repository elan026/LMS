import express from 'express';
import {
  handleGetAllCourses,
  handleGetCourse,
  handleCreateCourse,
  handleUpdateCourse,
  handleDeleteCourse,
} from './courses.controller.js';

const router = express.Router();

router.get('/', handleGetAllCourses);
router.get('/:id', handleGetCourse);
router.post('/', handleCreateCourse);
router.put('/:id', handleUpdateCourse);
router.delete('/:id', handleDeleteCourse);

export default router;
