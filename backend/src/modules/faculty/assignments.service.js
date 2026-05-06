import Assignment from '../../models/Assignment.js';
import Course from '../../models/Course.js';

async function assertCourseOwnership(courseId, facultyId) {
  const course = await Course.findOne({ _id: courseId, instructorId: facultyId });
  if (!course) {
    throw { statusCode: 403, message: 'Forbidden: Course not assigned to you' };
  }
  return course;
}

export async function getAssignmentsForCourse(courseId, facultyId) {
  await assertCourseOwnership(courseId, facultyId);
  return Assignment.find({ courseId }).sort({ dueDate: 1 });
}

export async function createAssignment(data, facultyId) {
  const { courseId, title, dueDate } = data;

  if (!courseId || !title || !dueDate) {
    throw { statusCode: 400, message: 'courseId, title, and dueDate are required' };
  }

  await assertCourseOwnership(courseId, facultyId);

  return Assignment.create({ courseId, title, dueDate });
}
