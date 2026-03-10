---
description: Vue 컴포넌트의 인터랙션 및 스크립트 로직 구현을 위한 전문 에이전트 규칙 인덱스
---

# Expert Vue Scripting Agent (expert-vue-scripting)

이 문서는 `expert-figma-to-vue`, `expert-legacy-to-vue`가 Vue 인터랙션 로직을 작성할 때 사용하는 **경량 인덱스**입니다.
세부 구현 예시는 이 파일에 모두 싣지 않고, 컴포넌트 유형과 요구사항에 맞는 패턴 모듈만 추가 로드합니다.

## 필수 규칙 (HARD Rules)

1. **Composition API 전용**: 모든 로직은 `<script setup lang="ts">` 내에서 Composition API로 작성합니다. Options API는 사용하지 않습니다.
2. **Nuxt Auto-imports 활용**: `ref`, `reactive`, `computed`, `watch`, `onMounted`, `onUnmounted`, `nextTick`, `navigateTo`, `useState`, `useFetch`, `useAsyncData` 등은 명시적 import 없이 사용합니다.
3. **`any` 타입 금지**: 상태, 이벤트 핸들러 파라미터, 유틸리티 함수에는 명시적 타입을 부여합니다.
4. **DOM 직접 조작 금지**: `document.querySelector`, `classList.add/remove`, 직접 style 변경은 금지합니다. 반응형 상태와 바인딩을 우선 사용합니다.
5. **`template ref` 제한 사용**: DOM 측정, 포커스 제어, CSS custom property 제어처럼 반응형으로 대체할 수 없는 경우에만 사용합니다.
6. **`Props` 정책**: `type Props`, `interface Props`, `defineProps`, `withDefaults(defineProps(...))` 패턴은 실제 입력 계약이 분명할 때만 명시적으로 추가합니다. 근거 없는 자동 추론이나 과도한 선언은 피합니다.
7. **부분 로드 우선**: 이 인덱스를 읽은 뒤, 아래 매핑표에서 필요한 모듈과 패턴만 추가로 로드합니다. 전체 패턴 모듈 동시 로드는 금지합니다.

## 컴포넌트 유형 판별 기준 (Component Type Decision)

컴포넌트 유형 판별은 **코드 생성 전에 반드시 선행**되어야 합니다.

| 워크플로우 | 판별 시점 | 행동 |
|-----------|---------|------|
| **Figma → Vue** | Figma 노드 분석 완료 직후, 코드 작성 전 | 판별 결과를 오케스트레이터에게 보고하고 필요한 패턴 모듈만 선택 |
| **Legacy → Vue** | JS 클래스/함수 구조 분석 직후, 변환 전 | 판별 결과를 오케스트레이터에게 보고하고 대응 패턴 모듈만 선택 |
| **기존 컴포넌트 수정** | 파일 읽기 완료 직후 | 기존 유형을 확인하고 변경 범위에 필요한 패턴만 재로딩 |

> **아키텍처 원칙**: 서브에이전트는 사용자와 직접 상호작용할 수 없습니다 (`core.md` §5). 모든 사용자 확인은 오케스트레이터를 통해 수행됩니다.

**보고 형식 예시**:
```
컴포넌트 유형 판별 결과: Stateful
근거: 내부 유효성 검사 로직과 다단계 상태 전이(idle → codeSent → verified)가 필요합니다.
추가 로드 모듈: patterns-forms.md (P02, P04, P05, P06)
```

| 유형 | 판별 기준 | 기본 모듈 | 주로 선택하는 패턴 |
|------|----------|----------|-------------------|
| **Controlled (수동 구현)** | 부모가 `v-model`로 데이터를 제어해야 하는 경우 | `patterns-forms.md` | `P01`, 필요 시 `P03`, `P04` |
| **Stateful** | 내부에 복잡한 상태 전이·유효성 검사가 존재하는 경우 | `patterns-forms.md` | `P02`, `P04`, `P05`, `P06` |
| **Display** | 사용자 인터랙션 없이 데이터를 계산·표시하는 경우 | `patterns-motion-display.md` | `P11` |
| **Interactive UI** | 탭, 아코디언, 캐러셀, 모달 트리거 등 UI 상태 전환이 주요 역할인 경우 | `patterns-interactive-ui.md` | `P07`, `P08`, `P09`, `P12`, 필요 시 `P14` |
| **Animation** | CSS animation과 JS 제어가 결합된 경우 | `patterns-motion-display.md` | `P10`, `P13`, 필요 시 `patterns-interactive-ui.md`의 `P14` |

## 모듈 로드 프로토콜 (Targeted Loading Protocol)

1. 먼저 이 인덱스를 읽고 컴포넌트 유형을 판별합니다.
2. 아래 모듈 중 **최소 개수만** 추가 로드합니다.
3. 한 모듈 안에서도 필요한 패턴 섹션만 주입하는 것을 우선합니다.
4. 레거시 전역 함수, 외부 DOM 접근, 타 컴포넌트 결합이 보이면 `interop-and-extension.md`를 추가 로드합니다.
5. 새 패턴을 정의하거나 문서를 확장해야 할 때만 `interop-and-extension.md`의 확장 가이드를 읽습니다.

| 모듈 | 파일 | 포함 범위 |
|------|------|----------|
| Forms | `@.ai/rules/development/expert-vue-scripting/patterns-forms.md` | `P01`~`P06` |
| Interactive UI | `@.ai/rules/development/expert-vue-scripting/patterns-interactive-ui.md` | `P07`~`P09`, `P12`, `P14` |
| Motion And Display | `@.ai/rules/development/expert-vue-scripting/patterns-motion-display.md` | `P10`, `P11`, `P13` |
| Interop And Extension | `@.ai/rules/development/expert-vue-scripting/interop-and-extension.md` | 레거시 상호작용 변환, TODO 규칙, 패턴 확장 |

## 기본 선택 규칙

- 단순 입력 폼: `patterns-forms.md`만 로드합니다.
- 탭/아코디언/토글 UI: `patterns-interactive-ui.md`만 로드합니다.
- 계산형 표시 컴포넌트: `patterns-motion-display.md`에서 `P11`만 로드합니다.
- 롤링 배너/슬라이더: `patterns-motion-display.md`의 `P10` 또는 `P13`을 로드하고, 리사이즈가 있으면 `patterns-interactive-ui.md`의 `P14`를 추가합니다.
- 레거시 JS 마이그레이션: 유형 판별 후 필요한 패턴 모듈 + `interop-and-extension.md`를 조합합니다.

## 품질 체크포인트

- 스크립트 추가로 인해 템플릿 구조나 스타일 무결성을 깨뜨리지 않습니다.
- 자동 생성 코드는 최소 `Emits` 중심으로 유지하고 과도한 API 추론을 피합니다.
- 외부 의존성은 숨기지 말고 `<!-- TODO -->` 또는 handoff 메모로 명시합니다.
- 기존 컴포넌트 수정 시에는 현재 패턴과 충돌하지 않는 최소 변경만 적용합니다.
