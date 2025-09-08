<script setup lang="ts"></script>

<template>
  <div class="min-h-screen relative overflow-hidden">
    <!-- Geometric Background -->
    <ClientOnly>
      <GeometricBackground />
    </ClientOnly>

    <!-- Site Header -->
    <SiteHeader />

    <!-- Main Content -->
    <main
      class="pt-6 py-12 md:py-18 lg:py-24 px-4 md:px-8 max-w-6xl mx-auto z-10"
    >
      <slot />
    </main>

    <!-- Site Footer -->
    <SiteFooter />
    <!-- <ScrollTopIcon /> -->
  </div>
</template>

<style></style>
