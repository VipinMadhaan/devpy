<script setup lang="ts">
// Enhanced SEO for blog listing page
useSeo({
  title: "Blog",
  description:
    "Read my latest thoughts, tutorials, and insights on web development, technology, and software engineering.",
  type: "website",
})

// Fetch all blog posts with proper typing and better error handling
const { data: posts, pending } = await useAsyncData(
  "all-blog-posts",
  async () => {
    try {
      const allPosts = await queryCollection("blog").order("date", "DESC").all()
      return allPosts || []
    } catch (error) {
      console.error("Failed to load blog posts:", error)
      return []
    }
  },
  {
    server: true,
    client: true,
    default: () => [],
  },
)

// Get unique categories for filtering
const categories = computed(() => {
  if (!posts.value) return []
  const cats = [
    ...new Set(posts.value.map((post) => post.category).filter(Boolean)),
  ]
  return cats.sort()
})

// Reactive filter state
const selectedCategory = ref<string>("")
const searchQuery = ref("")

// Pagination state
const route = useRoute()
const router = useRouter()
const currentPage = ref(1)
const postsPerPage = 10

// Initialize current page from URL query
onMounted(() => {
  const page = parseInt(route.query.page as string) || 1
  currentPage.value = page
})

// Watch for route changes to sync pagination with URL
watch(() => route.query.page, (newPage) => {
  const page = parseInt(newPage as string) || 1
  if (currentPage.value !== page) {
    currentPage.value = page
  }
})

// Watch for page changes and update URL
watch(currentPage, async (newPage) => {
  const query = { ...route.query }
  if (newPage > 1) {
    query.page = newPage.toString()
  } else {
    delete query.page
  }
  
  await router.push({ query })
}, { flush: 'post' })

// Reset to page 1 when filters change
watch([selectedCategory, searchQuery], () => {
  currentPage.value = 1
})

// Filtered posts
const filteredPosts = computed(() => {
  if (!posts.value) return []

  let filtered = posts.value

  // Filter by category
  if (selectedCategory.value) {
    filtered = filtered.filter(
      (post) => post.category === selectedCategory.value,
    )
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query) ||
        post.tags?.some((tag) => tag.toLowerCase().includes(query)),
    )
  }

  return filtered
})

// Featured posts
const featuredPosts = computed(() => {
  return posts.value?.filter((post) => post.featured) || []
})

// Pagination calculations
const totalPages = computed(() => {
  return Math.ceil(filteredPosts.value.length / postsPerPage)
})

// Paginated posts - slice the filtered posts based on current page
const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage
  const end = start + postsPerPage
  return filteredPosts.value.slice(start, end)
})

// Pagination controls
const canGoToPrevious = computed(() => currentPage.value > 1)
const canGoToNext = computed(() => currentPage.value < totalPages.value)

// Generate page numbers for pagination
const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  // Always show first page
  if (total > 0) pages.push(1)
  
  // Add ellipsis and pages around current page
  if (current > 3) pages.push('...')
  
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    if (i !== 1 && i !== total) pages.push(i)
  }
  
  // Add ellipsis and last page
  if (current < total - 2) pages.push('...')
  if (total > 1) pages.push(total)
  
  return pages
})

// Clear filters
const clearFilters = () => {
  selectedCategory.value = ""
  searchQuery.value = ""
}

// Pagination navigation functions
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const goToPrevious = () => {
  if (canGoToPrevious.value) {
    currentPage.value--
  }
}

const goToNext = () => {
  if (canGoToNext.value) {
    currentPage.value++
  }
}

// Function to transform blog paths to remove number prefix
const transformBlogPath = (path: string | undefined) => {
  if (!path) return path
  // Remove number prefix from blog paths (e.g., "/blog/1-my-post" -> "/blog/my-post")
  return path.replace(/\/blog\/\d+-/, '/blog/')
}
</script>

