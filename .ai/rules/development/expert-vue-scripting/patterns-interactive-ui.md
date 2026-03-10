---
description: 탭, 토글, 아코디언, 모달, 리사이즈 대응 등 Interactive UI 패턴 모듈
---

# Expert Vue Scripting Patterns - Interactive UI

이 모듈은 Interactive UI 유형에서 자주 쓰는 탭 전환, 토글 그룹, 아코디언, 모달 트리거, 리사이즈 대응 패턴을 다룹니다.

### P07. 탭 전환 (Tab Switching)

탭 메뉴로 콘텐츠를 필터링하거나 전환하는 경우에 적용합니다.

**구현 원칙**:
- 활성 탭을 유니온 타입 리터럴 `ref`로 관리합니다.
- 탭 데이터를 배열/객체로 정의하여 `v-for`로 렌더링합니다.
- `aria-selected` 속성을 동적으로 바인딩합니다.

```vue
<script setup lang="ts">
type TabType = 'damage' | 'life'

const emit = defineEmits<{
  (e: 'tab-change', tab: TabType): void
}>()

const activeTab = ref<TabType>('damage')

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
const mode = ref<'single' | 'multiple'>('multiple')
const openItems = ref<Set<number>>(new Set([0]))

const toggle = (index: number) => {
  if (mode.value === 'single') {
    if (openItems.value.has(index)) {
      openItems.value = new Set()
    } else {
      openItems.value = new Set([index])
    }
  } else {
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
