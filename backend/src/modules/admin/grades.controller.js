import { getAllGrades } from './grades.service.js';

export async function handleGetAllGrades(req, res, next) {
  try {
    const grades = await getAllGrades();
    res.json(grades);
  } catch (err) {
    next(err);
  }
}
