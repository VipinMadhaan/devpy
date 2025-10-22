<script setup lang="ts">
interface TocItem {
  id: string
  text: string
  depth: number
  children?: TocItem[]
}

interface Props {
  toc?: TocItem[]
  // CSS selector for the container that holds the headings (defaults to article)
  containerSelector?: string
}

const props = defineProps<Props>()

// Track active heading for highlighting
const activeId = ref('')

// Scroll to heading with smooth behavior
const scrollToHeading = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }
}

// Track which heading is currently visible
onMounted(() => {
  const containerSelector = props.containerSelector || 'article'

  const observerOptions = {
    root: null,
    // offset so heading is considered visible when it's near top (accounting for sticky header)
    rootMargin: '-120px 0px -60% 0px',
    threshold: [0, 0.25, 0.5]
  }

  const observer = new IntersectionObserver((entries) => {
    // Find the most visible entry (largest intersectionRatio)
    let mostVisible: IntersectionObserverEntry | null = null
    entries.forEach((entry) => {
      // Only consider headings with id
      if (!entry.target.id) return
      if (!mostVisible || entry.intersectionRatio > mostVisible.intersectionRatio) {
        mostVisible = entry
      }
    })

    if (mostVisible && mostVisible.isIntersecting) {
      activeId.value = mostVisible.target.id
    }
  }, observerOptions)

  // Observe headings inside the article (or provided container)
  const container = document.querySelector(containerSelector)
  if (container) {
    const headings = container.querySelectorAll('h1[id], h2[id], h3[id], h4[id]')
    headings.forEach((h) => observer.observe(h))
  }

  onBeforeUnmount(() => {
    observer.disconnect()
  })
})



// Check if heading is active
const isActive = (id: string) => activeId.value === id
</script>

<template>
  <div v-if="toc && toc.length > 0" class="sticky top-24 space-y-6">
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-lg font-semibold mb-4 flex items-center">
        <svg class="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
        Table of Contents
      </h3>
      
      <nav class="toc-nav text-sm">
        <nav id="TableOfContents">
          <ul>
            <template v-for="item in toc" :key="item.id">
              <li>
                <a 
                  :href="`#${item.id}`"
                  :class="[
                    isActive(item.id) ? 'active text-blue-500 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400'
                  ]"
                  @click.prevent="scrollToHeading(item.id)"
                >
                  {{ item.text }}
                </a>
                
                <!-- Render nested children -->
                <ul v-if="item.children && item.children.length > 0">
                  <li v-for="child in item.children" :key="child.id">
                    <a 
                      :href="`#${child.id}`"
                      :class="[
                        isActive(child.id) ? 'active text-blue-500 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400'
                      ]"
                      @click.prevent="scrollToHeading(child.id)"
                    >
                      {{ child.text }}
                    </a>
                  </li>
                </ul>
              </li>
            </template>
          </ul>
        </nav>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.toc-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-nav li {
  margin: 0.25rem 0;
}

.toc-nav ul ul {
  margin-left: 1rem;
  margin-top: 0.25rem;
}

.toc-nav a {
  display: block;
  padding: 0.25rem 0;
  text-decoration: none;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
  line-height: 1.4;
}

.toc-nav a:hover {
  transform: translateX(2px);
}

.toc-nav a.active {
  position: relative;
}

.toc-nav a.active::before {
  content: '';
  position: absolute;
  left: -12px;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 16px;
  background-color: currentColor;
  border-radius: 2px;
}
</style>