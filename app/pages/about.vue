<script setup lang="ts">
// Fetch profile and journey data
const { data: profile } = await useAsyncData("about-profile", () =>
  queryCollection("profile").first(),
)

// Enhanced SEO
useSeo({
  title: "About Me",
  description:
    "Learn more about my background, journey in software development, skills, and what drives my passion for creating exceptional digital experiences.",
  type: "website",
})

usePersonalSeo()
</script>

<template>
  <div class="container mx-auto px-4 pt-12">
    <div class="max-w-4xl mx-auto">
      <!-- Hero Section -->
      <div class="text-center mb-16">
        <div class="mb-8">
          <NuxtImg
            :src="profile?.avatar || '/vipin.webp'"
            :alt="profile?.name || 'Vipin Kumar Madhaan'"
            class="w-40 h-40 rounded-full mx-auto mb-6 ring-4 ring-primary/20"
            width="160"
            height="160"
          />
        </div>
        <h1 class="text-4xl lg:text-5xl font-bold mb-6">About Me</h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {{
            profile?.description ||
            "Senior Software Engineer specializing in modern web technologies, crafting scalable applications with passion and precision."
          }}
        </p>
      </div>

      <!-- My Story -->
      <div class="prose prose-lg max-w-none mb-16">
        <div class="bg-white dark:bg-gray-900 rounded-lg p-8 shadow-sm">
          <h2 class="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
            My Journey
          </h2>
          <div class="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              Hi there! I'm Vipin Kumar Madhaan, a Senior Software Engineer with
              over {{ profile?.experience || 10 }} years of experience in
              creating digital solutions that make a difference. My journey in
              technology started with curiosity and has evolved into a passion
              for building exceptional web applications and developer tools.
            </p>
            <p>
              What drives me is the intersection of technology and human
              experience. I believe that great software doesn't just work—it
              empowers people, solves real problems, and creates value. Whether
              I'm architecting a complex system or mentoring junior developers,
              I approach every challenge with empathy, creativity, and a
              commitment to excellence.
            </p>
            <p>
              When I'm not coding, you'll find me exploring new technologies,
              contributing to open source projects, or sharing my knowledge
              through writing and speaking. I'm particularly passionate about
              developer experience, performance optimization, and building tools
              that make other developers' lives easier.
            </p>
          </div>
        </div>
      </div>

      <!-- Skills & Expertise -->
      <div class="mb-16">
        <h2 class="text-2xl font-semibold mb-8 text-center">
          Skills & Expertise
        </h2>
        <div class="grid md:grid-cols-2 gap-8">
          <!-- Technical Skills -->
          <div class="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
            <h3 class="font-semibold mb-4 flex items-center gap-2">
              <UIcon name="i-ph-code" class="text-primary" />
              Technical Skills
            </h3>
            <div v-if="profile?.topSkills?.length" class="flex flex-wrap gap-2">
              <UBadge
                v-for="skill in profile.topSkills"
                :key="skill"
                variant="soft"
                size="md"
              >
                {{ skill }}
              </UBadge>
            </div>
          </div>

          <!-- Interests -->
          <div class="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
            <h3 class="font-semibold mb-4 flex items-center gap-2">
              <UIcon name="i-ph-heart" class="text-primary" />
              Interests & Passions
            </h3>
            <div v-if="profile?.interests?.length" class="flex flex-wrap gap-2">
              <UBadge
                v-for="interest in profile.interests"
                :key="interest"
                variant="outline"
                size="md"
              >
                {{ interest }}
              </UBadge>
            </div>
            <div v-else class="flex flex-wrap gap-2">
              <UBadge variant="outline" size="md">Open Source</UBadge>
              <UBadge variant="outline" size="md">Developer Tools</UBadge>
              <UBadge variant="outline" size="md">Performance</UBadge>
              <UBadge variant="outline" size="md">Mentoring</UBadge>
            </div>
          </div>
        </div>
      </div>

      <!-- Current Focus -->
      <div v-if="profile?.currentFocus?.length" class="mb-16">
        <div
          class="bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-lg p-8"
        >
          <h2 class="text-2xl font-semibold mb-6 text-center">Current Focus</h2>
          <div class="grid gap-4">
            <div
              v-for="focus in profile.currentFocus"
              :key="focus"
              class="flex items-start gap-3"
            >
              <UIcon
                name="i-ph-arrow-right"
                class="text-primary mt-1 flex-shrink-0"
              />
              <span class="text-gray-700 dark:text-gray-300">{{ focus }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Connect Section -->
      <div class="text-center">
        <h2 class="text-2xl font-semibold mb-6">Let's Connect</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          I'm always interested in discussing new opportunities, sharing
          knowledge, or just connecting with fellow developers and technology
          enthusiasts.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <UButton
            :to="
              profile?.social?.email
                ? `mailto:${profile.social.email}`
                : 'mailto:Vipin.Madhaan@gmail.com'
            "
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

        <!-- Social Links -->
        <div class="flex justify-center gap-4">
          <UButton
            to="https://github.com/VipinMadhaan"
            external
            aria-label="GitHub Profile"
            variant="ghost"
            class="transition-transform duration-200 ease-in-out hover:scale-105"
          >
            <UIcon name="i-ph-github-logo" />
          </UButton>
          <UButton
            to="https://linkedin.com/in/VipinMadhaan"
            external
            aria-label="LinkedIn Profile"
            variant="ghost"
            class="transition-transform duration-200 ease-in-out hover:scale-105"
          >
            <UIcon name="i-ph-linkedin-logo" />
          </UButton>
          <UButton
            to="https://x.com/VipinMadhaan"
            external
            aria-label="X Profile"
            variant="ghost"
            class="transition-transform duration-200 ease-in-out hover:scale-105"
          >
            <UIcon name="i-ph-x-logo" />
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>
