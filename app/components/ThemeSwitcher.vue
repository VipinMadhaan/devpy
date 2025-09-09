<script setup lang="ts">
const colorMode = useColorMode()

const isDark = computed(() => colorMode.value === "dark")

const toggleTheme = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark"
}
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
    <UIcon v-if="isDark" name="i-ph-moon" class="w-5 h-5" />
    <UIcon v-else name="i-ph-sun" class="w-5 h-5" />
  </UButton>
</template>
