<script setup lang="ts">
const route = useRoute()
const componentName = route.params.name as string

const DynamicComponent = defineAsyncComponent(() =>
  import(`~/components/${componentName}.vue`).catch(() => {
    return defineComponent({
      render: () =>
        h(
          'div',
          { class: 'text-status-error font-bold p-5' },
          `Component '${componentName}.vue' not found`
        ),
    })
  })
)
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
      <span class="text-sm font-medium text-text-primary">{{ componentName }}</span>
    </nav>

    <!-- 컴포넌트 렌더링 -->
    <div>
      <DynamicComponent />
    </div>
  </div>
</template>
