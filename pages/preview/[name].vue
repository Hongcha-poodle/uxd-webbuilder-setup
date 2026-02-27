<script setup lang="ts">
const route = useRoute()
const componentName = route.params.name as string

const frameWidth = ref(360)
const frameHeight = ref(640)
const presets = [360, 390, 414, 768] as const

const iframeSrc = computed(() => `/preview/raw/${componentName}`)

const clampWidth = () => {
  frameWidth.value = Math.min(768, Math.max(360, frameWidth.value))
}

const onMessage = (event: MessageEvent) => {
  if (event.data?.type === 'preview-resize' && typeof event.data.height === 'number') {
    frameHeight.value = event.data.height
  }
}

onMounted(() => {
  window.addEventListener('message', onMessage)
})

onUnmounted(() => {
  window.removeEventListener('message', onMessage)
})
</script>

<template>
  <div class="flex flex-col h-screen">
    <!-- Row 1: Component Info (기존 유지) -->
    <div
      class="flex-none bg-slate-900 text-white px-4 py-3 flex justify-between items-center z-50 shadow-md"
    >
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

    <!-- Row 2: Width Controls -->
    <div
      class="flex-none bg-slate-800 text-white px-4 py-2 flex items-center gap-4 border-t border-slate-700"
    >
      <span class="text-xs text-slate-400 mr-1">Width</span>

      <!-- Preset Buttons -->
      <div class="flex gap-1.5">
        <button
          v-for="preset in presets"
          :key="preset"
          class="px-2.5 py-1 text-xs rounded transition-colors"
          :class="
            frameWidth === preset
              ? 'bg-blue-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          "
          @click="frameWidth = preset"
        >
          {{ preset }}
        </button>
      </div>

      <!-- Slider -->
      <input
        v-model.number="frameWidth"
        type="range"
        :min="360"
        :max="768"
        class="flex-1 h-1.5 accent-blue-500 cursor-pointer"
      />

      <!-- Current Width Display -->
      <div class="flex items-center gap-1">
        <input
          v-model.number="frameWidth"
          type="number"
          :min="360"
          :max="768"
          class="w-14 bg-slate-700 text-white text-xs text-center rounded px-1.5 py-1 border border-slate-600 focus:border-blue-500 focus:outline-none"
          @blur="clampWidth"
        />
        <span class="text-xs text-slate-400">px</span>
      </div>
    </div>

    <!-- Device Frame Area -->
    <div class="flex-1 bg-gray-100 flex items-start justify-center overflow-auto py-8">
      <div
        class="rounded-lg border border-gray-300 shadow-lg bg-white overflow-hidden transition-[width] duration-200"
        :style="{ width: `${frameWidth}px` }"
      >
        <iframe
          :src="iframeSrc"
          :style="{ width: `${frameWidth}px`, height: `${frameHeight}px` }"
          class="block border-0"
          title="Component Preview"
        />
      </div>
    </div>
  </div>
</template>
