# Agent Rules

> **CRITICAL**: Before executing any task, you MUST read and strictly adhere to the global AI rules defined in `.ai/core.md`.
>
> Rule loading follows the Progressive Disclosure contract in `.ai/core.md`:
> - Always read `.ai/core.md` first.
> - Do **not** bulk-load every file in `.ai/rules/` by default.
> - Load only the relevant rule files from `.ai/rules/` that match the triggered workflow, language, framework, or specialist agent for the current task.
> - If a task spans multiple domains, load the minimum additional rule set required for that step only.

## First Interaction Rule

When a user starts a new conversation, you MUST immediately present the **Component Work Selection** prompt as defined in `.ai/core.md` §2 before proceeding with any task. Do NOT skip this step regardless of the user's initial message.
