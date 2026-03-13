<script setup lang="ts">
import { decodePreviewComponentId, resolvePreviewComponent } from '~/utils/preview-resolver'

const route = useRoute()
const componentId = computed(() => {
  const param = route.params.name
  return Array.isArray(param) ? param.join('/') : String(param ?? '')
})
const componentModules = import.meta.glob('~/components/**/*.vue')
const resolvedComponent = computed(() => resolvePreviewComponent(componentModules, componentId.value))
let observer: ResizeObserver | undefined

const MissingComponent = defineComponent({
  setup() {
    return () => h('div', { class: 'm-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700' }, [
      h('p', { class: 'font-bold' }, 'Preview component could not be resolved.'),
      h('p', { class: 'mt-2 font-mono text-xs text-red-900' }, `requested: ${decodePreviewComponentId(componentId.value)}`),
      h('p', { class: 'mt-1 font-mono text-xs text-red-900' }, `reason: ${resolvedComponent.value.reason}`),
      h('div', { class: 'mt-3' }, [
        h('p', { class: 'font-semibold text-red-900' }, 'attempted paths'),
        h('ul', { class: 'mt-1 list-disc pl-5 font-mono text-xs text-red-900' }, resolvedComponent.value.attemptedFilePaths.map(filePath =>
          h('li', filePath),
        )),
      ]),
      resolvedComponent.value.ambiguousMatches.length > 0
        ? h('div', { class: 'mt-3' }, [
            h('p', { class: 'font-semibold text-red-900' }, 'ambiguous matches'),
            h('ul', { class: 'mt-1 list-disc pl-5 font-mono text-xs text-red-900' }, resolvedComponent.value.ambiguousMatches.map(entry =>
              h('li', entry.filePath),
            )),
          ])
        : null,
    ])
  },
})

const DynamicComponent = computed(() => {
  if (!resolvedComponent.value.entry) {
    return MissingComponent
  }

  return defineAsyncComponent(resolvedComponent.value.entry.loader)
})

onMounted(() => {
  const sendHeight = () => {
    const height = document.documentElement.scrollHeight
    window.parent.postMessage({ type: 'preview-resize', height }, '*')
  }

  observer = new ResizeObserver(() => {
    sendHeight()
  })

  observer.observe(document.body)
  sendHeight()
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <div>
    <component :is="DynamicComponent" />
  </div>
</template>
