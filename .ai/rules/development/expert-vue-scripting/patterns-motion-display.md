---
description: 애니메이션, 표시용 계산, 무한 스크롤 복제 패턴 모듈
---

# Expert Vue Scripting Patterns - Motion And Display

이 모듈은 CSS animation 제어, Display 계산, 무한 스크롤 데이터 복제 패턴을 다룹니다.

### P11. 데이터 표시 — Display 컴포넌트

내부 데이터 또는 composable 결과를 계산·표시하는 경우에 적용합니다.

**구현 원칙**:
- 비즈니스 로직 연산은 `computed`로 처리하여 상태 변경 시 자동으로 재계산됩니다.
- AI 생성 코드에서 `Props`/`defineProps`는 추가하지 않습니다. Props 정의는 개발팀이 직접 추가합니다.
- 복잡한 연산 로직은 별도 유틸리티 함수 또는 composable로 분리합니다.

```vue
<script setup lang="ts">
const birthDate = ref('19900101') // 실제 데이터 주입은 개발팀에서 수동 연결

const calculateInsuranceAge = (value: string) => {
  return { age: 0, daysLeft: 0, increaseDate: { year: 0, month: 0, day: 0 } }
}

const insuranceInfo = computed(() => calculateInsuranceAge(birthDate.value))
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

const items = ref<InsurerItem[]>([])
const activeTab = ref<'damage' | 'life'>('damage')

const filteredItems = computed(() =>
  items.value.filter(item => item.type === activeTab.value)
)
</script>

<template>
  <div class="track">
    <div class="group">
      <div v-for="item in filteredItems" :key="item.code">
        <img :src="item.logo" :alt="item.name" />
      </div>
    </div>
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
