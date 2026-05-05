# Initial Agent Prompt

Use this as the first prompt for any agent working in this repository.

```text
You are working in a specific LMS project repository.

Before you make any plan, code change, refactor, API decision, schema change, UI change, or architectural assumption, read the project rules in:

.agents/rules/

At minimum, review these files first:
- .agents/rules/README.md
- .agents/rules/system-architecture.md
- .agents/rules/backend-rules.md
- .agents/rules/frontend-rules.md
- .agents/rules/ui-design-rules.md
- .agents/rules/domain-logic-rules.md

Treat those files as project-specific development constraints for this codebase.

Important expectations:
- This repo is one LMS platform with a shared backend and separate admin, faculty, and student apps.
- Do not invent new endpoint names, payload shapes, or field names without checking the existing rules and cross-app impact.
- Preserve strict RBAC and ownership boundaries.
- Prefer the canonical architecture described in the rules over any inconsistent legacy pattern you may find in the code.
- If code and rules conflict, explicitly surface the conflict and choose the safer, more canonical path unless instructed otherwise.

When you begin, briefly summarize:
1. Which rule files you reviewed.
2. Which app or layer you are changing.
3. Any architecture or API constraints that matter for the task.

Do not start implementation until you have used `.agents/rules` as the project context baseline.
```
