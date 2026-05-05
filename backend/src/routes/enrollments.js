import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET all enrollments (admin only)
router.get('/', requireRole('admin'), async (req, res) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      include: { student: true, course: true }
    });
    res.json(enrollments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ENROLL student in course (admin, faculty)
router.post('/', async (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    if (!studentId || !courseId) {
      return res.status(400).json({ error: 'studentId and courseId required' });
    }

    // Check permissions
    if (req.user.role === 'faculty') {
      const course = await prisma.course.findUnique({ where: { id: courseId } });
      if (!course || course.instructorId !== req.user.id) {
        return res.status(403).json({ error: 'Forbidden: You can only enroll students in your courses' });
      }
    } else if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Only admin and faculty can enroll students' });
    }

    const enrollment = await prisma.enrollment.create({
      data: { studentId, courseId },
      include: { student: true, course: true }
    });

    res.status(201).json(enrollment);
  } catch (err) {
    console.error(err);
    if (err.code === 'P2002') {
      return res.status(400).json({ error: 'Student already enrolled in this course' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET enrollments for a course
router.get('/course/:courseId', async (req, res) => {
  try {
    const courseId = req.params.courseId;

    // Check permissions
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (req.user.role === 'faculty' && course.instructorId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: You can only view enrollments for your courses' });
    }

    if (req.user.role === 'student') {
      return res.status(403).json({ error: 'Forbidden: Students cannot view enrollments' });
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { courseId },
      include: { student: true }
    });

    res.json(enrollments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// REMOVE student from course (admin, faculty)
router.delete('/:id', async (req, res) => {
  try {
    const enrollmentId = req.params.id;

    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: { course: true }
    });

    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    // Check permissions
    if (req.user.role === 'faculty' && enrollment.course.instructorId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: You can only remove students from your courses' });
    }

    if (req.user.role !== 'admin' && req.user.role !== 'faculty') {
      return res.status(403).json({ error: 'Forbidden: Only admin and faculty can remove enrollments' });
    }

    await prisma.enrollment.delete({ where: { id: enrollmentId } });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
