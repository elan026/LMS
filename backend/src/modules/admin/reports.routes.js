import express from 'express';
import { getEnrollmentSummary, getGradeSummary } from './reports.service.js';

const router = express.Router();

router.get('/enrollments', async (req, res, next) => {
  try {
    const data = await getEnrollmentSummary();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.get('/grades', async (req, res, next) => {
  try {
    const data = await getGradeSummary();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
