import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { verifyToken } from './middleware/auth.js';
import { requireRole } from './middleware/rbac.js';

// Shared routes
import authRouter from './shared/auth.routes.js';
import profileRouter from './shared/profile.routes.js';

// Admin module
import adminUsersRouter from './modules/admin/users.routes.js';
import adminCoursesRouter from './modules/admin/courses.routes.js';
import adminGradesRouter from './modules/admin/grades.routes.js';
import adminReportsRouter from './modules/admin/reports.routes.js';

// Student module
import studentCoursesRouter from './modules/student/courses.routes.js';
import studentGradesRouter from './modules/student/grades.routes.js';

// Faculty module
import facultyCoursesRouter from './modules/faculty/courses.routes.js';
import facultyGradesRouter from './modules/faculty/grades.routes.js';
import facultyEnrollmentsRouter from './modules/faculty/enrollments.routes.js';
import facultyAssignmentsRouter from './modules/faculty/assignments.routes.js';

const app = express();

app.use(cors({ origin: config.corsOrigins, credentials: true }));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Public routes
app.use('/api/auth', authRouter);
app.use('/api/me', profileRouter);

// Admin routes
const adminRouter = express.Router();
adminRouter.use('/users', adminUsersRouter);
adminRouter.use('/courses', adminCoursesRouter);
adminRouter.use('/grades', adminGradesRouter);
adminRouter.use('/reports', adminReportsRouter);
app.use('/api/admin', verifyToken, requireRole('admin'), adminRouter);

// Student routes
const studentRouter = express.Router();
studentRouter.use('/courses', studentCoursesRouter);
studentRouter.use('/grades', studentGradesRouter);
app.use('/api/student', verifyToken, requireRole('student'), studentRouter);

// Faculty routes
const facultyRouter = express.Router();
facultyRouter.use('/courses', facultyCoursesRouter);
facultyRouter.use('/grades', facultyGradesRouter);
facultyRouter.use('/enrollments', facultyEnrollmentsRouter);
facultyRouter.use('/assignments', facultyAssignmentsRouter);
app.use('/api/faculty', verifyToken, requireRole('faculty'), facultyRouter);

// Central error handler — must be last
app.use(errorHandler);

export default app;
