# Backend Architecture - LMS Common Server

## Overview
This backend is implemented as a single shared API server for all three clients:
- `admin-app`
- `faculty-app`
- `student-app`

Each client authenticates with JWT and calls the same server URL via `VITE_API_URL`.

## MongoDB Persistence
The backend is configured to use MongoDB via Prisma:
- `backend/.env` contains `DATABASE_URL="mongodb://localhost:27017/lms"`
- `backend/prisma/schema.prisma` uses `provider = "mongodb"`

## Auth Flow
1. Client sends credentials to `/api/auth/login`.
2. Server validates the user and returns a JWT plus user metadata.
3. Client stores `token` and `user` in `localStorage`.
4. `apiClient` adds the `Authorization: Bearer <token>` header automatically.
5. Client verifies active sessions by calling `/api/auth/verify`.

## Role-based access and explicit route groups
The backend now exposes both shared endpoints and explicit role service groups.

### Shared protected routes
- `/api/courses`
- `/api/grades`
- `/api/enrollments`

These routes use `authMiddleware` to verify JWTs.

### Explicit role route groups
The server also mounts group prefixes for architecture clarity:
- `/api/admin/*` - admin-only access via `requireRole('admin')`
- `/api/faculty/*` - faculty or admin access via `requireRole('faculty', 'admin')`
- `/api/student/*` - student or admin access via `requireRole('student', 'admin')`

The route modules themselves also enforce finer-grained permissions on individual endpoints.

## Client-side API URL standardization
All three React clients now resolve the backend as:
- `import.meta.env.VITE_API_URL || 'http://localhost:3000/api'`

This ensures consistent behavior across development environments and supports a single common backend server.

## Notes
- `admin-app/.env` and `student-app/.env` now point to the shared backend URL.
- `faculty-app/.env` already contains the same `VITE_API_URL` setting.
- The architecture is intentionally compatible with both the existing root-level `/api/*` endpoints and the explicit role-group prefixes.
