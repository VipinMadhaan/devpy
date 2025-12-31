import type { H3Event } from "h3"
import { queryCollection } from "@nuxt/content/server"
import { cleanBlogPath } from "~/utils/blogPaths"

type BlogPost = {
  path?: string
  date?: string
  dateUpdated?: string
}

export default defineSitemapEventHandler(async (event: H3Event) => {
  const posts = (await queryCollection(event, "blog").all()) as BlogPost[]

  return posts
    .filter((post) => typeof post.path === "string" && post.path.length > 0)
    .map((post) => {
      // Nuxt Content can return encoded paths (e.g. spaces as %20). Decode first to avoid double encoding.
      const decodedPath = decodeURI(post.path as string)
      const loc = cleanBlogPath(decodedPath)
      const lastmod = post.dateUpdated || post.date

      return {
        loc,
        lastmod,
      }
    })
})
