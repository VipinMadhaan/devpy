<script setup lang="ts">
definePageMeta({
  title: "About - Vipin Kumar Madhaan",
  description:
    "Learn about my professional journey, experience, education, and skills in web development.",
})

// Fetch professional journey data from Nuxt Content collection
const { data: professionalJourney } = await useAsyncData(
  "professional-journey",
  () => {
    return queryCollection("professionalJourney").first()
  },
)

// Fetch profile journey data from Nuxt Content collection
const { data: _profile } = await useAsyncData("profile", () => {
  return queryCollection("profile").first()
})

useHead({
  title: "About - Vipin Kumar Madhaan",
  meta: [
    {
      name: "description",
      content:
        "Learn about my professional journey, experience, education, and skills in web development.",
    },
  ],
})
</script>

<template>
  <div>
    <div class="space-y-32">
      <!-- Professional Experience -->
      <section class="space-y-12">
        <div class="text-center space-y-6">
          <h2>My Story</h2>
          <p class="max-w-3xl mx-auto">
            Hi there! I’m Vipin Kumar Madhaan, a Full Stack Lead Developer from
            India with over 10 years of experience in the world of web
            development. My passion lies in building web applications and web
            services that not only function well but also engage and delight
            users.
          </p>
        </div>
      </section>
           <section class="space-y-12">
        <div class="text-center space-y-6">
          <h2>Expertise and Experience</h2>
          <p class="max-w-3xl mx-auto">
            My journey into coding began in 2013, focusing primarily on
            JavaScript and Python. Over the years, I’ve honed my skills in
            various aspects of web development, including:
            <ul>
              <li>
                <strong>Websites Development:</strong> Bringing static and
                dynamic websites to life, ensuring seamless user experiences.
              </li>
              <li>
                <strong>Web Automation:</strong> Streamlining workflows and
                processes with automated solutions.
              </li>
              <li>
                <strong>Chat Bots:</strong> Building interactive and engaging
                chatbots for various purposes.
              </li>
              <li>
                <strong>Web RTC:</strong> Enabling real-time communication
                features like video chat and peer-to-peer connections.
              </li>
              <li>
                <strong>Open-Source Projects:</strong> Contributing to and creating
                open-source projects, fostering collaboration and knowledge sharing.
              </li>
            </ul>
          </p>
        </div>
      </section>
       <section class="space-y-12">
        <div class="text-center space-y-6">
          <h2>Passion for Learning and Innovation</h2>
          <p class="max-w-3xl mx-auto">
            Beyond my core expertise, I’m always eager to explore new
            technologies and trends. Recently, I’ve been delving into the
            fascinating world of Artificial Intelligence, expanding my knowledge
            and skills in this ever-evolvng field.
          </p>
        </div>
      </section>

      <!-- Education -->
      <section class="space-y-12">
        <div class="text-center space-y-6">
          <h2>Education & Learning</h2>

          <p class="max-w-3xl mx-auto">
            Strong academic foundation combined with continuous learning and
            professional development.
          </p>
        </div>

        <div class="grid gap-6 md:grid-cols-1">
          <div
            v-for="edu in professionalJourney?.education"
            :key="edu.id"
            class="h-full"
          >
            <div />
            <UCard class="">
              <div class="space-y-4">
                <div class="flex items-start gap-4">
                  <div class="flex items-center justify-center flex-shrink-0">
                    <UIcon
                      name="i-ph-graduation-cap"
                      size="3em"
                      class="text-info"
                    />
                  </div>
                  <div class="flex-1 space-y-3">
                    <h3>{{ edu.degree }}</h3>
                    <p>
                      {{ edu.institution }}
                    </p>
                    <p>
                      {{ edu.location }}
                    </p>
                    <UBadge :label="edu.period" variant="soft" />
                  </div>
                </div>

                <p>
                  {{ edu.description }}
                </p>

                <!-- <div>
                <h4 class="mb-2">Achievements:</h4>
                <ul class="space-y-1">
                  <li
                    v-for="(achievement, index) in edu.achievements"
                    :key="index"
                    class="flex items-start gap-2"
                  >
                    <UIcon
                      name="i-ph-medal"
                      class="w-3 h-3 mt-1 flex-shrink-0"
                    />
                    <span >{{ achievement }}</span>
                  </li>
                </ul>
              </div> -->
              </div>
            </UCard>
          </div>
        </div>
      </section>

      <!-- Certifications 
      <section class="space-y-12">
        <div class="text-center space-y-6">
          <h2>Certifications & Awards</h2>

          <p class="max-w-3xl mx-auto">
            Industry-recognized certifications and achievements that validate
            expertise and commitment to excellence.
          </p>
        </div>

        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="cert in professionalJourney?.certifications"
            :key="cert.id"
            class="h-full text-center"
          >
            <UCard class="">
              <div class="space-y-4">
                <div class="w-16 h-16 flex items-center justify-center mx-auto">
                  <UIcon name="i-ph-certificate" size="4em" class="text-info" />
                </div>

                <div class="space-y-3">
                  <h3>{{ cert.name }}</h3>
                  <p>{{ cert.issuer }}</p>
                  <UBadge :label="cert.date" variant="soft" />
                </div>

                <p>
                  {{ cert.description }}
                </p>

                <div>ID: {{ cert.credentialId }}</div>
              </div>
            </UCard>
          </div>
        </div>
      </section> -->

      <!-- Call to Action -->
      <section class="space-y-12">
        <UCard class="text-center ring-2 ring-primary">
          <div class="space-y-6">
            <div class="space-y-3">
              <h3>Ready to Work Together?</h3>
              <p class="max-w-2xl mx-auto">
                Now that you know my story, let's write the next chapter
                together. I'd love to help bring your ideas to life.
              </p>
            </div>

            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <UButton to="/services" size="lg" variant="solid">
                <UIcon name="i-ph-briefcase" />
                View Services
              </UButton>
              <UButton to="/contact" size="lg" variant="subtle">
                <UIcon name="i-ph-envelope" />
                Get In Touch
              </UButton>
            </div>
          </div>
        </UCard>
      </section>
    </div>
  </div>
</template>
