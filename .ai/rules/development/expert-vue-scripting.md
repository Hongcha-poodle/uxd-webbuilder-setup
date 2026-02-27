````markdown
---
description: Vue 컴포넌트의 인터랙션 및 스크립트 로직 구현을 위한 전문 에이전트 규칙
---

# Expert Vue Scripting Agent (expert-vue-scripting)

이 에이전트는 시각적 변환이 완료된 Vue 컴포넌트에 인터랙션 로직(`<script setup>`)을 구현하거나, 레거시 JS를 Composition API로 변환할 때 적용해야 할 스크립트 구현 패턴과 규칙을 정의합니다.

> **적용 범위**: `expert-figma-to-vue`, `expert-legacy-to-vue` 에이전트가 컴포넌트의 스크립트 로직을 작성할 때 본 규칙을 참조합니다.

## 필수 규칙 (HARD Rules)

1. **Composition API 전용**: 모든 로직은 `<script setup lang="ts">` 내에서 Composition API로 작성합니다. Options API는 사용하지 않습니다.
2. **Nuxt Auto-imports 활용**: `ref`, `reactive`, `computed`, `watch`, `onMounted`, `onUnmounted`, `nextTick`, `navigateTo`, `useState`, `useFetch`, `useAsyncData` 등은 명시적 import 없이 사용합니다.
3. **`any` 타입 금지**: 모든 상태, 이벤트 핸들러 파라미터, 유틸리티 함수에 명시적 타입을 부여합니다.
4. **DOM 직접 조작 금지**: `document.querySelector`, `element.style.xxx = 'value'`, `classList.add/remove` 등 DOM 직접 조작 대신 반드시 Vue의 반응형 시스템(`ref`, `computed`, `:class`, `:style`, `v-if`, `v-show`)을 사용합니다.
5. **`template ref` 사용 원칙**: DOM 측정(`scrollHeight`, `getBoundingClientRect`)이나 포커스 제어(`focus()`)처럼 반응형으로 대체할 수 없는 경우에만 `template ref`를 사용합니다.

---

## 컴포넌트 유형 판별 기준 (Component Type Decision)

컴포넌트의 인터랙션 요구사항을 분석하여 아래 유형 중 하나로 분류한 뒤, 해당 유형의 구현 패턴을 적용합니다.

| 유형 | 판별 기준 | 상태 관리 위치 | 대표 예시 |
|------|----------|--------------|----------|
| **Controlled** | 부모가 `v-model`로 데이터를 제어해야 하는 경우 | 부모 (Props + Emit) | 단일 입력 필드, 체크박스 |
| **Stateful** | 내부에 복잡한 상태 전이·유효성 검사가 존재하는 경우 | 내부 (`ref`/`reactive`) + 결과만 `emit` | 다단계 폼, SMS 인증 |
| **Display** | 사용자 인터랙션 없이 데이터를 수신하여 표시하는 경우 | 없음 (Props → `computed`) | 정보 카드, 통계 표시 |
| **Interactive UI** | 탭, 아코디언, 캐러셀 등 UI 상태 전환이 주요 역할인 경우 | 내부 (`ref`) | 탭 메뉴, FAQ 아코디언 |
| **Animation** | CSS 애니메이션과 JS 제어가 결합된 경우 | 내부 (`ref` + CSS 변수) | 무한 롤링, 슬라이더 |

---

## 패턴별 구현 가이드 (Pattern Implementation Guide)

### P01. 폼 입력 — Controlled 패턴

부모 컴포넌트가 `v-model`로 값을 제어하는 단순 입력 컴포넌트에 적용합니다.

**구현 원칙**:
- Props로 현재 값을 수신하고, 변경 시 `emit('update:필드명', value)`로 부모에 전달합니다.
- 컴포넌트 내부에 상태를 보유하지 않습니다.

**이벤트 핸들러 네이밍**: `on[필드명][동작]` 형식 (예: `onNameInput`, `onPhoneNumberInput`)

```vue
<script setup lang="ts">
type Props = {
  name?: string
  phoneNumber?: string
}

type Emits = {
  (e: 'update:name', value: string): void
  (e: 'update:phone-number', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  name: '',
  phoneNumber: '',
})

const emit = defineEmits<Emits>()

const onNameInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:name', target.value)
}
</script>
```

