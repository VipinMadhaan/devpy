<template>
  <section class="relative py-8 pb-24">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto text-center">
        <div class="mb-8">
          <NuxtImg
            :src="profile?.avatar || '/vipin.webp'"
            :alt="profile?.name || 'Vipin Kumar Madhaan'"
            class="w-32 h-32 rounded-full mx-auto mb-6 ring-4 ring-primary/20"
            width="128"
            height="128"
            loading="eager"
          />
        </div>

        <h1 class="text-4xl lg:text-6xl font-bold mb-6">
          <span
            class="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
          >
            {{ profile?.name || "Vipin Kumar Madhaan" }}
          </span>
        </h1>

        <p
          class="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
        >
          {{
            profile?.tagline ||
            "Senior Software Engineer specializing in modern web technologies"
          }}
        </p>

        <div
          v-if="profile?.topSkills?.length"
          class="flex flex-wrap justify-center gap-4 mb-12"
        >
          <UBadge
            v-for="skill in profile.topSkills"
            :key="skill"
            variant="soft"
            size="lg"
          >
            {{ skill }}
          </UBadge>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UButton to="/blog" size="lg" icon="i-ph-article">
            Read My Blog
          </UButton>
          <UButton to="/projects" variant="outline" size="lg" icon="i-ph-code">
            View Projects
          </UButton>
          <UButton to="/about" variant="outline" size="lg" icon="i-ph-user">
            About Me
          </UButton>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { data: profile } = await useAsyncData("hero-profile", () =>
  queryCollection("profile").first(),
)
</script>
