<script setup lang="ts">
import type { PropType } from 'vue'

type TocItem = {
  id: string
  text: string
  depth: number
  children?: TocItem[]
}

const props = defineProps({
  toc: {
    type: Array as PropType<TocItem[] | undefined>,
    required: false,
    default: undefined,
  },
  behavior: {
    type: String as PropType<'sticky' | 'smart'>,
    required: false,
    default: 'sticky',
  },
  topOffset: {
    type: Number,
    required: false,
    default: 60,
  },
  containerSelector: {
    type: String,
    required: false,
    default: 'article',
  },
  title: {
    type: String,
    required: false,
    default: 'Table of Contents',
  },
})

const activeId = ref('')

const flattened = computed(() => {
  const out: Array<{ id: string; text: string; depth: number }> = []

  const visit = (items?: TocItem[]) => {
    if (!items?.length) return
    for (const item of items) {
      if (item?.id && item?.text) {
        out.push({ id: item.id, text: item.text, depth: item.depth || 2 })
      }
      if (item.children?.length) visit(item.children)
    }
  }

  visit(props.toc)
  return out
})

const hasItems = computed(() => flattened.value.length > 0)

const scrollToHeading = (id: string) => {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const indentationPx = (depth: number) => {
  // Nuxt Content TOC depth is typically: h2 => 2, h3 => 3, ...
  // Keep it simple: indent 12px per level beyond h2.
  const base = 2
  const level = Math.max(0, depth - base)
  return `${level * 12}px`
}

const railRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const mode = ref<'static' | 'fixed' | 'absolute'>('static')
const fixedLeft = ref(0)
const fixedWidth = ref(0)
const absoluteTop = ref(0)
let rafId: number | null = null
let headingsObserver: IntersectionObserver | null = null

const updateSmartPosition = () => {
  if (!import.meta.client) return
  if (props.behavior !== 'smart') return
  const rail = railRef.value
  const panel = panelRef.value
  if (!rail || !panel) return

  const bounds = document.querySelector(props.containerSelector) as HTMLElement | null
  if (!bounds) return

  const railRect = rail.getBoundingClientRect()
  const railTopAbs = railRect.top + window.scrollY
  const boundsRect = bounds.getBoundingClientRect()
  const boundsTopAbs = boundsRect.top + window.scrollY
  const boundsBottomAbs = boundsTopAbs + bounds.offsetHeight

  const panelHeight = panel.offsetHeight
  const scrollTop = window.scrollY
  const pinTop = props.topOffset

  // Before article starts: keep TOC in normal flow at the top of the rail.
  if (scrollTop + pinTop < boundsTopAbs) {
    mode.value = 'static'
    return
  }

  // While inside article: pin as fixed.
  const wouldHitBottom = scrollTop + pinTop + panelHeight >= boundsBottomAbs
  if (!wouldHitBottom) {
    mode.value = 'fixed'
    fixedLeft.value = railRect.left
    fixedWidth.value = railRect.width
    return
  }

  // After reaching article end: stop pinning and place TOC at the bottom of the article.
  mode.value = 'absolute'
  fixedLeft.value = 0
  fixedWidth.value = 0

  const topWithinRail = boundsBottomAbs - railTopAbs - panelHeight
  absoluteTop.value = Math.max(0, topWithinRail)
}

const scheduleUpdate = () => {
  if (!import.meta.client) return
  if (rafId != null) return
  rafId = window.requestAnimationFrame(() => {
    rafId = null
    updateSmartPosition()
  })
}

const panelStyle = computed(() => {
  if (props.behavior !== 'smart') return undefined
  if (mode.value === 'fixed') {
    return {
      position: 'fixed',
      top: `${props.topOffset}px`,
      left: `${fixedLeft.value}px`,
      width: `${fixedWidth.value}px`,
    } as const
  }

  if (mode.value === 'absolute') {
    return {
      position: 'absolute',
      top: `${absoluteTop.value}px`,
      left: '0px',
      width: '100%',
    } as const
  }

  return {
    position: 'static',
  } as const
})

onMounted(() => {
  if (!import.meta.client) return

  const container = document.querySelector(props.containerSelector)
  if (!container) return

  const headings = container.querySelectorAll('h1[id], h2[id], h3[id], h4[id]')
  if (!headings.length) return

  headingsObserver = new IntersectionObserver(
    (entries) => {
      let best: IntersectionObserverEntry | null = null
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        if (!entry.target?.id) continue
        if (!best || entry.intersectionRatio > best.intersectionRatio) {
          best = entry
        }
      }
      if (best?.target?.id) activeId.value = best.target.id
    },
    {
      root: null,
      // Consider heading active when near top (account for sticky header)
      rootMargin: '-' + String(Math.max(80, props.topOffset + 60)) + 'px 0px -60% 0px',
      threshold: [0, 0.25, 0.5],
    },
  )

  headings.forEach((h) => headingsObserver?.observe(h))

  if (props.behavior === 'smart') {
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate, { passive: true })
    updateSmartPosition()
  }
})

onBeforeUnmount(() => {
  if (!import.meta.client) return
  headingsObserver?.disconnect()
  headingsObserver = null
  if (props.behavior === 'smart') {
    window.removeEventListener('scroll', scheduleUpdate)
    window.removeEventListener('resize', scheduleUpdate)
  }
  if (rafId != null) window.cancelAnimationFrame(rafId)
})
</script>

<template>
  <aside
    v-if="hasItems"
    ref="railRef"
    :class="behavior === 'sticky' ? 'sticky top-32 z-40' : 'relative h-full'"
  >
    <div ref="panelRef" :style="panelStyle" class="z-40">
      <UCard :ui="{ body: '!p-4 sm:!p-4 !pt-0 sm:!pt-0 ' }">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-ph-list" class="w-5 h-5 text-primary-500 dark:text-primary-400" />
          <h3 class="text-base font-semibold">
            {{ title }}
          </h3>
        </div>
      </template>

      <nav aria-label="Table of contents" class="text-sm">
        <ul class="space-y-1">
          <li v-for="item in flattened" :key="item.id">
            <a
              :href="`#${item.id}`"
              class="block rounded-md px-2 py-1 transition-colors"
              :class="
                activeId === item.id
                  ? 'text-primary-600 dark:text-primary-400 font-medium bg-primary-50 dark:bg-primary-950/30'
                  : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
              "
              :style="{ paddingLeft: indentationPx(item.depth) }"
              @click.prevent="scrollToHeading(item.id)"
            >
              {{ item.text }}
            </a>
          </li>
        </ul>
      </nav>
      </UCard>
    </div>
  </aside>
</template>
