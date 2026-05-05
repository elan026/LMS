import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from './courses.service.js';

export async function handleGetAllCourses(req, res, next) {
  try {
    const courses = await getAllCourses();
    res.json(courses);
  } catch (err) {
    next(err);
  }
}

export async function handleGetCourse(req, res, next) {
  try {
    const course = await getCourseById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (err) {
    next(err);
  }
}

export async function handleCreateCourse(req, res, next) {
  try {
    const course = await createCourse(req.body);
    res.status(201).json(course);
  } catch (err) {
    next(err);
  }
}

export async function handleUpdateCourse(req, res, next) {
  try {
    const course = await updateCourse(req.params.id, req.body);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (err) {
    next(err);
  }
}

export async function handleDeleteCourse(req, res, next) {
  try {
    await deleteCourse(req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
