import express from 'express';
import { getAssignmentsForCourse, createAssignment } from './assignments.service.js';

const router = express.Router();

router.get('/course/:courseId', async (req, res, next) => {
  try {
    const assignments = await getAssignmentsForCourse(req.params.courseId, req.user.id);
    res.json(assignments);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const assignment = await createAssignment(req.body, req.user.id);
    res.status(201).json(assignment);
  } catch (err) {
    next(err);
  }
});

export default router;
