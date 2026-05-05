# Backend Development Rules

## Stack

- Node.js
- Express
- Prisma
- JWT
- bcrypt
- dotenv

## Mandatory Structure

All new backend features should follow:

`route -> controller -> service -> prisma`

Use route files for:

- path definitions
- middleware composition
- controller binding

Use controllers for:

- reading params, body, query
- translating service results to HTTP responses
- forwarding errors to the global handler

Use services for:

- permission-aware business rules
- Prisma queries
- validation that belongs to the domain
- response shaping into reusable resource structures

## Do Not Repeat These Legacy Patterns

- Do not create a new `PrismaClient()` inside individual route files.
- Do not place major business logic directly inside `router.get/post/put/delete` callbacks.
- Do not hardcode secrets or environment fallbacks beyond `config/env.js`.
- Do not create duplicate middleware implementations unless replacing an old one deliberately.

## Prisma Rules

1. Use the shared Prisma client from `backend/src/config/db.js`.
2. Keep database field names aligned with `prisma/schema.prisma`.
3. Prefer explicit `select` or `include` to avoid leaking internal fields such as passwords.
4. Never return password hashes.
5. Preserve unique constraints:
   - `User.email`
   - `Course.name`
   - `Enrollment.studentId + courseId`
   - `Grade.studentId + courseId`

## Auth Rules

1. Use the shared JWT helpers in middleware/config space.
2. Auth verification must happen before protected route logic.
3. Role checks are not enough for faculty and student actions:
   - faculty actions must also verify course ownership
   - student actions must also verify self-scope
4. `verify` endpoints should return fresh user data, not only decoded token payload, when possible.

## RBAC Rules

### Admin

- full visibility across users, courses, enrollments, grades
- can create and delete courses
- can manage users

### Faculty

- can see and manage only courses they teach
- can enroll students only into courses they teach
- can read and write grades only for their own courses
- cannot manage users

### Student

- can read only their own courses, grades, and profile
- cannot read full enrollment lists
- cannot mutate course, enrollment, grade, or user data

## API Contract Rules

Use one canonical endpoint per use case.

Preferred patterns based on current server:

- `POST /api/auth/login`
- `POST /api/auth/verify`
- `GET /api/courses`
- `GET /api/courses/my-courses`
- `GET /api/grades/my-grades`
- `GET /api/grades/course/:courseId`
- `POST /api/grades`
- `GET /api/enrollments/course/:courseId`
- `POST /api/enrollments`
- `GET /api/profile/me`
- `PUT /api/profile/me`

If admin user management is exposed, mount it explicitly and keep it under an admin namespace, for example:

- `GET /api/admin/users`
- `GET /api/admin/users/:id`
- `DELETE /api/admin/users/:id`

## Validation Rules

Validate before persistence:

- required fields
- numeric ranges such as `score` from 0 to 100
- ownership and role compatibility
- duplicates and uniqueness conflicts

Translate validation failures into stable JSON error responses.

## Error Handling Rules

1. Route handlers should prefer `next(err)` over inline duplicated 500 responses.
2. Use the shared `errorHandler` middleware as the final formatter.
3. Throw structured service errors with `statusCode` and `message`.
4. Keep production errors safe and concise.

## Config Rules

1. Read environment through `backend/src/config/env.js`.
2. Keep allowed origins centralized.
3. Validate required env vars during startup.
4. Do not scatter literal backend URLs or secrets through the codebase.

## Migration And Schema Rules

The repo currently shows signs of mixed persistence assumptions. Agents must treat `prisma/schema.prisma` as the source of truth and reconcile any conflicting docs or generated artifacts before adding new persistence logic.

That means:

- check whether schema provider, migration files, and runtime database URL agree
- do not add schema changes based on outdated assumptions
- keep seed data aligned with the live schema field names
