<script setup lang="ts">
// Initialize color mode early
const colorMode = useColorMode()

useHead({
  htmlAttrs: {
    lang: "en",
  },
  link: [
    {
      rel: "icon",
      type: "image/png",
      href: "/favicon.png",
    },
    {
      rel: "alternate",
      type: "application/rss+xml",
      title: "Vipin Kumar Madhaan - DevPy Blog",
      href: "/rss.xml",
    },
  ],
  meta: [
    {
      name: "google-site-verification",
      content: "HCL7-zzyR002AD-QxBUEhq9uwSKx2KWCsamU0ANbBW8",
    },
    {
      name: "msvalidate.01",
      content: "8E520DCC754D9DE129C9B0DAC9334070",
    },
  ],
  script: [
    {
      innerHTML: `
        (function() {
          const preference = localStorage.getItem('nuxt-color-mode') || 'system';
          let theme = preference;
          
          if (preference === 'system') {
            theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          }
          
          if (theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        })();
      `,
    },
  ],
})

// Ensure color mode is reactive
watch(
  () => colorMode.value,
  (newMode) => {
    if (import.meta.client) {
      document.documentElement.classList.toggle("dark", newMode === "dark")
    }
  },
  { immediate: true },
)
</script>
<template>
  <div>
    <div>
      <NuxtLoadingIndicator />
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
      <NuxtRouteAnnouncer />
    </div>
  </div>
</template>
