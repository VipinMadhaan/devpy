<template>
  <nav v-if="breadcrumbs.length > 1" class="mb-8" aria-label="Breadcrumb">
    <ol
      class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400"
    >
      <li
        v-for="(crumb, index) in breadcrumbs"
        :key="crumb.path"
        class="flex items-center"
      >
        <UIcon
          v-if="index > 0"
          name="i-ph-caret-right"
          class="mx-2 text-gray-400"
        />
        <NuxtLink
          v-if="index < breadcrumbs.length - 1"
          :to="crumb.path"
          class="hover:text-primary transition-colors"
        >
          {{ crumb.label }}
        </NuxtLink>
        <span v-else class="text-gray-900 dark:text-gray-100 font-medium">
          {{ crumb.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
interface Breadcrumb {
  label: string
  path: string
}

const route = useRoute()

const breadcrumbs = computed(() => {
  const crumbs: Breadcrumb[] = [{ label: "Home", path: "/" }]

  const pathSegments = route.path.split("/").filter(Boolean)
  let currentPath = ""

  for (const segment of pathSegments) {
    currentPath += `/${segment}`

    // Generate human-readable labels
    let label = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")

    // Special cases for better labels
    if (label === "Blog") label = "Blog"
    if (label === "Projects") label = "Projects"
    if (label === "About") label = "About"

    crumbs.push({ label, path: currentPath })
  }

  return crumbs
})

// Add structured data for breadcrumbs
useSchemaOrg([
  defineBreadcrumb({
    itemListElement: breadcrumbs.value.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      item: `https://devpy.de${crumb.path}`,
    })),
  }),
])
</script>
