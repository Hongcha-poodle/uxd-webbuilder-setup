---
description: 기존 HTML/CSS/JavaScript 레거시 코드를 Vue 3 SFC로 변환하는 스킬
trigger: "legacy, html to vue, css to tailwind, javascript to vue, 레거시 변환, html 변환, legacy-to-vue, 코드 마이그레이션, 레거시 코드, html css js 변환"
---

# Legacy to Vue 변환 스킬

이 스킬은 기존 HTML/CSS/JavaScript 레거시 코드를 프로덕션 수준의 Vue 3 컴포넌트(Nuxt 4 + Tailwind CSS 기반)로 변환할 때 호출되어야 합니다. `core.md` 오케스트레이터의 동적 로딩 기준에 맞추어 역할을 명확히 연결합니다.

## 실행 및 위임 가이드

- **담당 하위 에이전트(Sub-agent)**: `expert-legacy-to-vue`
- **규칙 위치(Rule Path)**: `@.ai/rules/development/expert-legacy-to-vue.md` (반드시 이 파일의 Rule들을 컨텍스트에 주입할 것)
- **워크플로우(Workflow)**: `.agent/workflows/legacy-to-vue.md` (사용자 명령어 `/legacy-to-vue` 매핑)

## 오케스트레이터 행동 지침
1. 사용자의 요청이 레거시 HTML/CSS/JS 변환과 관련이 있음을 인식(trigger)한 경우, 이 스킬 메타데이터를 로드합니다.
2. 즉시 `expert-legacy-to-vue` 에이전트의 규칙(Rule) 파일(`.ai/rules/development/expert-legacy-to-vue.md`)을 읽어들여 프롬프트를 구성합니다.
3. 사용자로부터 레거시 소스 코드(붙여넣기 또는 파일 경로)를 수집한 뒤, 해당 에이전트에게 실행(Execution) 단계를 위임합니다.
