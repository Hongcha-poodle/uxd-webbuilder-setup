<script setup lang="ts">
const route = useRoute()
const componentName = route.params.name as string
let observer: ResizeObserver | undefined

const DynamicComponent = defineAsyncComponent(() =>
  import(`~/components/${componentName}.vue`).catch(() => {
    return defineComponent({
      render: () =>
        h(
          'div',
          { class: 'text-red-500 font-bold p-4' },
          `Component '${componentName}.vue' not found in ~/components/`
        ),
    })
  })
)

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
    <DynamicComponent />
  </div>
</template>
