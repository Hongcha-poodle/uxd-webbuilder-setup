<template>
  <main class="min-h-screen bg-bg-light-gray p-8">
    <div class="max-w-6xl mx-auto">
      <header class="mb-10 text-center">
        <h1 class="text-3xl font-bold text-text-primary mb-2">프리뷰 갤러리</h1>
        <p class="text-gray-500">생성된 모든 Vue 컴포넌트를 한눈에 확인하고 테스트하세요.</p>
      </header>

      <!-- 검색 영역 -->
      <div class="mb-8 p-4 bg-white rounded-xl shadow-sm border border-slate-200 flex justify-between items-center sm:flex-row flex-col gap-4">
        <div class="relative w-full max-w-md">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="컴포넌트 이름 검색..."
            class="w-full pl-4 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent transition-all"
          />
        </div>
        <div class="text-sm font-medium text-slate-500 whitespace-nowrap">
          검색된 컴포넌트: <span class="text-primary-orange font-bold">{{ filteredComponents.length }}</span>개
        </div>
      </div>

      <!-- 빈 상태 처리 -->
      <div v-if="filteredComponents.length === 0" class="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-slate-200">
        <span class="text-4xl mb-4">🧩</span>
        <h3 class="text-xl font-bold text-slate-700 mb-2">컴포넌트가 없습니다</h3>
        <p class="text-slate-500 text-center max-w-md">
          아직 <code>~/components</code> 폴더에 생성된 Vue 컴포넌트가 없거나,<br/>
          검색어와 일치하는 항목이 없습니다.
        </p>
      </div>

      <!-- 컴포넌트 목록 그리드 -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink 
          v-for="comp in filteredComponents" 
          :key="comp.name"
          :to="`/preview/${comp.name}`"
          class="group block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md hover:border-primary-orange transition-all duration-200"
        >
          <div class="p-6">
            <div class="flex items-center justify-between mb-3">
              <h2 class="text-lg font-bold text-slate-800 group-hover:text-primary-orange transition-colors truncate pr-2">
                {{ comp.name }}
              </h2>
              <span class="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded">.vue</span>
            </div>
            <p class="text-xs text-slate-400 truncate" :title="comp.path">{{ comp.path }}</p>
          </div>
          <div class="bg-slate-50 p-3 text-right border-t border-slate-100 text-sm font-medium text-slate-500 group-hover:text-primary-orange group-hover:bg-orange-50 transition-colors">
            프리뷰 보기 &rarr;
          </div>
        </NuxtLink>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Vite 기능을 사용하여 components 폴더의 모든 .vue 파일을 동적으로 가져옵니다.
const componentModules = import.meta.glob('~/components/**/*.vue')

interface ComponentInfo {
  name: string
  path: string
}

// 추출된 경로에서 컴포넌트 이름과 정보를 매핑
const componentsList = computed<ComponentInfo[]>(() => {
  return Object.keys(componentModules).map((filePath) => {
    // 예: ~/components/Header/Nav.vue -> Nav
    const fileName = filePath.split('/').pop()?.replace('.vue', '') || ''
    return {
      name: fileName,
      path: filePath
    }
  }).sort((a, b) => a.name.localeCompare(b.name)) // 알파벳 순 정렬
})

const searchQuery = ref('')

const filteredComponents = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) return componentsList.value
  
  return componentsList.value.filter(c => 
    c.name.toLowerCase().includes(query) || 
    c.path.toLowerCase().includes(query)
  )
})
</script>
