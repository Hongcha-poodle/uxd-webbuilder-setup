```markdown
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

2. **초기 확인 및 소스 수집** → `expert-legacy-to-vue` 위임:
   - 에이전트의 "대화 시작 시 초기 확인" 규칙에 따라 사용자 의도를 파악합니다.
   - 입력 방식을 결정합니다:
     - **붙여넣기**: 사용자가 채팅에 직접 HTML/CSS/JS 코드를 붙여넣은 경우, 해당 코드를 수집합니다.
     - **파일 경로**: 사용자가 레거시 파일 경로를 제공한 경우, 해당 파일들(`.html`, `.css`, `.js`)을 읽어 수집합니다.
   - 사용자에게 **PascalCase 컴포넌트 파일명**을 요청합니다. 미제공 시 레거시 코드의 역할을 분석하여 2~3개의 후보를 제안합니다.
   - 레거시 코드에 이미지/아이콘 참조가 있으면 에셋 배치 가이드를 안내합니다.

3. **코드 변환 및 생성** → `expert-legacy-to-vue` 위임:
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

4. **검증 핸드오프**:
   - 저장이 완료되면 `/component-validation` 워크플로우를 호출하여 QA 단계를 위임합니다.

```
