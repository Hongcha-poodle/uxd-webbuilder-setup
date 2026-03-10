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
   - 인터랙션 구현이 필요한 컴포넌트일 경우, 먼저 `@.ai/rules/development/expert-vue-scripting.md` 인덱스로 컴포넌트 유형만 판별합니다. 이후 판별 결과에 필요한 패턴 모듈만 1~2개 추가 로드합니다. 레거시 전역 함수나 외부 DOM 결합이 있을 때만 `interop-and-extension.md`를 추가합니다.

2. **초기 확인 및 데이터 수집** → `expert-figma-to-vue` 위임:
   - 에이전트의 "대화 시작 시 초기 확인" 규칙에 따라 사용자 의도를 파악합니다.
   - **Figma 데이터 수집 (MCP 우선 전략)**:
     - **1순위**: Figma MCP Server 연결을 시도하여 노드 메타데이터를 자동 수집합니다.
     - **2순위 (Fallback)**: MCP 연결이 실패할 경우, 사용자에게 Figma 노드 ID 또는 URL을 직접 요청합니다.
   - Figma 노드 데이터가 수집된 경우:
     - 노드의 `name` 속성(레이어명)을 **PascalCase**로 변환하여 컴포넌트 파일명으로 확정합니다.
     - 예: 레이어명 `"login form"` → 파일명 `LoginForm.vue`
   - 스크린샷이 주어진 경우: 시각적 분석으로 UI 요소를 역설계하고, 사용자에게 컴포넌트명을 확인합니다.

3. **코드 생성** → `expert-figma-to-vue` 위임:
   - **[HARD] Props/API 가드레일**: Props 관련 제한은 canonical source인 `@.ai/rules/development/component-guardrails.md`의 Props And API Guardrail을 그대로 적용합니다.
   - 에이전트의 "작업 유형별 워크플로우" 규칙에 따라 `.vue` 파일을 생성 또는 수정합니다.
   - 결과물을 사용자에게 리뷰용으로 제공한 후, 승인 시 **`components/[PascalCase명].vue`** 경로에 저장합니다.
   - 저장 경로 기본값은 반드시 `components/` 루트이며, 사용자가 별도 경로를 지시한 경우에만 변경합니다.

4. **[HARD] 공통 컴포넌트 가드레일 적용**:
   - 저장 직전 `@.ai/rules/development/component-guardrails.md`의 Props, style preservation, partial edit guardrail을 적용합니다.
   - 이 단계에서 Tailwind 클래스 보존, `<style scoped>` 보존, 긴 `class` 잘림 여부를 확인합니다.

5. **[HARD] 검증 핸드오프 (필수 — 건너뛰기 절대 금지)**:
   - 저장이 완료되면 `@.ai/rules/development/component-guardrails.md`의 validation chain guardrail에 따라 **반드시** `/component-validation`을 호출합니다.
   - **스타일 컨텍스트 전달**: 검증 워크플로우 호출 시 다음 정보를 함께 전달합니다:
     - 생성된 컴포넌트에 `<style scoped>` 블록이 포함되어 있는지 여부
     - `<style scoped>` 내 CSS 선언 수 (검증 시 보존 확인용)
     - 사용된 커스텀 Tailwind 토큰 목록 (예: `bg-primary-orange`, `text-text-primary`)
     - Figma CSS 변수에서 변환한 매핑 정보 (있을 경우)
     - Tailwind arbitrary value 사용 내역 (예: `w-[141px]`, `bg-[#FF9B00]`)
   - 이 컨텍스트는 visual-diff 교정 루프에서 스타일 수정 시 기존 스타일을 보존하는 데 활용됩니다.
