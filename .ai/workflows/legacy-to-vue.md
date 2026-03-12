---
description: 기존 HTML/CSS/JavaScript 레거시 코드를 Vue 3 SFC 컴포넌트로 변환하는 워크플로우
---

# Legacy to Vue Component Conversion Workflow

## Prerequisites
- 사용자가 변환할 대상(HTML/CSS/JS 코드 붙여넣기, 또는 레거시 파일 경로)을 제공해야 합니다.

## Input Contract
- 입력 방식은 반드시 다음 둘 중 하나입니다:
  - **채팅 붙여넣기**: 사용자가 HTML/CSS/JS 코드를 직접 제공합니다.
  - **파일 경로 제공**: 사용자가 레거시 파일 경로를 제공하고, workflow가 해당 `.html`, `.css`, `.js` 파일을 읽어 수집합니다.
- 컴포넌트 파일명은 사용자가 직접 지정한 **PascalCase** 이름을 우선 사용합니다.
- 사용자가 이름을 주지 않으면 workflow가 레거시 코드의 역할을 분석해 2~3개의 후보를 제안하고 확정합니다.

## Workflow Steps

1. **규칙 로드**:
   - `@.ai/rules/development/expert-legacy-to-vue.md` 를 읽고 에이전트 페르소나와 Hard Rules를 적용합니다.
   - `@.ai/rules/language/vue-nuxt.md`, `typescript.md`, `tailwind.md` 를 읽고 코딩 표준을 확보합니다.
   - 먼저 `@.ai/rules/development/expert-vue-scripting.md` 인덱스로 JS 구조 기준의 컴포넌트 유형만 판별합니다. 이후 판별 결과에 필요한 패턴 모듈만 1~2개 로드하고, 전역 함수나 외부 DOM 의존성이 있을 때만 `interop-and-extension.md`를 추가하여 JS → Composition API 변환 패턴을 적용합니다.

2. **소스 수집 및 변환 범위 확정**:
   - 입력 방식을 확정하고 sourceType을 `inline` 또는 `file-path`로 기록합니다.
   - `file-path`인 경우 대상 `.html`, `.css`, `.js` 파일을 읽어 변환 입력 세트를 구성합니다.
   - 레거시 코드 범위를 벗어나는 기존 `.vue` 수정 요청은 이 workflow로 처리하지 않고 `2번 기존 Vue 컴포넌트 수정` 경로로 되돌립니다.

3. **컴포넌트명 확정**:
   - 사용자 제공 이름이 있으면 그대로 사용합니다.
   - 이름이 없으면 workflow가 후보 2~3개를 제안하고 최종 컴포넌트명을 확정합니다.
   - 저장 기본 경로는 반드시 `components/[PascalCase명].vue` 입니다. 사용자가 별도 경로를 지시한 경우에만 변경합니다.

4. **에셋 안내 및 의존성 수집**:
   - 레거시 코드에 이미지, SVG 아이콘, 커스텀 폰트 참조가 있으면 `~/assets/images/`, `~/assets/icons/`, `~/assets/fonts/` 배치 기준을 안내합니다.
   - 외부 라이브러리, 글로벌 함수, 타 컴포넌트 참조 여부를 변환 전 체크리스트로 정리합니다.

5. **코드 변환 실행** → `expert-legacy-to-vue` 위임:
   - **[HARD] Props/API 가드레일**: Props 관련 제한은 canonical source인 `@.ai/rules/development/component-guardrails.md`의 Props And API Guardrail을 그대로 적용합니다.
   - 에이전트는 신규 Legacy HTML/CSS/JS를 분석해 저장 가능한 `.vue` SFC 결과물과 Dependencies Report를 반환합니다.
   - CSS 변수는 Tailwind `theme.extend` 매핑으로 정리하고, 글로벌 함수/타 컴포넌트 참조는 `<!-- TODO -->` 플레이스홀더와 함께 unresolved dependency로 기록합니다.
   - **[HARD] 클래스명 규칙**: `T002_B01_13` 같은 무의미한 레거시 ID를 클래스명으로 재사용하지 않습니다. 컴포넌트명이나 역할을 기반으로 한 직관적인 클래스명(예: `hero-slider`, `login-form`)을 사용합니다.
   - **[HARD] 루트 엘리먼트 데이터 속성 보존 (추적성)**: 변환된 컴포넌트의 루트 엘리먼트에만 아래 두 속성을 반드시 삽입합니다. 하위 엘리먼트에는 삽입하지 않습니다:
     - `data-component="[레거시 ID]"` — 레거시 원본 ID
     - `data-node-id="[Figma Node ID]"` — Figma 노드 ID (없는 경우 빈 문자열로 삽입)
   - **[HARD] 이미지 리소스 import**: `assets/images` 내 이미지를 사용할 경우 템플릿에서 문자열 경로를 직접 쓰지 않습니다. `<script setup>` 상단에서 `import`로 로드한 뒤 `:src` 바인딩으로 연결합니다. (Vite/Nuxt 에셋 최적화)
   - **[HARD] 카드 라운딩 세분화**: 상하단 영역이 분리된 카드 컴포넌트에서 전체 `rounded-*`를 사용하지 않습니다. 상단 영역에는 `rounded-t-*`, 하단 영역에는 `rounded-b-*`를 각각 적용하여 디자인 무결성을 유지합니다.
   - **Dependencies Report**를 사용자에게 첨부합니다:
     - CSS Variables 매핑 목록
     - Inter-component Dependencies (글로벌 함수/타 컴포넌트 참조)
     - Third-party Libraries (제3자 라이브러리 및 대체 방안)
     - Assets (이미지/아이콘 파일 배치 목록)
   - unresolved dependency는 코드 내 TODO와 Dependencies Report 양쪽에 모두 남깁니다.

6. **파일 저장 전 공통 가드레일 적용 및 저장**:
   - 저장 직전 `@.ai/rules/development/component-guardrails.md`의 Props, style preservation, partial edit guardrail을 적용합니다.
   - 이 단계에서 Tailwind 클래스 보존, `<style scoped>` 보존, 긴 `class` 잘림 여부를 확인합니다.
   - 위 점검이 끝나면 결과물을 **`components/[PascalCase명].vue`** 경로에 저장합니다.

7. **[HARD] 검증 핸드오프 (필수 — 건너뛰기 절대 금지)**:
   - 저장이 완료되면 `@.ai/rules/development/component-guardrails.md`의 validation chain guardrail에 따라 **반드시** `/component-validation` 워크플로우를 호출합니다.
   - Legacy 전용 handoff 패키지는 최소 다음 정보를 포함해야 합니다:
     - `componentPath`
     - `sourceType`
     - `hasScopedStyle`
     - `scopedStyleDeclarationCount`
     - `cssVariableMappings`
     - `customTailwindTokens`
     - `arbitraryValues`
     - `unresolvedDependencies`
   - 이 패키지는 `@.ai/rules/development/component-guardrails.md`의 handoff package minimum에 추가되는 Legacy 전용 컨텍스트로 취급합니다.
