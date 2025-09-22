import tailwindcss from "@tailwindcss/vite"
import { VitePWA } from 'vite-plugin-pwa'
import { definePerson } from "nuxt-schema-org/schema"

// https://nuxt.com/docs/api/configuration/nuxt-config
const IS_DEV = import.meta.dev

export default defineNuxtConfig({
  colorMode: {
    preference: "system",
    fallback: "light",
    classSuffix: "",
    storageKey: "nuxt-color-mode",
    storage: "localStorage",
  },

  css: ["./app/assets/css/main.css"],

  compatibilityDate: "2025-07-31",

  content: {
    renderer: {
      anchorLinks: false,
    },
    build: {
      markdown: {
        rehypePlugins: {
          "rehype-external-links": {
            target: "_blank",
            rel: "noopener noreferer",
          },
        },
        highlight: {
          // any Shiki theme like synthwave-84, one-dark-pro, andromeeda
          // ['json', 'js', 'ts', 'html', 'css', 'vue', 'shell', 'mdc', 'md', 'yaml']
          theme: {
            default: "andromeeda",
            // Theme used if `html.dark`
            dark: "andromeeda",
            // Theme used if `html.sepia`
            sepia: "monokai",
          },
        },
        toc: {
          depth: 2,
          searchDepth: 2,
        },
      },
    },
    preview: {
      dev: IS_DEV,
      api: "https://api.nuxt.studio",
      gitInfo: {
        name: "devpy",
        owner: "Vipin Kumar Madhaan",
        url: "https://github.com/VipinMadhaan/devpy",
      },
    },
  },

  debug: false,

  devtools: { enabled: IS_DEV },

  experimental: {
    typedPages: true,
    buildCache: true,
    headNext: true,
    lazyHydration: true,
    viewTransition: true,
    payloadExtraction: false,
    appManifest: false,
    componentIslands: true,
    asyncEntry: true,
  },

  eslint: {},

  // fonts: {},

  icon: {
    clientBundle: {
      scan: true,
    },
  },

  // image: {},

  image: {
    quality: 85,
    format: ["avif", "webp", "jpg"],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
    densities: [1, 2],
    presets: {
      avatar: {
        modifiers: {
          format: "avif,webp,jpg",
          quality: 90,
          width: 128,
          height: 128,
        },
      },
      blog: {
        modifiers: {
          format: "avif,webp,jpg",
          quality: 85,
          width: 800,
          height: 400,
        },
      },
      thumbnail: {
        modifiers: {
          format: "avif,webp,jpg",
          quality: 80,
          width: 320,
          height: 180,
        },
      },
    },
  },

  modules: [
    "@nuxtjs/color-mode",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/ui",
    "@nuxt/image",
    // "@nuxtjs/mdc",
    "@nuxtjs/seo",
    // "nuxt-feedme", // Removed due to compatibility issues
    "@nuxt/content",
    "nuxt-mcp",
    "@nuxt/eslint",
  ],

  nitro: {
    preset: "cloudflare-pages",
    prerender: {
      crawlLinks: true,
      failOnError: false,
      autoSubfolderIndex: true,
      routes: ["/blog", "/rss.xml"],
    },
    compressPublicAssets: {
      brotli: true,
      gzip: true,
    },
    minify: true,
    alias: {
      "#entry": "virtual:entry",
      "#app/entry": "virtual:entry",
    },
    rollupConfig: {
      external: ["#entry", "#app/entry"],
      output: {
        manualChunks: (id) => {
          // Vendor chunks for better caching
          if (id.includes('node_modules')) {
            if (id.includes('vue') || id.includes('nuxt')) {
              return 'vue-core'
            }
            if (id.includes('tailwind') || id.includes('css')) {
              return 'styles'
            }
            if (id.includes('icon') || id.includes('image')) {
              return 'assets'
            }
            return 'vendor'
          }
          // Component chunks
          if (id.includes('components/')) {
            return 'components'
          }
          // Utils chunks
          if (id.includes('utils/') || id.includes('composables/')) {
            return 'utils'
          }
        },
      },
    },
    esbuild: {
      options: {
        target: "es2022",
      },
    },
  },

  routeRules: {
    "/**": {
      static: true,
      prerender: true,
    },
    "/blog": {
      static: true,
      prerender: true,
      isr: false,
    },
    "/blog/**": {
      static: true,
      prerender: true,
    },
  },

  site: {
    indexable: true,
    url: "https://devpy.de",
    name: "Vipin Kumar Madhaan - Full Stack Engineer",
    description:
      "Senior Software Engineer specializing in modern web technologies. Crafting scalable web applications and browser extensions for startups and founders.",
    defaultLocale: "en",
    enabled: true,
  },

  sitemap: {
    excludeAppSources: true,
  },

  ssr: true,

  typescript: {
    strict: true,
  },

  vite: {
    plugins: [
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.png', 'apple-touch-icon.png', 'masked-icon.svg'],
        workbox: {
          globPatterns: ['**/*.{js,css,html,png,svg,ico,webp,jpg,jpeg}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // 365 days
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // 365 days
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            }
          ]
        },
        manifest: {
          name: 'Vipin Kumar Madhaan - Full Stack Engineer',
          short_name: 'DevPy',
          description: 'Senior Software Engineer specializing in modern web technologies. Crafting scalable web applications and browser extensions for startups and founders.',
          theme_color: '#3b82f6',
          background_color: '#ffffff',
          display: 'standalone',
          orientation: 'portrait',
          scope: '/',
          start_url: '/',
          icons: [
            {
              src: '/favicon.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/favicon.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: '/favicon.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        }
      })
    ],
    define: {
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
    },
    build: {
      target: "es2022",
      cssCodeSplit: true,
      minify: 'esbuild',
      rollupOptions: {
        external: ["#entry", "#app/entry"],
        output: {
          manualChunks: (id) => {
            // Vendor chunks for better caching
            if (id.includes('node_modules')) {
              if (id.includes('vue') || id.includes('nuxt')) {
                return 'vue-core'
              }
              if (id.includes('tailwind') || id.includes('css')) {
                return 'styles'
              }
              if (id.includes('icon') || id.includes('image')) {
                return 'assets'
              }
              return 'vendor'
            }
            // Component chunks
            if (id.includes('components/')) {
              return 'components'
            }
            // Utils chunks
            if (id.includes('utils/') || id.includes('composables/')) {
              return 'utils'
            }
          },
        },
      },
    },
    optimizeDeps: {
      exclude: ["#entry", "#app/entry"],
      include: ['lodash-es']
    },
  },

  schemaOrg: {
    identity: definePerson({
      // Basic Information, if applicable
      name: "Vipin Kumar Madhaan",
      givenName: "Vipin Madhaan",
      familyName: "Madhaan",
      additionalName: "Kumar", // middle name or other additional names
      alternateName: "Vipin Kumar Madhaan",

      // Profile Information, if applicable
      image: "/vipin.webp",
      description:
        "Senior Software Engineer specializing in modern web technologies. Crafting scalable web applications and browser extensions for startups and founders.",
      jobTitle:
        "Senior Software Engineer | Full-Stack Developer | DevOps Enthusiast",

      // Contact & Social, if applicable
      email: "Vipin.Madhaan@gmail.com",
      url: "https://devpy.de",
      sameAs: [
        "https://x.com/VipinMadhaan",
        "https://github.com/VipinMadhaan",
        "https://linkedin.com/in/VipinMadhaan",
      ],

      // Professional Details, if applicable
      worksFor: {
        "@type": "Organization",
        name: "Paragon Square Inc.",
        url: "https://paragonsquare.ai",
      },
    }),
  },
})
