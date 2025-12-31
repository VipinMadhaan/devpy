<script lang="ts" setup>
import { cleanBlogPath, normalizeRoutePath } from "~/utils/blogPaths"

const route = useRoute()
const site = useSiteConfig()
const runtimeConfig = useRuntimeConfig()
const appBaseURL = runtimeConfig.app?.baseURL || "/"

const normalizeForMatch = (path: string) => {
  const normalized = normalizeRoutePath(path)
  if (appBaseURL !== "/" && normalized.startsWith(appBaseURL)) {
    const stripped = normalized.slice(appBaseURL.length) || "/"
    return normalizeRoutePath(stripped.startsWith("/") ? stripped : `/${stripped}`)
  }
  return normalized
}

// Fetch blog post with proper error handling
const { data: page, error } = await useAsyncData(
  `blog-${normalizeForMatch(route.path)}`,
  async () => {
    try {
      const routePath = normalizeForMatch(route.path)
      const allPosts = await queryCollection("blog").all()

      const directMatch = allPosts.find(
        (post) => post.path && normalizeForMatch(post.path) === routePath,
      )
      if (directMatch) return directMatch

      const cleanMatch = allPosts.find(
        (post) => post.path && normalizeForMatch(cleanBlogPath(post.path)) === routePath,
      )
      return cleanMatch || null
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

// Canonicalize numbered URLs to the clean URL.
// Note: on fully static hosting this becomes a client-side redirect.
if (page.value?.path) {
  const routePath = normalizeForMatch(route.path)
  const rawPath = normalizeForMatch(page.value.path)
  const canonicalPath = cleanBlogPath(page.value.path)
  const canonicalNormalized = normalizeForMatch(canonicalPath)

  // Only redirect when the user is on the numbered (raw) URL.
  // Avoid redirecting purely due to trailing-slash normalization.
  if (canonicalPath && routePath === rawPath && routePath !== canonicalNormalized) {
    await navigateTo(canonicalPath, { redirectCode: 301 })
  }
}

// SEO: page meta, canonical, OG/Twitter, and BlogPosting schema
if (page.value) {
  const canonicalPath = page.value.path ? cleanBlogPath(page.value.path) : normalizeForMatch(route.path)
  const url = new URL(canonicalPath, site.url).toString()
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

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

const calculateReadingTime = (content: unknown, wordsPerMinute = 200): number => {
  if (!content) return 0

  let text = ""
  if (typeof content === "string") {
    text = content
  } else {
    try {
      text = JSON.stringify(content)
    } catch {
      text = ""
    }
  }

  const cleaned = text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/[#*_~[\]()]/g, " ")
    .replace(/\s+/g, " ")
    .trim()

  if (!cleaned) return 0
  const words = cleaned.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / wordsPerMinute))
}

const readingMinutes = computed(() => {
  if (!page.value) return 0
  return (
    (page.value as { readingTime?: number }).readingTime ||
    calculateReadingTime((page.value as { body?: unknown }).body)
  )
})

const generateShareUrls = (title: string, url: string) => {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  return {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&via=VipinMadhaan`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
  }
}

const copied = ref(false)
const copyToClipboard = async () => {
  if (!import.meta.client) return
  try {
    const canonicalPath = page.value?.path ? cleanBlogPath(page.value.path) : normalizeForMatch(route.path)
    const fullUrl = new URL(canonicalPath, site.url).toString()
    await navigator.clipboard.writeText(fullUrl)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error("Failed to copy to clipboard:", err)
  }
}

const shareUrls = computed(() => {
  if (!page.value) return { twitter: "", linkedin: "", facebook: "" }
  const canonicalPath = page.value.path ? cleanBlogPath(page.value.path) : normalizeForMatch(route.path)
  const fullUrl = new URL(canonicalPath, site.url).toString()
  return generateShareUrls(page.value.title, fullUrl)
})

const articleRef = ref<HTMLElement | null>(null)
const scrollProgress = ref(0)
let rafId: number | null = null

const updateScrollProgress = () => {
  if (!import.meta.client) return
  if (!articleRef.value) {
    scrollProgress.value = 0
    return
  }

  const articleTop = articleRef.value.getBoundingClientRect().top + window.scrollY
  const articleHeight = articleRef.value.scrollHeight
  const start = articleTop
  const end = Math.max(start, articleTop + articleHeight - window.innerHeight)

  if (end <= start) {
    scrollProgress.value = 100
    return
  }

  const raw = (window.scrollY - start) / (end - start)
  const clamped = Math.min(1, Math.max(0, raw))
  scrollProgress.value = Math.round(clamped * 100)
}

const onScroll = () => {
  if (!import.meta.client) return
  if (rafId != null) return
  rafId = window.requestAnimationFrame(() => {
    rafId = null
    updateScrollProgress()
  })
}

onMounted(() => {
  if (!import.meta.client) return
  window.addEventListener("scroll", onScroll, { passive: true })
  window.addEventListener("resize", onScroll, { passive: true })
  updateScrollProgress()
})

onBeforeUnmount(() => {
  if (!import.meta.client) return
  window.removeEventListener("scroll", onScroll)
  window.removeEventListener("resize", onScroll)
  if (rafId != null) window.cancelAnimationFrame(rafId)
})

type BlogPostLike = {
  path?: string
  title?: string
  description?: string
  date?: string | Date
  image?: string
  category?: string
  tags?: string[]
  readingTime?: number
  body?: unknown
}

const getRelatedPosts = (currentPost: BlogPostLike, allPosts: BlogPostLike[], limit = 3) => {
  if (!currentPost || !allPosts.length) return []

  const currentCanonical = currentPost.path ? cleanBlogPath(currentPost.path) : ""

  const otherPosts = allPosts.filter((post) => {
    if (!post.path) return false
    const canonical = cleanBlogPath(post.path)
    return canonical !== currentCanonical
  })

  const scored = otherPosts.map((post) => {
    let score = 0

    if (post.category && currentPost.category && post.category === currentPost.category) {
      score += 3
    }

    if (Array.isArray(currentPost.tags) && Array.isArray(post.tags)) {
      const shared = currentPost.tags.filter((tag) => post.tags?.includes(tag))
      score += shared.length * 2
    }

    const postTime = post.date ? new Date(post.date).getTime() : 0
    const currentTime = currentPost.date ? new Date(currentPost.date).getTime() : 0
    if (postTime && currentTime) {
      const daysDiff = Math.abs(currentTime - postTime) / (1000 * 60 * 60 * 24)
      if (daysDiff < 90) score += 1
    }

    return { post, score }
  })

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.post)
}

const { data: allPosts } = await useAsyncData("all-blog-posts-for-related", () =>
  queryCollection("blog").order("date", "DESC").all(),
)

const relatedPosts = computed(() => {
  if (!page.value || !allPosts.value) return []
  return getRelatedPosts(page.value as BlogPostLike, allPosts.value as BlogPostLike[], 3)
})
</script>

<template>
  <div v-if="page">
    <!-- Scroll Progress Bar -->
    <div class="fixed top-0 left-0 right-0 h-1 z-50 pointer-events-none">
      <div
        class="h-full bg-primary-500 dark:bg-primary-400 transition-[width] duration-100"
        :style="{ width: `${scrollProgress}%` }"
      />
    </div>

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

          <div v-if="readingMinutes" class="flex items-center gap-2">
            <UIcon
              name="i-ph-clock"
              class="w-5 h-5 text-primary-500 dark:text-primary-400"
            />
            <span>{{ readingMinutes }} min read</span>
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
        >
      </div>

      <!-- Main Content with Sidebar Layout -->
      <div class="relative max-w-7xl mx-auto">
        <div class="lg:grid lg:grid-cols-12 lg:gap-4">
          <!-- Main Content -->
          <div class="lg:col-span-8">
            <article
              ref="articleRef"
              class="prose prose-lg max-w-none dark:prose-invert"
            >
              <ContentRenderer :value="page" />
            </article>
          </div>

          <!-- Sidebar -->
          <div class="hidden lg:block lg:col-span-4 relative">
            <BlogTableOfContents :toc="page.body?.toc?.links" behavior="smart" :top-offset="60" />
          </div>
        </div>
      </div>

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
              variant="outline"
              size="lg"
              aria-label="Copy link"
              class="hover:scale-105 transition-all duration-200"
              @click="copyToClipboard"
            >
              <UIcon :name="copied ? 'i-ph-check' : 'i-ph-copy'" class="text-lg" />
              <span class="hidden sm:inline ml-2">{{ copied ? "Copied!" : "Copy" }}</span>
            </UButton>
          </div>
        </div>
      </section>

      <!-- Related Posts -->
      <section
        v-if="relatedPosts.length"
        class="border-t border-gray-200 dark:border-gray-700 pt-16"
      >
        <div class="mx-auto">
          <h2 class="text-2xl font-bold text-center mb-12">You might also like</h2>
          <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <article v-for="post in relatedPosts" :key="post.path" class="group">
              <NuxtLink :to="post.path ? cleanBlogPath(post.path) : '/blog'" class="block">
                <UCard class="h-full hover:shadow-lg transition-all duration-200">
                  <div
                    v-if="post.image"
                    class="aspect-[16/9] overflow-hidden rounded-lg mb-4"
                  >
                    <NuxtImg
                      :src="post.image"
                      :alt="post.title"
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      loading="lazy"
                    />
                  </div>

                  <div class="space-y-3">
                    <h3
                      class="font-semibold text-lg group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2"
                    >
                      {{ post.title }}
                    </h3>

                    <p
                      v-if="post.description"
                      class="text-gray-600 dark:text-gray-400 text-sm line-clamp-2"
                    >
                      {{ post.description }}
                    </p>

                    <div
                      class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400"
                    >
                      <div v-if="post.date" class="flex items-center gap-1">
                        <UIcon name="i-ph-calendar" class="w-4 h-4" />
                        <span>{{ formatDate(post.date) }}</span>
                      </div>
                      <div v-if="post.readingTime" class="flex items-center gap-1">
                        <UIcon name="i-ph-clock" class="w-4 h-4" />
                        <span>{{ post.readingTime }} min read</span>
                      </div>
                    </div>

                    <div v-if="post.tags?.length" class="flex flex-wrap gap-1">
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
