<script setup lang="ts">
// Fetch projects data
const { data: projectsData } = await useAsyncData("projects", () =>
  queryCollection("projects").first(),
)

// Enhanced SEO
useSeo({
  title: "Projects",
  description:
    "A showcase of my latest projects, open source contributions, and developer tools that demonstrate my passion for creating meaningful software solutions.",
  type: "website",
})

// Filter state
const selectedCategory = ref("All")
const searchQuery = ref("")

// Get all unique categories
const categories = computed(() => {
  if (!projectsData.value?.projects) return []
  const cats = [
    ...new Set(
      projectsData.value.projects.map((p) => p.category).filter(Boolean),
    ),
  ]
  return ["All", ...cats.sort()]
})

// Filter projects
const filteredProjects = computed(() => {
  if (!projectsData.value?.projects) return []

  let filtered = projectsData.value.projects

  // Filter by category
  if (selectedCategory.value !== "All") {
    filtered = filtered.filter((p) => p.category === selectedCategory.value)
  }

  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (p) =>
        p.title?.toLowerCase().includes(query) ||
        p.name?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.tech?.some((t) => t.toLowerCase().includes(query)) ||
        p.technologies?.some((t) => t.toLowerCase().includes(query)),
    )
  }

  return filtered.sort((a, b) => {
    // Featured projects first
    if (a.featured !== b.featured) {
      return b.featured ? 1 : -1
    }
    // Then by year (newest first)
    return (b.year || 0) - (a.year || 0)
  })
})

// Featured projects
const featuredProjects = computed(() => {
  return projectsData.value?.projects?.filter((p) => p.featured) || []
})

// Clear filters
const clearFilters = () => {
  selectedCategory.value = "All"
  searchQuery.value = ""
}
</script>

