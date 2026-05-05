# Agent Rules For This LMS

This folder defines the project-specific rules an agent must follow when developing inside this repository.

It is based on the current codebase in `backend`, `admin-app`, `faculty-app`, and `student-app`, not on a generic LMS template.

## Start Here

If you are onboarding a new agent to this repository, first give it the prompt in `INITIAL_AGENT_PROMPT.md`, then have it read this folder before making any code or architecture decisions.

## System Summary

- The repo is a multi-app LMS workspace.
- `backend` is a shared Express + Prisma API used by all clients.
- `admin-app`, `faculty-app`, and `student-app` are separate Vite + React + Zustand frontends.
- Authentication is JWT-based and all clients point to the same `VITE_API_URL`.
- Authorization is role-based and must be enforced on both route groups and resource-level logic.

## Priority Rules

1. Treat this repo as one system with four deployable parts, not as isolated apps.
2. Prefer shared contracts over app-specific shortcuts.
3. Do not introduce new endpoint names, payload shapes, or field names unless all affected apps are updated together.
4. Extend the controller/service/data-access separation already present in `backend/src/shared` and `backend/src/modules`; do not add more business logic directly inside route files.
5. Use one canonical API contract for each resource and mark mismatched legacy patterns as deprecated instead of expanding them.
6. Keep role boundaries strict:
   - Admin manages users, courses, enrollments, and full-grade visibility.
   - Faculty manages only courses they teach and grades within those courses.
   - Students can only read their own profile, courses, and grades.
7. Preserve role-specific UI identity:
   - Admin: operations, oversight, management.
   - Faculty: teaching workflow, grading workflow.
   - Student: self-service, clarity, progress visibility.
8. Prefer evolving shared utilities over duplicating auth stores, API clients, or endpoint wrappers across apps.

## Current Canonical Direction

The current repo contains mixed patterns. Agents should follow this direction when adding or refactoring code:

- Backend:
  - Canonical structure is `routes -> controller -> service -> prisma/config`.
  - Shared middleware from `backend/src/middleware` and shared Prisma client from `backend/src/config/db.js`.
  - Centralized config from `backend/src/config/env.js`.
- API design:
  - Shared resources live under `/api/...`.
  - Role-scoped aliases such as `/api/admin/...` are allowed only when they point to the same underlying contract.
  - Endpoint names must be consistent across all clients.
- Frontend:
  - Use a single API client abstraction per app.
  - Keep auth bootstrap predictable: `init()` local state first, then `verify()`.
  - Route protection must enforce the expected role for each app.
- UI:
  - Tailwind utility + component-class pattern is acceptable.
  - Reuse loading, empty, error, card, table, and form patterns.
  - Keep each app visually distinct but structurally consistent.

## Known Drift To Avoid Expanding

- Duplicate backend patterns exist:
  - direct route logic in `backend/src/routes`
  - controller/service structure in `backend/src/shared` and `backend/src/modules`
- Endpoint naming drift exists:
  - `/courses/my-courses` vs `/courses/my`
  - `/grades/my-grades` vs `/grades/my`
- Resource shape drift exists:
  - `course.name` vs `course.title`
  - `course.instructor` vs `course.faculty`
- Some frontend pages still use demo or simulated calls instead of stable feature flows.
- Some backend modules exist but are not clearly mounted in `server.js`.

Agents must reduce this drift, not normalize it.

## File Guide

- `INITIAL_AGENT_PROMPT.md`: copy-paste startup prompt for any agent
- `system-architecture.md`: full system topology and integration rules
- `backend-rules.md`: backend coding and API rules
- `frontend-rules.md`: frontend coding and integration rules
- `ui-design-rules.md`: UI/UX and design system guidance
- `domain-logic-rules.md`: LMS business rules and permission logic
