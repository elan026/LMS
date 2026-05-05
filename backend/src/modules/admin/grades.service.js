import Grade from '../../models/Grade.js';

export async function getAllGrades() {
  return Grade.find()
    .populate('studentId', 'name email')
    .populate('courseId', 'title')
    .sort({ createdAt: -1 });
}
