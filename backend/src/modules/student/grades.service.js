import Grade from '../../models/Grade.js';

export async function getMyGrades(studentId) {
  return Grade.find({ studentId }).populate('courseId', 'title status');
}
