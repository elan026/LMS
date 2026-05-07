# Contributing to Admin App

This document outlines the development standards and collaborative workflow for the Admin App team.

## 1. Team Structure (5 Members)

| Role | Primary Responsibilities |
| :--- | :--- |
| **Team Lead** | Architectural alignment, PR reviews, API contract validation with Backend. |
| **UI/UX Core** | Shared components (`/src/components`), Tailwind consistency, layout shells. |
| **State Manager** | Zustand stores, API client configuration, Auth bootstrap logic. |
| **Feature Dev A** | User Management, Role Assignments, System-wide Audit logs. |
| **Feature Dev B** | Course Management, Global Enrollment oversight, Grade visibility. |

## 2. Development Workflow

1.  **Branching**: Use `feat/admin/[feature-name]` for new work and `fix/admin/[bug-name]` for patches.
2.  **API Contracts**: 
    - Always use the canonical field names defined in `backend/prisma/schema.prisma`.
    - Use `course.name`, not `title`.
    - Use `course.instructorId`, not `facultyId`.
3.  **Code Style**:
    - Functional components with Hooks.
    - Tailind CSS for all styling.
    - Absolute imports preferred (e.g., `@/components/...`).

## 3. Collaborative Rules

- **Don't Duplicate**: If you need a utility that already exists in `src/utils` or `src/api`, use it. Do not create app-specific versions of shared logic.
- **RBAC Enforcement**: Remember that Admin has full visibility. Ensure your tables handle empty states and large datasets gracefully.
- **Backend Sync**: Before calling a new endpoint, verify its existence in the backend routes. If missing, coordinate with the Backend team.

## 4. PR Guidelines

- Every PR must have at least **2 approvals**.
- The Team Lead must review any changes to `src/api` or `src/store`.
- Ensure `npm run lint` passes before submitting.
