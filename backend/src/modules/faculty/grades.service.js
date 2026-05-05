import Grade from '../../models/Grade.js';
import Course from '../../models/Course.js';

async function assertCourseOwnership(courseId, facultyId) {
  const course = await Course.findOne({ _id: courseId, facultyId });
  if (!course) {
    throw { statusCode: 403, message: 'Forbidden: Course not assigned to you' };
  }
  return course;
}

export async function getCourseGrades(courseId, facultyId) {
  await assertCourseOwnership(courseId, facultyId);
  return Grade.find({ courseId }).populate('studentId', 'name email');
}

export async function createOrUpdateGrade(data, facultyId) {
  const { studentId, courseId, score } = data;

  if (!studentId || !courseId || score === undefined) {
    throw { statusCode: 400, message: 'studentId, courseId, and score are required' };
  }
  if (score < 0 || score > 100) {
    throw { statusCode: 400, message: 'Score must be between 0 and 100' };
  }

  await assertCourseOwnership(courseId, facultyId);

  return Grade.findOneAndUpdate(
    { studentId, courseId },
    { $set: { score, gradedById: facultyId } },
    { new: true, upsert: true, runValidators: true }
  );
}
