import Course from '../../models/Course.js';

export async function getAllCourses() {
  return Course.find().populate('instructorId', 'name email');
}

export async function getCourseById(courseId) {
  return Course.findById(courseId).populate('instructorId', 'name email');
}

export async function createCourse(data) {
  const { title, instructorId, status, semester, year } = data;

  if (!title || !instructorId || !semester || !year) {
    throw { statusCode: 400, message: 'title, instructorId, semester, and year are required' };
  }

  return Course.create({ title, instructorId, status, semester, year });
}

export async function updateCourse(courseId, data) {
  const allowedFields = ['title', 'instructorId', 'status', 'semester', 'year'];
  const updateData = {};

  for (const field of allowedFields) {
    if (data[field] !== undefined) updateData[field] = data[field];
  }

  return Course.findByIdAndUpdate(
    courseId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).populate('instructorId', 'name email');
}

export async function deleteCourse(courseId) {
  return Course.findByIdAndDelete(courseId);
}
