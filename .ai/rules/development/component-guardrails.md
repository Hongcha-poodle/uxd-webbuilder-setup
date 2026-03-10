---
description: Vue component generation and modification 공통 품질 가드레일
---

# Shared Component Guardrails

이 문서는 Vue 컴포넌트 생성/수정 워크플로우 전반에서 반복적으로 적용되는 공통 가드레일의 canonical source입니다.
각 workflow와 expert rule은 이 문서를 기준으로 적용하고, 자신에게만 필요한 고유 규칙만 추가로 서술합니다.

## 1. 적용 범위

다음 작업에 공통 적용합니다:
- Figma -> Vue 생성
- Legacy -> Vue 변환
- 기존 `.vue` 컴포넌트 수정
- validation handoff
- visual diff correction

## 2. Props And API Guardrail

- `type Props`, `interface Props`, `defineProps`, `withDefaults(defineProps(...))` 패턴은 필요한 경우에만 명시적으로 추가합니다.
- 시각 정보나 불완전한 추론만으로 입력 계약을 과도하게 생성하지 않습니다.
- 입력 계약이 불명확하면 최소 `Emits` 중심으로 유지하고, 필요한 계약은 후속 구현 또는 개발팀 검토 지점으로 남깁니다.
- 타입 계약의 기준은 `@.ai/rules/language/vue-nuxt.md`, `@.ai/rules/language/typescript.md`를 따릅니다.

## 3. Style Preservation Guardrail

- 수정 대상이 아닌 Tailwind 클래스를 삭제하거나 변경하지 않습니다.
- `<style scoped>` 블록이 존재하면 수정 대상 선언 외 CSS는 그대로 유지합니다.
- 긴 `class` 속성(3줄 이상)은 수정 전후 잘림(truncation) 여부를 확인합니다.
- 파일 저장 전 `<style scoped>` 블록 존재 여부, CSS 선언 수, 의도하지 않은 클래스 삭제 여부를 검증합니다.
- Tailwind 우선 원칙은 유지하되, `@keyframes`, 복잡한 selector, `::before/::after`, `grid-template-areas` 등은 `<style scoped>` 유지가 가능합니다.

## 4. Partial Edit Guardrail

- `.vue` 파일 수정 시 가능하면 전체 rewrite를 피하고 변경이 필요한 구간만 부분 수정(partial edit)합니다.
- visual diff 교정 시에도 `class` 속성 또는 `<style scoped>` 내 특정 선언만 수정합니다.
- 구조 변경이나 비즈니스 로직 변경이 필요한 경우에는 visual diff 루프에서 처리하지 않고 별도 수정 단계로 올립니다.

## 5. Validation Chain Guardrail

- 컴포넌트 생성/수정 후 순서는 반드시 다음을 따릅니다:
  1. 코드 생성 또는 수정
  2. `/component-validation`
  3. `/visual-diff`
  4. 프리뷰 URL 제공
- validation을 생략한 채 프리뷰 URL만 먼저 제공하는 것은 금지합니다.
- visual diff는 기준 이미지가 없거나 캡처 수단이 없는 등 workflow abort 조건에서만 건너뜁니다.

## 6. Handoff Package Minimum

validation 또는 visual diff 단계로 넘길 때 최소 다음 컨텍스트를 전달합니다:
- 타겟 컴포넌트 경로와 작업 유형(Figma 생성, Legacy 변환, 기존 컴포넌트 수정)
- `hasScopedStyle`
- `scopedStyleDeclarationCount` 또는 주요 CSS 선언 목록
- 사용된 커스텀 Tailwind 토큰 목록
- CSS 변수 또는 디자인 토큰 매핑 정보
- Tailwind arbitrary value 사용 내역

## 7. Feedback Loop Contract

- `expert-vue-tester` 또는 `visual-diff`가 차단 이슈를 반환하면, 원본 생성/수정 에이전트가 최소 수정 원칙으로 Self-Correction을 수행합니다.
- 수정 후에는 해당 단계 중간부터 임의 재개하지 않고 `validation chain`의 시작점으로 돌아가 다시 검증합니다.
- 피드백 요약은 차단 이슈, 수정한 항목, 남은 수동 확인 항목만 간결하게 유지합니다.

## 8. Reference Usage Rule

- workflow 문서는 이 문서의 guardrail을 적용 대상으로 선언하고, 단계 고유 정보만 남깁니다.
- expert rule은 공통 guardrail을 다시 길게 복제하지 말고 자신만의 도메인 규칙만 추가합니다.
- 언어 rule은 framework 또는 styling 관점의 추가 제약만 유지하고, cross-workflow 운영 규칙은 이 문서를 우선 참조합니다.
