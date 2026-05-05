import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const facultyPassword = await bcrypt.hash('faculty123', 10);
  const studentPassword = await bcrypt.hash('student123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@lms.com' },
    update: {},
    create: {
      email: 'admin@lms.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'admin'
    }
  });

  const faculty = await prisma.user.upsert({
    where: { email: 'faculty@lms.com' },
    update: {},
    create: {
      email: 'faculty@lms.com',
      name: 'Faculty User',
      password: facultyPassword,
      role: 'faculty'
    }
  });

  const student = await prisma.user.upsert({
    where: { email: 'student@lms.com' },
    update: {},
    create: {
      email: 'student@lms.com',
      name: 'Student User',
      password: studentPassword,
      role: 'student'
    }
  });

  console.log('Users created:', { admin, faculty, student });

  // Create courses
  const course1 = await prisma.course.upsert({
    where: { name: 'Introduction to Computer Science' },
    update: {},
    create: {
      name: 'Introduction to Computer Science',
      description: 'Learn the fundamentals of computer science',
      instructorId: faculty.id
    }
  });

  const course2 = await prisma.course.upsert({
    where: { name: 'Data Structures' },
    update: {},
    create: {
      name: 'Data Structures',
      description: 'Master data structures and algorithms',
      instructorId: faculty.id
    }
  });

  console.log('Courses created:', { course1, course2 });

  // Create enrollments
  const enrollment1 = await prisma.enrollment.upsert({
    where: { studentId_courseId: { studentId: student.id, courseId: course1.id } },
    update: {},
    create: {
      studentId: student.id,
      courseId: course1.id
    }
  });

  const enrollment2 = await prisma.enrollment.upsert({
    where: { studentId_courseId: { studentId: student.id, courseId: course2.id } },
    update: {},
    create: {
      studentId: student.id,
      courseId: course2.id
    }
  });

  console.log('Enrollments created:', { enrollment1, enrollment2 });

  // Create grades
  const grade1 = await prisma.grade.upsert({
    where: { studentId_courseId: { studentId: student.id, courseId: course1.id } },
    update: { score: 85 },
    create: {
      studentId: student.id,
      courseId: course1.id,
      score: 85
    }
  });

  const grade2 = await prisma.grade.upsert({
    where: { studentId_courseId: { studentId: student.id, courseId: course2.id } },
    update: { score: 92 },
    create: {
      studentId: student.id,
      courseId: course2.id,
      score: 92
    }
  });

  console.log('Grades created:', { grade1, grade2 });

  console.log('✅ Database seeded successfully!');
  console.log('\n=== SEED DATA ===');
  console.log('Users:');
  console.log('  admin@lms.com / admin123');
  console.log('  faculty@lms.com / faculty123');
  console.log('  student@lms.com / student123');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
