import Enrollment from '../../models/Enrollment.js';
import Course from '../../models/Course.js';

export async function getCourseEnrollments(courseId, facultyId) {
  const course = await Course.findOne({ _id: courseId, instructorId: facultyId });
  if (!course) {
    throw { statusCode: 403, message: 'Forbidden: Course not assigned to you' };
  }
  return Enrollment.find({ courseId }).populate('studentId', 'name email');
}
