<script lang="ts" setup>
import { formatDate, calculateReadingTime, getRelatedPosts, generateShareUrls } from '~/utils/blog'

const route = useRoute()
const site = useSiteConfig()

// Fetch blog post with proper error handling
const { data: page, error } = await useAsyncData(
  `blog-${route.path}`,
  async () => {
    try {
      // First try to find the post with the exact path
      let result = await queryCollection("blog").path(route.path).first()
      
      // If not found and path doesn't have a number prefix, try to find a numbered version
      if (!result && route.path.startsWith('/blog/')) {
        const slug = route.path.replace('/blog/', '')
        // Try to find any blog post that ends with this slug (with number prefix)
        const allPosts = await queryCollection("blog").all()
        result = allPosts.find(post => {
          if (!post.path) return false
          const postSlug = post.path.replace('/blog/', '')
          return postSlug.match(/^\d+-/) && postSlug.replace(/^\d+-/, '') === slug
        }) || null
      }
      
      return result
    } catch (err) {
      console.error("Error fetching blog post:", err)
      throw createError({
        statusCode: 404,
        statusMessage: "Blog post not found",
      })
    }
  },
)

// Handle error state
if (error.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Blog post not found",
  })
}

// Handle missing page
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Blog post not found",
  })
}

// SEO: page meta, canonical, OG/Twitter, and BlogPosting schema
if (page.value) {
  const url = new URL(route.fullPath, site.url).toString()
  const title = page.value.title || site.name
  const description = page.value.description || site.description
  const image = page.value.image || page.value.socialImage?.src
  const publishedTime = page.value.date
  const modifiedTime = page.value.dateUpdated || page.value.date
  const authorName = page.value.author || site.name

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogType: "article",
    ogUrl: url,
    ogImage: image ? [{ url: image }] : undefined,
    twitterCard: image ? "summary_large_image" : "summary",
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: image,
    articlePublishedTime: publishedTime,
    articleModifiedTime: modifiedTime,
  })

  useHead({
    link: [{ rel: "canonical", href: url }],
  })

  if (page.value.ogImage) {
    defineOgImage(page.value.ogImage)
  }
  defineOgImageComponent("NuxtSeo")

  // Register BlogPosting JSON-LD via Nuxt SEO
  useSchemaOrg({
    "@type": "BlogPosting",
    headline: title,
    description,
    image: image ? [image] : undefined,
    datePublished: publishedTime,
    dateModified: modifiedTime,
    mainEntityOfPage: url,
    author: authorName
      ? {
          "@type": "Person",
          name: authorName,
          url: site.url,
        }
      : undefined,
    publisher: {
      "@type": "Person",
      name: site.name,
      logo: {
        "@type": "ImageObject",
        url: new URL("/favicon.png", site.url).toString(),
      },
    },
  })
}

// Copy to clipboard functionality
const copied = ref(false)
const copyToClipboard = async () => {
  try {
    const site = useSiteConfig()
    const fullUrl = new URL(route.fullPath, site.url).toString()
    await navigator.clipboard.writeText(fullUrl)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy to clipboard:', err)
  }
}

// Fetch all posts for related posts functionality
const { data: allPosts } = await useAsyncData('all-blog-posts-for-related', () =>
  queryCollection("blog").order("date", "DESC").all()
)

// Get related posts
const relatedPosts = computed(() => {
  if (!page.value || !allPosts.value) return []
  return getRelatedPosts(page.value, allPosts.value, 3)
})

// Generate share URLs
const shareUrls = computed(() => {
  if (!page.value) return { twitter: '', linkedin: '', facebook: '' }
  const site = useSiteConfig()
  const fullUrl = new URL(route.fullPath, site.url).toString()
  return generateShareUrls(page.value.title, fullUrl)
})
</script>

