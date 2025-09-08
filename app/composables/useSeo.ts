export const useSeo = (options: {
  title: string
  description: string
  image?: string
  type?: "website" | "article"
  publishedTime?: string
  modifiedTime?: string
  tags?: string[]
}) => {
  const route = useRoute()
  const site = useSiteConfig()

  const canonical = `${site.url}${route.path}`
  const fullTitle =
    options.title === site.name
      ? options.title
      : `${options.title} | ${site.name}`

  useSeoMeta({
    title: fullTitle,
    description: options.description,
    ogTitle: options.title,
    ogDescription: options.description,
    ogImage: options.image || "/img/default-social.jpg",
    ogType: options.type || "website",
    ogUrl: canonical,
    twitterCard: "summary_large_image",
    twitterTitle: options.title,
    twitterDescription: options.description,
    twitterImage: options.image || "/img/default-social.jpg",
    ...(options.type === "article" && {
      articlePublishedTime: options.publishedTime,
      articleModifiedTime: options.modifiedTime,
      articleTag: options.tags,
    }),
  })

  useHead({
    link: [{ rel: "canonical", href: canonical }],
  })
}

export const usePersonalSeo = () => {
  const site = useSiteConfig()

  useSchemaOrg([
    defineWebSite({
      name: site.name,
      description: site.description,
      url: site.url,
    }),
    definePerson({
      name: "Vipin Kumar Madhaan",
      givenName: "Vipin",
      familyName: "Madhaan",
      jobTitle: "Senior Software Engineer | Full-Stack Developer",
      description: site.description,
      image: "/vipin.webp",
      url: site.url,
      email: "Vipin.Madhaan@gmail.com",
      sameAs: [
        "https://x.com/VipinMadhaan",
        "https://github.com/VipinMadhaan",
        "https://linkedin.com/in/VipinMadhaan",
      ],
    }),
  ])
}
