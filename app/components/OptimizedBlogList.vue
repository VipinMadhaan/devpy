<template>
  <div class="space-y-6">
    <article v-for="post in posts" :key="post.path" class="group">
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
                  class="flex items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400"
                >
                  <time>{{ formatDate(post.date) }}</time>
                  <span v-if="post.readingTime"
                    >{{ post.readingTime }} min read</span
                  >
                  <UBadge v-if="post.category" variant="soft" size="md">
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
            <div v-if="post.tags?.length" class="flex flex-wrap gap-1 mt-2">
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

    <div
      v-if="!posts?.length"
      class="text-center py-12 text-gray-500 dark:text-gray-400"
    >
      <UIcon name="i-ph-article" class="text-4xl mb-4" />
      <p>No blog posts found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  limit?: number
  featured?: boolean
  category?: string
}

const props = withDefaults(defineProps<Props>(), {
  limit: 10,
  featured: false,
  category: undefined,
})

const { data: posts } = await useAsyncData(
  `blog-posts-${props.limit}-${props.featured}-${props.category}`,
  () => {
    let query = queryCollection("blog").order("date", "DESC").limit(props.limit)

    if (props.featured) {
      query = query.where("featured", "=", true)
    }

    if (props.category) {
      query = query.where("category", "=", props.category)
    }

    return query.all()
  },
)

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Function to transform blog paths to remove number prefix
const transformBlogPath = (path: string | undefined) => {
  if (!path) return path
  // Remove number prefix from blog paths (e.g., "/blog/1-my-post" -> "/blog/my-post")
  return path.replace(/\/blog\/\d+-/, '/blog/')
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
