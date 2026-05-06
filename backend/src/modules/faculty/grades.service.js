import Grade from '../../models/Grade.js';
import Course from '../../models/Course.js';

async function assertCourseOwnership(courseId, facultyId) {
  const course = await Course.findOne({ _id: courseId, instructorId: facultyId });
  if (!course) {
    throw { statusCode: 403, message: 'Forbidden: Course not assigned to you' };
  }
  return course;
}

export async function getCourseGrades(courseId, facultyId) {
  await assertCourseOwnership(courseId, facultyId);
  return Grade.find({ courseId }).populate('studentId', 'name email');
}

function calculateLetter(score) {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

export async function createOrUpdateGrade(data, facultyId) {
  const { studentId, courseId, score } = data;

  if (!studentId || !courseId || score === undefined) {
    throw { statusCode: 400, message: 'studentId, courseId, and score are required' };
  }
  
  const scoreNum = parseFloat(score);
  if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
    throw { statusCode: 400, message: 'Score must be between 0 and 100' };
  }

  await assertCourseOwnership(courseId, facultyId);

  return Grade.findOneAndUpdate(
    { studentId, courseId },
    { $set: { score: scoreNum, letter: calculateLetter(scoreNum) } },
    { new: true, upsert: true, runValidators: true }
  );
}
