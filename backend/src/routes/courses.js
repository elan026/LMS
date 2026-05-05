import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET all courses (admin, faculty, student can view)
router.get('/', async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: { instructor: true }
    });
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET courses for current user (based on role)
router.get('/my-courses', async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let courses;

    if (role === 'faculty') {
      // Faculty sees courses they teach
      courses = await prisma.course.findMany({
        where: { instructorId: userId },
        include: { instructor: true }
      });
    } else if (role === 'student') {
      // Student sees enrolled courses
      courses = await prisma.course.findMany({
        where: {
          enrollments: {
            some: { studentId: userId }
          }
        },
        include: { instructor: true }
      });
    } else if (role === 'admin') {
      // Admin sees all courses
      courses = await prisma.course.findMany({
        include: { instructor: true }
      });
    }

    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.id },
      include: {
        instructor: true,
        enrollments: {
          include: { student: true }
        },
        grades: true
      }
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// CREATE course (admin only)
router.post('/', requireRole('admin'), async (req, res) => {
  try {
    const { name, description, instructorId } = req.body;

    if (!name || !instructorId) {
      return res.status(400).json({ error: 'Name and instructorId required' });
    }

    const course = await prisma.course.create({
      data: { name, description, instructorId },
      include: { instructor: true }
    });

    res.status(201).json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// UPDATE course (admin, faculty if they teach it)
router.put('/:id', async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await prisma.course.findUnique({ where: { id: courseId } });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check permissions
    if (req.user.role === 'faculty' && course.instructorId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: You can only edit courses you teach' });
    }

    if (req.user.role === 'student') {
      return res.status(403).json({ error: 'Forbidden: Students cannot edit courses' });
    }

    const updated = await prisma.course.update({
      where: { id: courseId },
      data: req.body,
      include: { instructor: true }
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE course (admin only)
router.delete('/:id', requireRole('admin'), async (req, res) => {
  try {
    const courseId = req.params.id;

    await prisma.course.delete({ where: { id: courseId } });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
