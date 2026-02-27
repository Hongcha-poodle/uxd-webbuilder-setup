# Claude Code Instructions

> **CRITICAL**: Before executing any task, you MUST read and strictly adhere to the global AI rules defined in `.ai/core.md` and all rules in `.ai/rules/`.

## MANDATORY: Component Work Selection

When any request involves **creating or modifying UI components**, you MUST stop and ask the user to choose one of the following before proceeding:

1. **Figma → Vue Component**: Create a new Vue component based on a Figma design → `/figma-to-code` workflow
2. **Modify existing Vue component**: Edit an already created `.vue` component → delegate directly to the relevant agent
3. **Legacy → Vue Component**: Convert existing HTML/CSS/JS legacy code to a Vue component → `/legacy-to-vue` workflow

Do NOT skip this step. Do NOT assume which type the user wants.