<template>
  <div class="container mx-auto px-4 pt-12">
    <div class="max-w-6xl mx-auto">
      <!-- Hero Section -->
      <div class="text-center mb-16">
        <h1 class="text-4xl lg:text-5xl font-bold mb-6">Blog</h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Thoughts, tutorials, and insights on web development, technology, and
          the ever-evolving world of software engineering.
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
              placeholder="Search posts..."
              icon="i-ph-magnifying-glass"
              size="lg"
              class="w-full"
            />
          </div>

          <!-- Category Filter -->
          <div class="flex flex-wrap gap-2 items-center">
            <UButton
              :variant="!selectedCategory ? 'solid' : 'outline'"
              size="md"
              @click="selectedCategory = ''"
            >
              All
            </UButton>
            <UButton
              v-for="category in categories"
              :key="category"
              :variant="selectedCategory === category ? 'solid' : 'outline'"
              size="md"
              @click="selectedCategory = category || ''"
            >
              {{ category }}
            </UButton>
            <UButton
              v-if="selectedCategory || searchQuery"
              variant="ghost"
              size="md"
              icon="i-ph-x"
              @click="clearFilters"
            >
              Clear
            </UButton>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="text-center py-12">
        <UIcon name="i-ph-spinner" class="animate-spin text-4xl text-primary" />
        <p class="mt-4 text-gray-600 dark:text-gray-400">Loading posts...</p>
      </div>

      <!-- Content -->
      <div v-else>
        <!-- Featured Posts -->
        <section
          v-if="featuredPosts.length && !selectedCategory && !searchQuery"
          class="mb-16"
        >
          <h2 class="text-2xl font-semibold mb-8 flex items-center gap-2">
            <UIcon name="i-ph-star" class="text-yellow-500" />
            Featured Posts
          </h2>
          <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <article
              v-for="post in featuredPosts"
              :key="post.path"
              class="group"
            >
              <NuxtLink :to="transformBlogPath(post.path)" class="block">
                <UCard
                  class="h-full hover:shadow-lg transition-all duration-200"
                >
                  <NuxtImg
                    v-if="post.image"
                    :src="post.image"
                    :alt="post.title"
                    class="w-full h-48 object-cover rounded-lg mb-4"
                    loading="lazy"
                  />
                  <div class="space-y-3">
                    <div class="flex items-center justify-between">
                      <UBadge variant="soft" size="md">Featured</UBadge>
                      <UBadge v-if="post.category" variant="outline" size="md">
                        {{ post.category }}
                      </UBadge>
                    </div>
                    <h3
                      class="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2"
                    >
                      {{ post.title }}
                    </h3>
                    <p
                      class="text-gray-600 dark:text-gray-400 text-md line-clamp-3"
                    >
                      {{ post.description }}
                    </p>
                    <div
                      class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400"
                    >
                      <time>{{
                        new Date(post.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      }}</time>
                      <span v-if="post.readingTime"
                        >{{ post.readingTime }} min read</span
                      >
                    </div>
                  </div>
                </UCard>
              </NuxtLink>
            </article>
          </div>
        </section>

        <!-- All Posts -->
        <section>
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-2xl font-semibold">
              {{
                selectedCategory || searchQuery
                  ? "Filtered Posts"
                  : "Recent Posts"
              }}
              <span
                class="text-sm font-normal text-gray-600 dark:text-gray-400"
              >
                ({{ filteredPosts.length }}
                {{ filteredPosts.length === 1 ? "post" : "posts" }}
                <template v-if="totalPages > 1">
                  • Page {{ currentPage }} of {{ totalPages }}
                </template>
                )
              </span>
            </h2>
          </div>

          <!-- Posts List -->
          <div v-if="filteredPosts.length">
            <div class="space-y-6">
              <article
                v-for="post in paginatedPosts"
                :key="post.path"
                class="group"
              >
                <NuxtLink :to="transformBlogPath(post.path)" class="block">
                  <div
                    class="flex gap-4 p-4 rounded-sm border border-gray-200 dark:border-gray-800 hover:border-primary/50 transition-all duration-200 hover:shadow-lg"
                  >
                    <NuxtImg
                      v-if="post.image"
                      :src="post.image"
                      :alt="post.title"
                      class="w-20 h-20 object-cover rounded-sm flex-shrink-0"
                      loading="lazy"
                      width="80"
                      height="80"
                    />
                    <div class="flex-1 min-w-0">
                      <div class="flex items-start justify-between gap-4">
                        <div class="flex-1">
                          <h3
                            class="font-semibold group-hover:text-primary transition-colors line-clamp-2"
                          >
                            {{ post.title }}
                          </h3>
                          <p
                            class="text-gray-600 dark:text-gray-400 text-md mt-1 line-clamp-2"
                          >
                            {{ post.description }}
                          </p>
                          <div
                            class="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400"
                          >
                            <time>{{
                              new Date(post.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            }}</time>
                            <span v-if="post.readingTime"
                              >{{ post.readingTime }} min read</span
                            >
                            <UBadge
                              v-if="post.category"
                              variant="soft"
                              size="md"
                            >
                              {{ post.category }}
                            </UBadge>
                          </div>
                        </div>
                        <UBadge
                          v-if="post.featured"
                          variant="solid"
                          size="md"
                          class="flex-shrink-0"
                        >
                          Featured
                        </UBadge>
                      </div>
                      <div
                        v-if="post.tags?.length"
                        class="flex flex-wrap gap-1 mt-2"
                      >
                        <UBadge
                          v-for="tag in post.tags.slice(0, 3)"
                          :key="tag"
                          variant="outline"
                          size="md"
                        >
                          {{ tag }}
                        </UBadge>
                      </div>
                    </div>
                  </div>
                </NuxtLink>
              </article>
            </div>
            
            <!-- Pagination Controls -->
            <div v-if="totalPages > 1" class="mt-12 flex justify-center">
              <div class="flex items-center gap-2">
                <!-- Previous Button -->
                <UButton
                  :disabled="!canGoToPrevious"
                  variant="outline"
                  size="md"
                  icon="i-ph-arrow-left"
                  @click="goToPrevious"
                >
                  Previous
                </UButton>

                <!-- Page Numbers -->
                <template v-for="page in visiblePages" :key="page">
                  <UButton
                    v-if="page === '...'"
                    variant="ghost"
                    size="md"
                    disabled
                  >
                    ...
                  </UButton>
                  <UButton
                    v-else
                    :variant="currentPage === page ? 'solid' : 'outline'"
                    size="md"
                    @click="goToPage(page)"
                  >
                    {{ page }}
                  </UButton>
                </template>

                <!-- Next Button -->
                <UButton
                  :disabled="!canGoToNext"
                  variant="outline"
                  size="md"
                  @click="goToNext"
                >
                  Next
                  <UIcon name="i-ph-arrow-right" class="ml-2" />
                </UButton>
              </div>
            </div>
          </div>

          <!-- No Posts Found -->
          <div v-else class="text-center py-16">
            <UIcon
              name="i-ph-magnifying-glass"
              class="text-6xl text-gray-400 mb-4"
            />
            <h3 class="text-xl font-semibold mb-2">No posts found</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your search terms or filters.
            </p>
            <UButton variant="outline" @click="clearFilters">
              Clear filters
            </UButton>
          </div>
        </section>
      </div>

      <!-- Newsletter Signup 
      <section class="mt-20 text-center">
        <div
          class="bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-lg p-8"
        >
          <h2 class="text-2xl font-semibold mb-4">Stay Updated</h2>
          <p class="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Get notified when I publish new posts about web development,
            technology insights, and developer tools.
          </p>
          <div
            class="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto"
          >
            <UInput placeholder="Enter your email" size="lg" class="flex-1" />
            <UButton size="lg">Subscribe</UButton>
          </div>
        </div>
      </section> -->
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
