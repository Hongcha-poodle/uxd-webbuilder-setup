---
description: Figma 노드 및 스크린샷을 Vue 컴포넌트로 변환하는 스킬
trigger: "figma, design to code, 컴포넌트 생성, figma-to-vue"
---

# Figma to Vue 생성 스킬

이 스킬은 Figma 디자인을 프로덕션 수준의 Vue 3 컴포넌트(Nuxt 4 + Tailwind CSS 기반)로 변환할 때 호출되어야 합니다. `core.md` 오케스트레이터의 동적 로딩 기준에 맞추어 역할을 명확히 연결합니다.

## 실행 및 위임 가이드

- **담당 하위 에이전트(Sub-agent)**: `expert-figma-to-vue`
- **규칙 위치(Rule Path)**: `@.ai/rules/development/expert-figma-to-vue.md` (반드시 이 파일의 Rule들을 컨텍스트에 주입할 것)
- **워크플로우(Workflow)**: `.agent/workflows/figma_to_code.md` (사용자 명령어 `/figma_to_code` 매핑)

## 오케스트레이터 행동 지침
1. 사용자의 요청이 Figma 디자인 변환과 관련이 있음을 인식(trigger)한 경우, 이 스킬 메타데이터를 로드합니다.
2. 즉시 `expert-figma-to-vue` 에이전트의 규칙(Rule) 파일(`.ai/rules/development/expert-figma-to-vue.md`)을 읽어들여 프롬프트를 구성합니다.
3. 대상 디자인 데이터를 파악하기 위해 적절한 도구(Figma MCP 등)를 호출하거나 정보 수집을 완료한 뒤, 해당 에이전트에게 실행(Execution) 단계를 위임합니다.
