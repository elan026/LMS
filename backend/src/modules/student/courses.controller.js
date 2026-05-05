import { getEnrolledCourses, enrollStudentInCourse } from './courses.service.js';

export async function handleGetEnrolledCourses(req, res, next) {
  try {
    const courses = await getEnrolledCourses(req.user.id);
    res.json(courses);
  } catch (err) {
    next(err);
  }
}

export async function handleEnroll(req, res, next) {
  try {
    const enrollment = await enrollStudentInCourse(req.user.id, req.body.courseId);
    res.status(201).json(enrollment);
  } catch (err) {
    next(err);
  }
}
