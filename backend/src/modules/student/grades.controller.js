import { getMyGrades } from './grades.service.js';

export async function handleGetMyGrades(req, res, next) {
  try {
    const grades = await getMyGrades(req.user.id);
    res.json(grades);
  } catch (err) {
    next(err);
  }
}