---

### P02. 폼 입력 — Stateful 패턴

내부 상태를 가지며, 유효성 검사·조건부 활성화·다단계 플로우가 필요한 복합 폼에 적용합니다.

**구현 원칙**:
- 내부 `ref`/`reactive`로 폼 상태를 관리합니다.
- 최종 결과(제출 데이터)만 `emit`으로 부모에 전달합니다.
- 에러 상태는 필드별 `ref<boolean>` 또는 `reactive<Record<string, boolean>>`로 관리합니다.

```vue
<script setup lang="ts">
// --- 상태 정의 ---
const name = ref('')
const birthDate = ref('')
const phoneNumber = ref('')

// --- 에러 상태 ---
const errors = reactive<Record<string, boolean>>({
  name: false,
  birthDate: false,
  phoneNumber: false,
})

// --- 유효성 검사 ---
const validateField = (field: string) => {
  switch (field) {
    case 'name':
      errors.name = !name.value.trim()
      break
    case 'birthDate':
      errors.birthDate = birthDate.value.length !== 8
      break
  }
}
</script>
```

---

### P03. 입력 필터링 및 포맷팅

숫자 전용, 전화번호 하이픈 삽입 등 입력값 제한/변환이 필요한 경우에 적용합니다.

**구현 원칙**:
- `@input` 핸들러 내에서 정규식으로 필터링합니다.
- 포맷팅은 `computed` 또는 `watch`로 자동 적용합니다.
- `maxlength`, `inputmode`, `autocomplete` 등 네이티브 HTML 속성을 최대한 활용합니다.

```vue
<script setup lang="ts">
const rawPhone = ref('')

// 숫자만 허용하는 입력 핸들러
const onPhoneInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const digitsOnly = target.value.replace(/[^0-9]/g, '')
  rawPhone.value = digitsOnly
  target.value = digitsOnly // DOM 값도 동기화
}

// 포맷팅된 표시값
const formattedPhone = computed(() => {
  if (rawPhone.value.length === 8) {
    return rawPhone.value.replace(/(\d{4})(\d{4})/, '$1-$2')
  }
  return rawPhone.value
})
</script>
```

---

### P04. 조건부 활성화 (버튼 disabled 제어)

여러 필드의 입력 상태에 따라 버튼 활성화를 제어하는 경우에 적용합니다.

**구현 원칙**:
- 반드시 `computed`로 활성화 조건을 선언합니다. 이벤트 핸들러 내에서 직접 `disabled`를 토글하지 않습니다.
- 템플릿에서 `:disabled="!isFormValid"` + 조건부 Tailwind 클래스를 사용합니다.

```vue
<script setup lang="ts">
const isVerifyEnabled = computed(() => {
  return name.value.trim() !== ''
    && birthDate.value.length === 8
    && rawPhone.value.length === 8
})

const isSubmitEnabled = computed(() => {
  return isVerifyEnabled.value
    && isVerified.value
    && consentChecked.value
})
</script>

<template>
  <button
    type="button"
    :disabled="!isSubmitEnabled"
    :class="[
      'w-full rounded-[6px] px-4 py-[14px] text-center text-[16px] font-semibold leading-[24px] transition-colors duration-200',
      isSubmitEnabled
        ? 'bg-primary-orange text-white cursor-pointer hover:opacity-90 active:opacity-80'
        : 'bg-bg-light-gray text-text-placeholder cursor-not-allowed'
    ]"
    @click="handleSubmit"
  >
    보험료 확인하기
  </button>
</template>
```

---

### P05. 상태 머신 (Multi-step Flow)

SMS 인증처럼 단계적 상태 전이가 필요한 경우에 적용합니다.

**구현 원칙**:
- 상태를 유니온 타입 리터럴 `ref`로 관리합니다.
- 각 단계에서 가능한 전이를 명확히 정의합니다.
- 템플릿에서 `v-if`/`v-show`로 단계별 UI를 분기합니다.

