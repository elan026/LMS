import Course from '../../models/Course.js';

export async function getMyCourses(facultyId) {
  return Course.find({ instructorId: facultyId });
}
