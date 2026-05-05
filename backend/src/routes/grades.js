import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET all grades (admin only)
router.get('/', requireRole('admin'), async (req, res) => {
  try {
    const grades = await prisma.grade.findMany({
      include: { student: true, course: true }
    });
    res.json(grades);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET my grades (student) or grades for my courses (faculty)
router.get('/my-grades', async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let grades;

    if (role === 'student') {
      // Student sees only their grades
      grades = await prisma.grade.findMany({
        where: { studentId: userId },
        include: { course: true }
      });
    } else if (role === 'faculty') {
      // Faculty sees grades for students in their courses
      grades = await prisma.grade.findMany({
        where: {
          course: {
            instructorId: userId
          }
        },
        include: { student: true, course: true }
      });
    } else if (role === 'admin') {
      // Admin sees all grades
      grades = await prisma.grade.findMany({
        include: { student: true, course: true }
      });
    }

    res.json(grades);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// CREATE/UPDATE grade (admin, faculty for their courses)
router.post('/', async (req, res) => {
  try {
    const { studentId, courseId, score } = req.body;

    if (score < 0 || score > 100) {
      return res.status(400).json({ error: 'Score must be between 0 and 100' });
    }

    // Check if user has permission
    if (req.user.role === 'faculty') {
      const course = await prisma.course.findUnique({ where: { id: courseId } });
      if (!course || course.instructorId !== req.user.id) {
        return res.status(403).json({ error: 'Forbidden: You can only grade students in your courses' });
      }
    } else if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Only admin and faculty can grade' });
    }

    let grade = await prisma.grade.findUnique({
      where: { studentId_courseId: { studentId, courseId } }
    });

    if (grade) {
      // Update existing
      grade = await prisma.grade.update({
        where: { studentId_courseId: { studentId, courseId } },
        data: { score },
        include: { student: true, course: true }
      });
    } else {
      // Create new
      grade = await prisma.grade.create({
        data: { studentId, courseId, score },
        include: { student: true, course: true }
      });
    }

    res.status(201).json(grade);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET grades for a specific course (faculty teaching it, admin)
router.get('/course/:courseId', async (req, res) => {
  try {
    const courseId = req.params.courseId;

    // Check permissions
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (req.user.role === 'faculty' && course.instructorId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: You can only view grades for your courses' });
    }

    if (req.user.role === 'student') {
      return res.status(403).json({ error: 'Forbidden: Students cannot view all grades' });
    }

    const grades = await prisma.grade.findMany({
      where: { courseId },
      include: { student: true }
    });

    res.json(grades);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