<template>
  <div v-if="page">
    <div class="space-y-16 py-16">
      <!-- Post Header -->
      <header class="text-center space-y-6">
        <h1>
          {{ page.title }}
        </h1>

        <div class="flex items-center justify-center gap-6">
          <div class="flex items-center gap-2">
            <UIcon
              name="i-ph-user-circle"
              class="w-5 h-5 text-primary-500 dark:text-primary-400"
            />
            <span>{{ page.author }}</span>
          </div>
          <div class="flex items-center gap-2">
            <UIcon
              name="i-ph-calendar"
              class="w-5 h-5 text-primary-500 dark:text-primary-400"
            />
            <span>{{ formatDate(page.date) }}</span>
          </div>
          <div v-if="page.readingTime || (page.body && calculateReadingTime(page.body))" class="flex items-center gap-2">
            <UIcon
              name="i-ph-clock"
              class="w-5 h-5 text-primary-500 dark:text-primary-400"
            />
            <span>{{ page.readingTime || calculateReadingTime(page.body) }} min read</span>
          </div>
        </div>

        <div v-if="page.tags" class="flex justify-center flex-wrap gap-2">
          <UBadge
            v-for="tag in page.tags"
            :key="tag"
            :label="tag"
            variant="soft"
          />
        </div>
      </header>

      <!-- Featured Image -->
      <div v-if="page.image" class="aspect-[16/9] overflow-hidden">
        <img
          :src="page.image"
          :alt="page.title"
          class="w-full h-full object-cover"
        />
      </div>

      <!-- Post Content -->
      <article class="prose prose-lg max-w-none mx-auto dark:prose-invert">
        <ContentRenderer :value="page" />
      </article>

      <!-- Social Share Section -->
      <section class="border-t border-gray-200 dark:border-gray-700 pt-12">
        <div class="max-w-2xl mx-auto text-center">
          <h3 class="text-xl font-semibold mb-6">Share this article</h3>
          <div class="flex justify-center gap-3">
            <UButton
              :to="shareUrls.twitter"
              external
              variant="outline"
              size="lg"
              aria-label="Share on X"
              class="hover:scale-105 transition-all duration-200"
            >
              <UIcon name="i-ph-x-logo" class="text-lg" />
              <span class="hidden sm:inline ml-2">X</span>
            </UButton>
            
            <UButton
              :to="shareUrls.linkedin"
              external
              variant="outline"
              size="lg"
              aria-label="Share on LinkedIn"
              class="hover:scale-105 transition-all duration-200"
            >
              <UIcon name="i-ph-linkedin-logo" class="text-lg" />
              <span class="hidden sm:inline ml-2">LinkedIn</span>
            </UButton>
            
            <UButton
              :to="shareUrls.facebook"
              external
              variant="outline"
              size="lg"
              aria-label="Share on Facebook"
              class="hover:scale-105 transition-all duration-200"
            >
              <UIcon name="i-ph-facebook-logo" class="text-lg" />
              <span class="hidden sm:inline ml-2">Facebook</span>
            </UButton>
            
            <UButton
              @click="copyToClipboard"
              variant="outline"
              size="lg"
              aria-label="Copy link"
              class="hover:scale-105 transition-all duration-200"
            >
              <UIcon :name="copied ? 'i-ph-check' : 'i-ph-copy'" class="text-lg" />
              <span class="hidden sm:inline ml-2">{{ copied ? 'Copied!' : 'Copy' }}</span>
            </UButton>
          </div>
        </div>
      </section>

      <!-- Related Posts -->
      <section v-if="relatedPosts.length" class="border-t border-gray-200 dark:border-gray-700 pt-16">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-2xl font-bold text-center mb-12">You might also like</h2>
          <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <article
              v-for="post in relatedPosts"
              :key="post.path"
              class="group"
            >
              <NuxtLink :to="post.path" class="block">
                <UCard class="h-full hover:shadow-lg transition-all duration-200">
                  <div v-if="post.image" class="aspect-[16/9] overflow-hidden rounded-lg mb-4">
                    <NuxtImg
                      :src="post.image"
                      :alt="post.title"
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      loading="lazy"
                      preset="blog"
                    />
                  </div>
                  
                  <div class="space-y-3">
                    <h3 class="font-semibold text-lg group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                      {{ post.title }}
                    </h3>
                    
                    <p v-if="post.description" class="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                      {{ post.description }}
                    </p>
                    
                    <div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div class="flex items-center gap-1">
                        <UIcon name="i-ph-calendar" class="w-4 h-4" />
                        <span>{{ formatDate(post.date) }}</span>
                      </div>
                      <div v-if="post.readingTime || (post.body && calculateReadingTime(post.body))" class="flex items-center gap-1">
                        <UIcon name="i-ph-clock" class="w-4 h-4" />
                        <span>{{ post.readingTime || calculateReadingTime(post.body) }} min</span>
                      </div>
                    </div>
                    
                    <div v-if="post.tags" class="flex flex-wrap gap-1">
                      <UBadge
                        v-for="tag in post.tags.slice(0, 2)"
                        :key="tag"
                        :label="tag"
                        variant="soft"
                        size="md"
                      />
                      <UBadge
                        v-if="post.tags.length > 2"
                        :label="`+${post.tags.length - 2}`"
                        variant="outline"
                        size="md"
                      />
                    </div>
                  </div>
                </UCard>
              </NuxtLink>
            </article>
          </div>
        </div>
      </section>

      <!-- Back to Blog Link -->
      <div class="text-center pt-8">
        <UButton to="/blog" variant="outline" class="">
          <UIcon name="i-ph-arrow-left" class="mr-2" />
          <span>Back to Blog</span>
        </UButton>
      </div>
    </div>
  </div>
  <div v-else class="text-center py-24">
    <h1>Post Not Found</h1>
    <p class="mt-4">The requested blog post could not be found.</p>
    <UButton to="/blog" class="mt-8">Back to Blog</UButton>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

```
