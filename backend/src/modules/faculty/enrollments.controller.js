import { getCourseEnrollments } from './enrollments.service.js';

export async function handleGetCourseEnrollments(req, res, next) {
  try {
    const enrollments = await getCourseEnrollments(req.params.courseId, req.user.id);
    res.json(enrollments);
  } catch (err) {
    next(err);
  }
}
