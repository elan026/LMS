# Frontend Development Rules

## Shared Stack

- React
- Vite
- React Router
- Zustand
- Axios
- Tailwind CSS

## System-Wide Frontend Principle

The three apps are separate role experiences on top of one backend contract. Shared behaviors must stay aligned even when the visual identity differs.

Shared behaviors include:

- login flow
- token storage
- session verification
- auth failure handling
- endpoint naming
- resource field naming

## Auth And Session Rules

1. Keep the auth bootstrap order stable:
   - read local storage
   - hydrate zustand state
   - verify token against backend
2. On `401`, clear local storage and redirect to the correct login page.
3. Each app must only admit its intended role through protected routes.
4. Do not trust stored role data without verification on app load.

## API Client Rules

1. Use one canonical axios client per app.
2. Put token attachment in request interceptors.
3. Put logout-on-401 behavior in response interceptors.
4. Keep endpoint wrappers inside `src/api`.
5. Do not scatter raw `axios` calls through pages unless there is a strong reason and the shared wrapper cannot support it.

## Route Rules

1. Use one routing pattern per app and keep it consistent.
2. Route-level components should compose layout + page content cleanly.
3. Avoid nested `Routes` patterns that duplicate navigation shells unless the layout truly requires it.
4. Protected routes should be minimal gatekeepers, not stateful feature containers.

## Data Contract Rules

All frontend apps must consume the same backend field names:

- use `course.name`, not `course.title`, unless an adapter normalizes it
- use `course.instructor`, not `course.faculty`, unless an adapter normalizes it
- use `grade.course`, `grade.student`, and `grade.score`

If the backend contract changes, all apps that consume that resource must change together.

## Role-Specific Rules

### Admin App

- Focus on management workflows.
- Prefer tables, filters, and administrative actions.
- Admin-only endpoints should not be called from student or faculty apps except when intentionally demonstrating forbidden access in a contained dev-only scenario.

### Faculty App

- Focus on teaching workflows.
- Optimize for course selection, student lists, grading, and status feedback.
- Faculty views must never assume access to all users or all courses.

### Student App

- Focus on self-service clarity.
- Optimize for enrolled courses, grades, and profile access.
- Student views must never query global administrative data as part of the normal flow.

## State Management Rules

1. Keep auth in zustand.
2. Keep page-local fetch state in components unless it is reused broadly.
3. Do not create parallel stores for the same concern.
4. Prefer derived render logic over duplicating transformed copies of server data everywhere.

## Frontend Drift Agents Must Avoid

- multiple endpoint spellings for the same feature
- mixed use of `apiClient`, `axiosClient`, and raw `axios` for identical work
- frontend assumptions that the backend has `/users` mounted when only admin modules exist on disk
- demo or simulation code leaking into production feature paths

## Preferred Refactor Direction

When touching frontend code, agents should gradually move toward:

1. one shared auth pattern across all apps
2. one endpoint wrapper style across all apps
3. one normalized resource shape across all apps
4. role-aware pages that read from canonical API wrappers instead of ad hoc HTTP calls
