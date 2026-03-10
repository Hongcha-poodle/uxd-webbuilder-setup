---
description: 폼 입력, 검증, 상태 전이에 관련된 Vue 스크립트 패턴 모듈
---

# Expert Vue Scripting Patterns - Forms

이 모듈은 Controlled 입력, Stateful 폼, 입력 포맷팅, 버튼 활성화, 다단계 상태 전이, 순차 검증 패턴을 다룹니다.

### P01. 폼 입력 — Controlled 요구사항 대응 (수동 API 위임)

`v-model` 기반 부모 제어가 필요한 경우, 입력 계약이 명확하면 `Props` API를 명시적으로 추가할 수 있습니다. 다만 근거 없는 자동 생성으로 계약을 부풀리지는 않습니다.

**구현 원칙**:
- 생성 코드에서는 내부 상태(`ref`) 기반으로 입력 흐름만 구성합니다.
- 부모 연동 API(`Props`/`v-model`)는 실제 요구사항이 확인된 범위에서만 명시적으로 설계합니다.
- 이벤트 알림이 필요한 경우 최소 `Emits`만 선언합니다.

```vue
<script setup lang="ts">
const name = ref('')
const phoneNumber = ref('')

type Emits = {
  (e: 'name-input', value: string): void
  (e: 'phone-input', value: string): void
}

const emit = defineEmits<Emits>()

const onNameInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  name.value = target.value
  emit('name-input', target.value)
}

const onPhoneNumberInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  phoneNumber.value = target.value
  emit('phone-input', target.value)
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
// 3. State
const rawPhone = ref('')

// 4. Computed — 포맷팅된 표시값
const formattedPhone = computed(() => {
  if (rawPhone.value.length === 8) {
    return rawPhone.value.replace(/(\d{4})(\d{4})/, '$1-$2')
  }
  return rawPhone.value
})

// 6. 핸들러 함수 — 숫자만 허용하는 입력 핸들러
const onPhoneInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const digitsOnly = target.value.replace(/[^0-9]/g, '')
  rawPhone.value = digitsOnly
  target.value = digitsOnly // DOM 값도 동기화
}
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
