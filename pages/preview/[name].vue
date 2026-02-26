<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
const route = useRoute()
const componentName = route.params.name as string

// Dynamic async component importing based on the route parameter
// Fallback to a plain text element if the component cannot be found.
const DynamicComponent = defineAsyncComponent(() =>
  import(`~/components/${componentName}.vue`).catch(() => {
    return defineComponent({
      render: () => h('div', { class: 'text-red-500 font-bold p-4' }, `Component '${componentName}.vue' not found in ~/components/`)
    })
  })
)
</script>

<template>
  <main class="min-h-screen bg-bg-light-gray flex flex-col items-center justify-center p-8">
    
    <!-- Top Bar with Component Info -->
    <div class="fixed top-0 left-0 w-full bg-slate-900 text-white p-3 flex justify-between items-center z-50 shadow-md">
      <div class="flex items-center gap-3">
        <NuxtLink
          to="/preview"
          class="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white border border-slate-700 hover:border-slate-400 px-2.5 py-1.5 rounded transition-colors"
        >
          ← 목록으로
        </NuxtLink>
        <span class="font-bold text-lg border-r border-slate-600 pr-3">Nuxt Component Preview</span>
        <span class="font-mono text-sm text-green-400">&lt;{{ componentName }} /&gt;</span>
      </div>
      <div class="text-xs text-slate-400">
        File: <code class="bg-slate-800 px-1 rounded">~/components/{{ componentName }}.vue</code>
      </div>
    </div>

    <!-- Component Render Area -->
    <div class="w-full max-w-[1440px] mt-16 bg-white shadow-2xl rounded-xl overflow-hidden border border-slate-200 relative min-h-[400px]">
      <DynamicComponent />
    </div>

  </main>
</template>
