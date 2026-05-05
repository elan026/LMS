import { getMyCourses } from './courses.service.js';

export async function handleGetMyCourses(req, res, next) {
  try {
    const courses = await getMyCourses(req.user.id);
    res.json(courses);
  } catch (err) {
    next(err);
  }
}
