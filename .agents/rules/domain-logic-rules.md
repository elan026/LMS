# Domain Logic Rules

## Domain Overview

This system models a learning management system with three operational roles:

- `admin`
- `faculty`
- `student`

The domain is centered around users, courses, enrollments, and grades.

## User Rules

1. Every user has one primary role.
2. Roles drive both visible features and backend authorization.
3. Passwords must always be stored hashed.
4. User resources returned to clients must exclude password hashes.

## Course Rules

1. A course belongs to one instructor.
2. Only admins can create or delete courses unless the product direction is intentionally changed everywhere.
3. Faculty may edit only the courses they teach.
4. Students cannot mutate course data.

## Enrollment Rules

1. An enrollment connects one student to one course.
2. Duplicate enrollments for the same student and course are forbidden.
3. Admins can enroll or remove any student.
4. Faculty can enroll or remove students only in courses they teach.
5. Students cannot manage enrollments.

## Grade Rules

1. A grade connects one student to one course.
2. Only one grade record per student-course pair is allowed.
3. Grade score range is `0` to `100`.
4. Admins can view all grades.
5. Faculty can view and update grades only for their own courses.
6. Students can view only their own grades.
7. Students cannot create or update grades.

## Profile Rules

1. Every authenticated user can read their own profile.
2. Every authenticated user can update only safe editable fields in their own profile.
3. Profile updates must not allow silent privilege escalation.

## Permission Rules

Authorization is two-step:

1. role-level access
2. ownership or scope validation

Examples:

- faculty role alone does not allow editing every course
- student role alone does not allow reading every grade
- admin role may bypass ownership checks where the product intends full oversight

## Response Shape Rules

Return data in ways that support the actual workflows:

- course lists should include instructor context when useful
- course detail can include enrollments and grades where needed
- grade lists for faculty should include student context
- student-grade lists should include course context

Never expose extra sensitive fields just because Prisma can include them.

## Logic Rules For Future Features

If adding assignments, attendance, announcements, or schedules:

1. attach them to the same role model
2. define ownership explicitly
3. keep student access self-scoped
4. keep faculty mutations course-scoped
5. keep admin visibility organization-wide unless intentionally narrowed

## Canonical Agent Behavior

When implementing any feature, an agent should ask:

1. Which role owns this action?
2. Which entity is the source of truth?
3. Is this action global, course-scoped, or self-scoped?
4. Does the API contract already exist?
5. Will this change break another app that depends on the same resource shape?

If any answer is unclear, align the contract before writing more feature code.