```vue
<script setup lang="ts">
type VerificationStep = 'idle' | 'codeSent' | 'verified'
const verificationStep = ref<VerificationStep>('idle')

const requestVerification = () => {
  // API 호출 로직...
  verificationStep.value = 'codeSent'
}

const confirmVerification = (code: string) => {
  // API 호출 로직...
  verificationStep.value = 'verified'
}
</script>

<template>
  <!-- 인증번호 입력 필드 — codeSent 이후에만 표시 -->
  <div v-show="verificationStep !== 'idle'">
    <input type="text" maxlength="5" placeholder="인증번호 5자리 입력" />
  </div>
</template>
```

---

### P06. 순차적 폼 유효성 검사 (Sequential Validation on Submit)

제출 시 필드를 순서대로 검증하고, 첫 번째 에러 필드에 포커스를 이동하는 패턴입니다.

**구현 원칙**:
- 검증 함수에서 `template ref`를 사용하여 에러 필드에 `focus()`를 호출합니다.
- 검증 순서를 배열로 관리하여 확장성을 확보합니다.
- 첫 번째 에러 발견 시 즉시 `return`하여 단일 에러만 표시합니다.

```vue
<script setup lang="ts">
const nameInputRef = ref<HTMLInputElement | null>(null)
const birthInputRef = ref<HTMLInputElement | null>(null)

type ValidationRule = {
  field: string
  check: () => boolean
  ref: Ref<HTMLInputElement | null>
}

const validationRules: ValidationRule[] = [
  { field: 'name', check: () => !name.value.trim(), ref: nameInputRef },
  { field: 'birthDate', check: () => birthDate.value.length !== 8, ref: birthInputRef },
]

const handleSubmit = () => {
  // 모든 에러 초기화
  Object.keys(errors).forEach(key => { errors[key] = false })

  // 순차 검증
  for (const rule of validationRules) {
    if (rule.check()) {
      errors[rule.field] = true
      rule.ref.value?.focus()
      return
    }
  }

  // 모든 검증 통과 시 제출
  emit('submit', { name: name.value, birthDate: birthDate.value })
}
</script>
```

---

### P07. 탭 전환 (Tab Switching)

탭 메뉴로 콘텐츠를 필터링하거나 전환하는 경우에 적용합니다.

**구현 원칙**:
- 활성 탭을 유니온 타입 리터럴 `ref`로 관리합니다.
- 탭 데이터를 배열/객체로 정의하여 `v-for`로 렌더링합니다.
- `aria-selected` 속성을 동적으로 바인딩합니다.

```vue
<script setup lang="ts">
type TabType = 'damage' | 'life'

type Props = {
  defaultTab?: TabType
}

const props = withDefaults(defineProps<Props>(), {
  defaultTab: 'damage',
})

const emit = defineEmits<{
  (e: 'tab-change', tab: TabType): void
}>()

const activeTab = ref<TabType>(props.defaultTab)

const tabs: { key: TabType; label: string }[] = [
  { key: 'damage', label: '손해보험사' },
  { key: 'life', label: '생명보험사' },
]

const switchTab = (tab: TabType) => {
  if (activeTab.value === tab) return
  activeTab.value = tab
  emit('tab-change', tab)
}
</script>

<template>
  <button
    v-for="tab in tabs"
    :key="tab.key"
    :class="[
      'text-[14px] font-semibold leading-[20px] transition-colors duration-200',
      activeTab === tab.key
        ? 'font-bold text-text-primary'
        : 'text-text-disabled hover:text-text-secondary'
    ]"
    :aria-selected="activeTab === tab.key"
    @click="switchTab(tab.key)"
  >
    {{ tab.label }}
  </button>
</template>
```

---

### P08. 토글/라디오 그룹 (Toggle Group)

성별 선택 등 단일 선택 토글 그룹에 적용합니다.

**구현 원칙**:
- 선택값을 유니온 타입 `ref`로 관리합니다.
- 숨겨진 `<input type="radio">`를 유지하고, 시각적 버튼에 `:class` 바인딩합니다.
- 접근성을 위해 `role="radiogroup"` + `aria-checked`를 사용합니다.

