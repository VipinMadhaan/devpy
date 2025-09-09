export default defineNuxtPlugin(() => {
  const colorMode = useColorMode()

  // Force refresh on client hydration
  onMounted(() => {
    nextTick(() => {
      // Trigger reactive update to ensure UI reflects current mode
      const currentMode = colorMode.value
      colorMode.preference = currentMode === "dark" ? "dark" : "light"
    })
  })
})
