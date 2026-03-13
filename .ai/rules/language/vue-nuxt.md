# Vue & Nuxt 규칙 (vue-nuxt.md)

이 문서는 프로젝트 내 Vue 3 및 Nuxt 4 컴포넌트 작성에 필요한 핵심 규칙을 정의합니다.

## 핵심 원칙
- **Vue 3 Composition API**: 모든 컴포넌트는 `<script setup>` 구문을 사용해야 합니다. Options API는 사용하지 않습니다.
- **Nuxt 4 Auto-imports**: Nuxt 4의 내장 기능을 활용하여 `ref`, `reactive`, `computed`, `watch` 등은 명시적으로 import하지 않습니다. 컴포넌트 또한 `~/components/` 내에 존재하므로 별도의 import 없이 템플릿에서 바로 사용합니다 (`nuxt.config.ts` 설정에 따라 prefix 없이 사용 가능).
- **[HARD] Props 생성 금지**: AI 자동 생성 결과물에서 `type Props`, `interface Props`, `defineProps`, `withDefaults(defineProps(...))` 패턴을 **일절 추가하지 않습니다**. Props 정의는 개발팀이 직접 추가하므로 AI가 생성하거나 추론해서는 안 됩니다.
## 컴포넌트 구조
- 오직 Vue Single File Component (`.vue`)로 작성합니다.
- 블록 순서: `<script setup lang="ts">` → `<template>` → `<style scoped>` 순으로 작성합니다.
- `app.vue` 및 레이아웃, 페이지 구성 시에는 내장 컴포넌트인 `<NuxtPage />` 와 파일 기반 라우팅을 활용합니다.

## `<script setup>` 내부 코드 순서

`<script setup lang="ts">` 블록 내부는 반드시 아래 6단계 순서를 준수합니다. 해당 단계가 없으면 건너뜁니다.

```typescript
// 1. Types — Emits, 내부 상태에 사용할 타입 정의
type Emits = { ... }
type TabType = 'a' | 'b'

// 2. Emits — defineEmits
const emit = defineEmits<Emits>()

// 3. 상태 (State) — ref, reactive
const value = ref('')
const form = reactive({ ... })

// 4. Computed — computed 파생 값
const isValid = computed(() => ...)

// 5. Watchers — watch, watchEffect
watch(value, (next) => { ... })

// 6. 핸들러 함수 & Lifecycle — 이벤트 핸들러, 비즈니스 로직, onMounted/onUnmounted
const onNameInput = (event: Event) => { ... }
const handleSubmit = () => { ... }
onMounted(() => { ... })
onUnmounted(() => { ... })
```

## 에셋 참조 및 폴더 구조

이미지, 아이콘, 전역 스타일 등의 정적 에셋은 `~/assets/` 경로를 통해 참조하며, 아래 Vue/Nuxt 권장 폴더 구조를 준수합니다:

```
assets/
├── css/      # 전역 스타일시트 (예: tailwind.css)
├── images/   # 래스터 이미지 (png, jpg, jpeg, webp, gif)
│             # 파일명 규칙: kebab-case (예: hero-background.png)
├── icons/    # SVG 아이콘 파일
│             # 파일명 규칙: icon-[name].svg (예: icon-arrow.svg)
```

- `<script setup>` 블록 안에서 에셋을 명시적으로 import하여 템플릿의 `:src` 등에 바인딩합니다.
  - 예: `import heroImage from '~/assets/images/hero-background.png'`
  - 예: `import arrowIcon from '~/assets/icons/icon-arrow.svg'`
  - 예: `import logoImage from '~/assets/images/logo.svg'`

## 이벤트 및 상태 관리
- 상태 값은 `ref` (원시 타입) 또는 `reactive` (객체)를 명확하게 구분하여 사용합니다.
- 전역 상태가 필요한 경우 `useState` 등의 Nuxt 내장 컴포지저블을 사용합니다.
- 컴포넌트의 인터랙션 로직(폼 입력, 유효성 검사, 탭 전환, 아코디언, 애니메이션 제어 등) 구현 시에는 먼저 `@.ai/rules/development/expert-vue-scripting.md` 인덱스로 유형을 판별한 뒤, 필요한 세부 패턴 모듈만 선택하여 참조합니다.

## Emit 명명 규칙

Emit 이름은 사용 목적에 따라 두 가지 형식을 구분하여 사용합니다. 혼용을 금지합니다.

| 목적 | 형식 | 예시 |
|------|------|------|
| `v-model` 연동 (값 전달) | `update:propName` (camelCase) | `update:modelValue`, `update:name`, `update:activeTab` |
| 동작/이벤트 알림 (트리거) | `kebab-case` 동사형 | `tab-change`, `modal-open`, `form-submit`, `item-select` |

```typescript
// v-model 연동 — 부모가 값을 직접 바인딩할 때
type Emits = {
  (e: 'update:name', value: string): void
}

// 동작 알림 — 부모에게 이벤트 발생을 통보할 때
type Emits = {
  (e: 'tab-change', tab: TabType): void
  (e: 'form-submit', data: FormData): void
}
```

**금지 패턴**: 동작 이벤트에 `update:` prefix 사용 (`update:tab` → `tab-change`로 교체)
