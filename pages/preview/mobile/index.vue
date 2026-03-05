<template>
  <main class="min-h-screen bg-white">
    <!-- 헤더 -->
    <header class="sticky top-0 z-10 bg-white border-b border-border-default px-5 py-3">
      <h1 class="text-lg font-bold text-text-primary">Mobile Preview</h1>
      <div class="mt-2">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="컴포넌트 검색..."
          class="w-full px-3 py-2 text-sm bg-bg-light-gray border border-border-default rounded-lg focus:outline-none focus:border-border-active"
        >
      </div>
    </header>

    <!-- 컴포넌트 목록 -->
    <div v-if="filteredComponents.length === 0" class="flex flex-col items-center justify-center py-20 px-5">
      <p class="text-sm text-text-placeholder">컴포넌트가 없습니다</p>
    </div>

    <ul v-else class="divide-y divide-border-default">
      <li v-for="comp in filteredComponents" :key="comp.name">
        <NuxtLink
          :to="`/preview/mobile/${comp.name}`"
          class="flex items-center justify-between px-5 py-4 active:bg-bg-light-gray transition-colors"
        >
          <span class="text-sm font-medium text-text-primary">{{ comp.name }}</span>
          <span class="text-text-placeholder text-xs">&rsaquo;</span>
        </NuxtLink>
      </li>
    </ul>
  </main>
</template>

<script setup lang="ts">
const componentModules = import.meta.glob('~/components/**/*.vue')

interface ComponentInfo {
  name: string
  path: string
}

const componentsList = computed<ComponentInfo[]>(() => {
  return Object.keys(componentModules).map((filePath) => {
    const fileName = filePath.split('/').pop()?.replace('.vue', '') || ''
    return { name: fileName, path: filePath }
  }).sort((a, b) => a.name.localeCompare(b.name))
})

const searchQuery = ref('')

const filteredComponents = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) return componentsList.value
  return componentsList.value.filter(c =>
    c.name.toLowerCase().includes(query)
  )
})
</script>
