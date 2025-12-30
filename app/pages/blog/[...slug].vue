<script lang="ts" setup>
import { cleanBlogPath } from "~/utils/blogPaths"

const route = useRoute()
const site = useSiteConfig()

// Fetch blog post with proper error handling
const { data: page, error } = await useAsyncData(
  `blog-${route.path}`,
  async () => {
    try {
      const allPosts = await queryCollection("blog").all()

      const directMatch = allPosts.find((post) => post.path === route.path)
      if (directMatch) return directMatch

      const cleanMatch = allPosts.find(
        (post) => cleanBlogPath(post.path) === route.path,
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
  const canonicalPath = cleanBlogPath(page.value.path)
  if (canonicalPath && route.path !== canonicalPath) {
    await navigateTo(canonicalPath, { redirectCode: 301 })
  }
}

// SEO: page meta, canonical, OG/Twitter, and BlogPosting schema
if (page.value) {
  const canonicalPath = page.value.path ? cleanBlogPath(page.value.path) : route.path
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

      <!-- Post Content -->
      <article class="prose prose-lg max-w-none mx-auto dark:prose-invert">
        <ContentRenderer :value="page" />
      </article>

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
