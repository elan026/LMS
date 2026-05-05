# UI Design Rules

## Product Design Principle

This LMS should feel like one platform with three role-specific workspaces.

That means:

- shared interaction grammar
- different role identities
- predictable layouts
- clear data-heavy workflows

## Current Role Themes To Preserve

### Admin

- operational and managerial
- warm admin palette already centered around orange tones
- tables, cards, quick actions, summary metrics

### Faculty

- focused and task-oriented
- strong indigo/purple teaching workspace identity already exists
- grading flows, course-level actions, student management

### Student

- calm and self-service oriented
- green learning/progress identity already exists
- quick overview, personal results, minimal operational complexity

## Visual Consistency Rules

1. Keep spacing, border radius, elevation, and typography rhythm consistent across apps even when colors differ.
2. Reuse common component patterns:
   - cards
   - tables
   - empty states
   - loading spinners
   - inline error banners
   - primary and secondary action buttons
3. Prefer rounded, modern surfaces already present in the repo.
4. Do not mix radically different visual systems inside the same app.

## Layout Rules

### Admin

- management dashboard layout
- navigation suited to multi-section oversight
- tables should be easy to scan and action

### Faculty

- sidebar or focused workspace layout is appropriate
- grading interfaces should minimize context switching
- course selection should be obvious and quick

### Student

- top navigation or lightweight shell is appropriate
- content should emphasize clarity over control density
- personal data should be surfaced with minimal friction

## Interaction Rules

1. Always represent loading, empty, success, and error states explicitly.
2. Destructive actions must be visually distinct.
3. Permission failures should be readable and not cryptic.
4. Forms should use clear labels, not placeholder-only design.
5. Tables must remain readable on common laptop widths and degrade cleanly on smaller screens.

## Content Design Rules

1. Prefer plain, domain-accurate labels:
   - Courses
   - Grades
   - Enrollments
   - Profile
   - Users
2. Avoid mixing `faculty` and `instructor` in user-facing copy without intent.
3. Empty states should explain what is missing and what the user can do next.
4. Success feedback should confirm the affected entity when possible.

## Tailwind Rules

1. Reuse app-specific utility classes such as `.card`, `.table`, `.btn-primary`, `.input-field` when available.
2. Add shared component classes for repeated patterns instead of duplicating long utility strings everywhere.
3. Keep color tokens and repeated styles coherent within each app theme.

## Accessibility Rules

1. Maintain adequate text contrast.
2. Use semantic buttons for actions and links for navigation.
3. Keep tables and forms keyboard-usable.
4. Provide visible focus states.

## UI Smells To Avoid

- admin pages using student-style lightweight navigation for dense workflows
- faculty pages calling admin actions from primary UI flows
- student pages exposing operational controls
- inconsistent resource wording caused by backend/frontend field drift
- placeholder demo data left in production pages after real API integration
