import Course from '../../models/Course.js';

export async function getAllCourses() {
  return Course.find().populate('facultyId', 'name email');
}

export async function getCourseById(courseId) {
  return Course.findById(courseId).populate('facultyId', 'name email');
}

export async function createCourse(data) {
  const { title, facultyId, status } = data;

  if (!title || !facultyId) {
    throw { statusCode: 400, message: 'title and facultyId are required' };
  }

  return Course.create({ title, facultyId, status });
}

export async function updateCourse(courseId, data) {
  const allowedFields = ['title', 'facultyId', 'status'];
  const updateData = {};

  for (const field of allowedFields) {
    if (data[field] !== undefined) updateData[field] = data[field];
  }

  return Course.findByIdAndUpdate(
    courseId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).populate('facultyId', 'name email');
}

export async function deleteCourse(courseId) {
  return Course.findByIdAndDelete(courseId);
}
