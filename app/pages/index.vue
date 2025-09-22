<script lang="ts" setup>
// Fetch profile data from Nuxt Content collection
const { data: profile } = await useAsyncData("profile", () => {
  return queryCollection("profile").first()
})

// Fetch tech stack data from Nuxt Content collection
const { data: techStack } = await useAsyncData("tech-stack", () => {
  return queryCollection("techStack").first()
})

// Enhanced SEO using the new composable
if (profile.value) {
  useSeo({
    title: profile.value.name,
    description: profile.value.description,
    image: profile.value.avatar,
    type: "website",
  })

  usePersonalSeo()
}
</script>

<template>
  <div>
    <!-- New Enhanced Hero Section -->
    <HeroSection />

    <div class="space-y-16">
      <AboutPreview />

      <!-- Featured Projects Section -->
      <section class="space-y-6">
        <FeaturedProjects />
      </section>

      <!-- Technologies -->
      <section class="space-y-6">
        <div class="text-center space-y-6">
          <h2>Skills & Expertise</h2>

          <p class="max-w-3xl mx-auto">
            Comprehensive technical expertise across modern web technologies,
            frameworks, and development practices.
          </p>
        </div>

        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="category in techStack.categories"
            :key="category.title"
            class="h-full"
          >
            <div />
            <UCard class="h-full">
              <div
                class="space-y-4 text-center content-center items-center justify-center"
              >
                <div
                  class="flex gap-2 mb-6 text-center content-center items-center justify-center"
                >
                  <div class="flex items-center justify-center flex-shrink-0">
                    <UIcon name="i-ph-code" class="w-6 h-6" />
                  </div>
                  <h3
                    class="capitalize text-center content-center items-center justify-center"
                  >
                    {{ category.title.replace(/([A-Z])/g, " $1") }}
                  </h3>
                </div>
                <div
                  class="flex flex-wrap gap-2 text-center content-center items-center justify-center"
                >
                  <UBadge
                    v-for="item in category.items"
                    :key="item"
                    :label="item"
                    variant="outline"
                    size="xl"
                  />
                </div>
              </div>
            </UCard>
          </div>
        </div>
      </section>

      <!-- Recent Blog Posts with Enhanced Design -->
      <section class="space-y-12">
        <div class="text-center space-y-6">
          <h2>Latest from the Blog</h2>
          <p class="max-w-3xl mx-auto">
            Thoughts, tutorials, and insights on modern web development.
          </p>
        </div>
        <OptimizedBlogList :limit="6" :featured="true" />
        <div class="text-center">
          <UButton to="/blog" variant="outline" size="lg">
            <UIcon name="i-ph-article" />
            Read All Posts
          </UButton>
        </div>
      </section>

      <!-- Minimal Contact Section -->
      <section class="space-y-12">
        <div class="text-center space-y-6">
          <h2>Let's Connect</h2>
          <p class="max-w-3xl mx-auto">
            Always interested in discussing new opportunities and exciting
            projects.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton
              :to="'mailto:Vipin.Madhaan@gmail.com'"
              size="lg"
              icon="i-ph-envelope"
            >
              Get in Touch
            </UButton>
            <UButton
              to="https://cal.com/VipinMadhaan"
              variant="outline"
              size="lg"
              icon="i-ph-calendar"
              external
            >
              Schedule a Call
            </UButton>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