<template>
  <div class="container mx-auto px-4 py-12">
    <div class="max-w-6xl mx-auto">
      <!-- Hero Section -->
      <div class="text-center mb-16">
        <h1 class="text-4xl lg:text-5xl font-bold mb-6">Projects</h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          A showcase of my latest work, open source contributions, and passion
          projects that demonstrate my commitment to creating meaningful
          software solutions.
        </p>
      </div>

      <!-- Search and Filters -->
      <div class="mb-12">
        <div
          class="flex flex-col md:flex-row gap-4 items-center justify-between"
        >
          <!-- Search -->
          <div class="w-full md:w-96">
            <UInput
              v-model="searchQuery"
              placeholder="Search projects..."
              icon="i-ph-magnifying-glass"
              size="lg"
              class="w-full"
            />
          </div>

          <!-- Category Filter -->
          <div class="flex flex-wrap gap-2 items-center">
            <UButton
              v-for="category in categories"
              :key="category"
              :variant="selectedCategory === category ? 'solid' : 'outline'"
              size="sm"
              @click="selectedCategory = category"
            >
              {{ category }}
            </UButton>
            <UButton
              v-if="selectedCategory !== 'All' || searchQuery"
              variant="ghost"
              size="sm"
              icon="i-ph-x"
              @click="clearFilters"
            >
              Clear
            </UButton>
          </div>
        </div>
      </div>

      <!-- Featured Projects -->
      <section
        v-if="
          featuredProjects.length && selectedCategory === 'All' && !searchQuery
        "
        class="mb-16"
      >
        <h2 class="text-2xl font-semibold mb-8 flex items-center gap-2">
          <UIcon name="i-ph-star" class="text-yellow-500" />
          Featured Projects
        </h2>
        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="project in featuredProjects"
            :key="project.id"
            class="group"
          >
            <UCard class="h-full hover:shadow-lg transition-all duration-200">
              <NuxtImg
                v-if="project.image"
                :src="project.image"
                :alt="project.title || project.name"
                class="w-full h-48 object-cover rounded-lg mb-4"
                loading="lazy"
              />
              <div class="space-y-4">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <h3
                      class="text-lg font-semibold group-hover:text-primary transition-colors"
                    >
                      {{ project.title || project.name }}
                    </h3>
                    <UBadge variant="soft" size="xs" class="mt-1"
                      >Featured</UBadge
                    >
                  </div>
                  <UBadge v-if="project.year" variant="outline" size="xs">
                    {{ project.year }}
                  </UBadge>
                </div>

                <p class="text-gray-600 dark:text-gray-400 text-sm">
                  {{ project.description }}
                </p>

                <!-- Tech Stack -->
                <div
                  v-if="project.tech?.length || project.technologies?.length"
                  class="flex flex-wrap gap-1"
                >
                  <UBadge
                    v-for="tech in (project.tech || project.technologies).slice(
                      0,
                      4,
                    )"
                    :key="tech"
                    variant="outline"
                    size="xs"
                  >
                    {{ tech }}
                  </UBadge>
                  <UBadge
                    v-if="(project.tech || project.technologies).length > 4"
                    variant="outline"
                    size="xs"
                  >
                    +{{ (project.tech || project.technologies).length - 4 }}
                  </UBadge>
                </div>

                <!-- Links -->
                <div class="flex gap-2">
                  <UButton
                    v-if="project.github || project.links?.github"
                    :to="project.github || project.links?.github"
                    variant="outline"
                    size="xs"
                    icon="i-ph-github-logo"
                    external
                  >
                    Code
                  </UButton>
                  <UButton
                    v-if="project.demo || project.links?.demo"
                    :to="project.demo || project.links?.demo"
                    variant="outline"
                    size="xs"
                    icon="i-ph-globe"
                    external
                  >
                    Demo
                  </UButton>
                  <UButton
                    v-if="project.links?.case_study"
                    :to="project.links.case_study"
                    variant="outline"
                    size="xs"
                    icon="i-ph-file-text"
                  >
                    Case Study
                  </UButton>
                </div>
              </div>
            </UCard>
          </article>
        </div>
      </section>

      <!-- All Projects -->
      <section>
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-semibold">
            {{
              selectedCategory !== "All" || searchQuery
                ? "Filtered Projects"
                : "All Projects"
            }}
            <span class="text-sm font-normal text-gray-600 dark:text-gray-400">
              ({{ filteredProjects.length }}
              {{ filteredProjects.length === 1 ? "project" : "projects" }})
            </span>
          </h2>
        </div>

        <!-- Projects Grid -->
        <div
          v-if="filteredProjects.length"
          class="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          <article
            v-for="project in filteredProjects"
            :key="project.id"
            class="group"
          >
            <UCard class="h-full hover:shadow-lg transition-all duration-200">
              <NuxtImg
                v-if="project.image"
                :src="project.image"
                :alt="project.title || project.name"
                class="w-full h-40 object-cover rounded-lg mb-4"
                loading="lazy"
              />
              <div class="space-y-3">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <h3
                      class="font-semibold group-hover:text-primary transition-colors line-clamp-2"
                    >
                      {{ project.title || project.name }}
                    </h3>
                    <div class="flex gap-2 mt-1">
                      <UBadge v-if="project.featured" variant="soft" size="xs"
                        >Featured</UBadge
                      >
                      <UBadge
                        v-if="project.category"
                        variant="outline"
                        size="xs"
                        >{{ project.category }}</UBadge
                      >
                    </div>
                  </div>
                  <UBadge v-if="project.year" variant="outline" size="xs">
                    {{ project.year }}
                  </UBadge>
                </div>

                <p
                  class="text-gray-600 dark:text-gray-400 text-sm line-clamp-3"
                >
                  {{ project.description }}
                </p>

                <!-- Tech Stack -->
                <div
                  v-if="project.tech?.length || project.technologies?.length"
                  class="flex flex-wrap gap-1"
                >
                  <UBadge
                    v-for="tech in (project.tech || project.technologies).slice(
                      0,
                      3,
                    )"
                    :key="tech"
                    variant="outline"
                    size="xs"
                  >
                    {{ tech }}
                  </UBadge>
                  <UBadge
                    v-if="(project.tech || project.technologies).length > 3"
                    variant="outline"
                    size="xs"
                  >
                    +{{ (project.tech || project.technologies).length - 3 }}
                  </UBadge>
                </div>

                <!-- Links -->
                <div class="flex gap-2">
                  <UButton
                    v-if="project.github || project.links?.github"
                    :to="project.github || project.links?.github"
                    variant="outline"
                    size="xs"
                    icon="i-ph-github-logo"
                    external
                  >
                    Code
                  </UButton>
                  <UButton
                    v-if="project.demo || project.links?.demo"
                    :to="project.demo || project.links?.demo"
                    variant="outline"
                    size="xs"
                    icon="i-ph-globe"
                    external
                  >
                    Demo
                  </UButton>
                </div>
              </div>
            </UCard>
          </article>
        </div>

        <!-- No Projects Found -->
        <div v-else class="text-center py-16">
          <UIcon name="i-ph-folder-open" class="text-6xl text-gray-400 mb-4" />
          <h3 class="text-xl font-semibold mb-2">No projects found</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Try adjusting your search terms or filters.
          </p>
          <UButton variant="outline" @click="clearFilters">
            Clear filters
          </UButton>
        </div>
      </section>

      <!-- Call to Action -->
      <section class="mt-20 text-center">
        <div
          class="bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-lg p-8"
        >
          <h2 class="text-2xl font-semibold mb-4">
            Interested in Collaborating?
          </h2>
          <p class="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            I'm always open to discussing new projects, creative ideas, or
            opportunities to be part of your visions.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton
              to="mailto:Vipin.Madhaan@gmail.com"
              size="lg"
              icon="i-ph-envelope"
            >
              Get in Touch
            </UButton>
            <UButton
              to="https://github.com/VipinMadhaan"
              variant="outline"
              size="lg"
              icon="i-ph-github-logo"
              external
            >
              View on GitHub
            </UButton>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
