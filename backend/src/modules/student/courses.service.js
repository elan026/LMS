import Enrollment from '../../models/Enrollment.js';

export async function getEnrolledCourses(studentId) {
  return Enrollment.find({ studentId }).populate({
    path: 'courseId',
    select: 'title status instructorId',
    populate: { path: 'instructorId', select: 'name email' },
  });
}

export async function enrollStudentInCourse(studentId, courseId) {
  if (!courseId) {
    throw { statusCode: 400, message: 'courseId is required' };
  }

  const exists = await Enrollment.findOne({ studentId, courseId });
  if (exists) {
    throw { statusCode: 409, message: 'Already enrolled in this course' };
  }

  return Enrollment.create({ studentId, courseId });
}