```vue
<script setup lang="ts">
type Gender = 'male' | 'female'
const selectedGender = ref<Gender>('male')

const genderOptions: { value: Gender; label: string }[] = [
  { value: 'male', label: '남' },
  { value: 'female', label: '여' },
]
</script>

<template>
  <div class="flex rounded-[6px] border border-border-default" role="radiogroup">
    <label
      v-for="option in genderOptions"
      :key="option.value"
      :class="[
        'cursor-pointer px-4 py-3 text-[16px] leading-[24px] transition-colors duration-200',
        selectedGender === option.value
          ? 'border border-primary-orange text-primary-orange relative z-[2] -m-px'
          : 'text-text-placeholder hover:bg-bg-lighter-gray'
      ]"
      :aria-checked="selectedGender === option.value"
    >
      <input
        v-model="selectedGender"
        type="radio"
        :value="option.value"
        class="hidden"
      />
      <span>{{ option.label }}</span>
    </label>
  </div>
</template>
```

---

### P09. 아코디언 (Accordion)

FAQ, 상세 정보 펼치기/접기 UI에 적용합니다.

**구현 원칙**:
- 열림 상태를 `ref<Set<number>>`(복수 열림) 또는 `ref<number | null>`(단일 열림)로 관리합니다.
- 높이 애니메이션은 CSS `grid-template-rows: 0fr → 1fr` 트릭을 **우선** 사용합니다. `scrollHeight` 측정이 반드시 필요한 경우에만 `template ref`를 사용합니다.
- 접근성: `aria-expanded`, `aria-controls`, `id` 연결을 보장합니다.

```vue
<script setup lang="ts">
type Props = {
  mode?: 'single' | 'multiple'
  defaultOpen?: number[]
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'multiple',
  defaultOpen: () => [0],
})

const openItems = ref<Set<number>>(new Set(props.defaultOpen))

const toggle = (index: number) => {
  if (props.mode === 'single') {
    // 단일 모드: 이미 열린 항목 클릭 시 닫기, 아니면 교체
    if (openItems.value.has(index)) {
      openItems.value = new Set()
    } else {
      openItems.value = new Set([index])
    }
  } else {
    // 복수 모드: 토글
    const next = new Set(openItems.value)
    if (next.has(index)) {
      next.delete(index)
    } else {
      next.add(index)
    }
    openItems.value = next
  }
}

const isOpen = (index: number) => openItems.value.has(index)
</script>

<template>
  <!-- 아코디언 아이템 -->
  <div
    v-for="(item, index) in items"
    :key="index"
    :class="['rounded-[6px] border transition-all duration-300', isOpen(index) ? 'border-border-active shadow-md' : 'border-border-light']"
  >
    <button
      :aria-expanded="isOpen(index)"
      :aria-controls="`panel-${index}`"
      @click="toggle(index)"
    >
      <span>{{ item.title }}</span>
    </button>

    <!-- CSS grid 트릭으로 높이 애니메이션 -->
    <div
      :id="`panel-${index}`"
      class="grid transition-[grid-template-rows] duration-350 ease-[cubic-bezier(0.4,0,0.2,1)]"
      :class="isOpen(index) ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
    >
      <div class="overflow-hidden">
        <div class="p-4">
          {{ item.content }}
        </div>
      </div>
    </div>
  </div>
</template>
```

---

### P10. CSS 애니메이션 + JS 속도 제어

무한 롤링, 슬라이더 등 CSS 애니메이션의 속도를 JS에서 동적으로 제어하는 경우에 적용합니다.

**구현 원칙**:
- `@keyframes`는 `<style scoped>` 내에 정의합니다.
- JS에서 CSS custom property(`--변수명`)를 `template ref` + `style.setProperty()`로 제어합니다.
- DOM 측정이 필요하면 `onMounted` + `nextTick` + `requestAnimationFrame`을 사용합니다.
- `onUnmounted`에서 이벤트 리스너를 반드시 해제합니다.

