<script setup lang="ts">
import { decodePreviewComponentId, resolvePreviewComponent } from '~/utils/preview-resolver'

const route = useRoute()
const componentId = computed(() => {
  const param = route.params.name
  return Array.isArray(param) ? param.join('/') : String(param ?? '')
})
const componentModules = import.meta.glob('~/components/**/*.vue')
const resolvedComponent = computed(() => resolvePreviewComponent(componentModules, componentId.value))
const componentLabel = computed(() => resolvedComponent.value.entry?.relativePath ?? decodePreviewComponentId(componentId.value))

const MissingComponent = defineComponent({
  setup() {
    return () => h('div', { class: 'm-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700' }, [
      h('p', { class: 'font-bold' }, 'Component preview is unavailable.'),
      h('p', { class: 'mt-2 font-mono text-xs' }, `requested: ${decodePreviewComponentId(componentId.value)}`),
      h('p', { class: 'mt-1 font-mono text-xs' }, `reason: ${resolvedComponent.value.reason}`),
    ])
  },
})

const DynamicComponent = computed(() => {
  if (!resolvedComponent.value.entry) {
    return MissingComponent
  }

  return defineAsyncComponent(resolvedComponent.value.entry.loader)
})
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- 최소한의 네비게이션 -->
    <nav class="sticky top-0 z-10 bg-white border-b border-border-default px-5 py-3 flex items-center gap-3">
      <NuxtLink
        to="/preview/mobile"
        class="text-sm text-text-secondary"
      >
        &lsaquo; 목록
      </NuxtLink>
      <span class="text-sm font-medium text-text-primary">{{ componentLabel }}</span>
    </nav>

    <!-- 컴포넌트 렌더링 -->
    <div>
      <component :is="DynamicComponent" />
    </div>
  </div>
</template>
