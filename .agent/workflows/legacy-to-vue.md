---
description: 기존 HTML/CSS/JavaScript 레거시 코드를 Vue 3 SFC 컴포넌트로 변환하는 워크플로우
---

# Legacy to Vue Component Conversion Workflow

## Prerequisites
- 사용자가 변환할 대상(HTML/CSS/JS 코드 붙여넣기, 또는 레거시 파일 경로)을 제공해야 합니다.

## Workflow Steps

1. **규칙 로드**:
   - `@.ai/rules/development/expert-legacy-to-vue.md` 를 읽고 에이전트 페르소나와 Hard Rules를 적용합니다.
   - `@.ai/rules/language/vue-nuxt.md`, `typescript.md`, `tailwind.md` 를 읽고 코딩 표준을 확보합니다.
   - 먼저 `@.ai/rules/development/expert-vue-scripting.md` 인덱스를 읽고 JS 구조를 기준으로 컴포넌트 유형을 판별합니다. 이후 `@.ai/rules/development/expert-vue-scripting/patterns-forms.md`, `@.ai/rules/development/expert-vue-scripting/patterns-interactive-ui.md`, `@.ai/rules/development/expert-vue-scripting/patterns-motion-display.md` 중 필요한 모듈만 로드하고, 전역 함수나 외부 DOM 의존성이 있으면 `@.ai/rules/development/expert-vue-scripting/interop-and-extension.md`를 추가 로드하여 JS → Composition API 변환 패턴을 적용합니다.

2. **초기 확인 및 소스 수집** → `expert-legacy-to-vue` 위임:
   - 에이전트의 "대화 시작 시 초기 확인" 규칙에 따라 사용자 의도를 파악합니다.
   - 입력 방식을 결정합니다:
     - **붙여넣기**: 사용자가 채팅에 직접 HTML/CSS/JS 코드를 붙여넣은 경우, 해당 코드를 수집합니다.
     - **파일 경로**: 사용자가 레거시 파일 경로를 제공한 경우, 해당 파일들(`.html`, `.css`, `.js`)을 읽어 수집합니다.
   - 사용자에게 **PascalCase 컴포넌트 파일명**을 요청합니다. 미제공 시 레거시 코드의 역할을 분석하여 2~3개의 후보를 제안합니다.
   - 레거시 코드에 이미지/아이콘 참조가 있으면 에셋 배치 가이드를 안내합니다.

3. **코드 변환 및 생성** → `expert-legacy-to-vue` 위임:
   - 생성 코드에서 `Props` API는 레거시 소스상 실제 입력 계약이 명확한 경우에만 추가합니다. 근거 없는 `type Props`, `defineProps`, `withDefaults(defineProps(...))` 자동 생성은 피합니다.
   - 에이전트의 "작업 유형별 워크플로우 A (신규 변환)" 규칙에 따라:
     - 레거시 HTML/CSS/JS를 분석하고 `.vue` SFC로 변환합니다.
     - CSS 변수를 Tailwind `theme.extend` 매핑으로 변환하고 목록을 기록합니다.
     - 글로벌 함수/타 컴포넌트 참조 → `<!-- TODO -->` 플레이스홀더 및 Dependencies Report 작성
   - **Dependencies Report**를 사용자에게 첨부합니다:
     - CSS Variables 매핑 목록
     - Inter-component Dependencies (글로벌 함수/타 컴포넌트 참조)
     - Third-party Libraries (제3자 라이브러리 및 대체 방안)
     - Assets (이미지/아이콘 파일 배치 목록)
   - 결과물을 사용자에게 리뷰용으로 제공한 후, 승인 시 **`components/[PascalCase명].vue`** 경로에 저장합니다.
   - 저장 경로 기본값은 반드시 `components/` 루트이며, 사용자가 별도 경로를 지시한 경우에만 변경합니다.

4. **[HARD] 공통 컴포넌트 가드레일 적용**:
   - 저장 직전 `@.ai/rules/development/component-guardrails.md`의 Props, style preservation, partial edit guardrail을 적용합니다.
   - 이 단계에서 Tailwind 클래스 보존, `<style scoped>` 보존, 긴 `class` 잘림 여부를 확인합니다.

5. **[HARD] 검증 핸드오프 (필수 — 건너뛰기 절대 금지)**:
   - 저장이 완료되면 `@.ai/rules/development/component-guardrails.md`의 validation chain guardrail에 따라 **반드시** `/component-validation` 워크플로우를 호출합니다.
   - **스타일 컨텍스트 전달**: 검증 워크플로우 호출 시 다음 정보를 함께 전달합니다:
     - 생성된 컴포넌트에 `<style scoped>` 블록이 포함되어 있는지 여부
     - `<style scoped>` 내 CSS 선언 수 (검증 시 보존 확인용)
     - CSS Variables 매핑 목록 (Dependencies Report에서 추출)
     - 사용된 커스텀 Tailwind 토큰 및 arbitrary value 사용 내역