```vue
<script setup lang="ts">
const rollingRef = ref<HTMLElement | null>(null)
const scrollDurationTop = ref(30)
const scrollDurationBottom = ref(30)
let baseSpeedPxPerSec: number | null = null

const measureAndSetDurations = () => {
  if (!rollingRef.value) return

  const topGroup = rollingRef.value.querySelector<HTMLElement>('[data-row="top"] .group')
  const bottomGroup = rollingRef.value.querySelector<HTMLElement>('[data-row="bottom"] .group')
  if (!topGroup || !bottomGroup) return

  const topWidth = topGroup.getBoundingClientRect().width
  const bottomWidth = bottomGroup.getBoundingClientRect().width

  if (!baseSpeedPxPerSec) {
    baseSpeedPxPerSec = topWidth / 30 // 기준 속도 확립
  }

  scrollDurationTop.value = Math.max(8, topWidth / baseSpeedPxPerSec)
  scrollDurationBottom.value = Math.max(8, bottomWidth / baseSpeedPxPerSec)
}

// 레이아웃 변경 후 측정 (더블 RAF)
const measureDeferred = () => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      measureAndSetDurations()
    })
  })
}

// 리사이즈 대응 (debounce)
let resizeTimer: ReturnType<typeof setTimeout> | null = null

const onResize = () => {
  if (resizeTimer) clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => measureAndSetDurations(), 150)
}

onMounted(() => {
  measureDeferred()
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
  if (resizeTimer) clearTimeout(resizeTimer)
})
</script>

<template>
  <div
    ref="rollingRef"
    :style="{
      '--scroll-duration-top': `${scrollDurationTop}s`,
      '--scroll-duration-bottom': `${scrollDurationBottom}s`,
    }"
  >
    <!-- 트랙 콘텐츠 -->
  </div>
</template>

<style scoped>
@keyframes scrollLeft {
  from { transform: translate3d(0, 0, 0); }
  to   { transform: translate3d(-50%, 0, 0); }
}

.track-top {
  animation: scrollLeft var(--scroll-duration-top) linear infinite;
}
</style>
```

---

### P11. 데이터 표시 — Display 컴포넌트

외부 데이터를 Props로 수신하여 파생 데이터를 계산·표시하는 경우에 적용합니다.

**구현 원칙**:
- 비즈니스 로직 연산은 `computed`로 처리하여 Props 변경 시 자동으로 재계산됩니다.
- 내부 `ref` 상태를 두지 않습니다 (순수 파생).
- 복잡한 연산 로직은 별도 유틸리티 함수 또는 composable로 분리합니다.

```vue
<script setup lang="ts">
type Props = {
  userName: string
  birthDate: string // YYYYMMDD
}

const props = defineProps<Props>()

// 순수 연산 함수 (composable 또는 utils로 분리 가능)
const calculateInsuranceAge = (birthDate: string) => {
  // 계산 로직...
  return { age: 0, daysLeft: 0, increaseDate: { year: 0, month: 0, day: 0 } }
}

// Props가 변경되면 자동 재계산
const insuranceInfo = computed(() => calculateInsuranceAge(props.birthDate))
</script>
```

---

### P12. 모달/오버레이 트리거

모달, 바텀시트, 팝업 등을 열고 닫는 패턴에 적용합니다.

**구현 원칙**:
- 모달의 열림/닫힘 상태는 **부모**에서 `v-model` 또는 `ref<boolean>`로 관리합니다.
- 자식 컴포넌트는 `emit('open-modal')`, `emit('close-modal')` 등으로만 요청합니다.
- `document.body.style.overflow` 같은 전역 DOM 조작은 직접 하지 않고, 부모나 composable(`useBodyScrollLock`)에 위임합니다.

```vue
<script setup lang="ts">
// 자식 컴포넌트 — 모달 열기만 요청
const emit = defineEmits<{
  (e: 'open-modal', name: string): void
}>()

const handleCTA = () => {
  emit('open-modal', 'consultation')
}
</script>
```

---

### P13. 무한 스크롤 데이터 복제

CSS `translate`를 이용한 끊김 없는 무한 스크롤에서 데이터 세트를 복제하는 패턴입니다.

**구현 원칙**:
- 원본 데이터를 `v-for`로 렌더링하는 그룹을 2번 반복합니다.
- 두 번째 그룹에 `aria-hidden="true"`를 적용하여 접근성을 보장합니다.
- 필터링(`v-show`)과 복제가 동시에 필요한 경우, `computed`로 필터링된 데이터를 먼저 산출한 뒤 2회 렌더링합니다.

