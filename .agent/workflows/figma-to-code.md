---
description: Figma 디자인 스크린샷 또는 노드를 Vue 컴포넌트 코드로 변환하는 워크플로우
---

# Figma to Vue Component Conversion Workflow

## Prerequisites
- 사용자가 변환할 대상(Figma Node ID, 화면 스크린샷, 화면 요건 등)을 제공해야 합니다.

## Workflow Steps

1. **규칙 로드**:
   - `@.ai/rules/development/expert-figma-to-vue.md` 를 읽고 에이전트 페르소나와 Hard Rules를 적용합니다.
   - `@.ai/rules/language/vue-nuxt.md`, `typescript.md`, `tailwind.md` 를 읽고 코딩 표준을 확보합니다.

2. **초기 확인 및 데이터 수집** → `expert-figma-to-vue` 위임:
   - 에이전트의 "대화 시작 시 초기 확인" 규칙에 따라 사용자 의도를 파악합니다.
   - Figma Node ID가 주어진 경우: Figma MCP Server를 호출하여 노드 메타데이터를 수집합니다.
     - 노드의 `name` 속성(레이어명)을 **PascalCase**로 변환하여 컴포넌트 파일명으로 확정합니다.
     - 예: 레이어명 `"login form"` → 파일명 `LoginForm.vue`
   - 스크린샷이 주어진 경우: 시각적 분석으로 UI 요소를 역설계하고, 사용자에게 컴포넌트명을 확인합니다.

3. **코드 생성** → `expert-figma-to-vue` 위임:
   - 에이전트의 "작업 유형별 워크플로우" 규칙에 따라 `.vue` 파일을 생성 또는 수정합니다.
   - 결과물을 사용자에게 리뷰용으로 제공한 후, 승인 시 **`components/[PascalCase명].vue`** 경로에 저장합니다.
   - 저장 경로 기본값은 반드시 `components/` 루트이며, 사용자가 별도 경로를 지시한 경우에만 변경합니다.

4. **검증 핸드오프**:
   - 저장이 완료되면 `/component-validation` 워크플로우를 호출하여 QA 단계를 위임합니다.
