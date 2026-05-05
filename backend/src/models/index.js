// MongoDB Models (Prisma schema is in backend/prisma/schema.prisma)
// These are reference models for the service layers

export const UserModel = {
  fields: {
    id: 'ObjectId (MongoDB auto-generated)',
    email: 'String (unique)',
    password: 'String (hashed)',
    name: 'String',
    role: 'String (admin, faculty, student)',
  },
};

export const CourseModel = {
  fields: {
    id: 'ObjectId',
    name: 'String',
    description: 'String',
    instructorId: 'ObjectId (references User)',
  },
};

export const EnrollmentModel = {
  fields: {
    id: 'ObjectId',
    studentId: 'ObjectId (references User)',
    courseId: 'ObjectId (references Course)',
    enrolledAt: 'DateTime',
  },
};

export const GradeModel = {
  fields: {
    id: 'ObjectId',
    studentId: 'ObjectId (references User)',
    courseId: 'ObjectId (references Course)',
    score: 'Number (0-100)',
    createdAt: 'DateTime',
    updatedAt: 'DateTime',
  },
};

export const AssignmentModel = {
  fields: {
    id: 'ObjectId',
    courseId: 'ObjectId (references Course)',
    title: 'String',
    dueDate: 'DateTime',
    description: 'String',
  },
};
