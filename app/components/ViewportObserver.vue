<template>
  <div v-if="isVisible" ref="element">
    <slot />
  </div>
  <div v-else ref="placeholder" class="min-h-[200px] flex items-center justify-center">
    <div class="animate-pulse bg-gray-200 dark:bg-gray-700 rounded w-full h-48" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const element = ref<HTMLElement>()
const placeholder = ref<HTMLElement>()
const isVisible = ref(false)

let observer: IntersectionObserver | null = null

onMounted(() => {
  if (placeholder.value) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible.value) {
            isVisible.value = true
            observer?.disconnect()
          }
        })
      },
      {
        rootMargin: '100px'
      }
    )
    
    observer.observe(placeholder.value)
  }
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>