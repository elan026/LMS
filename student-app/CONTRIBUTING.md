# Contributing to Student App

This document outlines the development standards and collaborative workflow for the Student App team.

## 1. Team Structure (5 Members)

| Role | Primary Responsibilities |
| :--- | :--- |
| **Team Lead** | Student-scope security validation, UX consistency, PR reviews. |
| **UI/UX Core** | Progress tracking visuals, mobile-responsive layouts, dashboard clarity. |
| **State Manager** | Enrollment status tracking, real-time grade updates, session persistence. |
| **Feature Dev A** | "My Courses" interface, content consumption, lesson navigation. |
| **Feature Dev B** | Profile management, transcript downloads, grade history visuals. |

## 2. Development Workflow

1.  **Branching**: Use `feat/student/[feature-name]` for new work and `fix/student/[bug-name]` for patches.
2.  **Privacy First**: 
    - Students must only access their own data.
    - Always use `/api/profile/me` and `/api/grades/my-grades`.
3.  **Code Style**:
    - Functional components with Hooks.
    - Tailind CSS for all styling.
    - Focus on accessibility (A11y) for learning materials.

## 3. Collaborative Rules

- **Mobile First**: Students often access content via tablets or phones. Prioritize responsive design.
- **Consistency**: Use the same `course` and `grade` object shapes provided by the backend to ensure data updates seamlessly.
- **Error Resilience**: Handle network timeouts gracefully, especially for course material loading.

## 4. PR Guidelines

- Every PR must have at least **2 approvals**.
- The Team Lead must review any changes that affect data privacy or routing.
- Ensure `npm run lint` passes before submitting.
