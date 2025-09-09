<script setup lang="ts">
const colorMode = useColorMode()

const isDark = computed(() => colorMode.value === "dark")

const toggleTheme = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark"
}

// Ensure proper hydration and prevent flickering
const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})
</script>

<template>
  <UButton
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    variant="ghost"
    size="sm"
    square
    class="transition-transform duration-200 ease-in-out active:scale-95 hover:scale-105"
    @click="toggleTheme"
  >
    <!-- Theme icons - using standard phosphor names -->
    <UIcon
      :name="mounted && isDark ? 'i-ph-moon' : 'i-ph-sun'"
      class="w-5 h-5 transition-opacity duration-150"
      :class="{ 'opacity-50': !mounted }"
    />
  </UButton>
</template>