```vue
<script setup lang="ts">
type InsurerItem = {
  code: string
  name: string
  logo: string
  type: 'damage' | 'life'
}

const props = defineProps<{ items: InsurerItem[] }>()

const activeTab = ref<'damage' | 'life'>('damage')

const filteredItems = computed(() =>
  props.items.filter(item => item.type === activeTab.value)
)
</script>

<template>
  <div class="track">
    <!-- 원본 그룹 -->
    <div class="group">
      <div v-for="item in filteredItems" :key="item.code">
        <img :src="item.logo" :alt="item.name" />
      </div>
    </div>
    <!-- 복제 그룹 (무한 스크롤용) -->
    <div class="group" aria-hidden="true">
      <div v-for="item in filteredItems" :key="`dup-${item.code}`">
        <img :src="item.logo" :alt="item.name" />
      </div>
    </div>
  </div>
</template>
```

---

### P14. 리사이즈 대응 (Resize Handler)

윈도우 크기 변경에 반응하여 레이아웃을 재계산하는 경우에 적용합니다.

**구현 원칙**:
- `onMounted`에서 `addEventListener`, `onUnmounted`에서 `removeEventListener`를 반드시 쌍으로 작성합니다.
- debounce를 적용하여 과도한 재계산을 방지합니다 (기본 150ms).
- 타이머 참조를 클린업합니다.

```vue
<script setup lang="ts">
let resizeTimer: ReturnType<typeof setTimeout> | null = null

const handleResize = () => {
  // 재계산 로직...
}

const onResize = () => {
  if (resizeTimer) clearTimeout(resizeTimer)
  resizeTimer = setTimeout(handleResize, 150)
}

onMounted(() => window.addEventListener('resize', onResize))
onUnmounted(() => {
  window.removeEventListener('resize', onResize)
  if (resizeTimer) clearTimeout(resizeTimer)
})
</script>
```

---

## 컴포넌트 간 통신 (Inter-component Communication)

레거시 코드에서 발견되는 글로벌 함수 호출·타 컴포넌트 DOM 직접 접근은 Vue에서 아래 규칙을 따릅니다.

### 변환 규칙

| 레거시 패턴 | Vue 변환 | 비고 |
|------------|---------|------|
| `window.globalFunc()` | `emit('이벤트명')` → 부모에서 처리 | 단방향 상향 통신 |
| `document.querySelector('[data-component="..."]')` | 부모가 `v-model` / Props로 전달 | 단방향 하향 통신 |
| `new OtherComponent(el)` | `<ChildComponent :prop="value" />` | 선언적 자식 포함 |
| `window.addEventListener('custom-event')` | `provide`/`inject` 또는 composable | 깊은 컴포넌트 트리 |
| `document.body.style.overflow = 'hidden'` | composable (`useBodyScrollLock`) | 전역 부수효과 격리 |

### TODO 플레이스홀더 규칙

변환 시점에 즉시 해결할 수 없는 외부 의존성은 `<!-- TODO -->` 코멘트로 표시합니다:

```html
<!-- TODO: [window.showSpinner] — 부모 컴포넌트에서 emit으로 처리 필요 -->
<!-- TODO: [T005_E02_5] — 부모 컴포넌트에서 props/v-model로 상태 전환 필요 -->
<!-- TODO: [T006_F01_4.setUserData] — props 바인딩으로 데이터 전달 구조 전환 필요 -->
```

---

## 확장 가이드 (Extension Guide)

새로운 인터랙션 패턴이 발견될 경우, 아래 템플릿에 따라 본 문서에 패턴을 추가합니다.

### 패턴 추가 템플릿

```markdown
### P[번호]. [패턴 이름] ([English Name])

[1~2문장 설명: 어떤 상황에서 적용하는지]

**구현 원칙**:
- [핵심 원칙 1]
- [핵심 원칙 2]
- [핵심 원칙 3]

\`\`\`vue
<script setup lang="ts">
// 코드 예시
</script>
\`\`\`
```

### 패턴 번호 규칙
- `P01`~`P19`: 폼 및 입력 관련
- `P20`~`P39`: UI 상태 전환 (탭, 아코디언, 모달 등)
- `P40`~`P59`: 애니메이션 및 DOM 측정
- `P60`~`P79`: 데이터 표시 및 연산
- `P80`~`P99`: 네트워크/API 및 외부 연동

> 현재 등록된 패턴: P01~P14 (총 14개)

````
