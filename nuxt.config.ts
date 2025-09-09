import tailwindcss from "@tailwindcss/vite"
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
    quality: 80,
    format: ["webp", "jpg"],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
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
    // "nuxt-feedme",
    "@nuxt/content",
    "nuxt-mcp",
    "@nuxt/eslint",
    "@nuxthub/core",
  ],

  hub: {
    analytics: false,
    blob: false,
    cache: false,
    database: false,
    kv: false,
  },

  nitro: {
    preset: "cloudflare-pages",
    prerender: {
      crawlLinks: true,
      failOnError: false,
      autoSubfolderIndex: true,
      routes: ["/blog"],
    },
    compressPublicAssets: {
      brotli: true,
      gzip: true,
    },
    alias: {
      "#entry": "virtual:entry",
      "#app/entry": "virtual:entry",
    },
    rollupConfig: {
      external: ["#entry", "#app/entry"],
      output: {
        manualChunks: undefined,
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
    plugins: [tailwindcss()],
    define: {
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
    },
    build: {
      target: "es2022",
      rollupOptions: {
        external: ["#entry", "#app/entry"],
        output: {
          manualChunks: undefined,
        },
      },
    },
    optimizeDeps: {
      exclude: ["#entry", "#app/entry"],
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
