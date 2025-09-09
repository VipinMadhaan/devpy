<template>
  <header
    :class="[
      'fixed left-1/2 md:top-2 transform -translate-x-1/2 z-50 w-full max-w-3xl bg-white/80 dark:bg-neutral-900/80 hover:shadow-lg md:rounded-2xl backdrop-blur-lg transition-all duration-300 border-b-2 border-neutral-300/80 dark:border-neutral-800/80',
      scrolled ? 'shadow-lg scale-103' : '',
    ]"
    style="padding: 0"
  >
    <div class="relative">
      <div class="flex justify-center items-center px-2 md:px-6 py-2">
        <nav
          class="flex justify-between items-center gap-8 w-full text-sm md:text-base"
          role="navigation"
          aria-label="Main navigation"
        >
          <!-- Logo/Brand -->
          <ULink
            to="/"
            class="flex items-center gap-2 justify-center"
            aria-label="Go to homepage"
          >
            <div class="w-8 h-8 flex items-center justify-center">
              <UIcon name="i-ph-code" />
            </div>
            <span>Vipin Madhaan</span>
          </ULink>

          <!-- Desktop Navigation -->
          <div
            class="hidden lg:flex items-center gap-5 justify-center text-base"
          >
            <ULink
              to="/blog"
              class="hover:scale-105 transition-transform duration-200 ease-in-out"
            >
              Blog
            </ULink>
            <ULink
              to="/projects"
              class="hover:scale-105 transition-transform duration-200 ease-in-out"
            >
              Projects
            </ULink>
            <ULink
              to="/about"
              class="hover:scale-105 transition-transform duration-200 ease-in-out"
            >
              About
            </ULink>
          </div>

          <!-- Action Buttons & Mobile Menu -->
          <div class="flex items-center md:gap-2 justify-center">
            <!-- Social Links -->
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

            <!-- Theme Switcher -->
            <ThemeSwitcher />

            <!-- Mobile menu button -->
            <UButton
              class="lg:hidden ml-2 p-2 shadow hover:shadow-lg transition-shadow duration-300 ease-in-out hover:scale-105"
              :aria-expanded="mobileMenuOpen"
              aria-label="Toggle mobile menu"
              aria-controls="mobile-menu"
              @click="toggleMobileMenu"
            >
              <UIcon :name="mobileMenuOpen ? 'i-ph-x' : 'i-ph-list'" />
            </UButton>
          </div>
        </nav>
      </div>
    </div>
    <!-- Mobile Menu -->
    <div
      v-show="mobileMenuOpen"
      id="mobile-menu"
      class="lg:hidden h-auto min-h-screen absolute left-0 top-full w-screen max-w-none overflow-hidden"
      style="margin-left: calc(-50vw + 50%); margin-right: calc(-50vw + 50%)"
      @click.stop
    >
      <div class="m-4" @click="toggleMobileMenu">
        <div
          class="backdrop-blur bg-white/95 dark:bg-neutral-900/95 rounded-lg border border-neutral-200/60 dark:border-neutral-800/80 overflow-hidden shadow-2xl"
        >
          <nav class="flex flex-col py-6 px-4" aria-label="Mobile navigation">
            <!-- Navigation Links with Enhanced Touch Targets -->
            <ULink
              v-for="item in navigationItems"
              :key="item.path"
              :to="item.path"
              class="flex items-center gap-4 px-4 py-4 min-h-[44px] hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-all duration-300 ease-in-out"
              @click="closeMobileMenu"
            >
              <UIcon :name="item.icon" />
              <span>{{ item.label }}</span>
            </ULink>

            <br />

            <!-- Mobile CTA with Enhanced Styling -->
            <ULink
              :to="'mailto:Vipin.Madhaan@gmail.com'"
              class="flex items-center justify-center gap-3 px-6 py-4 min-h-[48px] bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors duration-300"
              @click="closeMobileMenu"
            >
              <UIcon name="i-ph-envelope" />
              <span>Get in Touch</span>
            </ULink>
          </nav>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
// Mobile menu state
const mobileMenuOpen = ref(false)

// Navigation items configuration
const navigationItems = [
  { path: "/blog", label: "Blog", icon: "i-ph-article" },
  { path: "/projects", label: "Projects", icon: "i-ph-folder-open" },
  { path: "/about", label: "About", icon: "i-ph-user" },
]

// Header shadow on scroll
const scrolled = ref(false)
const handleScroll = () => {
  scrolled.value = window.scrollY > 8
}

// Close mobile menu when route changes
const route = useRoute()
watch(
  () => route.path,
  () => {
    mobileMenuOpen.value = false
  },
)

// Mobile menu controls
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value

  // Prevent body scroll when menu is open
  if (import.meta.client) {
    if (mobileMenuOpen.value) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
  }
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
  if (import.meta.client) {
    document.body.style.overflow = ""
  }
}

// Keyboard event handler function
const handleKeydown = (e: KeyboardEvent) => {
  // Escape to close mobile menu
  if (e.key === "Escape" && mobileMenuOpen.value) {
    closeMobileMenu()
  }

  // Focus management for accessibility
  if (e.key === "Tab" && mobileMenuOpen.value) {
    // Trap focus within mobile menu when open
    const mobileMenu = document.getElementById("mobile-menu")
    if (mobileMenu) {
      const focusableElements = mobileMenu.querySelectorAll(
        'a, button, [tabindex]:not([tabindex="-1"])',
      )

      if (focusableElements && focusableElements.length > 0) {
        const firstElement = focusableElements[0] as HTMLElement
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }
  }
}

// Lifecycle management
onMounted(() => {
  // Scroll handling
  window.addEventListener("scroll", handleScroll, { passive: true })
  handleScroll()

  // Keyboard shortcuts
  document.addEventListener("keydown", handleKeydown)
})

// Cleanup on unmount
onBeforeUnmount(() => {
  if (import.meta.client) {
    window.removeEventListener("scroll", handleScroll)
    document.removeEventListener("keydown", handleKeydown)
    document.body.style.overflow = ""
  }
})
</script>
