# Contributing to Faculty App

This document outlines the development standards and collaborative workflow for the Faculty App team.

## 1. Team Structure (5 Members)

| Role | Primary Responsibilities |
| :--- | :--- |
| **Team Lead** | Alignment with backend business logic, grading math validation, PR reviews. |
| **UI/UX Core** | Gradebook interfaces, student lists, interactive course dashboards. |
| **State Manager** | Course-specific state, caching student grades, token handling. |
| **Feature Dev A** | Grading Engine, assessment management, submission tracking. |
| **Feature Dev B** | Course Content management, student communication, enrollment views. |

## 2. Development Workflow

1.  **Branching**: Use `feat/faculty/[feature-name]` for new work and `fix/faculty/[bug-name]` for patches.
2.  **Ownership Logic**: 
    - Faculty members can only see courses where they are the `instructorId`.
    - Ensure your API calls reflect this scope (e.g., `/api/courses/my-courses`).
3.  **Code Style**:
    - Functional components with Hooks.
    - Tailind CSS for all styling.
    - Consistent error handling for failed grading submissions.

## 3. Collaborative Rules

- **Shared Domain**: Use `grade.score` (0-100) as the source of truth.
- **Resource Naming**: Stick to `course.name` and `student`. Avoid "lecturer" or "pupil" naming conventions.
- **Visual Feedback**: Since faculty perform repetitive tasks (grading), ensure all actions have immediate visual feedback (success toasts, loading states).

## 4. PR Guidelines

- Every PR must have at least **2 approvals**.
- The Team Lead must review any changes to grading logic or API interactions.
- Ensure `npm run lint` passes before submitting.
