<script setup lang="ts">
definePageMeta({
  title: "Contact - Vipin Kumar Madhaan",
  description:
    "Get in touch to discuss your project requirements and start working together.",
})

useHead({
  title: "Contact - Vipin Kumar Madhaan",
  meta: [
    {
      name: "description",
      content:
        "Get in touch to discuss your project requirements and start working together.",
    },
  ],
})

// Contact methods
const contactMethods = ref([
  {
    icon: "i-ph-envelope",
    title: "Email",
    description: "Send me an email anytime",
    value: "Vipin.Madhaan@gmail.com",
    action: "mailto:Vipin.Madhaan@gmail.com",
  },
  {
    icon: "i-ph-linkedin-logo",
    title: "LinkedIn",
    description: "Connect with me professionally",
    value: "/in/VipinMadhaan",
    action: "https://linkedin.com/in/VipinMadhaan",
  },
  {
    icon: "i-ph-calendar",
    title: "Schedule a Call",
    description: "Book a 30-min consultation",
    value: "cal.com/VipinMadhaan",
    action: "https://cal.com/VipinMadhaan",
  },
])
</script>

<template>
  <div>
    <div class="space-y-32">
      <!-- Contact Methods -->
      <section class="space-y-6">
        <!-- Page Header -->
        <div class="text-center py-10">
          <h1>Let's Work Together</h1>

          <p class="max-w-4xl mx-auto">
            Have a project in mind? I'd love to hear about it and discuss how we
            can bring your ideas to life.
          </p>
        </div>
        <div class="text-center space-y-6">
          <h2>Choose Your Preferred Method</h2>
          <p class="max-w-3xl mx-auto">
            Select the most convenient way to reach out, and I'll get back to
            you as soon as possible.
          </p>
        </div>

        <div class="grid gap-6 md:grid-cols-3 lg:grid-cols-3">
          <UCard
            v-for="method in contactMethods"
            :key="method.title"
            class="items-center text-center"
          >
            <!-- Card content -->
            <div class="space-y-4 p-4">
              <div class="w-16 h-16 flex items-center justify-center mx-auto">
                <UIcon :name="method.icon" size="3em" class="text-info" />
              </div>
              <div>
                <h3 class="mb-1">
                  {{ method.title }}
                </h3>
                <p class="mb-2">
                  {{ method.description }}
                </p>

                <UButton
                  :title="method.title"
                  class="cursor-pointer mt-3"
                  @click="navigateTo(method.action, { external: true })"
                >
                  {{ method.value }}
                </UButton>
              </div>
            </div>
          </UCard>
        </div>
      </section>
    </div>
  </div>
</template>
