import { getCourseGrades, createOrUpdateGrade } from './grades.service.js';

export async function handleGetCourseGrades(req, res, next) {
  try {
    const grades = await getCourseGrades(req.params.courseId, req.user.id);
    res.json(grades);
  } catch (err) {
    next(err);
  }
}

export async function handleCreateOrUpdateGrade(req, res, next) {
  try {
    const grade = await createOrUpdateGrade(req.body, req.user.id);
    res.status(201).json(grade);
  } catch (err) {
    next(err);
  }
}
