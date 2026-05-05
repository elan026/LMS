# System Architecture Rules

## Topology

This repository is a shared LMS platform with four primary applications:

- `backend`: common API server
- `admin-app`: admin console
- `faculty-app`: faculty workspace
- `student-app`: student portal

All three frontends authenticate against the same backend and consume the same domain model.

## Core Architecture Principle

Build the system as one domain with role-specific experiences, not as three unrelated products.

That means:

- one shared source of truth for auth
- one shared source of truth for user/course/enrollment/grade data
- one shared permission model
- different UI shells and workflows per role

## Backend Responsibilities

The backend owns:

- authentication and token issuance
- permission enforcement
- persistence through Prisma
- domain validation
- response shaping

The backend must not rely on frontend role checks for security.

## Frontend Responsibilities

Each frontend owns:

- role-appropriate navigation
- session bootstrap and logout handling
- rendering role-relevant data from the shared API
- local view state and interaction state

Frontends must not re-implement business permission logic as the primary enforcement layer. They may mirror it for UX only.

## Approved Layering

### Backend

- `routes`: HTTP wiring only
- `controller`: request parsing and response selection
- `service`: business logic and permission-aware operations
- `config/db`: shared infrastructure access
- `middleware`: auth, RBAC, error translation, cross-cutting concerns

### Frontend

- `api`: endpoint wrappers only
- `store`: auth/session state
- `components`: reusable UI blocks
- `pages`: route-level workflows
- `lib`: client utilities and shared helpers

## Canonical Integration Flow

1. User logs in through `/api/auth/login`.
2. Backend returns `token` and minimal `user` metadata.
3. Frontend stores `token` and `user` in local storage and zustand state.
4. Protected requests attach `Authorization: Bearer <token>`.
5. Frontend verifies active session through `/api/auth/verify`.
6. Backend authorizes access using JWT + role checks + ownership checks.

## Data Model

Current core entities:

- `User`
- `Course`
- `Enrollment`
- `Grade`

Current relationships:

- one faculty user can instruct many courses
- one student can enroll in many courses
- one course can have many enrollments
- one course can have many grades
- one student can have one grade per course

## Contract Stability Rules

When changing the system:

1. Keep entity naming stable across backend and all clients.
2. Keep route naming stable across backend and all clients.
3. Keep role semantics stable across backend and all clients.
4. Update all affected apps in one change when a shared contract changes.

## Canonical Naming Direction

Use these domain names consistently:

- `course.name`
- `course.description`
- `course.instructorId`
- `course.instructor`
- `grade.score`
- `student`
- `faculty` only as a user role label, not as a course relation field

Avoid introducing parallel aliases like `title` or `faculty` for the same persisted fields unless there is a deliberate adapter layer.

## Route Design Direction

Use resource-first endpoints with explicit role-aware behavior:

- `/api/auth/...`
- `/api/courses/...`
- `/api/grades/...`
- `/api/enrollments/...`
- `/api/profile/...`
- `/api/admin/users/...` for admin-only user management when mounted

If role-prefixed aliases exist, they must not invent different payloads or resource names.

## Architecture Debt Agents Must Notice

Agents should recognize and gradually resolve these issues:

- duplicated auth route implementation
- mixed route-level business logic vs service-layer business logic
- inconsistent endpoint names across clients
- frontend data assumptions that do not match Prisma schema field names
- backend modules present on disk but not always wired into the live server

Do not add new work on top of these inconsistencies without first aligning the contract you depend on.
