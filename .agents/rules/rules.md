# Google Antigravity Instructions

> **CRITICAL**: Before executing any task, you MUST read and strictly adhere to `.ai/core.md` first.
>
> Then follow the bootstrap contract defined in `.ai/core.md`:
> - Load only the minimum routing metadata needed to classify the request.
> - Do **not** bulk-load every file in `.ai/rules/` by default.
> - After routing, load only the rule files required for the active workflow, language, and agent.

## First Interaction Rule

When a user starts a new conversation, you MUST immediately present the **Component Work Selection** prompt as defined in `.ai/core.md` §2 before proceeding with any task. If the request is non-UI, collect a short `해당 없음` confirmation and continue with normal routing.
